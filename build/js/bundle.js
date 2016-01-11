/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Object$defineProperties = __webpack_require__(1)['default'];

	var query = __webpack_require__(4)(location.search.substring(1));
	var access_token = query.access_token;
	var openid = query.openid;

	// GET method
	var lotteryUrl = 'http://xinzhongzhu.ga:13000/lottery';
	// GET method
	var userInfoUrl = 'http://xinzhongzhu.ga:12000/userinfo';

	var $ = __webpack_require__(5);
	var shake = __webpack_require__(6);
	var fadeInTimeout = 500;
	var fadeOutTimeout = 500;
	var cssTable = [[2, 1, 0], [1, 0, 2], [2, 1, 0], [2, 0, 1], [2, 0, 1], [1, 0, 2]];

	var c = $('.c');
	var store = _Object$defineProperties({
	    maxIndex: 6
	}, {
	    index: {
	        get: function get() {
	            return this._index || 0;
	        },
	        set: function set(val) {
	            if (val > this.maxIndex) {
	                endGame();
	            } else if (val === 0) {
	                p($('.loading'), $(idx()));
	            } else {
	                p($('[data-pg]', c), $(pgTpl(val, cssTable[val - 1])), function (n) {
	                    if (video[val]) {
	                        $('.d-pic', n).append('<video controls width="100%" height="100%" src="' + video[val] + '"></video>').css('backgroundImage', 'none');
	                    }
	                });
	                this._index = val;
	            }
	        },
	        configurable: true,
	        enumerable: true
	    }
	});

	__webpack_require__(7)(function () {
	    store.index = 0;
	});

	var video = {
	    '2': './video/wendu.mp4',
	    '3': './video/guabei.mp4',
	    '4': './video/aocao.mp4'
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
	    $.get(lotteryUrl, {
	        openid: openid
	    }, null, 'json').done(function (data) {});
	    p($('.ed', c), $(res(0)));
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
	        }, fadeInTimeout);
	    }, fadeOutTimeout);
	}

	function idx() {
	    return '\n     <div data-pg="0">\n        <div class="rl-btn"></div>\n        <div class="st-btn"></div>\n    </div>';
	}

	function cj() {
	    shake(function () {
	        lottery();
	    });
	    return '\n        <div class="ed">\n            <div class="logo"></div>\n        </div>\n    ';
	}

	function res(type) {
	    // 根据 type  不同获奖信息, 获取不同模版
	    switch (type) {
	        case 0:
	            return '\n                <div class="libao">\n                    <div class="logo"></div>\n                    <div class="libao-nxt"></div>\n                </div>\n            ';
	    }
	}

	function formTpl() {
	    return '\n        <div class="form">\n            <div class="logo"></div>\n            <input style="top: 344px;" type="text" name="n">\n            <input style="top: 412px;" type="text" name="c">\n            <input style="top: 480px;" type="text" name="a">\n        </div>\n    ';
	}

	function pgTpl(index, res) {
	    return '\n    <div data-pg="' + index + '">\n        <div class="logo"></div>\n        <div class="d-pic"></div>\n        <div class="q"></div>\n        <div class="opt">\n            <div data-res="ans-' + res[0] + '"></div>\n            <div data-res="ans-' + res[1] + '"></div>\n            <div data-res="ans-' + res[2] + '"></div>\n        </div>\n        <div class="i" style="display: none">\n            <div class="cv"></div>\n            <div class="ans">\n            <div style="width: 100%;height: 100%" class="ans-content">\n                <div class="ans-btn"></div>\n                <div class="close-tip-btn"></div>\n            </div>\n            </div>\n        </div>\n    </div>';
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(3);
	module.exports = function defineProperties(T, D){
	  return $.setDescs(T, D);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (s) {
	    if (!s) return {};
	    var o = {};
	    s.split('&').forEach(function (el) {
	        o[el.split('=')[0]] = el.split('=')[1];
	    });
	    return o;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var SHAKE_THRESHOLD = 2000;
	var last_update = 0;
	var x = 0,
	    y = 0,
	    z = 0,
	    last_x = 0,
	    last_y = 0,
	    last_z = 0;
	var watchId;
	var l = [];
	if (window.DeviceMotionEvent) {
	    // 判断设备标准javascript是否支持加速度API
	    window.addEventListener('devicemotion', deviceMotionHandler, false);
	}

	function deviceMotionHandler(eventData) {
	    var acceleration = eventData.accelerationIncludingGravity || eventData;
	    var curTime = new Date().getTime();
	    if (curTime - last_update > 100) {
	        var diffTime = curTime - last_update;
	        last_update = curTime;
	        x = acceleration.x;
	        y = acceleration.y;
	        z = acceleration.z;
	        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
	        if (speed > SHAKE_THRESHOLD) {
	            // 抛出shake事件到window
	            l.forEach(function (f) {
	                return f();
	            });
	        }
	        last_x = x;
	        last_y = y;
	        last_z = z;
	    }
	}

	module.exports = function (f) {
	    if (!window.DeviceMotionEvent) {
	        alert('您的手机不支持"摇一摇"功能');
	        return;
	    }
	    l.push(f);
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var ready;
	var loadTimeout = null;
	var maxHeight = 50;
	$(window).on('load', function () {
	    clearTimeout(loadTimeout);
	    $('.load-fore').height(maxHeight);
	    $('.percent').text('100%');
	    ready && ready();
	});

	function load(t) {
	    if (t < 100) {
	        $('.load-fore').height(maxHeight * t / 100);
	        $('.percent').text(t + '%');
	        loadTimeout = setTimeout(function () {
	            load(t + 3);
	        }, 100);
	    }
	}

	setTimeout(function () {
	    load(0);
	}, 5000);

	module.exports = function (d) {
	    ready = d;
	};

/***/ }
/******/ ]);