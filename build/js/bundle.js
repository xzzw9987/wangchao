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

	var _Object$assign = __webpack_require__(4)['default'];

	var query = __webpack_require__(16)(location.search.substring(1));
	var access_token = query.access_token;
	var openid = query.openid;

	// GET method
	var setLotteryUrl = 'http://xinzhongzhu.ga:13000/setlottery';
	// GET method
	var userInfoUrl = 'http://xinzhongzhu.ga:12000/userinfo';

	var $ = __webpack_require__(17);
	var shake = __webpack_require__(18);
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

	__webpack_require__(19)(function () {
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
	    }, null, 'json').done(function (data) {
	        if (data['award'] === 1) {
	            if (data['awardName'] === '王朝春节礼包') {
	                p($('.ed', c), $(res(_Object$assign(data, { type: 1 }))));
	            }
	            if (data['awardName'] === '红包') {
	                p($('.ed', c), $(res(_Object$assign(data, { type: 2 }))));
	            }
	        } else {
	            p($('.ed', c), $(res(_Object$assign(data, { type: 0 }))));
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
	        }, fadeInTimeout);
	    }, fadeOutTimeout);
	}

	function idx() {
	    return '\n     <div data-pg="0">\n        <div class="rl-btn"></div>\n        <div class="st-btn"></div>\n    </div>';
	}

	function cj() {
	    function once(foo) {
	        var done = false;
	        return function () {
	            if (!done) foo();
	            done = true;
	        };
	    }

	    var f = once(lottery);
	    shake(function () {
	        f();
	    });
	    return '\n        <div class="ed">\n            <div class="logo"></div>\n        </div>\n    ';
	}

	function res(d) {
	    var type = d.type;

	    // 根据 type  不同获奖信息, 获取不同模版
	    switch (type) {
	        case 0:
	            return '\n                <div class="z nzj">\n                    <div class="logo"></div>\n                    <div class="share"></div>\n                </div>\n            ';
	        case 1:
	            // libao
	            return '\n                <div class="z zj1">\n                    <div class="logo"></div>\n                    <div style="position: absolute;left: 150px;top: 322px;font-size: 30px;color: #a60006;">\n                        中奖编码: ' + d.randomCode + '\n                    </div>\n                    <img src="./erweima.png" width="640">\n                    <div class="share"></div>\n                </div>\n            ';
	        case 2:
	            // hongbao
	            return '\n                <div class="z zj2 ">\n                    <div class="logo"></div>\n                    <div style="position: absolute;left: 112px;top: 270px;font-size: 30px;color: #a60006;">\n                        王朝 ' + d.size + ' 元红包已存入账户\n                    </div>\n                    <div class="share"></div>\n                </div>\n            ';
	    }
	}

	function formTpl() {
	    return '\n        <div class="form">\n            <div class="logo"></div>\n            <input style="top: 344px;" type="text" name="n">\n            <input style="top: 412px;" type="text" name="c">\n            <input style="top: 480px;" type="text" name="a">\n        </div>\n    ';
	}

	function pgTpl(index, res) {
	    return '\n    <div data-pg="' + index + '">\n        <div class="logo"></div>\n        <div class="d-pic"></div>\n        <div class="q"></div>\n        <div class="opt">\n            <div data-res="ans-' + res[0] + '"></div>\n            <div data-res="ans-' + res[1] + '"></div>\n            <div data-res="ans-' + res[2] + '"></div>\n        </div>\n        <div class="i" style="display: none">\n            <div class="cv"></div>\n            <div class="ans">\n            <div style="width: 100%;height: 100%" class="ans-content">\n                <div class="ans-btn"></div>\n                <div class="close-tip-btn"></div>\n            </div>\n            </div>\n        </div>\n    </div>';
	}

	$('.fenxiang').on('touchend', function () {
	    $(this).toggle();
	});

	$(document).on('touchend', '.share', function () {
	    $('.fenxiang').toggle();
	});

	wx.onMenuShareTimeline({
	    title: '王朝', // 分享标题
	    link: 'http://wx.wine-dynasty.com/mjcq/index.html', // 分享链接
	    imgUrl: 'http://wx.wine-dynasty.com/mjcq/fg.jpg', // 分享图标
	    success: function success() {
	        // 用户确认分享后执行的回调函数
	    },
	    cancel: function cancel() {
	        // 用户取消分享后执行的回调函数
	    }
	});

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
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	module.exports = __webpack_require__(9).Object.assign;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(7);

	$def($def.S + $def.F, 'Object', {assign: __webpack_require__(10)});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(8)
	  , core      = __webpack_require__(9)
	  , PROTOTYPE = 'prototype';
	var ctx = function(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	};
	var $def = function(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {})[PROTOTYPE]
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && typeof target[key] != 'function')exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp[PROTOTYPE] = C[PROTOTYPE];
	    }(out);
	    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	module.exports = $def;

/***/ },
/* 8 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 9 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.2'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(3)
	  , toObject = __webpack_require__(11)
	  , IObject  = __webpack_require__(13);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(15)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(12);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// indexed object, fallback for non-array-like ES3 strings
	var cof = __webpack_require__(14);
	module.exports = 0 in Object('z') ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 16 */
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
/* 17 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 18 */
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
/* 19 */
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