var query = require('./query')(location.search.substring(1));
var {access_token,openid} = query;
// GET method
var setLotteryUrl = 'http://xinzhongzhu.ga:13000/setlottery';
// GET method
var userInfoUrl = 'http://xinzhongzhu.ga:12000/userinfo';

var $ = require('jquery');
var shake = require('./shake');
var fadeInTimeout = 500;
var fadeOutTimeout = 500;
var cssTable = [
    [2, 1, 0],
    [1, 0, 2],
    [2, 1, 0],
    [2, 0, 1],
    [2, 0, 1],
    [1, 0, 2]
];

var c = $('.c');
var store = {
    maxIndex: 6,
    get index() {
        return this._index || 0;
    },
    set index(val) {
        if (val > this.maxIndex) {
            endGame();
        }
        else if (val === 0) {
            p($('.loading'), $(idx()));
        }
        else {
            p($('[data-pg]', c), $(pgTpl(val, cssTable[val - 1])),
                function (n) {
                    if (video[val]) {
                        $('.d-pic', n)
                            .append('<video controls width="100%" height="100%" src="' + video[val] + '"></video>')
                            .css('backgroundImage', 'none');
                    }
                });
            this._index = val;
        }

    }
};

require('./load')(function () {
    store.index = 0;
});

var video = {
    '2': 'http://xinzhongzhu.ga/publicwangchao/video/wendu.mp4',
    '3': 'http://xinzhongzhu.ga/publicwangchao/video/guabei.mp4',
    '4': 'http://xinzhongzhu.ga/publicwangchao/video/aocao.mp4'
};


$(document).on('touchend', '.st-btn', function () {
    store.index = 1;
});

$(document).on('touchend', '[data-res]', function (e) {
    if ($(this).parents('[data-pg]').data('pg') == '6' && $(this).data('res') == 'ans-0') {
        store.index++;
        return;
    }
    var pg = $(this).parents('[data-pg]');
    $('.i', pg).show();
    $('.ans', pg)[0].className = 'ans';
    $('.ans', pg).addClass($(this).data('res'));
});

$(document).on('touchend', '.ans-btn', function () {
    var pt = $(this).parents('.ans');
    if (pt.hasClass('ans-0')) {
        store.index++;
        closeTip($(this).parents('.i'));
    } else {
        closeTip($(this).parents('.i'));
    }
});

$(document).on('touchend', '.close-tip-btn', function () {
    closeTip($(this).parents('.i'));
});

// $(document).on('touchend', '.ed-cj', lottery);

// $(document).on('touchend', '.libao-nxt', form);

function closeTip(pt) {
    pt.hide();
}

function endGame() {
    // 游戏结束
    p($('[data-pg]', c), $(cj()));
}

function lottery() {
    // 抽奖
    // $.get...
    // @todo
    $.get(setLotteryUrl, {
            openid: openid,
            access_token: access_token
        }, null, 'json')
        .done((data)=> {
            if (data['award'] === 1) {
                if (data['awardName'] === '王朝春节礼包') {
                    p($('.ed', c), $(res(Object.assign(data, {type: 1}))));
                }
                if (data['awardName'] === '红包') {
                    p($('.ed', c), $(res(Object.assign(data, {type: 2}))));
                }
            }
            else {
                p($('.ed', c), $(res(Object.assign(data, {type: 0}))));
            }
        });
}

function form() {
    // 表单
    p($('.libao', c), $(formTpl()));
}


function p(from, to, cb) {
    var m = from;
    m.addClass('out');
    // out
    setTimeout(function () {
        m.remove();
        var n = to;
        n.addClass('in');
        c.append(n);
        // in
        setTimeout(function () {
            n.removeClass('in');
            cb && cb(n);
        }, fadeInTimeout)
    }, fadeOutTimeout);
}

function idx() {
    return `
     <div data-pg="0">
        <div class="rl-btn"></div>
        <div class="st-btn"></div>
    </div>`;
}

function cj() {
    function once(foo) {
        var done = false;
        return function () {
            if (!done)
                foo();
            done = true;
        }
    }

    var f = once(lottery);
    shake(function () {
        f();
    });
    return `
        <div class="ed">
            <div class="logo"></div>
        </div>
    `;
}

function res(d) {
    var {type} = d;
    // 根据 type  不同获奖信息, 获取不同模版
    switch (type) {
        case 0:
            return `
                <div class="z nzj">
                    <div class="logo"></div>
                    <div class="share"></div>
                </div>
            `;
        case 1:
            // libao
            return `
                <div class="z zj1">
                    <div class="logo"></div>
                    <div style="position: absolute;left: 150px;top: 322px;font-size: 30px;color: #a60006;">
                        中奖编码: ${d.randomCode}
                    </div>
                    <img src="./erweima.png" width="640">
                    <div class="share"></div>
                </div>
            `;
        case 2:
            // hongbao
            return `
                <div class="z zj2 ">
                    <div class="logo"></div>
                    <div style="position: absolute;left: 112px;top: 270px;font-size: 30px;color: #a60006;">
                        王朝 ${d.size} 元红包已存入账户
                    </div>
                    <div class="share"></div>
                </div>
            `;
    }
}

function formTpl() {
    return `
        <div class="form">
            <div class="logo"></div>
            <input style="top: 344px;" type="text" name="n">
            <input style="top: 412px;" type="text" name="c">
            <input style="top: 480px;" type="text" name="a">
        </div>
    `;
}

function pgTpl(index, res) {
    return `
    <div data-pg="${index}">
        <div class="logo"></div>
        <div class="d-pic"></div>
        <div class="q"></div>
        <div class="opt">
            <div data-res="ans-${res[0]}"></div>
            <div data-res="ans-${res[1]}"></div>
            <div data-res="ans-${res[2]}"></div>
        </div>
        <div class="i" style="display: none">
            <div class="cv"></div>
            <div class="ans">
            <div style="width: 100%;height: 100%" class="ans-content">
                <div class="ans-btn"></div>
                <div class="close-tip-btn"></div>
            </div>
            </div>
        </div>
    </div>`;
}

$('.fenxiang').on('touchend', function () {
    $(this).toggle();
});


$(document).on('touchend', '.share', function () {
    $('.fenxiang').toggle();
});