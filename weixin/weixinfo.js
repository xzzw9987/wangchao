var crypto = require('crypto');
var https = require('https');
var http = require('http');
var querystring = require('querystring');
var processArgs = {};
var nonceStr = 'abqqvzpe';

[process.argv[2], process.argv[3]].forEach(function (el) {
    if (el)
        processArgs[el.split('=')[0]] = el.split('=')[1];
});

var appid = processArgs['appid'];
var secret = processArgs['secret'];

var accessToken;
var jsApiTicket;
var timestamp;

if (!appid || !secret) {
    throw new Error('no id or secret');
}

function getAccessToken() {
    https.get({
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret
    }, function (res) {
        var d = '';
        res.setEncoding('utf8');
        res.on('data', function (data) {
            d += data;
        });
        res.on('end', function () {
            d = JSON.parse(d);
            accessToken = d['access_token'];
            if (accessToken)
                getJSAPITicket();
        })
    });
    setTimeout(getAccessToken, 7200 * 1000);
}

function getJSAPITicket() {
    // https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi
    https.get({
            hostname: 'api.weixin.qq.com',
            path: '/cgi-bin/ticket/getticket?access_token=' + accessToken + '&type=jsapi'
        },
        function (res) {
            var d = '';
            res.setEncoding('utf8');
            res.on('data', function (data) {
                d += data;
            });
            res.on('end', function () {
                d = JSON.parse(d);
                jsApiTicket = d['ticket'];
            })
        }
    )
    ;
}

function getSignature(url) {
    if (!jsApiTicket || !accessToken)
        return;
    timestamp = parseInt(('' + (new Date).getTime()).substring(0, 10), 10);
    console.log(
        'jsapi_ticket=' + jsApiTicket +
        '&noncestr=' + nonceStr +
        '&timestamp=' + timestamp +
        '&url=' + url
    );
    return crypto.createHash('sha1')
        .update(
            'jsapi_ticket=' + jsApiTicket +
            '&noncestr=' + nonceStr +
            '&timestamp=' + timestamp +
            '&url=' + url
        )
        .digest('hex');
}

module.exports = http.createServer(function (req, res) {
    // get /config?url=encodeURIComponent()
    var content = '';
    // Routers
    if (req.url.indexOf('/config') === 0) {
        var q = require('url').parse(req.url, true).query;
        console.log(q);
        res.writeHead(200, {
            'content-type': 'application/javascript; charset=utf-8'
        });
        var sig = getSignature(q.url);
        content =
            "wx.config({" +
            "debug: false, " +
            "appId: '" + appid + "'," +
            "timestamp: '" + timestamp + "'," +
            "nonceStr: '" + nonceStr + "'," +
            "signature: '" + sig + "'," +
            "jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']" +
            '})';
        console.log(content);
        res.end(content);

    }
    else if (req.url.indexOf('/userinfo') === 0) {
        var query = require('url').parse(req.url, true).query;
        var openid = query['openid'];
        var at = query['access_token'];
        res.writeHead(200, {
            'content-type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        });

        if (at && openid) {
            https.get({
                hostname: 'api.weixin.qq.com',
                path: '/sns/userinfo?access_token=' + at + '&openid=' + openid + '&lang=zh_CN'
            }, function (_res) {
                _res.pipe(res);
            });
        }
        else {
            res.end(JSON.stringify({
                msg: 'openid 或 access_token 不存在'
            }));
        }
    }

    else if (req.url.indexOf('/proxy') === 0) {
        var query = require('url').parse(req.url, true).query;
        var code = query.code;
        var u = query.url;
        if (code) {
            https.get({
                hostname: 'api.weixin.qq.com',
                path: '/sns/oauth2/access_token?appid=' + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code'
            }, function (_res) {
                var d = '';
                _res.setEncoding('utf8');
                _res.on('data', function (data) {
                    d += data;
                });
                _res.on('end', function () {
                    d = JSON.parse(d);
                    u = decodeURIComponent(u);
                    res.writeHead(302, {
                        Location: u + '?access_token=' + d['access_token'] + '&openid=' + d['openid']
                    });
                    res.end();
                });
            });
        }
        else {
            // 未授权
            res.writeHead(200, {
                'content-type': 'application/json'
            });
            res.end(JSON.stringify({msg: 'No Auth'}));
        }
    }
    else {
        res.writeHead(200);
        res.end(content);
    }

});

getAccessToken();
