var r = require('rethinkdb');
var url = require('url');
var http = require('http');
var https = require('https');
var header = {
    'Access-Control-Allow-Origin': '*'
};
/**
 * {award: 1 表示中奖 ,0 未中奖}
 */
var redPacks;
var libao;

function getRandom() {
    return Math.random() < .5;
}

function getRandomString() {
    var s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var ret = '';
    for (var i = 0; i < 8; i++) {
        ret += s[parseInt(62 * Math.random(), 10)];
    }
    return ret;
}

function weixinSetRedPack() {
    // @todo
    var p = Promise.defer();
    p.resolve();
    return p.promise;
}

function getUserInfo(access_token, openid, res) {
    var p = Promise.defer();
    if (access_token && openid) {
        https.get({
            hostname: 'api.weixin.qq.com',
            path: '/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN'
        }, _res=> {
            var d = '';
            _res.setEncoding('utf8');
            _res.on('data', data=>d += data);
            _res.on('end', ()=> {
                d = JSON.parse(d);
                if (d['openid']) {
                    p.resolve(d);
                }
                else {
                    if (res) {
                        res.writeHead(200, Object.assign({
                            'content-type': 'application/json'
                        }, header));
                        res.end(JSON.stringify({
                            errmsg: 'access_token or openid is wrong'
                        }));
                    }
                    p.reject();
                }
            });
        });
    }
    else {
        p.reject();
    }
    return p.promise;
}

var connection = null;
var db = null;

r.connect({host: 'localhost', port: 28015}, function (err, conn) {
    if (err) throw err;
    connection = conn;
    db = r.db('wangchao');
    db.table('totalredpack')
        .run(conn, (err, cursor)=> {
            cursor.toArray((err, result)=> {
                if (err) throw err;
                result.forEach(res=> {
                    if (res.type === 'red') {
                        redPacks = res['total'];
                        console.log('redpacks is ', redPacks);
                    }
                    if (res.type === 'libao') {
                        libao = res['total'];
                        console.log('libao is ', libao);
                    }
                });
            });
        });
});

function getAward(openid) {
    var p = Promise.defer();
    db.table('reward').get(openid)
        .run(connection, (err, cursor)=> {
            if (cursor) {
                p.resolve(cursor);
            }
            else {
                p.reject();
            }

        });
    return p.promise;
}

module.exports = http.createServer((req, res)=> {
    var query = url.parse(req.url, true).query;

    if (!query['access_token'] || !query['openid']) {
        res.writeHead(200, Object.assign({
            'content-type': 'application/json'
        }, header));
        res.end(JSON.stringify({
            errmsg: 'no openid or access_token'
        }));
        return;
    }
    var access_token = query['access_token'];
    var openid = query['openid'];

    // Routers
    if (req.url.indexOf('/getlottery') === 0) {
        res.writeHead(200, Object.assign({'content-type': 'application/json'}, header));
        getAward(openid)
            .then(d=> {
                res.end(JSON.stringify({
                    award: 1,
                    awardName: d['awardName'],
                    size: d['size'],
                    randomCode: d['randomCode']
                }));
            }, ()=> {
                res.end(JSON.stringify({
                    award: 0
                }))
            })
    }
    else if (req.url.indexOf('/setlottery') === 0) {
        getUserInfo(access_token, openid, res)
            .then(d => {
                res.writeHead(200, Object.assign({
                    'content-type': 'application/json'
                }, header));
                getAward(openid)
                    .then((d)=> {
                        res.end(JSON.stringify({
                            award: 1,
                            awardName: d['awardName'],
                            size: d['size'],
                            randomCode: d['randomCode']
                        }));
                    }, ()=> {
                        if (getRandom()) {
                            // 获奖
                            if (d['province'].indexOf('江苏') > -1) {
                                // 江苏 -> 红包

                                var pack = parseInt((.5 + Math.random()) * 100, 10) / 100;
                                if (redPacks - pack > 0) {
                                    // 微信请求
                                    weixinSetRedPack(openid)
                                        .then(()=> {
                                            redPacks -= pack;
                                            var randomCode = getRandomString();
                                            // 写回数据库
                                            db.table('totalredpack')
                                                .filter({type: 'red'})
                                                .update({
                                                    total: redPacks
                                                })
                                                .run(connection, (err, result)=> {

                                                });
                                            db
                                                .table('reward')
                                                .insert({
                                                    openid: openid,
                                                    awardName: '红包',
                                                    size: pack,
                                                    randomCode: randomCode
                                                })
                                                .run(connection);

                                            // 发回请求

                                            res.end(JSON.stringify({
                                                award: 1,
                                                awardName: '红包',
                                                size: pack,
                                                randomCode: randomCode
                                            }));

                                        }, ()=> {
                                        });
                                }
                            }
                            // 江苏以外
                            else {
                                if (libao - 1 > 0) {
                                    libao--;
                                    var randomCode = getRandomString();
                                    db.table('totalredpack')
                                        .filter({type: 'libao'})
                                        .update({
                                            total: libao
                                        })
                                        .run(connection, (err, result)=> {

                                        });
                                    db
                                        .table('reward')
                                        .insert({
                                            openid: openid,
                                            awardName: '王朝春节礼包',
                                            size: 1,
                                            randomCode: randomCode
                                        })
                                        .run(connection);

                                    res.end(JSON.stringify({
                                        award: 1,
                                        awardName: '王朝春节礼包',
                                        size: 1,
                                        randomCode: randomCode
                                    }));
                                }
                            }
                        } else {
                            // 未中奖
                            res.end(JSON.stringify({
                                award: 0
                            }));
                        }
                    });
            }, ()=> {
            })
    }
    else {
        res.writeHead(200);
        res.end();
    }
});