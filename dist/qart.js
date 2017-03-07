(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["qart"] = factory();
	else
		root["qart"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _classCallCheck2 = __webpack_require__(1);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(2);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _qrcode = __webpack_require__(21);
	
	var _util = __webpack_require__(75);
	
	var _util2 = _interopRequireDefault(_util);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var QArt = function () {
	    function QArt(options) {
	        (0, _classCallCheck3.default)(this, QArt);
	
	        if (typeof options === 'undefined') {
	            throw new TypeError('QArt required `options`.');
	        } else if (typeof options.value === 'undefined') {
	            throw new TypeError('QArt required `value` option.');
	        } else if (typeof options.imagePath === 'undefined') {
	            throw new TypeError('QArt required `imagePath` option.');
	        }
	
	        this.filter = typeof options.filter === 'undefined' ? QArt.DEFAULTS.filter : options.filter;
	        this.value = options.value;
	        this.imagePath = options.imagePath;
	    }
	
	    (0, _createClass3.default)(QArt, [{
	        key: 'make',
	        value: function make(el) {
	            var imageSize = 195;
	            var padding = 12;
	            var level = 10;
	
	            var qr = (0, _qrcode.QRCode)(level, 'H');
	            qr.addData(this.value);
	            qr.make();
	            var qrImage = qr.createImgObject(3);
	
	            var self = this;
	            qrImage.onload = function () {
	                var coverImage = new Image();
	                coverImage.src = self.imagePath;
	
	                var resultCanvas = _util2.default.createCanvas(imageSize, qrImage);
	                var qrCanvas = _util2.default.createCanvas(imageSize, qrImage);
	
	                coverImage.onload = function () {
	                    if (coverImage.width < coverImage.height) {
	                        coverImage.height = (imageSize - padding * 2) * (1.0 * coverImage.height / coverImage.width);
	                        coverImage.width = imageSize - padding * 2;
	                    } else {
	                        coverImage.width = (imageSize - padding * 2) * (1.0 * coverImage.width / coverImage.height);
	                        coverImage.height = imageSize - padding * 2;
	                    }
	
	                    var coverCanvas = document.createElement('canvas');
	                    coverCanvas.width = imageSize;
	                    coverCanvas.height = imageSize;
	                    coverCanvas.getContext('2d').drawImage(coverImage, padding, padding, imageSize - padding * 2, imageSize - padding * 2);
	
	                    var coverImageData = coverCanvas.getContext('2d').getImageData(0, 0, imageSize, imageSize);
	                    var coverImageBinary = coverImageData.data;
	                    var resultImageData = resultCanvas.getContext('2d').getImageData(0, 0, imageSize, imageSize);
	                    var resultImageBinary = resultImageData.data;
	
	                    for (var i = 0; i < coverImageBinary.length; i += 4) {
	                        var x = Math.floor(i / 4) % imageSize;
	                        var y = Math.floor(Math.floor(i / 4) / imageSize);
	
	                        if (x < padding || y < padding || x >= imageSize - padding || y >= imageSize - padding) {
	                            resultImageBinary[i + 3] = 0;
	                            continue;
	                        }
	                        if (x % 3 == 1 && y % 3 == 1) {
	                            continue;
	                        }
	                        if (x < 36 && (y < 36 || y >= imageSize - 36)) {
	                            continue;
	                        }
	                        if (x >= imageSize - 36 && y < 36) {
	                            continue;
	                        }
	
	                        if (self.filter == 'threshold') {
	                            var factor = _util2.default.threshold(coverImageBinary[i], coverImageBinary[i + 1], coverImageBinary[i + 2], 127);
	                            resultImageBinary[i] = factor;
	                            resultImageBinary[i + 1] = factor;
	                            resultImageBinary[i + 2] = factor;
	                        } else if (self.filter == 'color') {
	                            resultImageBinary[i] = coverImageBinary[i];
	                            resultImageBinary[i + 1] = coverImageBinary[i + 1];
	                            resultImageBinary[i + 2] = coverImageBinary[i + 2];
	                        }
	                        resultImageBinary[i + 3] = coverImageBinary[i + 3];
	                    }
	
	                    resultCanvas.getContext('2d').putImageData(resultImageData, 0, 0);
	
	                    var patternPostion = _qrcode.QRUtil.getPatternPosition(level);
	                    for (var i = 0; i < patternPostion.length; i += 1) {
	                        for (var j = 0; j < patternPostion.length; j += 1) {
	                            var x = patternPostion[i];
	                            var y = patternPostion[j];
	                            if (!(x == 6 && y == 50 || y == 6 && x == 50 || x == 6 && y == 6)) {
	                                var rectX = 3 * (x - 2) + 12;
	                                var rectY = 3 * (y - 2) + 12;
	                                var rectWidth = 3 * (x + 3) + 12 - rectX;
	                                var rectHeight = 3 * (y + 3) + 12 - rectY;
	
	                                var rectData = qrCanvas.getContext('2d').getImageData(rectX, rectY, rectWidth, rectHeight);
	                                resultCanvas.getContext('2d').putImageData(rectData, rectX, rectY);
	                            }
	                        }
	                    }
	
	                    el.innerHTML = '';
	                    el.appendChild(resultCanvas);
	                };
	            };
	        }
	    }], [{
	        key: 'DEFAULTS',
	        get: function get() {
	            return {
	                value: '',
	                filter: 'threshold'
	            };
	        }
	    }]);
	    return QArt;
	}();
	
	window.QArt = QArt;
	exports.default = window.QArt;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(3);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	var $Object = __webpack_require__(8).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(16), 'Object', {defineProperty: __webpack_require__(12).f});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(7)
	  , core      = __webpack_require__(8)
	  , ctx       = __webpack_require__(9)
	  , hide      = __webpack_require__(11)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 7 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(10);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(12)
	  , createDesc = __webpack_require__(20);
	module.exports = __webpack_require__(16) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(13)
	  , IE8_DOM_DEFINE = __webpack_require__(15)
	  , toPrimitive    = __webpack_require__(19)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(16) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(16) && !__webpack_require__(17)(function(){
	  return Object.defineProperty(__webpack_require__(18)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(17)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14)
	  , document = __webpack_require__(7).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(14);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof2 = __webpack_require__(22);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var qrcode = function () {
	  var qrcode = function qrcode(typeNumber, errorCorrectionLevel) {
	
	    var PAD0 = 0xEC;
	    var PAD1 = 0x11;
	
	    var _typeNumber = typeNumber;
	    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
	    var _modules = null;
	    var _moduleCount = 0;
	    var _dataCache = null;
	    var _dataList = new Array();
	
	    var _this = {};
	
	    var makeImpl = function makeImpl(test, maskPattern) {
	
	      _moduleCount = _typeNumber * 4 + 17;
	      _modules = function (moduleCount) {
	        var modules = new Array(moduleCount);
	        for (var row = 0; row < moduleCount; row += 1) {
	          modules[row] = new Array(moduleCount);
	          for (var col = 0; col < moduleCount; col += 1) {
	            modules[row][col] = null;
	          }
	        }
	        return modules;
	      }(_moduleCount);
	
	      setupPositionProbePattern(0, 0);
	      setupPositionProbePattern(_moduleCount - 7, 0);
	      setupPositionProbePattern(0, _moduleCount - 7);
	      setupPositionAdjustPattern();
	      setupTimingPattern();
	      setupTypeInfo(test, maskPattern);
	
	      if (_typeNumber >= 7) {
	        setupTypeNumber(test);
	      }
	
	      if (_dataCache == null) {
	        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
	      }
	
	      mapData(_dataCache, maskPattern);
	    };
	
	    var setupPositionProbePattern = function setupPositionProbePattern(row, col) {
	
	      for (var r = -1; r <= 7; r += 1) {
	
	        if (row + r <= -1 || _moduleCount <= row + r) continue;
	
	        for (var c = -1; c <= 7; c += 1) {
	
	          if (col + c <= -1 || _moduleCount <= col + c) continue;
	
	          if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
	            _modules[row + r][col + c] = true;
	          } else {
	            _modules[row + r][col + c] = false;
	          }
	        }
	      }
	    };
	
	    var getBestMaskPattern = function getBestMaskPattern() {
	
	      var minLostPoint = 0;
	      var pattern = 0;
	
	      for (var i = 0; i < 8; i += 1) {
	
	        makeImpl(true, i);
	
	        var lostPoint = QRUtil.getLostPoint(_this);
	
	        if (i == 0 || minLostPoint > lostPoint) {
	          minLostPoint = lostPoint;
	          pattern = i;
	        }
	      }
	
	      return pattern;
	    };
	
	    var setupTimingPattern = function setupTimingPattern() {
	
	      for (var r = 8; r < _moduleCount - 8; r += 1) {
	        if (_modules[r][6] != null) {
	          continue;
	        }
	        _modules[r][6] = r % 2 == 0;
	      }
	
	      for (var c = 8; c < _moduleCount - 8; c += 1) {
	        if (_modules[6][c] != null) {
	          continue;
	        }
	        _modules[6][c] = c % 2 == 0;
	      }
	    };
	
	    var setupPositionAdjustPattern = function setupPositionAdjustPattern() {
	
	      var pos = QRUtil.getPatternPosition(_typeNumber);
	
	      for (var i = 0; i < pos.length; i += 1) {
	
	        for (var j = 0; j < pos.length; j += 1) {
	
	          var row = pos[i];
	          var col = pos[j];
	
	          if (_modules[row][col] != null) {
	            continue;
	          }
	
	          for (var r = -2; r <= 2; r += 1) {
	
	            for (var c = -2; c <= 2; c += 1) {
	
	              if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
	                _modules[row + r][col + c] = true;
	              } else {
	                _modules[row + r][col + c] = false;
	              }
	            }
	          }
	        }
	      }
	    };
	
	    var setupTypeNumber = function setupTypeNumber(test) {
	
	      var bits = QRUtil.getBCHTypeNumber(_typeNumber);
	
	      for (var i = 0; i < 18; i += 1) {
	        var mod = !test && (bits >> i & 1) == 1;
	        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
	      }
	
	      for (var i = 0; i < 18; i += 1) {
	        var mod = !test && (bits >> i & 1) == 1;
	        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
	      }
	    };
	
	    var setupTypeInfo = function setupTypeInfo(test, maskPattern) {
	
	      var data = _errorCorrectionLevel << 3 | maskPattern;
	      var bits = QRUtil.getBCHTypeInfo(data);
	
	      for (var i = 0; i < 15; i += 1) {
	
	        var mod = !test && (bits >> i & 1) == 1;
	
	        if (i < 6) {
	          _modules[i][8] = mod;
	        } else if (i < 8) {
	          _modules[i + 1][8] = mod;
	        } else {
	          _modules[_moduleCount - 15 + i][8] = mod;
	        }
	      }
	
	      for (var i = 0; i < 15; i += 1) {
	
	        var mod = !test && (bits >> i & 1) == 1;
	
	        if (i < 8) {
	          _modules[8][_moduleCount - i - 1] = mod;
	        } else if (i < 9) {
	          _modules[8][15 - i - 1 + 1] = mod;
	        } else {
	          _modules[8][15 - i - 1] = mod;
	        }
	      }
	
	      _modules[_moduleCount - 8][8] = !test;
	    };
	
	    var mapData = function mapData(data, maskPattern) {
	
	      var inc = -1;
	      var row = _moduleCount - 1;
	      var bitIndex = 7;
	      var byteIndex = 0;
	      var maskFunc = QRUtil.getMaskFunction(maskPattern);
	
	      for (var col = _moduleCount - 1; col > 0; col -= 2) {
	
	        if (col == 6) col -= 1;
	
	        while (true) {
	
	          for (var c = 0; c < 2; c += 1) {
	
	            if (_modules[row][col - c] == null) {
	
	              var dark = false;
	
	              if (byteIndex < data.length) {
	                dark = (data[byteIndex] >>> bitIndex & 1) == 1;
	              }
	
	              var mask = maskFunc(row, col - c);
	
	              if (mask) {
	                dark = !dark;
	              }
	
	              _modules[row][col - c] = dark;
	              bitIndex -= 1;
	
	              if (bitIndex == -1) {
	                byteIndex += 1;
	                bitIndex = 7;
	              }
	            }
	          }
	
	          row += inc;
	
	          if (row < 0 || _moduleCount <= row) {
	            row -= inc;
	            inc = -inc;
	            break;
	          }
	        }
	      }
	    };
	
	    var createBytes = function createBytes(buffer, rsBlocks) {
	
	      var offset = 0;
	
	      var maxDcCount = 0;
	      var maxEcCount = 0;
	
	      var dcdata = new Array(rsBlocks.length);
	      var ecdata = new Array(rsBlocks.length);
	
	      for (var r = 0; r < rsBlocks.length; r += 1) {
	
	        var dcCount = rsBlocks[r].dataCount;
	        var ecCount = rsBlocks[r].totalCount - dcCount;
	
	        maxDcCount = Math.max(maxDcCount, dcCount);
	        maxEcCount = Math.max(maxEcCount, ecCount);
	
	        dcdata[r] = new Array(dcCount);
	
	        for (var i = 0; i < dcdata[r].length; i += 1) {
	          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
	        }
	        offset += dcCount;
	
	        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
	        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
	
	        var modPoly = rawPoly.mod(rsPoly);
	        ecdata[r] = new Array(rsPoly.getLength() - 1);
	        for (var i = 0; i < ecdata[r].length; i += 1) {
	          var modIndex = i + modPoly.getLength() - ecdata[r].length;
	          ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
	        }
	      }
	
	      var totalCodeCount = 0;
	      for (var i = 0; i < rsBlocks.length; i += 1) {
	        totalCodeCount += rsBlocks[i].totalCount;
	      }
	
	      var data = new Array(totalCodeCount);
	      var index = 0;
	
	      for (var i = 0; i < maxDcCount; i += 1) {
	        for (var r = 0; r < rsBlocks.length; r += 1) {
	          if (i < dcdata[r].length) {
	            data[index] = dcdata[r][i];
	            index += 1;
	          }
	        }
	      }
	
	      for (var i = 0; i < maxEcCount; i += 1) {
	        for (var r = 0; r < rsBlocks.length; r += 1) {
	          if (i < ecdata[r].length) {
	            data[index] = ecdata[r][i];
	            index += 1;
	          }
	        }
	      }
	
	      return data;
	    };
	
	    var createData = function createData(typeNumber, errorCorrectionLevel, dataList) {
	
	      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);
	
	      var buffer = qrBitBuffer();
	
	      for (var i = 0; i < dataList.length; i += 1) {
	        var data = dataList[i];
	        buffer.put(data.getMode(), 4);
	        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
	        data.write(buffer);
	      }
	
	      var totalDataCount = 0;
	      for (var i = 0; i < rsBlocks.length; i += 1) {
	        totalDataCount += rsBlocks[i].dataCount;
	      }
	
	      if (buffer.getLengthInBits() > totalDataCount * 8) {
	        throw new Error('code length overflow. (' + buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')');
	      }
	
	      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
	        buffer.put(0, 4);
	      }
	
	      while (buffer.getLengthInBits() % 8 != 0) {
	        buffer.putBit(false);
	      }
	
	      while (true) {
	
	        if (buffer.getLengthInBits() >= totalDataCount * 8) {
	          break;
	        }
	        buffer.put(PAD0, 8);
	
	        if (buffer.getLengthInBits() >= totalDataCount * 8) {
	          break;
	        }
	        buffer.put(PAD1, 8);
	      }
	
	      return createBytes(buffer, rsBlocks);
	    };
	
	    _this.addData = function (data, mode) {
	
	      mode = mode || 'Byte';
	
	      var newData = null;
	
	      switch (mode) {
	        case 'Numeric':
	          newData = qrNumber(data);
	          break;
	        case 'Alphanumeric':
	          newData = qrAlphaNum(data);
	          break;
	        case 'Byte':
	          newData = qr8BitByte(data);
	          break;
	        case 'Kanji':
	          newData = qrKanji(data);
	          break;
	        default:
	          throw 'mode:' + mode;
	      }
	
	      _dataList.push(newData);
	      _dataCache = null;
	    };
	
	    _this.isDark = function (row, col) {
	      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
	        throw new Error(row + ',' + col);
	      }
	      return _modules[row][col];
	    };
	
	    _this.getModuleCount = function () {
	      return _moduleCount;
	    };
	
	    _this.make = function () {
	      makeImpl(false, getBestMaskPattern());
	    };
	
	    _this.createTableTag = function (cellSize, margin) {
	
	      cellSize = cellSize || 2;
	      margin = typeof margin == 'undefined' ? cellSize * 4 : margin;
	
	      var qrHtml = '';
	
	      qrHtml += '<table style="';
	      qrHtml += ' border-width: 0px; border-style: none;';
	      qrHtml += ' border-collapse: collapse;';
	      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
	      qrHtml += '">';
	      qrHtml += '<tbody>';
	
	      for (var r = 0; r < _this.getModuleCount(); r += 1) {
	
	        qrHtml += '<tr>';
	
	        for (var c = 0; c < _this.getModuleCount(); c += 1) {
	          qrHtml += '<td style="';
	          qrHtml += ' border-width: 0px; border-style: none;';
	          qrHtml += ' border-collapse: collapse;';
	          qrHtml += ' padding: 0px; margin: 0px;';
	          qrHtml += ' width: ' + cellSize + 'px;';
	          qrHtml += ' height: ' + cellSize + 'px;';
	          qrHtml += ' background-color: ';
	          qrHtml += _this.isDark(r, c) ? '#000000' : '#ffffff';
	          qrHtml += ';';
	          qrHtml += '"/>';
	        }
	
	        qrHtml += '</tr>';
	      }
	
	      qrHtml += '</tbody>';
	      qrHtml += '</table>';
	
	      return qrHtml;
	    };
	
	    _this.createSvgTag = function (cellSize, margin) {
	
	      cellSize = cellSize || 2;
	      margin = typeof margin == 'undefined' ? cellSize * 4 : margin;
	      var size = _this.getModuleCount() * cellSize + margin * 2;
	      var c,
	          mc,
	          r,
	          mr,
	          qrSvg = '',
	          rect;
	
	      rect = 'l' + cellSize + ',0 0,' + cellSize + ' -' + cellSize + ',0 0,-' + cellSize + 'z ';
	
	      qrSvg += '<svg';
	      qrSvg += ' width="' + size + 'px"';
	      qrSvg += ' height="' + size + 'px"';
	      qrSvg += ' xmlns="http://www.w3.org/2000/svg"';
	      qrSvg += '>';
	      qrSvg += '<path d="';
	
	      for (r = 0; r < _this.getModuleCount(); r += 1) {
	        mr = r * cellSize + margin;
	        for (c = 0; c < _this.getModuleCount(); c += 1) {
	          if (_this.isDark(r, c)) {
	            mc = c * cellSize + margin;
	            qrSvg += 'M' + mc + ',' + mr + rect;
	          }
	        }
	      }
	
	      qrSvg += '" stroke="transparent" fill="black"/>';
	      qrSvg += '</svg>';
	
	      return qrSvg;
	    };
	
	    _this.createImgTag = function (cellSize, margin) {
	
	      cellSize = cellSize || 2;
	      margin = typeof margin == 'undefined' ? cellSize * 4 : margin;
	
	      var size = _this.getModuleCount() * cellSize + margin * 2;
	      var min = margin;
	      var max = size - margin;
	
	      return createImgTag(size, size, function (x, y) {
	        if (min <= x && x < max && min <= y && y < max) {
	          var c = Math.floor((x - min) / cellSize);
	          var r = Math.floor((y - min) / cellSize);
	          return _this.isDark(r, c) ? 0 : 1;
	        } else {
	          return 1;
	        }
	      });
	    };
	
	    _this.createImgObject = function (cellSize, margin) {
	
	      cellSize = cellSize || 2;
	      margin = typeof margin == 'undefined' ? cellSize * 4 : margin;
	
	      var size = _this.getModuleCount() * cellSize + margin * 2;
	      var min = margin;
	      var max = size - margin;
	
	      return createImgObject(size, size, function (x, y) {
	        if (min <= x && x < max && min <= y && y < max) {
	          var c = Math.floor((x - min) / cellSize);
	          var r = Math.floor((y - min) / cellSize);
	          return _this.isDark(r, c) ? 0 : 1;
	        } else {
	          return 1;
	        }
	      });
	    };
	
	    return _this;
	  };
	
	  qrcode.stringToBytes = function (s) {
	    var bytes = new Array();
	    for (var i = 0; i < s.length; i += 1) {
	      var c = s.charCodeAt(i);
	      bytes.push(c & 0xff);
	    }
	    return bytes;
	  };
	
	  qrcode.createStringToBytes = function (unicodeData, numChars) {
	
	    var unicodeMap = function () {
	
	      var bin = base64DecodeInputStream(unicodeData);
	      var read = function read() {
	        var b = bin.read();
	        if (b == -1) throw new Error();
	        return b;
	      };
	
	      var count = 0;
	      var unicodeMap = {};
	      while (true) {
	        var b0 = bin.read();
	        if (b0 == -1) break;
	        var b1 = read();
	        var b2 = read();
	        var b3 = read();
	        var k = String.fromCharCode(b0 << 8 | b1);
	        var v = b2 << 8 | b3;
	        unicodeMap[k] = v;
	        count += 1;
	      }
	      if (count != numChars) {
	        throw new Error(count + ' != ' + numChars);
	      }
	
	      return unicodeMap;
	    }();
	
	    var unknownChar = '?'.charCodeAt(0);
	
	    return function (s) {
	      var bytes = new Array();
	      for (var i = 0; i < s.length; i += 1) {
	        var c = s.charCodeAt(i);
	        if (c < 128) {
	          bytes.push(c);
	        } else {
	          var b = unicodeMap[s.charAt(i)];
	          if (typeof b == 'number') {
	            if ((b & 0xff) == b) {
	              bytes.push(b);
	            } else {
	              bytes.push(b >>> 8);
	              bytes.push(b & 0xff);
	            }
	          } else {
	            bytes.push(unknownChar);
	          }
	        }
	      }
	      return bytes;
	    };
	  };
	
	  var QRMode = {
	    MODE_NUMBER: 1 << 0,
	    MODE_ALPHA_NUM: 1 << 1,
	    MODE_8BIT_BYTE: 1 << 2,
	    MODE_KANJI: 1 << 3
	  };
	
	  var QRErrorCorrectionLevel = {
	    L: 1,
	    M: 0,
	    Q: 3,
	    H: 2
	  };
	
	  var QRMaskPattern = {
	    PATTERN000: 0,
	    PATTERN001: 1,
	    PATTERN010: 2,
	    PATTERN011: 3,
	    PATTERN100: 4,
	    PATTERN101: 5,
	    PATTERN110: 6,
	    PATTERN111: 7
	  };
	
	  var QRUtil = function () {
	
	    var PATTERN_POSITION_TABLE = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]];
	    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
	    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
	    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
	
	    var _this = {};
	
	    var getBCHDigit = function getBCHDigit(data) {
	      var digit = 0;
	      while (data != 0) {
	        digit += 1;
	        data >>>= 1;
	      }
	      return digit;
	    };
	
	    _this.getBCHTypeInfo = function (data) {
	      var d = data << 10;
	      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
	        d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
	      }
	      return (data << 10 | d) ^ G15_MASK;
	    };
	
	    _this.getBCHTypeNumber = function (data) {
	      var d = data << 12;
	      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
	        d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
	      }
	      return data << 12 | d;
	    };
	
	    _this.getPatternPosition = function (typeNumber) {
	      return PATTERN_POSITION_TABLE[typeNumber - 1];
	    };
	
	    _this.getMaskFunction = function (maskPattern) {
	
	      switch (maskPattern) {
	
	        case QRMaskPattern.PATTERN000:
	          return function (i, j) {
	            return (i + j) % 2 == 0;
	          };
	        case QRMaskPattern.PATTERN001:
	          return function (i, j) {
	            return i % 2 == 0;
	          };
	        case QRMaskPattern.PATTERN010:
	          return function (i, j) {
	            return j % 3 == 0;
	          };
	        case QRMaskPattern.PATTERN011:
	          return function (i, j) {
	            return (i + j) % 3 == 0;
	          };
	        case QRMaskPattern.PATTERN100:
	          return function (i, j) {
	            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
	          };
	        case QRMaskPattern.PATTERN101:
	          return function (i, j) {
	            return i * j % 2 + i * j % 3 == 0;
	          };
	        case QRMaskPattern.PATTERN110:
	          return function (i, j) {
	            return (i * j % 2 + i * j % 3) % 2 == 0;
	          };
	        case QRMaskPattern.PATTERN111:
	          return function (i, j) {
	            return (i * j % 3 + (i + j) % 2) % 2 == 0;
	          };
	
	        default:
	          throw new Error('bad maskPattern:' + maskPattern);
	      }
	    };
	
	    _this.getErrorCorrectPolynomial = function (errorCorrectLength) {
	      var a = qrPolynomial([1], 0);
	      for (var i = 0; i < errorCorrectLength; i += 1) {
	        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
	      }
	      return a;
	    };
	
	    _this.getLengthInBits = function (mode, type) {
	
	      if (1 <= type && type < 10) {
	
	        switch (mode) {
	          case QRMode.MODE_NUMBER:
	            return 10;
	          case QRMode.MODE_ALPHA_NUM:
	            return 9;
	          case QRMode.MODE_8BIT_BYTE:
	            return 8;
	          case QRMode.MODE_KANJI:
	            return 8;
	          default:
	            throw new Error('mode:' + mode);
	        }
	      } else if (type < 27) {
	
	        switch (mode) {
	          case QRMode.MODE_NUMBER:
	            return 12;
	          case QRMode.MODE_ALPHA_NUM:
	            return 11;
	          case QRMode.MODE_8BIT_BYTE:
	            return 16;
	          case QRMode.MODE_KANJI:
	            return 10;
	          default:
	            throw new Error('mode:' + mode);
	        }
	      } else if (type < 41) {
	
	        switch (mode) {
	          case QRMode.MODE_NUMBER:
	            return 14;
	          case QRMode.MODE_ALPHA_NUM:
	            return 13;
	          case QRMode.MODE_8BIT_BYTE:
	            return 16;
	          case QRMode.MODE_KANJI:
	            return 12;
	          default:
	            throw new Error('mode:' + mode);
	        }
	      } else {
	        throw new Error('type:' + type);
	      }
	    };
	
	    _this.getLostPoint = function (qrcode) {
	
	      var moduleCount = qrcode.getModuleCount();
	
	      var lostPoint = 0;
	
	      for (var row = 0; row < moduleCount; row += 1) {
	        for (var col = 0; col < moduleCount; col += 1) {
	
	          var sameCount = 0;
	          var dark = qrcode.isDark(row, col);
	
	          for (var r = -1; r <= 1; r += 1) {
	
	            if (row + r < 0 || moduleCount <= row + r) {
	              continue;
	            }
	
	            for (var c = -1; c <= 1; c += 1) {
	
	              if (col + c < 0 || moduleCount <= col + c) {
	                continue;
	              }
	
	              if (r == 0 && c == 0) {
	                continue;
	              }
	
	              if (dark == qrcode.isDark(row + r, col + c)) {
	                sameCount += 1;
	              }
	            }
	          }
	
	          if (sameCount > 5) {
	            lostPoint += 3 + sameCount - 5;
	          }
	        }
	      };
	
	      for (var row = 0; row < moduleCount - 1; row += 1) {
	        for (var col = 0; col < moduleCount - 1; col += 1) {
	          var count = 0;
	          if (qrcode.isDark(row, col)) count += 1;
	          if (qrcode.isDark(row + 1, col)) count += 1;
	          if (qrcode.isDark(row, col + 1)) count += 1;
	          if (qrcode.isDark(row + 1, col + 1)) count += 1;
	          if (count == 0 || count == 4) {
	            lostPoint += 3;
	          }
	        }
	      }
	
	      for (var row = 0; row < moduleCount; row += 1) {
	        for (var col = 0; col < moduleCount - 6; col += 1) {
	          if (qrcode.isDark(row, col) && !qrcode.isDark(row, col + 1) && qrcode.isDark(row, col + 2) && qrcode.isDark(row, col + 3) && qrcode.isDark(row, col + 4) && !qrcode.isDark(row, col + 5) && qrcode.isDark(row, col + 6)) {
	            lostPoint += 40;
	          }
	        }
	      }
	
	      for (var col = 0; col < moduleCount; col += 1) {
	        for (var row = 0; row < moduleCount - 6; row += 1) {
	          if (qrcode.isDark(row, col) && !qrcode.isDark(row + 1, col) && qrcode.isDark(row + 2, col) && qrcode.isDark(row + 3, col) && qrcode.isDark(row + 4, col) && !qrcode.isDark(row + 5, col) && qrcode.isDark(row + 6, col)) {
	            lostPoint += 40;
	          }
	        }
	      }
	
	      var darkCount = 0;
	
	      for (var col = 0; col < moduleCount; col += 1) {
	        for (var row = 0; row < moduleCount; row += 1) {
	          if (qrcode.isDark(row, col)) {
	            darkCount += 1;
	          }
	        }
	      }
	
	      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
	      lostPoint += ratio * 10;
	
	      return lostPoint;
	    };
	
	    return _this;
	  }();
	
	  var QRMath = function () {
	
	    var EXP_TABLE = new Array(256);
	    var LOG_TABLE = new Array(256);
	
	    for (var i = 0; i < 8; i += 1) {
	      EXP_TABLE[i] = 1 << i;
	    }
	    for (var i = 8; i < 256; i += 1) {
	      EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
	    }
	    for (var i = 0; i < 255; i += 1) {
	      LOG_TABLE[EXP_TABLE[i]] = i;
	    }
	
	    var _this = {};
	
	    _this.glog = function (n) {
	
	      if (n < 1) {
	        throw new Error('glog(' + n + ')');
	      }
	
	      return LOG_TABLE[n];
	    };
	
	    _this.gexp = function (n) {
	
	      while (n < 0) {
	        n += 255;
	      }
	
	      while (n >= 256) {
	        n -= 255;
	      }
	
	      return EXP_TABLE[n];
	    };
	
	    return _this;
	  }();
	
	  function qrPolynomial(num, shift) {
	
	    if (typeof num.length == 'undefined') {
	      throw new Error(num.length + '/' + shift);
	    }
	
	    var _num = function () {
	      var offset = 0;
	      while (offset < num.length && num[offset] == 0) {
	        offset += 1;
	      }
	      var _num = new Array(num.length - offset + shift);
	      for (var i = 0; i < num.length - offset; i += 1) {
	        _num[i] = num[i + offset];
	      }
	      return _num;
	    }();
	
	    var _this = {};
	
	    _this.getAt = function (index) {
	      return _num[index];
	    };
	
	    _this.getLength = function () {
	      return _num.length;
	    };
	
	    _this.multiply = function (e) {
	
	      var num = new Array(_this.getLength() + e.getLength() - 1);
	
	      for (var i = 0; i < _this.getLength(); i += 1) {
	        for (var j = 0; j < e.getLength(); j += 1) {
	          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
	        }
	      }
	
	      return qrPolynomial(num, 0);
	    };
	
	    _this.mod = function (e) {
	
	      if (_this.getLength() - e.getLength() < 0) {
	        return _this;
	      }
	
	      var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
	
	      var num = new Array(_this.getLength());
	      for (var i = 0; i < _this.getLength(); i += 1) {
	        num[i] = _this.getAt(i);
	      }
	
	      for (var i = 0; i < e.getLength(); i += 1) {
	        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
	      }
	
	      return qrPolynomial(num, 0).mod(e);
	    };
	
	    return _this;
	  };
	
	  var QRRSBlock = function () {
	
	    var RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
	
	    var qrRSBlock = function qrRSBlock(totalCount, dataCount) {
	      var _this = {};
	      _this.totalCount = totalCount;
	      _this.dataCount = dataCount;
	      return _this;
	    };
	
	    var _this = {};
	
	    var getRsBlockTable = function getRsBlockTable(typeNumber, errorCorrectionLevel) {
	
	      switch (errorCorrectionLevel) {
	        case QRErrorCorrectionLevel.L:
	          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	        case QRErrorCorrectionLevel.M:
	          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	        case QRErrorCorrectionLevel.Q:
	          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	        case QRErrorCorrectionLevel.H:
	          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	        default:
	          return undefined;
	      }
	    };
	
	    _this.getRSBlocks = function (typeNumber, errorCorrectionLevel) {
	
	      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
	
	      if (typeof rsBlock == 'undefined') {
	        throw new Error('bad rs block @ typeNumber:' + typeNumber + '/errorCorrectionLevel:' + errorCorrectionLevel);
	      }
	
	      var length = rsBlock.length / 3;
	
	      var list = new Array();
	
	      for (var i = 0; i < length; i += 1) {
	
	        var count = rsBlock[i * 3 + 0];
	        var totalCount = rsBlock[i * 3 + 1];
	        var dataCount = rsBlock[i * 3 + 2];
	
	        for (var j = 0; j < count; j += 1) {
	          list.push(qrRSBlock(totalCount, dataCount));
	        }
	      }
	
	      return list;
	    };
	
	    return _this;
	  }();
	
	  var qrBitBuffer = function qrBitBuffer() {
	
	    var _buffer = new Array();
	    var _length = 0;
	
	    var _this = {};
	
	    _this.getBuffer = function () {
	      return _buffer;
	    };
	
	    _this.getAt = function (index) {
	      var bufIndex = Math.floor(index / 8);
	      return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
	    };
	
	    _this.put = function (num, length) {
	      for (var i = 0; i < length; i += 1) {
	        _this.putBit((num >>> length - i - 1 & 1) == 1);
	      }
	    };
	
	    _this.getLengthInBits = function () {
	      return _length;
	    };
	
	    _this.putBit = function (bit) {
	
	      var bufIndex = Math.floor(_length / 8);
	      if (_buffer.length <= bufIndex) {
	        _buffer.push(0);
	      }
	
	      if (bit) {
	        _buffer[bufIndex] |= 0x80 >>> _length % 8;
	      }
	
	      _length += 1;
	    };
	
	    return _this;
	  };
	
	  var qrNumber = function qrNumber(data) {
	
	    var _mode = QRMode.MODE_NUMBER;
	    var _data = data;
	
	    var _this = {};
	
	    _this.getMode = function () {
	      return _mode;
	    };
	
	    _this.getLength = function (buffer) {
	      return _data.length;
	    };
	
	    _this.write = function (buffer) {
	
	      var data = _data;
	
	      var i = 0;
	
	      while (i + 2 < data.length) {
	        buffer.put(strToNum(data.substring(i, i + 3)), 10);
	        i += 3;
	      }
	
	      if (i < data.length) {
	        if (data.length - i == 1) {
	          buffer.put(strToNum(data.substring(i, i + 1)), 4);
	        } else if (data.length - i == 2) {
	          buffer.put(strToNum(data.substring(i, i + 2)), 7);
	        }
	      }
	    };
	
	    var strToNum = function strToNum(s) {
	      var num = 0;
	      for (var i = 0; i < s.length; i += 1) {
	        num = num * 10 + chatToNum(s.charAt(i));
	      }
	      return num;
	    };
	
	    var chatToNum = function chatToNum(c) {
	      if ('0' <= c && c <= '9') {
	        return c.charCodeAt(0) - '0'.charCodeAt(0);
	      }
	      throw 'illegal char :' + c;
	    };
	
	    return _this;
	  };
	
	  var qrAlphaNum = function qrAlphaNum(data) {
	
	    var _mode = QRMode.MODE_ALPHA_NUM;
	    var _data = data;
	
	    var _this = {};
	
	    _this.getMode = function () {
	      return _mode;
	    };
	
	    _this.getLength = function (buffer) {
	      return _data.length;
	    };
	
	    _this.write = function (buffer) {
	
	      var s = _data;
	
	      var i = 0;
	
	      while (i + 1 < s.length) {
	        buffer.put(getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)), 11);
	        i += 2;
	      }
	
	      if (i < s.length) {
	        buffer.put(getCode(s.charAt(i)), 6);
	      }
	    };
	
	    var getCode = function getCode(c) {
	
	      if ('0' <= c && c <= '9') {
	        return c.charCodeAt(0) - '0'.charCodeAt(0);
	      } else if ('A' <= c && c <= 'Z') {
	        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
	      } else {
	        switch (c) {
	          case ' ':
	            return 36;
	          case '$':
	            return 37;
	          case '%':
	            return 38;
	          case '*':
	            return 39;
	          case '+':
	            return 40;
	          case '-':
	            return 41;
	          case '.':
	            return 42;
	          case '/':
	            return 43;
	          case ':':
	            return 44;
	          default:
	            throw 'illegal char :' + c;
	        }
	      }
	    };
	
	    return _this;
	  };
	
	  var qr8BitByte = function qr8BitByte(data) {
	
	    var _mode = QRMode.MODE_8BIT_BYTE;
	    var _data = data;
	    var _bytes = qrcode.stringToBytes(data);
	
	    var _this = {};
	
	    _this.getMode = function () {
	      return _mode;
	    };
	
	    _this.getLength = function (buffer) {
	      return _bytes.length;
	    };
	
	    _this.write = function (buffer) {
	      for (var i = 0; i < _bytes.length; i += 1) {
	        buffer.put(_bytes[i], 8);
	      }
	    };
	
	    return _this;
	  };
	
	  var qrKanji = function qrKanji(data) {
	
	    var _mode = QRMode.MODE_KANJI;
	    var _data = data;
	    var _bytes = qrcode.stringToBytes(data);
	
	    !function (c, code) {
	      var test = qrcode.stringToBytes(c);
	      if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
	        throw 'sjis not supported.';
	      }
	    }('\u53CB', 0x9746);
	
	    var _this = {};
	
	    _this.getMode = function () {
	      return _mode;
	    };
	
	    _this.getLength = function (buffer) {
	      return ~~(_bytes.length / 2);
	    };
	
	    _this.write = function (buffer) {
	
	      var data = _bytes;
	
	      var i = 0;
	
	      while (i + 1 < data.length) {
	
	        var c = (0xff & data[i]) << 8 | 0xff & data[i + 1];
	
	        if (0x8140 <= c && c <= 0x9FFC) {
	          c -= 0x8140;
	        } else if (0xE040 <= c && c <= 0xEBBF) {
	          c -= 0xC140;
	        } else {
	          throw 'illegal char at ' + (i + 1) + '/' + c;
	        }
	
	        c = (c >>> 8 & 0xff) * 0xC0 + (c & 0xff);
	
	        buffer.put(c, 13);
	
	        i += 2;
	      }
	
	      if (i < data.length) {
	        throw 'illegal char at ' + (i + 1);
	      }
	    };
	
	    return _this;
	  };
	
	  var byteArrayOutputStream = function byteArrayOutputStream() {
	
	    var _bytes = new Array();
	
	    var _this = {};
	
	    _this.writeByte = function (b) {
	      _bytes.push(b & 0xff);
	    };
	
	    _this.writeShort = function (i) {
	      _this.writeByte(i);
	      _this.writeByte(i >>> 8);
	    };
	
	    _this.writeBytes = function (b, off, len) {
	      off = off || 0;
	      len = len || b.length;
	      for (var i = 0; i < len; i += 1) {
	        _this.writeByte(b[i + off]);
	      }
	    };
	
	    _this.writeString = function (s) {
	      for (var i = 0; i < s.length; i += 1) {
	        _this.writeByte(s.charCodeAt(i));
	      }
	    };
	
	    _this.toByteArray = function () {
	      return _bytes;
	    };
	
	    _this.toString = function () {
	      var s = '';
	      s += '[';
	      for (var i = 0; i < _bytes.length; i += 1) {
	        if (i > 0) {
	          s += ',';
	        }
	        s += _bytes[i];
	      }
	      s += ']';
	      return s;
	    };
	
	    return _this;
	  };
	
	  var base64EncodeOutputStream = function base64EncodeOutputStream() {
	
	    var _buffer = 0;
	    var _buflen = 0;
	    var _length = 0;
	    var _base64 = '';
	
	    var _this = {};
	
	    var writeEncoded = function writeEncoded(b) {
	      _base64 += String.fromCharCode(encode(b & 0x3f));
	    };
	
	    var encode = function encode(n) {
	      if (n < 0) {} else if (n < 26) {
	        return 0x41 + n;
	      } else if (n < 52) {
	        return 0x61 + (n - 26);
	      } else if (n < 62) {
	        return 0x30 + (n - 52);
	      } else if (n == 62) {
	        return 0x2b;
	      } else if (n == 63) {
	        return 0x2f;
	      }
	      throw new Error('n:' + n);
	    };
	
	    _this.writeByte = function (n) {
	
	      _buffer = _buffer << 8 | n & 0xff;
	      _buflen += 8;
	      _length += 1;
	
	      while (_buflen >= 6) {
	        writeEncoded(_buffer >>> _buflen - 6);
	        _buflen -= 6;
	      }
	    };
	
	    _this.flush = function () {
	
	      if (_buflen > 0) {
	        writeEncoded(_buffer << 6 - _buflen);
	        _buffer = 0;
	        _buflen = 0;
	      }
	
	      if (_length % 3 != 0) {
	        var padlen = 3 - _length % 3;
	        for (var i = 0; i < padlen; i += 1) {
	          _base64 += '=';
	        }
	      }
	    };
	
	    _this.toString = function () {
	      return _base64;
	    };
	
	    return _this;
	  };
	
	  var base64DecodeInputStream = function base64DecodeInputStream(str) {
	
	    var _str = str;
	    var _pos = 0;
	    var _buffer = 0;
	    var _buflen = 0;
	
	    var _this = {};
	
	    _this.read = function () {
	
	      while (_buflen < 8) {
	
	        if (_pos >= _str.length) {
	          if (_buflen == 0) {
	            return -1;
	          }
	          throw new Error('unexpected end of file./' + _buflen);
	        }
	
	        var c = _str.charAt(_pos);
	        _pos += 1;
	
	        if (c == '=') {
	          _buflen = 0;
	          return -1;
	        } else if (c.match(/^\s$/)) {
	          continue;
	        }
	
	        _buffer = _buffer << 6 | decode(c.charCodeAt(0));
	        _buflen += 6;
	      }
	
	      var n = _buffer >>> _buflen - 8 & 0xff;
	      _buflen -= 8;
	      return n;
	    };
	
	    var decode = function decode(c) {
	      if (0x41 <= c && c <= 0x5a) {
	        return c - 0x41;
	      } else if (0x61 <= c && c <= 0x7a) {
	        return c - 0x61 + 26;
	      } else if (0x30 <= c && c <= 0x39) {
	        return c - 0x30 + 52;
	      } else if (c == 0x2b) {
	        return 62;
	      } else if (c == 0x2f) {
	        return 63;
	      } else {
	        throw new Error('c:' + c);
	      }
	    };
	
	    return _this;
	  };
	
	  var gifImage = function gifImage(width, height) {
	
	    var _width = width;
	    var _height = height;
	    var _data = new Array(width * height);
	
	    var _this = {};
	
	    _this.setPixel = function (x, y, pixel) {
	      _data[y * _width + x] = pixel;
	    };
	
	    _this.write = function (out) {
	
	      out.writeString('GIF87a');
	
	      out.writeShort(_width);
	      out.writeShort(_height);
	
	      out.writeByte(0x80);
	      out.writeByte(0);
	      out.writeByte(0);
	
	      out.writeByte(0x00);
	      out.writeByte(0x00);
	      out.writeByte(0x00);
	
	      out.writeByte(0xff);
	      out.writeByte(0xff);
	      out.writeByte(0xff);
	
	      out.writeString(',');
	      out.writeShort(0);
	      out.writeShort(0);
	      out.writeShort(_width);
	      out.writeShort(_height);
	      out.writeByte(0);
	
	      var lzwMinCodeSize = 2;
	      var raster = getLZWRaster(lzwMinCodeSize);
	
	      out.writeByte(lzwMinCodeSize);
	
	      var offset = 0;
	
	      while (raster.length - offset > 255) {
	        out.writeByte(255);
	        out.writeBytes(raster, offset, 255);
	        offset += 255;
	      }
	
	      out.writeByte(raster.length - offset);
	      out.writeBytes(raster, offset, raster.length - offset);
	      out.writeByte(0x00);
	
	      out.writeString(';');
	    };
	
	    var bitOutputStream = function bitOutputStream(out) {
	
	      var _out = out;
	      var _bitLength = 0;
	      var _bitBuffer = 0;
	
	      var _this = {};
	
	      _this.write = function (data, length) {
	
	        if (data >>> length != 0) {
	          throw new Error('length over');
	        }
	
	        while (_bitLength + length >= 8) {
	          _out.writeByte(0xff & (data << _bitLength | _bitBuffer));
	          length -= 8 - _bitLength;
	          data >>>= 8 - _bitLength;
	          _bitBuffer = 0;
	          _bitLength = 0;
	        }
	
	        _bitBuffer = data << _bitLength | _bitBuffer;
	        _bitLength = _bitLength + length;
	      };
	
	      _this.flush = function () {
	        if (_bitLength > 0) {
	          _out.writeByte(_bitBuffer);
	        }
	      };
	
	      return _this;
	    };
	
	    var getLZWRaster = function getLZWRaster(lzwMinCodeSize) {
	
	      var clearCode = 1 << lzwMinCodeSize;
	      var endCode = (1 << lzwMinCodeSize) + 1;
	      var bitLength = lzwMinCodeSize + 1;
	
	      var table = lzwTable();
	
	      for (var i = 0; i < clearCode; i += 1) {
	        table.add(String.fromCharCode(i));
	      }
	      table.add(String.fromCharCode(clearCode));
	      table.add(String.fromCharCode(endCode));
	
	      var byteOut = byteArrayOutputStream();
	      var bitOut = bitOutputStream(byteOut);
	
	      bitOut.write(clearCode, bitLength);
	
	      var dataIndex = 0;
	
	      var s = String.fromCharCode(_data[dataIndex]);
	      dataIndex += 1;
	
	      while (dataIndex < _data.length) {
	
	        var c = String.fromCharCode(_data[dataIndex]);
	        dataIndex += 1;
	
	        if (table.contains(s + c)) {
	
	          s = s + c;
	        } else {
	
	          bitOut.write(table.indexOf(s), bitLength);
	
	          if (table.size() < 0xfff) {
	
	            if (table.size() == 1 << bitLength) {
	              bitLength += 1;
	            }
	
	            table.add(s + c);
	          }
	
	          s = c;
	        }
	      }
	
	      bitOut.write(table.indexOf(s), bitLength);
	
	      bitOut.write(endCode, bitLength);
	
	      bitOut.flush();
	
	      return byteOut.toByteArray();
	    };
	
	    var lzwTable = function lzwTable() {
	
	      var _map = {};
	      var _size = 0;
	
	      var _this = {};
	
	      _this.add = function (key) {
	        if (_this.contains(key)) {
	          throw new Error('dup key:' + key);
	        }
	        _map[key] = _size;
	        _size += 1;
	      };
	
	      _this.size = function () {
	        return _size;
	      };
	
	      _this.indexOf = function (key) {
	        return _map[key];
	      };
	
	      _this.contains = function (key) {
	        return typeof _map[key] != 'undefined';
	      };
	
	      return _this;
	    };
	
	    return _this;
	  };
	
	  var createImgTag = function createImgTag(width, height, getPixel, alt) {
	
	    var gif = gifImage(width, height);
	    for (var y = 0; y < height; y += 1) {
	      for (var x = 0; x < width; x += 1) {
	        gif.setPixel(x, y, getPixel(x, y));
	      }
	    }
	
	    var b = byteArrayOutputStream();
	    gif.write(b);
	
	    var base64 = base64EncodeOutputStream();
	    var bytes = b.toByteArray();
	    for (var i = 0; i < bytes.length; i += 1) {
	      base64.writeByte(bytes[i]);
	    }
	    base64.flush();
	
	    var img = '';
	    img += '<img';
	    img += ' src="';
	    img += 'data:image/gif;base64,';
	    img += base64;
	    img += '"';
	    img += ' width="';
	    img += width;
	    img += '"';
	    img += ' height="';
	    img += height;
	    img += '"';
	    if (alt) {
	      img += ' alt="';
	      img += alt;
	      img += '"';
	    }
	    img += '/>';
	
	    return img;
	  };
	
	  var createImgObject = function createImgObject(width, height, getPixel) {
	
	    var gif = gifImage(width, height);
	    for (var y = 0; y < height; y += 1) {
	      for (var x = 0; x < width; x += 1) {
	        gif.setPixel(x, y, getPixel(x, y));
	      }
	    }
	
	    var b = byteArrayOutputStream();
	    gif.write(b);
	
	    var base64 = base64EncodeOutputStream();
	    var bytes = b.toByteArray();
	    for (var i = 0; i < bytes.length; i += 1) {
	      base64.writeByte(bytes[i]);
	    }
	    base64.flush();
	
	    var img = new Image();
	    img.src = 'data:image/gif;base64,' + base64;
	    img.width = width;
	    img.height = height;
	
	    return img;
	  };
	
	  return {
	    QRCode: qrcode,
	    QRUtil: QRUtil
	  };
	}();
	
	(function (factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if ((typeof exports === 'undefined' ? 'undefined' : (0, _typeof3.default)(exports)) === 'object') {
	    module.exports = factory();
	  }
	})(function () {
	  return {
	    QRCode: qrcode.QRCode,
	    QRUtil: qrcode.QRUtil
	  };
	});

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(23);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(59);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(24), __esModule: true };

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(25);
	__webpack_require__(54);
	module.exports = __webpack_require__(58).f('iterator');

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(26)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(29)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(27)
	  , defined   = __webpack_require__(28);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(30)
	  , $export        = __webpack_require__(6)
	  , redefine       = __webpack_require__(31)
	  , hide           = __webpack_require__(11)
	  , has            = __webpack_require__(32)
	  , Iterators      = __webpack_require__(33)
	  , $iterCreate    = __webpack_require__(34)
	  , setToStringTag = __webpack_require__(50)
	  , getPrototypeOf = __webpack_require__(52)
	  , ITERATOR       = __webpack_require__(51)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11);

/***/ },
/* 32 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(35)
	  , descriptor     = __webpack_require__(20)
	  , setToStringTag = __webpack_require__(50)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(11)(IteratorPrototype, __webpack_require__(51)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(13)
	  , dPs         = __webpack_require__(36)
	  , enumBugKeys = __webpack_require__(48)
	  , IE_PROTO    = __webpack_require__(45)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(18)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(49).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(12)
	  , anObject = __webpack_require__(13)
	  , getKeys  = __webpack_require__(37);
	
	module.exports = __webpack_require__(16) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(38)
	  , enumBugKeys = __webpack_require__(48);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(32)
	  , toIObject    = __webpack_require__(39)
	  , arrayIndexOf = __webpack_require__(42)(false)
	  , IE_PROTO     = __webpack_require__(45)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(40)
	  , defined = __webpack_require__(28);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(41);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(39)
	  , toLength  = __webpack_require__(43)
	  , toIndex   = __webpack_require__(44);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(27)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(27)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(46)('keys')
	  , uid    = __webpack_require__(47);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7).document && document.documentElement;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(12).f
	  , has = __webpack_require__(32)
	  , TAG = __webpack_require__(51)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(46)('wks')
	  , uid        = __webpack_require__(47)
	  , Symbol     = __webpack_require__(7).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(32)
	  , toObject    = __webpack_require__(53)
	  , IE_PROTO    = __webpack_require__(45)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(28);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(55);
	var global        = __webpack_require__(7)
	  , hide          = __webpack_require__(11)
	  , Iterators     = __webpack_require__(33)
	  , TO_STRING_TAG = __webpack_require__(51)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(56)
	  , step             = __webpack_require__(57)
	  , Iterators        = __webpack_require__(33)
	  , toIObject        = __webpack_require__(39);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(29)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(51);

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(60), __esModule: true };

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(61);
	__webpack_require__(72);
	__webpack_require__(73);
	__webpack_require__(74);
	module.exports = __webpack_require__(8).Symbol;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(7)
	  , has            = __webpack_require__(32)
	  , DESCRIPTORS    = __webpack_require__(16)
	  , $export        = __webpack_require__(6)
	  , redefine       = __webpack_require__(31)
	  , META           = __webpack_require__(62).KEY
	  , $fails         = __webpack_require__(17)
	  , shared         = __webpack_require__(46)
	  , setToStringTag = __webpack_require__(50)
	  , uid            = __webpack_require__(47)
	  , wks            = __webpack_require__(51)
	  , wksExt         = __webpack_require__(58)
	  , wksDefine      = __webpack_require__(63)
	  , keyOf          = __webpack_require__(64)
	  , enumKeys       = __webpack_require__(65)
	  , isArray        = __webpack_require__(68)
	  , anObject       = __webpack_require__(13)
	  , toIObject      = __webpack_require__(39)
	  , toPrimitive    = __webpack_require__(19)
	  , createDesc     = __webpack_require__(20)
	  , _create        = __webpack_require__(35)
	  , gOPNExt        = __webpack_require__(69)
	  , $GOPD          = __webpack_require__(71)
	  , $DP            = __webpack_require__(12)
	  , $keys          = __webpack_require__(37)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(70).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(67).f  = $propertyIsEnumerable;
	  __webpack_require__(66).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(30)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(11)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(47)('meta')
	  , isObject = __webpack_require__(14)
	  , has      = __webpack_require__(32)
	  , setDesc  = __webpack_require__(12).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(17)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(7)
	  , core           = __webpack_require__(8)
	  , LIBRARY        = __webpack_require__(30)
	  , wksExt         = __webpack_require__(58)
	  , defineProperty = __webpack_require__(12).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(37)
	  , toIObject = __webpack_require__(39);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(37)
	  , gOPS    = __webpack_require__(66)
	  , pIE     = __webpack_require__(67);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 67 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(41);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(39)
	  , gOPN      = __webpack_require__(70).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(38)
	  , hiddenKeys = __webpack_require__(48).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(67)
	  , createDesc     = __webpack_require__(20)
	  , toIObject      = __webpack_require__(39)
	  , toPrimitive    = __webpack_require__(19)
	  , has            = __webpack_require__(32)
	  , IE8_DOM_DEFINE = __webpack_require__(15)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(16) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 72 */
/***/ function(module, exports) {



/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(63)('asyncIterator');

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(63)('observable');

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(1);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(2);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Util = function () {
	  function Util() {
	    (0, _classCallCheck3.default)(this, Util);
	  }
	
	  (0, _createClass3.default)(Util, null, [{
	    key: 'createCanvas',
	    value: function createCanvas(size, image) {
	      var canvas = document.createElement('canvas');
	      canvas.width = size;
	      canvas.height = size;
	      canvas.getContext('2d').drawImage(image, 0, 0, size, size);
	      return canvas;
	    }
	  }, {
	    key: 'threshold',
	    value: function threshold(r, g, b, value) {
	      return 0.2126 * r + 0.7152 * g + 0.0722 * b >= value ? 255 : 0;
	    }
	  }]);
	  return Util;
	}();
	
	exports.default = Util;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjNGY1ZmY0NzZkOTE1ODc4ZDM0YyIsIndlYnBhY2s6Ly8vLi9zcmMvcWFydC5qcyIsIndlYnBhY2s6Ly8vLi9+L2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIndlYnBhY2s6Ly8vLi9+L2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwid2VicGFjazovLy8uL3NyYy9xcmNvZGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvdHlwZW9mLmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZXh0LmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19rZXlvZi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wbi1leHQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcGQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbIlFBcnQiLCJvcHRpb25zIiwiVHlwZUVycm9yIiwidmFsdWUiLCJpbWFnZVBhdGgiLCJmaWx0ZXIiLCJERUZBVUxUUyIsImVsIiwiaW1hZ2VTaXplIiwicGFkZGluZyIsImxldmVsIiwicXIiLCJhZGREYXRhIiwibWFrZSIsInFySW1hZ2UiLCJjcmVhdGVJbWdPYmplY3QiLCJzZWxmIiwib25sb2FkIiwiY292ZXJJbWFnZSIsIkltYWdlIiwic3JjIiwicmVzdWx0Q2FudmFzIiwiY3JlYXRlQ2FudmFzIiwicXJDYW52YXMiLCJ3aWR0aCIsImhlaWdodCIsImNvdmVyQ2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZ2V0Q29udGV4dCIsImRyYXdJbWFnZSIsImNvdmVySW1hZ2VEYXRhIiwiZ2V0SW1hZ2VEYXRhIiwiY292ZXJJbWFnZUJpbmFyeSIsImRhdGEiLCJyZXN1bHRJbWFnZURhdGEiLCJyZXN1bHRJbWFnZUJpbmFyeSIsImkiLCJsZW5ndGgiLCJ4IiwiTWF0aCIsImZsb29yIiwieSIsImZhY3RvciIsInRocmVzaG9sZCIsInB1dEltYWdlRGF0YSIsInBhdHRlcm5Qb3N0aW9uIiwiZ2V0UGF0dGVyblBvc2l0aW9uIiwiaiIsInJlY3RYIiwicmVjdFkiLCJyZWN0V2lkdGgiLCJyZWN0SGVpZ2h0IiwicmVjdERhdGEiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsIndpbmRvdyIsInFyY29kZSIsInR5cGVOdW1iZXIiLCJlcnJvckNvcnJlY3Rpb25MZXZlbCIsIlBBRDAiLCJQQUQxIiwiX3R5cGVOdW1iZXIiLCJfZXJyb3JDb3JyZWN0aW9uTGV2ZWwiLCJRUkVycm9yQ29ycmVjdGlvbkxldmVsIiwiX21vZHVsZXMiLCJfbW9kdWxlQ291bnQiLCJfZGF0YUNhY2hlIiwiX2RhdGFMaXN0IiwiQXJyYXkiLCJfdGhpcyIsIm1ha2VJbXBsIiwidGVzdCIsIm1hc2tQYXR0ZXJuIiwibW9kdWxlQ291bnQiLCJtb2R1bGVzIiwicm93IiwiY29sIiwic2V0dXBQb3NpdGlvblByb2JlUGF0dGVybiIsInNldHVwUG9zaXRpb25BZGp1c3RQYXR0ZXJuIiwic2V0dXBUaW1pbmdQYXR0ZXJuIiwic2V0dXBUeXBlSW5mbyIsInNldHVwVHlwZU51bWJlciIsImNyZWF0ZURhdGEiLCJtYXBEYXRhIiwiciIsImMiLCJnZXRCZXN0TWFza1BhdHRlcm4iLCJtaW5Mb3N0UG9pbnQiLCJwYXR0ZXJuIiwibG9zdFBvaW50IiwiUVJVdGlsIiwiZ2V0TG9zdFBvaW50IiwicG9zIiwiYml0cyIsImdldEJDSFR5cGVOdW1iZXIiLCJtb2QiLCJnZXRCQ0hUeXBlSW5mbyIsImluYyIsImJpdEluZGV4IiwiYnl0ZUluZGV4IiwibWFza0Z1bmMiLCJnZXRNYXNrRnVuY3Rpb24iLCJkYXJrIiwibWFzayIsImNyZWF0ZUJ5dGVzIiwiYnVmZmVyIiwicnNCbG9ja3MiLCJvZmZzZXQiLCJtYXhEY0NvdW50IiwibWF4RWNDb3VudCIsImRjZGF0YSIsImVjZGF0YSIsImRjQ291bnQiLCJkYXRhQ291bnQiLCJlY0NvdW50IiwidG90YWxDb3VudCIsIm1heCIsImdldEJ1ZmZlciIsInJzUG9seSIsImdldEVycm9yQ29ycmVjdFBvbHlub21pYWwiLCJyYXdQb2x5IiwicXJQb2x5bm9taWFsIiwiZ2V0TGVuZ3RoIiwibW9kUG9seSIsIm1vZEluZGV4IiwiZ2V0QXQiLCJ0b3RhbENvZGVDb3VudCIsImluZGV4IiwiZGF0YUxpc3QiLCJRUlJTQmxvY2siLCJnZXRSU0Jsb2NrcyIsInFyQml0QnVmZmVyIiwicHV0IiwiZ2V0TW9kZSIsImdldExlbmd0aEluQml0cyIsIndyaXRlIiwidG90YWxEYXRhQ291bnQiLCJFcnJvciIsInB1dEJpdCIsIm1vZGUiLCJuZXdEYXRhIiwicXJOdW1iZXIiLCJxckFscGhhTnVtIiwicXI4Qml0Qnl0ZSIsInFyS2FuamkiLCJwdXNoIiwiaXNEYXJrIiwiZ2V0TW9kdWxlQ291bnQiLCJjcmVhdGVUYWJsZVRhZyIsImNlbGxTaXplIiwibWFyZ2luIiwicXJIdG1sIiwiY3JlYXRlU3ZnVGFnIiwic2l6ZSIsIm1jIiwibXIiLCJxclN2ZyIsInJlY3QiLCJjcmVhdGVJbWdUYWciLCJtaW4iLCJzdHJpbmdUb0J5dGVzIiwicyIsImJ5dGVzIiwiY2hhckNvZGVBdCIsImNyZWF0ZVN0cmluZ1RvQnl0ZXMiLCJ1bmljb2RlRGF0YSIsIm51bUNoYXJzIiwidW5pY29kZU1hcCIsImJpbiIsImJhc2U2NERlY29kZUlucHV0U3RyZWFtIiwicmVhZCIsImIiLCJjb3VudCIsImIwIiwiYjEiLCJiMiIsImIzIiwiayIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsInYiLCJ1bmtub3duQ2hhciIsImNoYXJBdCIsIlFSTW9kZSIsIk1PREVfTlVNQkVSIiwiTU9ERV9BTFBIQV9OVU0iLCJNT0RFXzhCSVRfQllURSIsIk1PREVfS0FOSkkiLCJMIiwiTSIsIlEiLCJIIiwiUVJNYXNrUGF0dGVybiIsIlBBVFRFUk4wMDAiLCJQQVRURVJOMDAxIiwiUEFUVEVSTjAxMCIsIlBBVFRFUk4wMTEiLCJQQVRURVJOMTAwIiwiUEFUVEVSTjEwMSIsIlBBVFRFUk4xMTAiLCJQQVRURVJOMTExIiwiUEFUVEVSTl9QT1NJVElPTl9UQUJMRSIsIkcxNSIsIkcxOCIsIkcxNV9NQVNLIiwiZ2V0QkNIRGlnaXQiLCJkaWdpdCIsImQiLCJlcnJvckNvcnJlY3RMZW5ndGgiLCJhIiwibXVsdGlwbHkiLCJRUk1hdGgiLCJnZXhwIiwidHlwZSIsInNhbWVDb3VudCIsImRhcmtDb3VudCIsInJhdGlvIiwiYWJzIiwiRVhQX1RBQkxFIiwiTE9HX1RBQkxFIiwiZ2xvZyIsIm4iLCJudW0iLCJzaGlmdCIsIl9udW0iLCJlIiwiUlNfQkxPQ0tfVEFCTEUiLCJxclJTQmxvY2siLCJnZXRSc0Jsb2NrVGFibGUiLCJ1bmRlZmluZWQiLCJyc0Jsb2NrIiwibGlzdCIsIl9idWZmZXIiLCJfbGVuZ3RoIiwiYnVmSW5kZXgiLCJiaXQiLCJfbW9kZSIsIl9kYXRhIiwic3RyVG9OdW0iLCJzdWJzdHJpbmciLCJjaGF0VG9OdW0iLCJnZXRDb2RlIiwiX2J5dGVzIiwiY29kZSIsImJ5dGVBcnJheU91dHB1dFN0cmVhbSIsIndyaXRlQnl0ZSIsIndyaXRlU2hvcnQiLCJ3cml0ZUJ5dGVzIiwib2ZmIiwibGVuIiwid3JpdGVTdHJpbmciLCJ0b0J5dGVBcnJheSIsInRvU3RyaW5nIiwiYmFzZTY0RW5jb2RlT3V0cHV0U3RyZWFtIiwiX2J1ZmxlbiIsIl9iYXNlNjQiLCJ3cml0ZUVuY29kZWQiLCJlbmNvZGUiLCJmbHVzaCIsInBhZGxlbiIsInN0ciIsIl9zdHIiLCJfcG9zIiwibWF0Y2giLCJkZWNvZGUiLCJnaWZJbWFnZSIsIl93aWR0aCIsIl9oZWlnaHQiLCJzZXRQaXhlbCIsInBpeGVsIiwib3V0IiwibHp3TWluQ29kZVNpemUiLCJyYXN0ZXIiLCJnZXRMWldSYXN0ZXIiLCJiaXRPdXRwdXRTdHJlYW0iLCJfb3V0IiwiX2JpdExlbmd0aCIsIl9iaXRCdWZmZXIiLCJjbGVhckNvZGUiLCJlbmRDb2RlIiwiYml0TGVuZ3RoIiwidGFibGUiLCJsendUYWJsZSIsImFkZCIsImJ5dGVPdXQiLCJiaXRPdXQiLCJkYXRhSW5kZXgiLCJjb250YWlucyIsImluZGV4T2YiLCJfbWFwIiwiX3NpemUiLCJrZXkiLCJnZXRQaXhlbCIsImFsdCIsImdpZiIsImJhc2U2NCIsImltZyIsIlFSQ29kZSIsImZhY3RvcnkiLCJkZWZpbmUiLCJleHBvcnRzIiwibW9kdWxlIiwiVXRpbCIsImltYWdlIiwiY2FudmFzIiwiZyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7O0FBQ0E7Ozs7OztLQUVNQSxJO0FBQ0osbUJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFDbkIsYUFBSSxPQUFPQSxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2hDLG1CQUFNLElBQUlDLFNBQUosQ0FBYywwQkFBZCxDQUFOO0FBQ0gsVUFGRCxNQUVPLElBQUksT0FBT0QsUUFBUUUsS0FBZixLQUF5QixXQUE3QixFQUEwQztBQUM3QyxtQkFBTSxJQUFJRCxTQUFKLENBQWMsK0JBQWQsQ0FBTjtBQUNILFVBRk0sTUFFQSxJQUFJLE9BQU9ELFFBQVFHLFNBQWYsS0FBNkIsV0FBakMsRUFBOEM7QUFDakQsbUJBQU0sSUFBSUYsU0FBSixDQUFjLG1DQUFkLENBQU47QUFDSDs7QUFHRCxjQUFLRyxNQUFMLEdBQWUsT0FBT0osUUFBUUksTUFBZixLQUEwQixXQUEzQixHQUEwQ0wsS0FBS00sUUFBTCxDQUFjRCxNQUF4RCxHQUFpRUosUUFBUUksTUFBdkY7QUFDQSxjQUFLRixLQUFMLEdBQWFGLFFBQVFFLEtBQXJCO0FBQ0EsY0FBS0MsU0FBTCxHQUFpQkgsUUFBUUcsU0FBekI7QUFDRDs7Ozs4QkFVSUcsRSxFQUFJO0FBQ1AsaUJBQUlDLFlBQVksR0FBaEI7QUFDQSxpQkFBSUMsVUFBVSxFQUFkO0FBQ0EsaUJBQUlDLFFBQVEsRUFBWjs7QUFFQSxpQkFBSUMsS0FBSyxvQkFBT0QsS0FBUCxFQUFjLEdBQWQsQ0FBVDtBQUNBQyxnQkFBR0MsT0FBSCxDQUFXLEtBQUtULEtBQWhCO0FBQ0FRLGdCQUFHRSxJQUFIO0FBQ0EsaUJBQUlDLFVBQVVILEdBQUdJLGVBQUgsQ0FBbUIsQ0FBbkIsQ0FBZDs7QUFFQSxpQkFBSUMsT0FBTyxJQUFYO0FBQ0FGLHFCQUFRRyxNQUFSLEdBQWlCLFlBQVc7QUFDeEIscUJBQUlDLGFBQWEsSUFBSUMsS0FBSixFQUFqQjtBQUNBRCw0QkFBV0UsR0FBWCxHQUFpQkosS0FBS1osU0FBdEI7O0FBRUEscUJBQUlpQixlQUFlLGVBQUtDLFlBQUwsQ0FBa0JkLFNBQWxCLEVBQTZCTSxPQUE3QixDQUFuQjtBQUNBLHFCQUFJUyxXQUFXLGVBQUtELFlBQUwsQ0FBa0JkLFNBQWxCLEVBQTZCTSxPQUE3QixDQUFmOztBQUVBSSw0QkFBV0QsTUFBWCxHQUFvQixZQUFXO0FBQzNCLHlCQUFJQyxXQUFXTSxLQUFYLEdBQW1CTixXQUFXTyxNQUFsQyxFQUEwQztBQUN0Q1Asb0NBQVdPLE1BQVgsR0FBb0IsQ0FBQ2pCLFlBQVlDLFVBQVUsQ0FBdkIsS0FBNkIsTUFBTVMsV0FBV08sTUFBakIsR0FBMEJQLFdBQVdNLEtBQWxFLENBQXBCO0FBQ0FOLG9DQUFXTSxLQUFYLEdBQW1CaEIsWUFBWUMsVUFBVSxDQUF6QztBQUNILHNCQUhELE1BR087QUFDSFMsb0NBQVdNLEtBQVgsR0FBbUIsQ0FBQ2hCLFlBQVlDLFVBQVUsQ0FBdkIsS0FBNkIsTUFBTVMsV0FBV00sS0FBakIsR0FBeUJOLFdBQVdPLE1BQWpFLENBQW5CO0FBQ0FQLG9DQUFXTyxNQUFYLEdBQW9CakIsWUFBWUMsVUFBVSxDQUExQztBQUNIOztBQUVELHlCQUFJaUIsY0FBY0MsU0FBU0MsYUFBVCxDQUF1QixRQUF2QixDQUFsQjtBQUNBRixpQ0FBWUYsS0FBWixHQUFvQmhCLFNBQXBCO0FBQ0FrQixpQ0FBWUQsTUFBWixHQUFxQmpCLFNBQXJCO0FBQ0FrQixpQ0FBWUcsVUFBWixDQUF1QixJQUF2QixFQUE2QkMsU0FBN0IsQ0FBdUNaLFVBQXZDLEVBQW1EVCxPQUFuRCxFQUE0REEsT0FBNUQsRUFBcUVELFlBQVlDLFVBQVUsQ0FBM0YsRUFBOEZELFlBQVlDLFVBQVUsQ0FBcEg7O0FBRUEseUJBQUlzQixpQkFBaUJMLFlBQVlHLFVBQVosQ0FBdUIsSUFBdkIsRUFBNkJHLFlBQTdCLENBQTBDLENBQTFDLEVBQTZDLENBQTdDLEVBQWdEeEIsU0FBaEQsRUFBMkRBLFNBQTNELENBQXJCO0FBQ0EseUJBQUl5QixtQkFBbUJGLGVBQWVHLElBQXRDO0FBQ0EseUJBQUlDLGtCQUFrQmQsYUFBYVEsVUFBYixDQUF3QixJQUF4QixFQUE4QkcsWUFBOUIsQ0FBMkMsQ0FBM0MsRUFBOEMsQ0FBOUMsRUFBaUR4QixTQUFqRCxFQUE0REEsU0FBNUQsQ0FBdEI7QUFDQSx5QkFBSTRCLG9CQUFvQkQsZ0JBQWdCRCxJQUF4Qzs7QUFFQSwwQkFBSyxJQUFJRyxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLGlCQUFpQkssTUFBckMsRUFBNkNELEtBQUssQ0FBbEQsRUFBcUQ7QUFDakQsNkJBQUlFLElBQUlDLEtBQUtDLEtBQUwsQ0FBV0osSUFBSSxDQUFmLElBQW9CN0IsU0FBNUI7QUFDQSw2QkFBSWtDLElBQUlGLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0MsS0FBTCxDQUFXSixJQUFJLENBQWYsSUFBb0I3QixTQUEvQixDQUFSOztBQUVBLDZCQUFJK0IsSUFBSTlCLE9BQUosSUFBZWlDLElBQUlqQyxPQUFuQixJQUE4QjhCLEtBQUsvQixZQUFVQyxPQUE3QyxJQUF3RGlDLEtBQUtsQyxZQUFVQyxPQUEzRSxFQUFvRjtBQUNoRjJCLCtDQUFrQkMsSUFBRSxDQUFwQixJQUF5QixDQUF6QjtBQUNBO0FBQ0g7QUFDRCw2QkFBSUUsSUFBRSxDQUFGLElBQU8sQ0FBUCxJQUFZRyxJQUFFLENBQUYsSUFBTyxDQUF2QixFQUEwQjtBQUN0QjtBQUNIO0FBQ0QsNkJBQUlILElBQUksRUFBSixLQUFXRyxJQUFJLEVBQUosSUFBVUEsS0FBS2xDLFlBQVUsRUFBcEMsQ0FBSixFQUE2QztBQUN6QztBQUNIO0FBQ0QsNkJBQUkrQixLQUFLL0IsWUFBVSxFQUFmLElBQXFCa0MsSUFBSSxFQUE3QixFQUFpQztBQUM3QjtBQUNIOztBQUVELDZCQUFJMUIsS0FBS1gsTUFBTCxJQUFlLFdBQW5CLEVBQWdDO0FBQzVCLGlDQUFJc0MsU0FBUyxlQUFLQyxTQUFMLENBQWVYLGlCQUFpQkksQ0FBakIsQ0FBZixFQUFvQ0osaUJBQWlCSSxJQUFFLENBQW5CLENBQXBDLEVBQTJESixpQkFBaUJJLElBQUUsQ0FBbkIsQ0FBM0QsRUFBa0YsR0FBbEYsQ0FBYjtBQUNBRCwrQ0FBa0JDLENBQWxCLElBQXVCTSxNQUF2QjtBQUNBUCwrQ0FBa0JDLElBQUUsQ0FBcEIsSUFBeUJNLE1BQXpCO0FBQ0FQLCtDQUFrQkMsSUFBRSxDQUFwQixJQUF5Qk0sTUFBekI7QUFDSCwwQkFMRCxNQUtPLElBQUkzQixLQUFLWCxNQUFMLElBQWUsT0FBbkIsRUFBNEI7QUFDL0IrQiwrQ0FBa0JDLENBQWxCLElBQXVCSixpQkFBaUJJLENBQWpCLENBQXZCO0FBQ0FELCtDQUFrQkMsSUFBRSxDQUFwQixJQUF5QkosaUJBQWlCSSxJQUFFLENBQW5CLENBQXpCO0FBQ0FELCtDQUFrQkMsSUFBRSxDQUFwQixJQUF5QkosaUJBQWlCSSxJQUFFLENBQW5CLENBQXpCO0FBQ0g7QUFDREQsMkNBQWtCQyxJQUFFLENBQXBCLElBQXlCSixpQkFBaUJJLElBQUUsQ0FBbkIsQ0FBekI7QUFDSDs7QUFFRGhCLGtDQUFhUSxVQUFiLENBQXdCLElBQXhCLEVBQThCZ0IsWUFBOUIsQ0FBMkNWLGVBQTNDLEVBQTRELENBQTVELEVBQStELENBQS9EOztBQUVBLHlCQUFJVyxpQkFBaUIsZUFBT0Msa0JBQVAsQ0FBMEJyQyxLQUExQixDQUFyQjtBQUNBLDBCQUFLLElBQUkyQixJQUFJLENBQWIsRUFBZ0JBLElBQUlTLGVBQWVSLE1BQW5DLEVBQTJDRCxLQUFLLENBQWhELEVBQW1EO0FBQy9DLDhCQUFLLElBQUlXLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsZUFBZVIsTUFBbkMsRUFBMkNVLEtBQUssQ0FBaEQsRUFBbUQ7QUFDL0MsaUNBQUlULElBQUlPLGVBQWVULENBQWYsQ0FBUjtBQUNBLGlDQUFJSyxJQUFJSSxlQUFlRSxDQUFmLENBQVI7QUFDQSxpQ0FBSSxFQUFHVCxLQUFLLENBQUwsSUFBVUcsS0FBSyxFQUFoQixJQUF3QkEsS0FBSyxDQUFMLElBQVVILEtBQUssRUFBdkMsSUFBK0NBLEtBQUssQ0FBTCxJQUFVRyxLQUFLLENBQWhFLENBQUosRUFBeUU7QUFDckUscUNBQUlPLFFBQVEsS0FBS1YsSUFBRSxDQUFQLElBQVksRUFBeEI7QUFDQSxxQ0FBSVcsUUFBUSxLQUFLUixJQUFFLENBQVAsSUFBWSxFQUF4QjtBQUNBLHFDQUFJUyxZQUFhLEtBQUtaLElBQUUsQ0FBUCxJQUFZLEVBQWIsR0FBbUJVLEtBQW5DO0FBQ0EscUNBQUlHLGFBQWMsS0FBS1YsSUFBRSxDQUFQLElBQVksRUFBYixHQUFtQlEsS0FBcEM7O0FBRUEscUNBQUlHLFdBQVc5QixTQUFTTSxVQUFULENBQW9CLElBQXBCLEVBQTBCRyxZQUExQixDQUF1Q2lCLEtBQXZDLEVBQThDQyxLQUE5QyxFQUFxREMsU0FBckQsRUFBZ0VDLFVBQWhFLENBQWY7QUFDQS9CLDhDQUFhUSxVQUFiLENBQXdCLElBQXhCLEVBQThCZ0IsWUFBOUIsQ0FBMkNRLFFBQTNDLEVBQXFESixLQUFyRCxFQUE0REMsS0FBNUQ7QUFDSDtBQUNKO0FBQ0o7O0FBSUQzQyx3QkFBRytDLFNBQUgsR0FBZSxFQUFmO0FBQ0EvQyx3QkFBR2dELFdBQUgsQ0FBZWxDLFlBQWY7QUFDSCxrQkF6RUQ7QUEwRUgsY0FqRkQ7QUFrRkQ7Ozs2QkFyR3FCO0FBQ3BCLG9CQUFPO0FBRUxsQix3QkFBTyxFQUZGO0FBR0xFLHlCQUFRO0FBSEgsY0FBUDtBQUtEOzs7OztBQWtHSG1ELFFBQU94RCxJQUFQLEdBQWNBLElBQWQ7bUJBQ2V3RCxPQUFPeEQsSTs7Ozs7O0FDNUh0Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7OztBQ1JBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLHVDQUFzQyx1Q0FBdUMsZ0JBQWdCOztBQUU3RjtBQUNBO0FBQ0Esb0JBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQyxHOzs7Ozs7QUMxQkQsbUJBQWtCLHVEOzs7Ozs7QUNBbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHOzs7Ozs7QUNKQTtBQUNBO0FBQ0Esc0VBQXVFLDBDQUEwQyxFOzs7Ozs7QUNGakg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFtRTtBQUNuRTtBQUNBLHNGQUFxRjtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsZ0RBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWM7QUFDZCxlQUFjO0FBQ2QsZUFBYztBQUNkLGVBQWM7QUFDZCxnQkFBZTtBQUNmLGdCQUFlO0FBQ2YsZ0JBQWU7QUFDZixpQkFBZ0I7QUFDaEIsMEI7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBdUMsZ0M7Ozs7OztBQ0h2Qyw4QkFBNkI7QUFDN0Isc0NBQXFDLGdDOzs7Ozs7QUNEckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHOzs7Ozs7QUNuQkE7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBLEc7Ozs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUcsVUFBVTtBQUNiO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDSkE7QUFDQTtBQUNBLEc7Ozs7OztBQ0ZBO0FBQ0Esc0VBQXNFLGdCQUFnQixVQUFVLEdBQUc7QUFDbkcsRUFBQyxFOzs7Ozs7QUNGRDtBQUNBO0FBQ0Esa0NBQWlDLFFBQVEsZ0JBQWdCLFVBQVUsR0FBRztBQUN0RSxFQUFDLEU7Ozs7OztBQ0hEO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsRzs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7Ozs7Ozs7Ozs7QUNVQSxLQUFJeUQsU0FBUyxZQUFXO0FBV3RCLE9BQUlBLFNBQVMsU0FBVEEsTUFBUyxDQUFTQyxVQUFULEVBQXFCQyxvQkFBckIsRUFBMkM7O0FBRXRELFNBQUlDLE9BQU8sSUFBWDtBQUNBLFNBQUlDLE9BQU8sSUFBWDs7QUFFQSxTQUFJQyxjQUFjSixVQUFsQjtBQUNBLFNBQUlLLHdCQUF3QkMsdUJBQXVCTCxvQkFBdkIsQ0FBNUI7QUFDQSxTQUFJTSxXQUFXLElBQWY7QUFDQSxTQUFJQyxlQUFlLENBQW5CO0FBQ0EsU0FBSUMsYUFBYSxJQUFqQjtBQUNBLFNBQUlDLFlBQVksSUFBSUMsS0FBSixFQUFoQjs7QUFFQSxTQUFJQyxRQUFRLEVBQVo7O0FBRUEsU0FBSUMsV0FBVyxTQUFYQSxRQUFXLENBQVNDLElBQVQsRUFBZUMsV0FBZixFQUE0Qjs7QUFFekNQLHNCQUFlSixjQUFjLENBQWQsR0FBa0IsRUFBakM7QUFDQUcsa0JBQVcsVUFBU1MsV0FBVCxFQUFzQjtBQUMvQixhQUFJQyxVQUFVLElBQUlOLEtBQUosQ0FBVUssV0FBVixDQUFkO0FBQ0EsY0FBSyxJQUFJRSxNQUFNLENBQWYsRUFBa0JBLE1BQU1GLFdBQXhCLEVBQXFDRSxPQUFPLENBQTVDLEVBQStDO0FBQzdDRCxtQkFBUUMsR0FBUixJQUFlLElBQUlQLEtBQUosQ0FBVUssV0FBVixDQUFmO0FBQ0EsZ0JBQUssSUFBSUcsTUFBTSxDQUFmLEVBQWtCQSxNQUFNSCxXQUF4QixFQUFxQ0csT0FBTyxDQUE1QyxFQUErQztBQUM3Q0YscUJBQVFDLEdBQVIsRUFBYUMsR0FBYixJQUFvQixJQUFwQjtBQUNEO0FBQ0Y7QUFDRCxnQkFBT0YsT0FBUDtBQUNELFFBVFUsQ0FTVFQsWUFUUyxDQUFYOztBQVdBWSxpQ0FBMEIsQ0FBMUIsRUFBNkIsQ0FBN0I7QUFDQUEsaUNBQTBCWixlQUFlLENBQXpDLEVBQTRDLENBQTVDO0FBQ0FZLGlDQUEwQixDQUExQixFQUE2QlosZUFBZSxDQUE1QztBQUNBYTtBQUNBQztBQUNBQyxxQkFBY1QsSUFBZCxFQUFvQkMsV0FBcEI7O0FBRUEsV0FBSVgsZUFBZSxDQUFuQixFQUFzQjtBQUNwQm9CLHlCQUFnQlYsSUFBaEI7QUFDRDs7QUFFRCxXQUFJTCxjQUFjLElBQWxCLEVBQXdCO0FBQ3RCQSxzQkFBYWdCLFdBQVdyQixXQUFYLEVBQXdCQyxxQkFBeEIsRUFBK0NLLFNBQS9DLENBQWI7QUFDRDs7QUFFRGdCLGVBQVFqQixVQUFSLEVBQW9CTSxXQUFwQjtBQUNELE1BOUJEOztBQWdDQSxTQUFJSyw0QkFBNEIsU0FBNUJBLHlCQUE0QixDQUFTRixHQUFULEVBQWNDLEdBQWQsRUFBbUI7O0FBRWpELFlBQUssSUFBSVEsSUFBSSxDQUFDLENBQWQsRUFBaUJBLEtBQUssQ0FBdEIsRUFBeUJBLEtBQUssQ0FBOUIsRUFBaUM7O0FBRS9CLGFBQUlULE1BQU1TLENBQU4sSUFBVyxDQUFDLENBQVosSUFBaUJuQixnQkFBZ0JVLE1BQU1TLENBQTNDLEVBQThDOztBQUU5QyxjQUFLLElBQUlDLElBQUksQ0FBQyxDQUFkLEVBQWlCQSxLQUFLLENBQXRCLEVBQXlCQSxLQUFLLENBQTlCLEVBQWlDOztBQUUvQixlQUFJVCxNQUFNUyxDQUFOLElBQVcsQ0FBQyxDQUFaLElBQWlCcEIsZ0JBQWdCVyxNQUFNUyxDQUEzQyxFQUE4Qzs7QUFFOUMsZUFBTSxLQUFLRCxDQUFMLElBQVVBLEtBQUssQ0FBZixLQUFxQkMsS0FBSyxDQUFMLElBQVVBLEtBQUssQ0FBcEMsQ0FBRCxJQUNHLEtBQUtBLENBQUwsSUFBVUEsS0FBSyxDQUFmLEtBQXFCRCxLQUFLLENBQUwsSUFBVUEsS0FBSyxDQUFwQyxDQURILElBRUcsS0FBS0EsQ0FBTCxJQUFVQSxLQUFLLENBQWYsSUFBb0IsS0FBS0MsQ0FBekIsSUFBOEJBLEtBQUssQ0FGM0MsRUFFZ0Q7QUFDOUNyQixzQkFBU1csTUFBTVMsQ0FBZixFQUFrQlIsTUFBTVMsQ0FBeEIsSUFBNkIsSUFBN0I7QUFDRCxZQUpELE1BSU87QUFDTHJCLHNCQUFTVyxNQUFNUyxDQUFmLEVBQWtCUixNQUFNUyxDQUF4QixJQUE2QixLQUE3QjtBQUNEO0FBQ0Y7QUFDRjtBQUNGLE1BbkJEOztBQXFCQSxTQUFJQyxxQkFBcUIsU0FBckJBLGtCQUFxQixHQUFXOztBQUVsQyxXQUFJQyxlQUFlLENBQW5CO0FBQ0EsV0FBSUMsVUFBVSxDQUFkOztBQUVBLFlBQUssSUFBSXBELElBQUksQ0FBYixFQUFnQkEsSUFBSSxDQUFwQixFQUF1QkEsS0FBSyxDQUE1QixFQUErQjs7QUFFN0JrQyxrQkFBUyxJQUFULEVBQWVsQyxDQUFmOztBQUVBLGFBQUlxRCxZQUFZQyxPQUFPQyxZQUFQLENBQW9CdEIsS0FBcEIsQ0FBaEI7O0FBRUEsYUFBSWpDLEtBQUssQ0FBTCxJQUFVbUQsZUFBZUUsU0FBN0IsRUFBd0M7QUFDdENGLDBCQUFlRSxTQUFmO0FBQ0FELHFCQUFVcEQsQ0FBVjtBQUNEO0FBQ0Y7O0FBRUQsY0FBT29ELE9BQVA7QUFDRCxNQWxCRDs7QUFvQkEsU0FBSVQscUJBQXFCLFNBQXJCQSxrQkFBcUIsR0FBVzs7QUFFbEMsWUFBSyxJQUFJSyxJQUFJLENBQWIsRUFBZ0JBLElBQUluQixlQUFlLENBQW5DLEVBQXNDbUIsS0FBSyxDQUEzQyxFQUE4QztBQUM1QyxhQUFJcEIsU0FBU29CLENBQVQsRUFBWSxDQUFaLEtBQWtCLElBQXRCLEVBQTRCO0FBQzFCO0FBQ0Q7QUFDRHBCLGtCQUFTb0IsQ0FBVCxFQUFZLENBQVosSUFBa0JBLElBQUksQ0FBSixJQUFTLENBQTNCO0FBQ0Q7O0FBRUQsWUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlwQixlQUFlLENBQW5DLEVBQXNDb0IsS0FBSyxDQUEzQyxFQUE4QztBQUM1QyxhQUFJckIsU0FBUyxDQUFULEVBQVlxQixDQUFaLEtBQWtCLElBQXRCLEVBQTRCO0FBQzFCO0FBQ0Q7QUFDRHJCLGtCQUFTLENBQVQsRUFBWXFCLENBQVosSUFBa0JBLElBQUksQ0FBSixJQUFTLENBQTNCO0FBQ0Q7QUFDRixNQWZEOztBQWlCQSxTQUFJUCw2QkFBNkIsU0FBN0JBLDBCQUE2QixHQUFXOztBQUUxQyxXQUFJYyxNQUFNRixPQUFPNUMsa0JBQVAsQ0FBMEJlLFdBQTFCLENBQVY7O0FBRUEsWUFBSyxJQUFJekIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJd0QsSUFBSXZELE1BQXhCLEVBQWdDRCxLQUFLLENBQXJDLEVBQXdDOztBQUV0QyxjQUFLLElBQUlXLElBQUksQ0FBYixFQUFnQkEsSUFBSTZDLElBQUl2RCxNQUF4QixFQUFnQ1UsS0FBSyxDQUFyQyxFQUF3Qzs7QUFFdEMsZUFBSTRCLE1BQU1pQixJQUFJeEQsQ0FBSixDQUFWO0FBQ0EsZUFBSXdDLE1BQU1nQixJQUFJN0MsQ0FBSixDQUFWOztBQUVBLGVBQUlpQixTQUFTVyxHQUFULEVBQWNDLEdBQWQsS0FBc0IsSUFBMUIsRUFBZ0M7QUFDOUI7QUFDRDs7QUFFRCxnQkFBSyxJQUFJUSxJQUFJLENBQUMsQ0FBZCxFQUFpQkEsS0FBSyxDQUF0QixFQUF5QkEsS0FBSyxDQUE5QixFQUFpQzs7QUFFL0Isa0JBQUssSUFBSUMsSUFBSSxDQUFDLENBQWQsRUFBaUJBLEtBQUssQ0FBdEIsRUFBeUJBLEtBQUssQ0FBOUIsRUFBaUM7O0FBRS9CLG1CQUFJRCxLQUFLLENBQUMsQ0FBTixJQUFXQSxLQUFLLENBQWhCLElBQXFCQyxLQUFLLENBQUMsQ0FBM0IsSUFBZ0NBLEtBQUssQ0FBckMsSUFDSUQsS0FBSyxDQUFMLElBQVVDLEtBQUssQ0FEdkIsRUFDNEI7QUFDMUJyQiwwQkFBU1csTUFBTVMsQ0FBZixFQUFrQlIsTUFBTVMsQ0FBeEIsSUFBNkIsSUFBN0I7QUFDRCxnQkFIRCxNQUdPO0FBQ0xyQiwwQkFBU1csTUFBTVMsQ0FBZixFQUFrQlIsTUFBTVMsQ0FBeEIsSUFBNkIsS0FBN0I7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNGO0FBQ0YsTUE3QkQ7O0FBK0JBLFNBQUlKLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBU1YsSUFBVCxFQUFlOztBQUVuQyxXQUFJc0IsT0FBT0gsT0FBT0ksZ0JBQVAsQ0FBd0JqQyxXQUF4QixDQUFYOztBQUVBLFlBQUssSUFBSXpCLElBQUksQ0FBYixFQUFnQkEsSUFBSSxFQUFwQixFQUF3QkEsS0FBSyxDQUE3QixFQUFnQztBQUM5QixhQUFJMkQsTUFBTyxDQUFDeEIsSUFBRCxJQUFTLENBQUdzQixRQUFRekQsQ0FBVCxHQUFjLENBQWhCLEtBQXNCLENBQTFDO0FBQ0E0QixrQkFBU3pCLEtBQUtDLEtBQUwsQ0FBV0osSUFBSSxDQUFmLENBQVQsRUFBNEJBLElBQUksQ0FBSixHQUFRNkIsWUFBUixHQUF1QixDQUF2QixHQUEyQixDQUF2RCxJQUE0RDhCLEdBQTVEO0FBQ0Q7O0FBRUQsWUFBSyxJQUFJM0QsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEVBQXBCLEVBQXdCQSxLQUFLLENBQTdCLEVBQWdDO0FBQzlCLGFBQUkyRCxNQUFPLENBQUN4QixJQUFELElBQVMsQ0FBR3NCLFFBQVF6RCxDQUFULEdBQWMsQ0FBaEIsS0FBc0IsQ0FBMUM7QUFDQTRCLGtCQUFTNUIsSUFBSSxDQUFKLEdBQVE2QixZQUFSLEdBQXVCLENBQXZCLEdBQTJCLENBQXBDLEVBQXVDMUIsS0FBS0MsS0FBTCxDQUFXSixJQUFJLENBQWYsQ0FBdkMsSUFBNEQyRCxHQUE1RDtBQUNEO0FBQ0YsTUFiRDs7QUFlQSxTQUFJZixnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQVNULElBQVQsRUFBZUMsV0FBZixFQUE0Qjs7QUFFOUMsV0FBSXZDLE9BQVE2Qix5QkFBeUIsQ0FBMUIsR0FBK0JVLFdBQTFDO0FBQ0EsV0FBSXFCLE9BQU9ILE9BQU9NLGNBQVAsQ0FBc0IvRCxJQUF0QixDQUFYOztBQUdBLFlBQUssSUFBSUcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEVBQXBCLEVBQXdCQSxLQUFLLENBQTdCLEVBQWdDOztBQUU5QixhQUFJMkQsTUFBTyxDQUFDeEIsSUFBRCxJQUFTLENBQUdzQixRQUFRekQsQ0FBVCxHQUFjLENBQWhCLEtBQXNCLENBQTFDOztBQUVBLGFBQUlBLElBQUksQ0FBUixFQUFXO0FBQ1Q0QixvQkFBUzVCLENBQVQsRUFBWSxDQUFaLElBQWlCMkQsR0FBakI7QUFDRCxVQUZELE1BRU8sSUFBSTNELElBQUksQ0FBUixFQUFXO0FBQ2hCNEIsb0JBQVM1QixJQUFJLENBQWIsRUFBZ0IsQ0FBaEIsSUFBcUIyRCxHQUFyQjtBQUNELFVBRk0sTUFFQTtBQUNML0Isb0JBQVNDLGVBQWUsRUFBZixHQUFvQjdCLENBQTdCLEVBQWdDLENBQWhDLElBQXFDMkQsR0FBckM7QUFDRDtBQUNGOztBQUdELFlBQUssSUFBSTNELElBQUksQ0FBYixFQUFnQkEsSUFBSSxFQUFwQixFQUF3QkEsS0FBSyxDQUE3QixFQUFnQzs7QUFFOUIsYUFBSTJELE1BQU8sQ0FBQ3hCLElBQUQsSUFBUyxDQUFHc0IsUUFBUXpELENBQVQsR0FBYyxDQUFoQixLQUFzQixDQUExQzs7QUFFQSxhQUFJQSxJQUFJLENBQVIsRUFBVztBQUNUNEIsb0JBQVMsQ0FBVCxFQUFZQyxlQUFlN0IsQ0FBZixHQUFtQixDQUEvQixJQUFvQzJELEdBQXBDO0FBQ0QsVUFGRCxNQUVPLElBQUkzRCxJQUFJLENBQVIsRUFBVztBQUNoQjRCLG9CQUFTLENBQVQsRUFBWSxLQUFLNUIsQ0FBTCxHQUFTLENBQVQsR0FBYSxDQUF6QixJQUE4QjJELEdBQTlCO0FBQ0QsVUFGTSxNQUVBO0FBQ0wvQixvQkFBUyxDQUFULEVBQVksS0FBSzVCLENBQUwsR0FBUyxDQUFyQixJQUEwQjJELEdBQTFCO0FBQ0Q7QUFDRjs7QUFHRC9CLGdCQUFTQyxlQUFlLENBQXhCLEVBQTJCLENBQTNCLElBQWlDLENBQUNNLElBQWxDO0FBQ0QsTUFuQ0Q7O0FBcUNBLFNBQUlZLFVBQVUsU0FBVkEsT0FBVSxDQUFTbEQsSUFBVCxFQUFldUMsV0FBZixFQUE0Qjs7QUFFeEMsV0FBSXlCLE1BQU0sQ0FBQyxDQUFYO0FBQ0EsV0FBSXRCLE1BQU1WLGVBQWUsQ0FBekI7QUFDQSxXQUFJaUMsV0FBVyxDQUFmO0FBQ0EsV0FBSUMsWUFBWSxDQUFoQjtBQUNBLFdBQUlDLFdBQVdWLE9BQU9XLGVBQVAsQ0FBdUI3QixXQUF2QixDQUFmOztBQUVBLFlBQUssSUFBSUksTUFBTVgsZUFBZSxDQUE5QixFQUFpQ1csTUFBTSxDQUF2QyxFQUEwQ0EsT0FBTyxDQUFqRCxFQUFvRDs7QUFFbEQsYUFBSUEsT0FBTyxDQUFYLEVBQWNBLE9BQU8sQ0FBUDs7QUFFZCxnQkFBTyxJQUFQLEVBQWE7O0FBRVgsZ0JBQUssSUFBSVMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLENBQXBCLEVBQXVCQSxLQUFLLENBQTVCLEVBQStCOztBQUU3QixpQkFBSXJCLFNBQVNXLEdBQVQsRUFBY0MsTUFBTVMsQ0FBcEIsS0FBMEIsSUFBOUIsRUFBb0M7O0FBRWxDLG1CQUFJaUIsT0FBTyxLQUFYOztBQUVBLG1CQUFJSCxZQUFZbEUsS0FBS0ksTUFBckIsRUFBNkI7QUFDM0JpRSx3QkFBUyxDQUFHckUsS0FBS2tFLFNBQUwsTUFBb0JELFFBQXJCLEdBQWlDLENBQW5DLEtBQXlDLENBQWxEO0FBQ0Q7O0FBRUQsbUJBQUlLLE9BQU9ILFNBQVN6QixHQUFULEVBQWNDLE1BQU1TLENBQXBCLENBQVg7O0FBRUEsbUJBQUlrQixJQUFKLEVBQVU7QUFDUkQsd0JBQU8sQ0FBQ0EsSUFBUjtBQUNEOztBQUVEdEMsd0JBQVNXLEdBQVQsRUFBY0MsTUFBTVMsQ0FBcEIsSUFBeUJpQixJQUF6QjtBQUNBSiwyQkFBWSxDQUFaOztBQUVBLG1CQUFJQSxZQUFZLENBQUMsQ0FBakIsRUFBb0I7QUFDbEJDLDhCQUFhLENBQWI7QUFDQUQsNEJBQVcsQ0FBWDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRHZCLGtCQUFPc0IsR0FBUDs7QUFFQSxlQUFJdEIsTUFBTSxDQUFOLElBQVdWLGdCQUFnQlUsR0FBL0IsRUFBb0M7QUFDbENBLG9CQUFPc0IsR0FBUDtBQUNBQSxtQkFBTSxDQUFDQSxHQUFQO0FBQ0E7QUFDRDtBQUNGO0FBQ0Y7QUFDRixNQWpERDs7QUFtREEsU0FBSU8sY0FBYyxTQUFkQSxXQUFjLENBQVNDLE1BQVQsRUFBaUJDLFFBQWpCLEVBQTJCOztBQUUzQyxXQUFJQyxTQUFTLENBQWI7O0FBRUEsV0FBSUMsYUFBYSxDQUFqQjtBQUNBLFdBQUlDLGFBQWEsQ0FBakI7O0FBRUEsV0FBSUMsU0FBUyxJQUFJMUMsS0FBSixDQUFVc0MsU0FBU3JFLE1BQW5CLENBQWI7QUFDQSxXQUFJMEUsU0FBUyxJQUFJM0MsS0FBSixDQUFVc0MsU0FBU3JFLE1BQW5CLENBQWI7O0FBRUEsWUFBSyxJQUFJK0MsSUFBSSxDQUFiLEVBQWdCQSxJQUFJc0IsU0FBU3JFLE1BQTdCLEVBQXFDK0MsS0FBSyxDQUExQyxFQUE2Qzs7QUFFM0MsYUFBSTRCLFVBQVVOLFNBQVN0QixDQUFULEVBQVk2QixTQUExQjtBQUNBLGFBQUlDLFVBQVVSLFNBQVN0QixDQUFULEVBQVkrQixVQUFaLEdBQXlCSCxPQUF2Qzs7QUFFQUosc0JBQWFyRSxLQUFLNkUsR0FBTCxDQUFTUixVQUFULEVBQXFCSSxPQUFyQixDQUFiO0FBQ0FILHNCQUFhdEUsS0FBSzZFLEdBQUwsQ0FBU1AsVUFBVCxFQUFxQkssT0FBckIsQ0FBYjs7QUFFQUosZ0JBQU8xQixDQUFQLElBQVksSUFBSWhCLEtBQUosQ0FBVTRDLE9BQVYsQ0FBWjs7QUFFQSxjQUFLLElBQUk1RSxJQUFJLENBQWIsRUFBZ0JBLElBQUkwRSxPQUFPMUIsQ0FBUCxFQUFVL0MsTUFBOUIsRUFBc0NELEtBQUssQ0FBM0MsRUFBOEM7QUFDNUMwRSxrQkFBTzFCLENBQVAsRUFBVWhELENBQVYsSUFBZSxPQUFPcUUsT0FBT1ksU0FBUCxHQUFtQmpGLElBQUl1RSxNQUF2QixDQUF0QjtBQUNEO0FBQ0RBLG1CQUFVSyxPQUFWOztBQUVBLGFBQUlNLFNBQVM1QixPQUFPNkIseUJBQVAsQ0FBaUNMLE9BQWpDLENBQWI7QUFDQSxhQUFJTSxVQUFVQyxhQUFhWCxPQUFPMUIsQ0FBUCxDQUFiLEVBQXdCa0MsT0FBT0ksU0FBUCxLQUFxQixDQUE3QyxDQUFkOztBQUVBLGFBQUlDLFVBQVVILFFBQVF6QixHQUFSLENBQVl1QixNQUFaLENBQWQ7QUFDQVAsZ0JBQU8zQixDQUFQLElBQVksSUFBSWhCLEtBQUosQ0FBVWtELE9BQU9JLFNBQVAsS0FBcUIsQ0FBL0IsQ0FBWjtBQUNBLGNBQUssSUFBSXRGLElBQUksQ0FBYixFQUFnQkEsSUFBSTJFLE9BQU8zQixDQUFQLEVBQVUvQyxNQUE5QixFQUFzQ0QsS0FBSyxDQUEzQyxFQUE4QztBQUM1QyxlQUFJd0YsV0FBV3hGLElBQUl1RixRQUFRRCxTQUFSLEVBQUosR0FBMEJYLE9BQU8zQixDQUFQLEVBQVUvQyxNQUFuRDtBQUNBMEUsa0JBQU8zQixDQUFQLEVBQVVoRCxDQUFWLElBQWdCd0YsWUFBWSxDQUFiLEdBQWlCRCxRQUFRRSxLQUFSLENBQWNELFFBQWQsQ0FBakIsR0FBMkMsQ0FBMUQ7QUFDRDtBQUNGOztBQUVELFdBQUlFLGlCQUFpQixDQUFyQjtBQUNBLFlBQUssSUFBSTFGLElBQUksQ0FBYixFQUFnQkEsSUFBSXNFLFNBQVNyRSxNQUE3QixFQUFxQ0QsS0FBSyxDQUExQyxFQUE2QztBQUMzQzBGLDJCQUFrQnBCLFNBQVN0RSxDQUFULEVBQVkrRSxVQUE5QjtBQUNEOztBQUVELFdBQUlsRixPQUFPLElBQUltQyxLQUFKLENBQVUwRCxjQUFWLENBQVg7QUFDQSxXQUFJQyxRQUFRLENBQVo7O0FBRUEsWUFBSyxJQUFJM0YsSUFBSSxDQUFiLEVBQWdCQSxJQUFJd0UsVUFBcEIsRUFBZ0N4RSxLQUFLLENBQXJDLEVBQXdDO0FBQ3RDLGNBQUssSUFBSWdELElBQUksQ0FBYixFQUFnQkEsSUFBSXNCLFNBQVNyRSxNQUE3QixFQUFxQytDLEtBQUssQ0FBMUMsRUFBNkM7QUFDM0MsZUFBSWhELElBQUkwRSxPQUFPMUIsQ0FBUCxFQUFVL0MsTUFBbEIsRUFBMEI7QUFDeEJKLGtCQUFLOEYsS0FBTCxJQUFjakIsT0FBTzFCLENBQVAsRUFBVWhELENBQVYsQ0FBZDtBQUNBMkYsc0JBQVMsQ0FBVDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxZQUFLLElBQUkzRixJQUFJLENBQWIsRUFBZ0JBLElBQUl5RSxVQUFwQixFQUFnQ3pFLEtBQUssQ0FBckMsRUFBd0M7QUFDdEMsY0FBSyxJQUFJZ0QsSUFBSSxDQUFiLEVBQWdCQSxJQUFJc0IsU0FBU3JFLE1BQTdCLEVBQXFDK0MsS0FBSyxDQUExQyxFQUE2QztBQUMzQyxlQUFJaEQsSUFBSTJFLE9BQU8zQixDQUFQLEVBQVUvQyxNQUFsQixFQUEwQjtBQUN4Qkosa0JBQUs4RixLQUFMLElBQWNoQixPQUFPM0IsQ0FBUCxFQUFVaEQsQ0FBVixDQUFkO0FBQ0EyRixzQkFBUyxDQUFUO0FBQ0Q7QUFDRjtBQUNGOztBQUVELGNBQU85RixJQUFQO0FBQ0QsTUEvREQ7O0FBaUVBLFNBQUlpRCxhQUFhLFNBQWJBLFVBQWEsQ0FBU3pCLFVBQVQsRUFBcUJDLG9CQUFyQixFQUEyQ3NFLFFBQTNDLEVBQXFEOztBQUVwRSxXQUFJdEIsV0FBV3VCLFVBQVVDLFdBQVYsQ0FBc0J6RSxVQUF0QixFQUFrQ0Msb0JBQWxDLENBQWY7O0FBRUEsV0FBSStDLFNBQVMwQixhQUFiOztBQUVBLFlBQUssSUFBSS9GLElBQUksQ0FBYixFQUFnQkEsSUFBSTRGLFNBQVMzRixNQUE3QixFQUFxQ0QsS0FBSyxDQUExQyxFQUE2QztBQUMzQyxhQUFJSCxPQUFPK0YsU0FBUzVGLENBQVQsQ0FBWDtBQUNBcUUsZ0JBQU8yQixHQUFQLENBQVduRyxLQUFLb0csT0FBTCxFQUFYLEVBQTJCLENBQTNCO0FBQ0E1QixnQkFBTzJCLEdBQVAsQ0FBV25HLEtBQUt5RixTQUFMLEVBQVgsRUFBNkJoQyxPQUFPNEMsZUFBUCxDQUF1QnJHLEtBQUtvRyxPQUFMLEVBQXZCLEVBQXVDNUUsVUFBdkMsQ0FBN0I7QUFDQXhCLGNBQUtzRyxLQUFMLENBQVc5QixNQUFYO0FBQ0Q7O0FBR0QsV0FBSStCLGlCQUFpQixDQUFyQjtBQUNBLFlBQUssSUFBSXBHLElBQUksQ0FBYixFQUFnQkEsSUFBSXNFLFNBQVNyRSxNQUE3QixFQUFxQ0QsS0FBSyxDQUExQyxFQUE2QztBQUMzQ29HLDJCQUFrQjlCLFNBQVN0RSxDQUFULEVBQVk2RSxTQUE5QjtBQUNEOztBQUVELFdBQUlSLE9BQU82QixlQUFQLEtBQTJCRSxpQkFBaUIsQ0FBaEQsRUFBbUQ7QUFDakQsZUFBTSxJQUFJQyxLQUFKLENBQVUsNEJBQ1poQyxPQUFPNkIsZUFBUCxFQURZLEdBRVosR0FGWSxHQUdaRSxpQkFBaUIsQ0FITCxHQUlaLEdBSkUsQ0FBTjtBQUtEOztBQUdELFdBQUkvQixPQUFPNkIsZUFBUCxLQUEyQixDQUEzQixJQUFnQ0UsaUJBQWlCLENBQXJELEVBQXdEO0FBQ3REL0IsZ0JBQU8yQixHQUFQLENBQVcsQ0FBWCxFQUFjLENBQWQ7QUFDRDs7QUFHRCxjQUFPM0IsT0FBTzZCLGVBQVAsS0FBMkIsQ0FBM0IsSUFBZ0MsQ0FBdkMsRUFBMEM7QUFDeEM3QixnQkFBT2lDLE1BQVAsQ0FBYyxLQUFkO0FBQ0Q7O0FBR0QsY0FBTyxJQUFQLEVBQWE7O0FBRVgsYUFBSWpDLE9BQU82QixlQUFQLE1BQTRCRSxpQkFBaUIsQ0FBakQsRUFBb0Q7QUFDbEQ7QUFDRDtBQUNEL0IsZ0JBQU8yQixHQUFQLENBQVd6RSxJQUFYLEVBQWlCLENBQWpCOztBQUVBLGFBQUk4QyxPQUFPNkIsZUFBUCxNQUE0QkUsaUJBQWlCLENBQWpELEVBQW9EO0FBQ2xEO0FBQ0Q7QUFDRC9CLGdCQUFPMkIsR0FBUCxDQUFXeEUsSUFBWCxFQUFpQixDQUFqQjtBQUNEOztBQUVELGNBQU80QyxZQUFZQyxNQUFaLEVBQW9CQyxRQUFwQixDQUFQO0FBQ0QsTUFwREQ7O0FBc0RBckMsV0FBTTFELE9BQU4sR0FBZ0IsVUFBU3NCLElBQVQsRUFBZTBHLElBQWYsRUFBcUI7O0FBRW5DQSxjQUFPQSxRQUFRLE1BQWY7O0FBRUEsV0FBSUMsVUFBVSxJQUFkOztBQUVBLGVBQU9ELElBQVA7QUFDQSxjQUFLLFNBQUw7QUFDRUMscUJBQVVDLFNBQVM1RyxJQUFULENBQVY7QUFDQTtBQUNGLGNBQUssY0FBTDtBQUNFMkcscUJBQVVFLFdBQVc3RyxJQUFYLENBQVY7QUFDQTtBQUNGLGNBQUssTUFBTDtBQUNFMkcscUJBQVVHLFdBQVc5RyxJQUFYLENBQVY7QUFDQTtBQUNGLGNBQUssT0FBTDtBQUNFMkcscUJBQVVJLFFBQVEvRyxJQUFSLENBQVY7QUFDQTtBQUNGO0FBQ0UsaUJBQU0sVUFBVTBHLElBQWhCO0FBZEY7O0FBaUJBeEUsaUJBQVU4RSxJQUFWLENBQWVMLE9BQWY7QUFDQTFFLG9CQUFhLElBQWI7QUFDRCxNQXpCRDs7QUEyQkFHLFdBQU02RSxNQUFOLEdBQWUsVUFBU3ZFLEdBQVQsRUFBY0MsR0FBZCxFQUFtQjtBQUNoQyxXQUFJRCxNQUFNLENBQU4sSUFBV1YsZ0JBQWdCVSxHQUEzQixJQUFrQ0MsTUFBTSxDQUF4QyxJQUE2Q1gsZ0JBQWdCVyxHQUFqRSxFQUFzRTtBQUNwRSxlQUFNLElBQUk2RCxLQUFKLENBQVU5RCxNQUFNLEdBQU4sR0FBWUMsR0FBdEIsQ0FBTjtBQUNEO0FBQ0QsY0FBT1osU0FBU1csR0FBVCxFQUFjQyxHQUFkLENBQVA7QUFDRCxNQUxEOztBQU9BUCxXQUFNOEUsY0FBTixHQUF1QixZQUFXO0FBQ2hDLGNBQU9sRixZQUFQO0FBQ0QsTUFGRDs7QUFJQUksV0FBTXpELElBQU4sR0FBYSxZQUFXO0FBQ3RCMEQsZ0JBQVMsS0FBVCxFQUFnQmdCLG9CQUFoQjtBQUNELE1BRkQ7O0FBSUFqQixXQUFNK0UsY0FBTixHQUF1QixVQUFTQyxRQUFULEVBQW1CQyxNQUFuQixFQUEyQjs7QUFFaERELGtCQUFXQSxZQUFZLENBQXZCO0FBQ0FDLGdCQUFVLE9BQU9BLE1BQVAsSUFBaUIsV0FBbEIsR0FBZ0NELFdBQVcsQ0FBM0MsR0FBK0NDLE1BQXhEOztBQUVBLFdBQUlDLFNBQVMsRUFBYjs7QUFFQUEsaUJBQVUsZ0JBQVY7QUFDQUEsaUJBQVUseUNBQVY7QUFDQUEsaUJBQVUsNkJBQVY7QUFDQUEsaUJBQVUsNEJBQTRCRCxNQUE1QixHQUFxQyxLQUEvQztBQUNBQyxpQkFBVSxJQUFWO0FBQ0FBLGlCQUFVLFNBQVY7O0FBRUEsWUFBSyxJQUFJbkUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJZixNQUFNOEUsY0FBTixFQUFwQixFQUE0Qy9ELEtBQUssQ0FBakQsRUFBb0Q7O0FBRWxEbUUsbUJBQVUsTUFBVjs7QUFFQSxjQUFLLElBQUlsRSxJQUFJLENBQWIsRUFBZ0JBLElBQUloQixNQUFNOEUsY0FBTixFQUFwQixFQUE0QzlELEtBQUssQ0FBakQsRUFBb0Q7QUFDbERrRSxxQkFBVSxhQUFWO0FBQ0FBLHFCQUFVLHlDQUFWO0FBQ0FBLHFCQUFVLDZCQUFWO0FBQ0FBLHFCQUFVLDZCQUFWO0FBQ0FBLHFCQUFVLGFBQWFGLFFBQWIsR0FBd0IsS0FBbEM7QUFDQUUscUJBQVUsY0FBY0YsUUFBZCxHQUF5QixLQUFuQztBQUNBRSxxQkFBVSxxQkFBVjtBQUNBQSxxQkFBVWxGLE1BQU02RSxNQUFOLENBQWE5RCxDQUFiLEVBQWdCQyxDQUFoQixJQUFvQixTQUFwQixHQUFnQyxTQUExQztBQUNBa0UscUJBQVUsR0FBVjtBQUNBQSxxQkFBVSxLQUFWO0FBQ0Q7O0FBRURBLG1CQUFVLE9BQVY7QUFDRDs7QUFFREEsaUJBQVUsVUFBVjtBQUNBQSxpQkFBVSxVQUFWOztBQUVBLGNBQU9BLE1BQVA7QUFDRCxNQXRDRDs7QUF3Q0FsRixXQUFNbUYsWUFBTixHQUFxQixVQUFTSCxRQUFULEVBQW1CQyxNQUFuQixFQUEyQjs7QUFFOUNELGtCQUFXQSxZQUFZLENBQXZCO0FBQ0FDLGdCQUFVLE9BQU9BLE1BQVAsSUFBaUIsV0FBbEIsR0FBZ0NELFdBQVcsQ0FBM0MsR0FBK0NDLE1BQXhEO0FBQ0EsV0FBSUcsT0FBT3BGLE1BQU04RSxjQUFOLEtBQXlCRSxRQUF6QixHQUFvQ0MsU0FBUyxDQUF4RDtBQUNBLFdBQUlqRSxDQUFKO0FBQUEsV0FBT3FFLEVBQVA7QUFBQSxXQUFXdEUsQ0FBWDtBQUFBLFdBQWN1RSxFQUFkO0FBQUEsV0FBa0JDLFFBQU0sRUFBeEI7QUFBQSxXQUE0QkMsSUFBNUI7O0FBRUFBLGNBQU8sTUFBTVIsUUFBTixHQUFpQixPQUFqQixHQUEyQkEsUUFBM0IsR0FDTCxJQURLLEdBQ0VBLFFBREYsR0FDYSxRQURiLEdBQ3dCQSxRQUR4QixHQUNtQyxJQUQxQzs7QUFHQU8sZ0JBQVMsTUFBVDtBQUNBQSxnQkFBUyxhQUFhSCxJQUFiLEdBQW9CLEtBQTdCO0FBQ0FHLGdCQUFTLGNBQWNILElBQWQsR0FBcUIsS0FBOUI7QUFDQUcsZ0JBQVMscUNBQVQ7QUFDQUEsZ0JBQVMsR0FBVDtBQUNBQSxnQkFBUyxXQUFUOztBQUVBLFlBQUt4RSxJQUFJLENBQVQsRUFBWUEsSUFBSWYsTUFBTThFLGNBQU4sRUFBaEIsRUFBd0MvRCxLQUFLLENBQTdDLEVBQWdEO0FBQzlDdUUsY0FBS3ZFLElBQUlpRSxRQUFKLEdBQWVDLE1BQXBCO0FBQ0EsY0FBS2pFLElBQUksQ0FBVCxFQUFZQSxJQUFJaEIsTUFBTThFLGNBQU4sRUFBaEIsRUFBd0M5RCxLQUFLLENBQTdDLEVBQWdEO0FBQzlDLGVBQUloQixNQUFNNkUsTUFBTixDQUFhOUQsQ0FBYixFQUFnQkMsQ0FBaEIsQ0FBSixFQUF5QjtBQUN2QnFFLGtCQUFLckUsSUFBRWdFLFFBQUYsR0FBV0MsTUFBaEI7QUFDQU0sc0JBQVMsTUFBTUYsRUFBTixHQUFXLEdBQVgsR0FBaUJDLEVBQWpCLEdBQXNCRSxJQUEvQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFREQsZ0JBQVMsdUNBQVQ7QUFDQUEsZ0JBQVMsUUFBVDs7QUFFQSxjQUFPQSxLQUFQO0FBQ0QsTUEvQkQ7O0FBaUNBdkYsV0FBTXlGLFlBQU4sR0FBcUIsVUFBU1QsUUFBVCxFQUFtQkMsTUFBbkIsRUFBMkI7O0FBRTlDRCxrQkFBV0EsWUFBWSxDQUF2QjtBQUNBQyxnQkFBVSxPQUFPQSxNQUFQLElBQWlCLFdBQWxCLEdBQWdDRCxXQUFXLENBQTNDLEdBQStDQyxNQUF4RDs7QUFFQSxXQUFJRyxPQUFPcEYsTUFBTThFLGNBQU4sS0FBeUJFLFFBQXpCLEdBQW9DQyxTQUFTLENBQXhEO0FBQ0EsV0FBSVMsTUFBTVQsTUFBVjtBQUNBLFdBQUlsQyxNQUFNcUMsT0FBT0gsTUFBakI7O0FBRUEsY0FBT1EsYUFBYUwsSUFBYixFQUFtQkEsSUFBbkIsRUFBeUIsVUFBU25ILENBQVQsRUFBWUcsQ0FBWixFQUFlO0FBQzdDLGFBQUlzSCxPQUFPekgsQ0FBUCxJQUFZQSxJQUFJOEUsR0FBaEIsSUFBdUIyQyxPQUFPdEgsQ0FBOUIsSUFBbUNBLElBQUkyRSxHQUEzQyxFQUFnRDtBQUM5QyxlQUFJL0IsSUFBSTlDLEtBQUtDLEtBQUwsQ0FBWSxDQUFDRixJQUFJeUgsR0FBTCxJQUFZVixRQUF4QixDQUFSO0FBQ0EsZUFBSWpFLElBQUk3QyxLQUFLQyxLQUFMLENBQVksQ0FBQ0MsSUFBSXNILEdBQUwsSUFBWVYsUUFBeEIsQ0FBUjtBQUNBLGtCQUFPaEYsTUFBTTZFLE1BQU4sQ0FBYTlELENBQWIsRUFBZ0JDLENBQWhCLElBQW9CLENBQXBCLEdBQXdCLENBQS9CO0FBQ0QsVUFKRCxNQUlPO0FBQ0wsa0JBQU8sQ0FBUDtBQUNEO0FBQ0YsUUFSTSxDQUFQO0FBU0QsTUFsQkQ7O0FBb0JBaEIsV0FBTXZELGVBQU4sR0FBd0IsVUFBU3VJLFFBQVQsRUFBbUJDLE1BQW5CLEVBQTJCOztBQUVqREQsa0JBQVdBLFlBQVksQ0FBdkI7QUFDQUMsZ0JBQVUsT0FBT0EsTUFBUCxJQUFpQixXQUFsQixHQUFnQ0QsV0FBVyxDQUEzQyxHQUErQ0MsTUFBeEQ7O0FBRUEsV0FBSUcsT0FBT3BGLE1BQU04RSxjQUFOLEtBQXlCRSxRQUF6QixHQUFvQ0MsU0FBUyxDQUF4RDtBQUNBLFdBQUlTLE1BQU1ULE1BQVY7QUFDQSxXQUFJbEMsTUFBTXFDLE9BQU9ILE1BQWpCOztBQUVBLGNBQU94SSxnQkFBZ0IySSxJQUFoQixFQUFzQkEsSUFBdEIsRUFBNEIsVUFBU25ILENBQVQsRUFBWUcsQ0FBWixFQUFlO0FBQ2hELGFBQUlzSCxPQUFPekgsQ0FBUCxJQUFZQSxJQUFJOEUsR0FBaEIsSUFBdUIyQyxPQUFPdEgsQ0FBOUIsSUFBbUNBLElBQUkyRSxHQUEzQyxFQUFnRDtBQUM5QyxlQUFJL0IsSUFBSTlDLEtBQUtDLEtBQUwsQ0FBWSxDQUFDRixJQUFJeUgsR0FBTCxJQUFZVixRQUF4QixDQUFSO0FBQ0EsZUFBSWpFLElBQUk3QyxLQUFLQyxLQUFMLENBQVksQ0FBQ0MsSUFBSXNILEdBQUwsSUFBWVYsUUFBeEIsQ0FBUjtBQUNBLGtCQUFPaEYsTUFBTTZFLE1BQU4sQ0FBYTlELENBQWIsRUFBZ0JDLENBQWhCLElBQW9CLENBQXBCLEdBQXdCLENBQS9CO0FBQ0QsVUFKRCxNQUlPO0FBQ0wsa0JBQU8sQ0FBUDtBQUNEO0FBQ0YsUUFSTSxDQUFQO0FBU0QsTUFsQkQ7O0FBb0JBLFlBQU9oQixLQUFQO0FBQ0QsSUFqZ0JEOztBQXVnQkFiLFVBQU93RyxhQUFQLEdBQXVCLFVBQVNDLENBQVQsRUFBWTtBQUNqQyxTQUFJQyxRQUFRLElBQUk5RixLQUFKLEVBQVo7QUFDQSxVQUFLLElBQUloQyxJQUFJLENBQWIsRUFBZ0JBLElBQUk2SCxFQUFFNUgsTUFBdEIsRUFBOEJELEtBQUssQ0FBbkMsRUFBc0M7QUFDcEMsV0FBSWlELElBQUk0RSxFQUFFRSxVQUFGLENBQWEvSCxDQUFiLENBQVI7QUFDQThILGFBQU1qQixJQUFOLENBQVc1RCxJQUFJLElBQWY7QUFDRDtBQUNELFlBQU82RSxLQUFQO0FBQ0QsSUFQRDs7QUFrQkExRyxVQUFPNEcsbUJBQVAsR0FBNkIsVUFBU0MsV0FBVCxFQUFzQkMsUUFBdEIsRUFBZ0M7O0FBSTNELFNBQUlDLGFBQWEsWUFBVzs7QUFFMUIsV0FBSUMsTUFBTUMsd0JBQXdCSixXQUF4QixDQUFWO0FBQ0EsV0FBSUssT0FBTyxTQUFQQSxJQUFPLEdBQVc7QUFDcEIsYUFBSUMsSUFBSUgsSUFBSUUsSUFBSixFQUFSO0FBQ0EsYUFBSUMsS0FBSyxDQUFDLENBQVYsRUFBYSxNQUFNLElBQUlsQyxLQUFKLEVBQU47QUFDYixnQkFBT2tDLENBQVA7QUFDRCxRQUpEOztBQU1BLFdBQUlDLFFBQVEsQ0FBWjtBQUNBLFdBQUlMLGFBQWEsRUFBakI7QUFDQSxjQUFPLElBQVAsRUFBYTtBQUNYLGFBQUlNLEtBQUtMLElBQUlFLElBQUosRUFBVDtBQUNBLGFBQUlHLE1BQU0sQ0FBQyxDQUFYLEVBQWM7QUFDZCxhQUFJQyxLQUFLSixNQUFUO0FBQ0EsYUFBSUssS0FBS0wsTUFBVDtBQUNBLGFBQUlNLEtBQUtOLE1BQVQ7QUFDQSxhQUFJTyxJQUFJQyxPQUFPQyxZQUFQLENBQXNCTixNQUFNLENBQVAsR0FBWUMsRUFBakMsQ0FBUjtBQUNBLGFBQUlNLElBQUtMLE1BQU0sQ0FBUCxHQUFZQyxFQUFwQjtBQUNBVCxvQkFBV1UsQ0FBWCxJQUFnQkcsQ0FBaEI7QUFDQVIsa0JBQVMsQ0FBVDtBQUNEO0FBQ0QsV0FBSUEsU0FBU04sUUFBYixFQUF1QjtBQUNyQixlQUFNLElBQUk3QixLQUFKLENBQVVtQyxRQUFRLE1BQVIsR0FBaUJOLFFBQTNCLENBQU47QUFDRDs7QUFFRCxjQUFPQyxVQUFQO0FBQ0QsTUEzQmdCLEVBQWpCOztBQTZCQSxTQUFJYyxjQUFjLElBQUlsQixVQUFKLENBQWUsQ0FBZixDQUFsQjs7QUFFQSxZQUFPLFVBQVNGLENBQVQsRUFBWTtBQUNqQixXQUFJQyxRQUFRLElBQUk5RixLQUFKLEVBQVo7QUFDQSxZQUFLLElBQUloQyxJQUFJLENBQWIsRUFBZ0JBLElBQUk2SCxFQUFFNUgsTUFBdEIsRUFBOEJELEtBQUssQ0FBbkMsRUFBc0M7QUFDcEMsYUFBSWlELElBQUk0RSxFQUFFRSxVQUFGLENBQWEvSCxDQUFiLENBQVI7QUFDQSxhQUFJaUQsSUFBSSxHQUFSLEVBQWE7QUFDWDZFLGlCQUFNakIsSUFBTixDQUFXNUQsQ0FBWDtBQUNELFVBRkQsTUFFTztBQUNMLGVBQUlzRixJQUFJSixXQUFXTixFQUFFcUIsTUFBRixDQUFTbEosQ0FBVCxDQUFYLENBQVI7QUFDQSxlQUFJLE9BQU91SSxDQUFQLElBQVksUUFBaEIsRUFBMEI7QUFDeEIsaUJBQUssQ0FBQ0EsSUFBSSxJQUFMLEtBQWNBLENBQW5CLEVBQXNCO0FBRXBCVCxxQkFBTWpCLElBQU4sQ0FBVzBCLENBQVg7QUFDRCxjQUhELE1BR087QUFFTFQscUJBQU1qQixJQUFOLENBQVcwQixNQUFNLENBQWpCO0FBQ0FULHFCQUFNakIsSUFBTixDQUFXMEIsSUFBSSxJQUFmO0FBQ0Q7QUFDRixZQVRELE1BU087QUFDTFQsbUJBQU1qQixJQUFOLENBQVdvQyxXQUFYO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsY0FBT25CLEtBQVA7QUFDRCxNQXZCRDtBQXdCRCxJQTNERDs7QUFpRUEsT0FBSXFCLFNBQVM7QUFDWEMsa0JBQWlCLEtBQUssQ0FEWDtBQUVYQyxxQkFBaUIsS0FBSyxDQUZYO0FBR1hDLHFCQUFpQixLQUFLLENBSFg7QUFJWEMsaUJBQWlCLEtBQUs7QUFKWCxJQUFiOztBQVdBLE9BQUk1SCx5QkFBeUI7QUFDM0I2SCxRQUFJLENBRHVCO0FBRTNCQyxRQUFJLENBRnVCO0FBRzNCQyxRQUFJLENBSHVCO0FBSTNCQyxRQUFJO0FBSnVCLElBQTdCOztBQVdBLE9BQUlDLGdCQUFnQjtBQUNsQkMsaUJBQWEsQ0FESztBQUVsQkMsaUJBQWEsQ0FGSztBQUdsQkMsaUJBQWEsQ0FISztBQUlsQkMsaUJBQWEsQ0FKSztBQUtsQkMsaUJBQWEsQ0FMSztBQU1sQkMsaUJBQWEsQ0FOSztBQU9sQkMsaUJBQWEsQ0FQSztBQVFsQkMsaUJBQWE7QUFSSyxJQUFwQjs7QUFlQSxPQUFJOUcsU0FBUyxZQUFXOztBQUV0QixTQUFJK0cseUJBQXlCLENBQzNCLEVBRDJCLEVBRTNCLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FGMkIsRUFHM0IsQ0FBQyxDQUFELEVBQUksRUFBSixDQUgyQixFQUkzQixDQUFDLENBQUQsRUFBSSxFQUFKLENBSjJCLEVBSzNCLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FMMkIsRUFNM0IsQ0FBQyxDQUFELEVBQUksRUFBSixDQU4yQixFQU8zQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixDQVAyQixFQVEzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixDQVIyQixFQVMzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixDQVQyQixFQVUzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixDQVYyQixFQVczQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixDQVgyQixFQVkzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixDQVoyQixFQWEzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixDQWIyQixFQWMzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosQ0FkMkIsRUFlM0IsQ0FBQyxDQUFELEVBQUksRUFBSixFQUFRLEVBQVIsRUFBWSxFQUFaLENBZjJCLEVBZ0IzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosQ0FoQjJCLEVBaUIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosQ0FqQjJCLEVBa0IzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosQ0FsQjJCLEVBbUIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosQ0FuQjJCLEVBb0IzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosQ0FwQjJCLEVBcUIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsRUFBaEIsQ0FyQjJCLEVBc0IzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsRUFBaEIsQ0F0QjJCLEVBdUIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsQ0F2QjJCLEVBd0IzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsQ0F4QjJCLEVBeUIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsQ0F6QjJCLEVBMEIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsQ0ExQjJCLEVBMkIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsQ0EzQjJCLEVBNEIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsRUFBaEIsRUFBb0IsR0FBcEIsQ0E1QjJCLEVBNkIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0E3QjJCLEVBOEIzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0E5QjJCLEVBK0IzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0EvQjJCLEVBZ0MzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FoQzJCLEVBaUMzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FqQzJCLEVBa0MzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FsQzJCLEVBbUMzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsQ0FuQzJCLEVBb0MzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsQ0FwQzJCLEVBcUMzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsQ0FyQzJCLEVBc0MzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsQ0F0QzJCLEVBdUMzQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsR0FBaEIsRUFBcUIsR0FB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Q0FBbEIsR0FBc0IsU0FBT3RJLENBQTdCLElBQWtDekssS0FBbkMsR0FBNEMsR0FBNUMsR0FBa0QsQ0FBekQ7QUFDRDs7Ozs7bUJBR1k0UyxJIiwiZmlsZSI6InFhcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJxYXJ0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInFhcnRcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi4vZGlzdC9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjNGY1ZmY0NzZkOTE1ODc4ZDM0YyIsImltcG9ydCB7UVJDb2RlLCBRUlV0aWx9IGZyb20gJy4vcXJjb2RlJztcbmltcG9ydCBVdGlsIGZyb20gJy4vdXRpbCc7XG5cbmNsYXNzIFFBcnQge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdRQXJ0IHJlcXVpcmVkIGBvcHRpb25zYC4nKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLnZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdRQXJ0IHJlcXVpcmVkIGB2YWx1ZWAgb3B0aW9uLicpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuaW1hZ2VQYXRoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdRQXJ0IHJlcXVpcmVkIGBpbWFnZVBhdGhgIG9wdGlvbi4nKVxuICAgIH1cblxuICAgIC8vIHRoaXMuc2l6ZSA9ICh0eXBlb2Ygb3B0aW9ucy5zaXplID09PSAndW5kZWZpbmVkJykgPyBRQXJ0LkRFRkFVTFRTLnNpemUgOiBvcHRpb25zLnNpemU7XG4gICAgdGhpcy5maWx0ZXIgPSAodHlwZW9mIG9wdGlvbnMuZmlsdGVyID09PSAndW5kZWZpbmVkJykgPyBRQXJ0LkRFRkFVTFRTLmZpbHRlciA6IG9wdGlvbnMuZmlsdGVyO1xuICAgIHRoaXMudmFsdWUgPSBvcHRpb25zLnZhbHVlO1xuICAgIHRoaXMuaW1hZ2VQYXRoID0gb3B0aW9ucy5pbWFnZVBhdGg7XG4gIH1cblxuICBzdGF0aWMgZ2V0IERFRkFVTFRTKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBzaXplOiAxOTUsXG4gICAgICB2YWx1ZTogJycsXG4gICAgICBmaWx0ZXI6ICd0aHJlc2hvbGQnXG4gICAgfVxuICB9XG5cbiAgbWFrZShlbCkge1xuICAgIHZhciBpbWFnZVNpemUgPSAxOTU7XG4gICAgdmFyIHBhZGRpbmcgPSAxMjtcbiAgICB2YXIgbGV2ZWwgPSAxMDtcblxuICAgIHZhciBxciA9IFFSQ29kZShsZXZlbCwgJ0gnKTtcbiAgICBxci5hZGREYXRhKHRoaXMudmFsdWUpO1xuICAgIHFyLm1ha2UoKTtcbiAgICB2YXIgcXJJbWFnZSA9IHFyLmNyZWF0ZUltZ09iamVjdCgzKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBxckltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY292ZXJJbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBjb3ZlckltYWdlLnNyYyA9IHNlbGYuaW1hZ2VQYXRoO1xuXG4gICAgICAgIHZhciByZXN1bHRDYW52YXMgPSBVdGlsLmNyZWF0ZUNhbnZhcyhpbWFnZVNpemUsIHFySW1hZ2UpO1xuICAgICAgICB2YXIgcXJDYW52YXMgPSBVdGlsLmNyZWF0ZUNhbnZhcyhpbWFnZVNpemUsIHFySW1hZ2UpO1xuXG4gICAgICAgIGNvdmVySW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY292ZXJJbWFnZS53aWR0aCA8IGNvdmVySW1hZ2UuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgY292ZXJJbWFnZS5oZWlnaHQgPSAoaW1hZ2VTaXplIC0gcGFkZGluZyAqIDIpICogKDEuMCAqIGNvdmVySW1hZ2UuaGVpZ2h0IC8gY292ZXJJbWFnZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgY292ZXJJbWFnZS53aWR0aCA9IGltYWdlU2l6ZSAtIHBhZGRpbmcgKiAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb3ZlckltYWdlLndpZHRoID0gKGltYWdlU2l6ZSAtIHBhZGRpbmcgKiAyKSAqICgxLjAgKiBjb3ZlckltYWdlLndpZHRoIC8gY292ZXJJbWFnZS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGNvdmVySW1hZ2UuaGVpZ2h0ID0gaW1hZ2VTaXplIC0gcGFkZGluZyAqIDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjb3ZlckNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgY292ZXJDYW52YXMud2lkdGggPSBpbWFnZVNpemU7XG4gICAgICAgICAgICBjb3ZlckNhbnZhcy5oZWlnaHQgPSBpbWFnZVNpemU7XG4gICAgICAgICAgICBjb3ZlckNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLmRyYXdJbWFnZShjb3ZlckltYWdlLCBwYWRkaW5nLCBwYWRkaW5nLCBpbWFnZVNpemUgLSBwYWRkaW5nICogMiwgaW1hZ2VTaXplIC0gcGFkZGluZyAqIDIpXG5cbiAgICAgICAgICAgIHZhciBjb3ZlckltYWdlRGF0YSA9IGNvdmVyQ2FudmFzLmdldENvbnRleHQoJzJkJykuZ2V0SW1hZ2VEYXRhKDAsIDAsIGltYWdlU2l6ZSwgaW1hZ2VTaXplKTtcbiAgICAgICAgICAgIHZhciBjb3ZlckltYWdlQmluYXJ5ID0gY292ZXJJbWFnZURhdGEuZGF0YTtcbiAgICAgICAgICAgIHZhciByZXN1bHRJbWFnZURhdGEgPSByZXN1bHRDYW52YXMuZ2V0Q29udGV4dCgnMmQnKS5nZXRJbWFnZURhdGEoMCwgMCwgaW1hZ2VTaXplLCBpbWFnZVNpemUpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdEltYWdlQmluYXJ5ID0gcmVzdWx0SW1hZ2VEYXRhLmRhdGE7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY292ZXJJbWFnZUJpbmFyeS5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICAgICAgICAgIHZhciB4ID0gTWF0aC5mbG9vcihpIC8gNCkgJSBpbWFnZVNpemU7XG4gICAgICAgICAgICAgICAgdmFyIHkgPSBNYXRoLmZsb29yKE1hdGguZmxvb3IoaSAvIDQpIC8gaW1hZ2VTaXplKTtcblxuICAgICAgICAgICAgICAgIGlmICh4IDwgcGFkZGluZyB8fCB5IDwgcGFkZGluZyB8fCB4ID49IGltYWdlU2l6ZS1wYWRkaW5nIHx8IHkgPj0gaW1hZ2VTaXplLXBhZGRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0SW1hZ2VCaW5hcnlbaSszXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoeCUzID09IDEgJiYgeSUzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh4IDwgMzYgJiYgKHkgPCAzNiB8fCB5ID49IGltYWdlU2l6ZS0zNikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh4ID49IGltYWdlU2l6ZS0zNiAmJiB5IDwgMzYpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZmlsdGVyID09ICd0aHJlc2hvbGQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmYWN0b3IgPSBVdGlsLnRocmVzaG9sZChjb3ZlckltYWdlQmluYXJ5W2ldLCBjb3ZlckltYWdlQmluYXJ5W2krMV0sIGNvdmVySW1hZ2VCaW5hcnlbaSsyXSwgMTI3KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0SW1hZ2VCaW5hcnlbaV0gPSBmYWN0b3I7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEltYWdlQmluYXJ5W2krMV0gPSBmYWN0b3I7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEltYWdlQmluYXJ5W2krMl0gPSBmYWN0b3I7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLmZpbHRlciA9PSAnY29sb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEltYWdlQmluYXJ5W2ldID0gY292ZXJJbWFnZUJpbmFyeVtpXTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0SW1hZ2VCaW5hcnlbaSsxXSA9IGNvdmVySW1hZ2VCaW5hcnlbaSsxXTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0SW1hZ2VCaW5hcnlbaSsyXSA9IGNvdmVySW1hZ2VCaW5hcnlbaSsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0SW1hZ2VCaW5hcnlbaSszXSA9IGNvdmVySW1hZ2VCaW5hcnlbaSszXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzdWx0Q2FudmFzLmdldENvbnRleHQoJzJkJykucHV0SW1hZ2VEYXRhKHJlc3VsdEltYWdlRGF0YSwgMCwgMCk7XG5cbiAgICAgICAgICAgIHZhciBwYXR0ZXJuUG9zdGlvbiA9IFFSVXRpbC5nZXRQYXR0ZXJuUG9zaXRpb24obGV2ZWwpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXR0ZXJuUG9zdGlvbi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGF0dGVyblBvc3Rpb24ubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHggPSBwYXR0ZXJuUG9zdGlvbltpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHkgPSBwYXR0ZXJuUG9zdGlvbltqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoKHggPT0gNiAmJiB5ID09IDUwKSB8fCAoeSA9PSA2ICYmIHggPT0gNTApIHx8ICh4ID09IDYgJiYgeSA9PSA2KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWN0WCA9IDMgKiAoeC0yKSArIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY3RZID0gMyAqICh5LTIpICsgMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjdFdpZHRoID0gKDMgKiAoeCszKSArIDEyKSAtIHJlY3RYO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY3RIZWlnaHQgPSAoMyAqICh5KzMpICsgMTIpIC0gcmVjdFk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWN0RGF0YSA9IHFyQ2FudmFzLmdldENvbnRleHQoJzJkJykuZ2V0SW1hZ2VEYXRhKHJlY3RYLCByZWN0WSwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdENhbnZhcy5nZXRDb250ZXh0KCcyZCcpLnB1dEltYWdlRGF0YShyZWN0RGF0YSwgcmVjdFgsIHJlY3RZKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVzdWx0Q2FudmFzLndpZHRoID0gc2VsZi5zaXplO1xuICAgICAgICAgICAgLy8gcmVzdWx0Q2FudmFzLmhlaWdodCA9IHNlbGYuc2l6ZTtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQocmVzdWx0Q2FudmFzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gIH1cbn1cblxud2luZG93LlFBcnQgPSBRQXJ0O1xuZXhwb3J0IGRlZmF1bHQgd2luZG93LlFBcnQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcWFydC5qcyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2RlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZpbmVQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAoMCwgX2RlZmluZVByb3BlcnR5Mi5kZWZhdWx0KSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eScpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcbiAgcmV0dXJuICRPYmplY3QuZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7ZGVmaW5lUHJvcGVydHk6IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZ9KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIEMpe1xuICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IEMoYSk7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQyhhLCBiKTtcbiAgICAgICAgICB9IHJldHVybiBuZXcgQyhhLCBiLCBjKTtcbiAgICAgICAgfSByZXR1cm4gQy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUubWV0aG9kcy4lTkFNRSVcbiAgICBpZihJU19QUk9UTyl7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYodHlwZSAmICRleHBvcnQuUiAmJiBleHBQcm90byAmJiAhZXhwUHJvdG9ba2V5XSloaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBRUiBDb2RlIEdlbmVyYXRvciBmb3IgSmF2YVNjcmlwdFxuLy9cbi8vIENvcHlyaWdodCAoYykgMjAwOSBLYXp1aGlrbyBBcmFzZVxuLy9cbi8vIFVSTDogaHR0cDovL3d3dy5kLXByb2plY3QuY29tL1xuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbi8vICBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuLy9cbi8vIFRoZSB3b3JkICdRUiBDb2RlJyBpcyByZWdpc3RlcmVkIHRyYWRlbWFyayBvZlxuLy8gREVOU08gV0FWRSBJTkNPUlBPUkFURURcbi8vICBodHRwOi8vd3d3LmRlbnNvLXdhdmUuY29tL3FyY29kZS9mYXFwYXRlbnQtZS5odG1sXG4vL1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHFyY29kZSA9IGZ1bmN0aW9uKCkge1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyY29kZVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBxcmNvZGVcbiAgICogQHBhcmFtIHR5cGVOdW1iZXIgMSB0byA0MFxuICAgKiBAcGFyYW0gZXJyb3JDb3JyZWN0aW9uTGV2ZWwgJ0wnLCdNJywnUScsJ0gnXG4gICAqL1xuICB2YXIgcXJjb2RlID0gZnVuY3Rpb24odHlwZU51bWJlciwgZXJyb3JDb3JyZWN0aW9uTGV2ZWwpIHtcblxuICAgIHZhciBQQUQwID0gMHhFQztcbiAgICB2YXIgUEFEMSA9IDB4MTE7XG5cbiAgICB2YXIgX3R5cGVOdW1iZXIgPSB0eXBlTnVtYmVyO1xuICAgIHZhciBfZXJyb3JDb3JyZWN0aW9uTGV2ZWwgPSBRUkVycm9yQ29ycmVjdGlvbkxldmVsW2Vycm9yQ29ycmVjdGlvbkxldmVsXTtcbiAgICB2YXIgX21vZHVsZXMgPSBudWxsO1xuICAgIHZhciBfbW9kdWxlQ291bnQgPSAwO1xuICAgIHZhciBfZGF0YUNhY2hlID0gbnVsbDtcbiAgICB2YXIgX2RhdGFMaXN0ID0gbmV3IEFycmF5KCk7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIHZhciBtYWtlSW1wbCA9IGZ1bmN0aW9uKHRlc3QsIG1hc2tQYXR0ZXJuKSB7XG5cbiAgICAgIF9tb2R1bGVDb3VudCA9IF90eXBlTnVtYmVyICogNCArIDE3O1xuICAgICAgX21vZHVsZXMgPSBmdW5jdGlvbihtb2R1bGVDb3VudCkge1xuICAgICAgICB2YXIgbW9kdWxlcyA9IG5ldyBBcnJheShtb2R1bGVDb3VudCk7XG4gICAgICAgIGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IG1vZHVsZUNvdW50OyByb3cgKz0gMSkge1xuICAgICAgICAgIG1vZHVsZXNbcm93XSA9IG5ldyBBcnJheShtb2R1bGVDb3VudCk7XG4gICAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbW9kdWxlQ291bnQ7IGNvbCArPSAxKSB7XG4gICAgICAgICAgICBtb2R1bGVzW3Jvd11bY29sXSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb2R1bGVzO1xuICAgICAgfShfbW9kdWxlQ291bnQpO1xuXG4gICAgICBzZXR1cFBvc2l0aW9uUHJvYmVQYXR0ZXJuKDAsIDApO1xuICAgICAgc2V0dXBQb3NpdGlvblByb2JlUGF0dGVybihfbW9kdWxlQ291bnQgLSA3LCAwKTtcbiAgICAgIHNldHVwUG9zaXRpb25Qcm9iZVBhdHRlcm4oMCwgX21vZHVsZUNvdW50IC0gNyk7XG4gICAgICBzZXR1cFBvc2l0aW9uQWRqdXN0UGF0dGVybigpO1xuICAgICAgc2V0dXBUaW1pbmdQYXR0ZXJuKCk7XG4gICAgICBzZXR1cFR5cGVJbmZvKHRlc3QsIG1hc2tQYXR0ZXJuKTtcblxuICAgICAgaWYgKF90eXBlTnVtYmVyID49IDcpIHtcbiAgICAgICAgc2V0dXBUeXBlTnVtYmVyKHRlc3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2RhdGFDYWNoZSA9PSBudWxsKSB7XG4gICAgICAgIF9kYXRhQ2FjaGUgPSBjcmVhdGVEYXRhKF90eXBlTnVtYmVyLCBfZXJyb3JDb3JyZWN0aW9uTGV2ZWwsIF9kYXRhTGlzdCk7XG4gICAgICB9XG5cbiAgICAgIG1hcERhdGEoX2RhdGFDYWNoZSwgbWFza1BhdHRlcm4pO1xuICAgIH07XG5cbiAgICB2YXIgc2V0dXBQb3NpdGlvblByb2JlUGF0dGVybiA9IGZ1bmN0aW9uKHJvdywgY29sKSB7XG5cbiAgICAgIGZvciAodmFyIHIgPSAtMTsgciA8PSA3OyByICs9IDEpIHtcblxuICAgICAgICBpZiAocm93ICsgciA8PSAtMSB8fCBfbW9kdWxlQ291bnQgPD0gcm93ICsgcikgY29udGludWU7XG5cbiAgICAgICAgZm9yICh2YXIgYyA9IC0xOyBjIDw9IDc7IGMgKz0gMSkge1xuXG4gICAgICAgICAgaWYgKGNvbCArIGMgPD0gLTEgfHwgX21vZHVsZUNvdW50IDw9IGNvbCArIGMpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKCAoMCA8PSByICYmIHIgPD0gNiAmJiAoYyA9PSAwIHx8IGMgPT0gNikgKVxuICAgICAgICAgICAgICB8fCAoMCA8PSBjICYmIGMgPD0gNiAmJiAociA9PSAwIHx8IHIgPT0gNikgKVxuICAgICAgICAgICAgICB8fCAoMiA8PSByICYmIHIgPD0gNCAmJiAyIDw9IGMgJiYgYyA8PSA0KSApIHtcbiAgICAgICAgICAgIF9tb2R1bGVzW3JvdyArIHJdW2NvbCArIGNdID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX21vZHVsZXNbcm93ICsgcl1bY29sICsgY10gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGdldEJlc3RNYXNrUGF0dGVybiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgbWluTG9zdFBvaW50ID0gMDtcbiAgICAgIHZhciBwYXR0ZXJuID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcblxuICAgICAgICBtYWtlSW1wbCh0cnVlLCBpKTtcblxuICAgICAgICB2YXIgbG9zdFBvaW50ID0gUVJVdGlsLmdldExvc3RQb2ludChfdGhpcyk7XG5cbiAgICAgICAgaWYgKGkgPT0gMCB8fCBtaW5Mb3N0UG9pbnQgPiBsb3N0UG9pbnQpIHtcbiAgICAgICAgICBtaW5Mb3N0UG9pbnQgPSBsb3N0UG9pbnQ7XG4gICAgICAgICAgcGF0dGVybiA9IGk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhdHRlcm47XG4gICAgfTtcblxuICAgIHZhciBzZXR1cFRpbWluZ1BhdHRlcm4gPSBmdW5jdGlvbigpIHtcblxuICAgICAgZm9yICh2YXIgciA9IDg7IHIgPCBfbW9kdWxlQ291bnQgLSA4OyByICs9IDEpIHtcbiAgICAgICAgaWYgKF9tb2R1bGVzW3JdWzZdICE9IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBfbW9kdWxlc1tyXVs2XSA9IChyICUgMiA9PSAwKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgYyA9IDg7IGMgPCBfbW9kdWxlQ291bnQgLSA4OyBjICs9IDEpIHtcbiAgICAgICAgaWYgKF9tb2R1bGVzWzZdW2NdICE9IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBfbW9kdWxlc1s2XVtjXSA9IChjICUgMiA9PSAwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHNldHVwUG9zaXRpb25BZGp1c3RQYXR0ZXJuID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBwb3MgPSBRUlV0aWwuZ2V0UGF0dGVyblBvc2l0aW9uKF90eXBlTnVtYmVyKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3MubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBvcy5sZW5ndGg7IGogKz0gMSkge1xuXG4gICAgICAgICAgdmFyIHJvdyA9IHBvc1tpXTtcbiAgICAgICAgICB2YXIgY29sID0gcG9zW2pdO1xuXG4gICAgICAgICAgaWYgKF9tb2R1bGVzW3Jvd11bY29sXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHZhciByID0gLTI7IHIgPD0gMjsgciArPSAxKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAtMjsgYyA8PSAyOyBjICs9IDEpIHtcblxuICAgICAgICAgICAgICBpZiAociA9PSAtMiB8fCByID09IDIgfHwgYyA9PSAtMiB8fCBjID09IDJcbiAgICAgICAgICAgICAgICAgIHx8IChyID09IDAgJiYgYyA9PSAwKSApIHtcbiAgICAgICAgICAgICAgICBfbW9kdWxlc1tyb3cgKyByXVtjb2wgKyBjXSA9IHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX21vZHVsZXNbcm93ICsgcl1bY29sICsgY10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc2V0dXBUeXBlTnVtYmVyID0gZnVuY3Rpb24odGVzdCkge1xuXG4gICAgICB2YXIgYml0cyA9IFFSVXRpbC5nZXRCQ0hUeXBlTnVtYmVyKF90eXBlTnVtYmVyKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxODsgaSArPSAxKSB7XG4gICAgICAgIHZhciBtb2QgPSAoIXRlc3QgJiYgKCAoYml0cyA+PiBpKSAmIDEpID09IDEpO1xuICAgICAgICBfbW9kdWxlc1tNYXRoLmZsb29yKGkgLyAzKV1baSAlIDMgKyBfbW9kdWxlQ291bnQgLSA4IC0gM10gPSBtb2Q7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgbW9kID0gKCF0ZXN0ICYmICggKGJpdHMgPj4gaSkgJiAxKSA9PSAxKTtcbiAgICAgICAgX21vZHVsZXNbaSAlIDMgKyBfbW9kdWxlQ291bnQgLSA4IC0gM11bTWF0aC5mbG9vcihpIC8gMyldID0gbW9kO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc2V0dXBUeXBlSW5mbyA9IGZ1bmN0aW9uKHRlc3QsIG1hc2tQYXR0ZXJuKSB7XG5cbiAgICAgIHZhciBkYXRhID0gKF9lcnJvckNvcnJlY3Rpb25MZXZlbCA8PCAzKSB8IG1hc2tQYXR0ZXJuO1xuICAgICAgdmFyIGJpdHMgPSBRUlV0aWwuZ2V0QkNIVHlwZUluZm8oZGF0YSk7XG5cbiAgICAgIC8vIHZlcnRpY2FsXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE1OyBpICs9IDEpIHtcblxuICAgICAgICB2YXIgbW9kID0gKCF0ZXN0ICYmICggKGJpdHMgPj4gaSkgJiAxKSA9PSAxKTtcblxuICAgICAgICBpZiAoaSA8IDYpIHtcbiAgICAgICAgICBfbW9kdWxlc1tpXVs4XSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgOCkge1xuICAgICAgICAgIF9tb2R1bGVzW2kgKyAxXVs4XSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfbW9kdWxlc1tfbW9kdWxlQ291bnQgLSAxNSArIGldWzhdID0gbW9kO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGhvcml6b250YWxcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTU7IGkgKz0gMSkge1xuXG4gICAgICAgIHZhciBtb2QgPSAoIXRlc3QgJiYgKCAoYml0cyA+PiBpKSAmIDEpID09IDEpO1xuXG4gICAgICAgIGlmIChpIDwgOCkge1xuICAgICAgICAgIF9tb2R1bGVzWzhdW19tb2R1bGVDb3VudCAtIGkgLSAxXSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgOSkge1xuICAgICAgICAgIF9tb2R1bGVzWzhdWzE1IC0gaSAtIDEgKyAxXSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfbW9kdWxlc1s4XVsxNSAtIGkgLSAxXSA9IG1vZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBmaXhlZCBtb2R1bGVcbiAgICAgIF9tb2R1bGVzW19tb2R1bGVDb3VudCAtIDhdWzhdID0gKCF0ZXN0KTtcbiAgICB9O1xuXG4gICAgdmFyIG1hcERhdGEgPSBmdW5jdGlvbihkYXRhLCBtYXNrUGF0dGVybikge1xuXG4gICAgICB2YXIgaW5jID0gLTE7XG4gICAgICB2YXIgcm93ID0gX21vZHVsZUNvdW50IC0gMTtcbiAgICAgIHZhciBiaXRJbmRleCA9IDc7XG4gICAgICB2YXIgYnl0ZUluZGV4ID0gMDtcbiAgICAgIHZhciBtYXNrRnVuYyA9IFFSVXRpbC5nZXRNYXNrRnVuY3Rpb24obWFza1BhdHRlcm4pO1xuXG4gICAgICBmb3IgKHZhciBjb2wgPSBfbW9kdWxlQ291bnQgLSAxOyBjb2wgPiAwOyBjb2wgLT0gMikge1xuXG4gICAgICAgIGlmIChjb2wgPT0gNikgY29sIC09IDE7XG5cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcblxuICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgMjsgYyArPSAxKSB7XG5cbiAgICAgICAgICAgIGlmIChfbW9kdWxlc1tyb3ddW2NvbCAtIGNdID09IG51bGwpIHtcblxuICAgICAgICAgICAgICB2YXIgZGFyayA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgIGlmIChieXRlSW5kZXggPCBkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRhcmsgPSAoICggKGRhdGFbYnl0ZUluZGV4XSA+Pj4gYml0SW5kZXgpICYgMSkgPT0gMSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgbWFzayA9IG1hc2tGdW5jKHJvdywgY29sIC0gYyk7XG5cbiAgICAgICAgICAgICAgaWYgKG1hc2spIHtcbiAgICAgICAgICAgICAgICBkYXJrID0gIWRhcms7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBfbW9kdWxlc1tyb3ddW2NvbCAtIGNdID0gZGFyaztcbiAgICAgICAgICAgICAgYml0SW5kZXggLT0gMTtcblxuICAgICAgICAgICAgICBpZiAoYml0SW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBieXRlSW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICBiaXRJbmRleCA9IDc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByb3cgKz0gaW5jO1xuXG4gICAgICAgICAgaWYgKHJvdyA8IDAgfHwgX21vZHVsZUNvdW50IDw9IHJvdykge1xuICAgICAgICAgICAgcm93IC09IGluYztcbiAgICAgICAgICAgIGluYyA9IC1pbmM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNyZWF0ZUJ5dGVzID0gZnVuY3Rpb24oYnVmZmVyLCByc0Jsb2Nrcykge1xuXG4gICAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgICAgdmFyIG1heERjQ291bnQgPSAwO1xuICAgICAgdmFyIG1heEVjQ291bnQgPSAwO1xuXG4gICAgICB2YXIgZGNkYXRhID0gbmV3IEFycmF5KHJzQmxvY2tzLmxlbmd0aCk7XG4gICAgICB2YXIgZWNkYXRhID0gbmV3IEFycmF5KHJzQmxvY2tzLmxlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgcnNCbG9ja3MubGVuZ3RoOyByICs9IDEpIHtcblxuICAgICAgICB2YXIgZGNDb3VudCA9IHJzQmxvY2tzW3JdLmRhdGFDb3VudDtcbiAgICAgICAgdmFyIGVjQ291bnQgPSByc0Jsb2Nrc1tyXS50b3RhbENvdW50IC0gZGNDb3VudDtcblxuICAgICAgICBtYXhEY0NvdW50ID0gTWF0aC5tYXgobWF4RGNDb3VudCwgZGNDb3VudCk7XG4gICAgICAgIG1heEVjQ291bnQgPSBNYXRoLm1heChtYXhFY0NvdW50LCBlY0NvdW50KTtcblxuICAgICAgICBkY2RhdGFbcl0gPSBuZXcgQXJyYXkoZGNDb3VudCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkY2RhdGFbcl0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBkY2RhdGFbcl1baV0gPSAweGZmICYgYnVmZmVyLmdldEJ1ZmZlcigpW2kgKyBvZmZzZXRdO1xuICAgICAgICB9XG4gICAgICAgIG9mZnNldCArPSBkY0NvdW50O1xuXG4gICAgICAgIHZhciByc1BvbHkgPSBRUlV0aWwuZ2V0RXJyb3JDb3JyZWN0UG9seW5vbWlhbChlY0NvdW50KTtcbiAgICAgICAgdmFyIHJhd1BvbHkgPSBxclBvbHlub21pYWwoZGNkYXRhW3JdLCByc1BvbHkuZ2V0TGVuZ3RoKCkgLSAxKTtcblxuICAgICAgICB2YXIgbW9kUG9seSA9IHJhd1BvbHkubW9kKHJzUG9seSk7XG4gICAgICAgIGVjZGF0YVtyXSA9IG5ldyBBcnJheShyc1BvbHkuZ2V0TGVuZ3RoKCkgLSAxKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlY2RhdGFbcl0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICB2YXIgbW9kSW5kZXggPSBpICsgbW9kUG9seS5nZXRMZW5ndGgoKSAtIGVjZGF0YVtyXS5sZW5ndGg7XG4gICAgICAgICAgZWNkYXRhW3JdW2ldID0gKG1vZEluZGV4ID49IDApPyBtb2RQb2x5LmdldEF0KG1vZEluZGV4KSA6IDA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHRvdGFsQ29kZUNvdW50ID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnNCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdG90YWxDb2RlQ291bnQgKz0gcnNCbG9ja3NbaV0udG90YWxDb3VudDtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGEgPSBuZXcgQXJyYXkodG90YWxDb2RlQ291bnQpO1xuICAgICAgdmFyIGluZGV4ID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhEY0NvdW50OyBpICs9IDEpIHtcbiAgICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCByc0Jsb2Nrcy5sZW5ndGg7IHIgKz0gMSkge1xuICAgICAgICAgIGlmIChpIDwgZGNkYXRhW3JdLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YVtpbmRleF0gPSBkY2RhdGFbcl1baV07XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEVjQ291bnQ7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKHZhciByID0gMDsgciA8IHJzQmxvY2tzLmxlbmd0aDsgciArPSAxKSB7XG4gICAgICAgICAgaWYgKGkgPCBlY2RhdGFbcl0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBkYXRhW2luZGV4XSA9IGVjZGF0YVtyXVtpXTtcbiAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlRGF0YSA9IGZ1bmN0aW9uKHR5cGVOdW1iZXIsIGVycm9yQ29ycmVjdGlvbkxldmVsLCBkYXRhTGlzdCkge1xuXG4gICAgICB2YXIgcnNCbG9ja3MgPSBRUlJTQmxvY2suZ2V0UlNCbG9ja3ModHlwZU51bWJlciwgZXJyb3JDb3JyZWN0aW9uTGV2ZWwpO1xuXG4gICAgICB2YXIgYnVmZmVyID0gcXJCaXRCdWZmZXIoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhTGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgZGF0YSA9IGRhdGFMaXN0W2ldO1xuICAgICAgICBidWZmZXIucHV0KGRhdGEuZ2V0TW9kZSgpLCA0KTtcbiAgICAgICAgYnVmZmVyLnB1dChkYXRhLmdldExlbmd0aCgpLCBRUlV0aWwuZ2V0TGVuZ3RoSW5CaXRzKGRhdGEuZ2V0TW9kZSgpLCB0eXBlTnVtYmVyKSApO1xuICAgICAgICBkYXRhLndyaXRlKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIC8vIGNhbGMgbnVtIG1heCBkYXRhLlxuICAgICAgdmFyIHRvdGFsRGF0YUNvdW50ID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnNCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdG90YWxEYXRhQ291bnQgKz0gcnNCbG9ja3NbaV0uZGF0YUNvdW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoYnVmZmVyLmdldExlbmd0aEluQml0cygpID4gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY29kZSBsZW5ndGggb3ZlcmZsb3cuICgnXG4gICAgICAgICAgKyBidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKClcbiAgICAgICAgICArICc+J1xuICAgICAgICAgICsgdG90YWxEYXRhQ291bnQgKiA4XG4gICAgICAgICAgKyAnKScpO1xuICAgICAgfVxuXG4gICAgICAvLyBlbmQgY29kZVxuICAgICAgaWYgKGJ1ZmZlci5nZXRMZW5ndGhJbkJpdHMoKSArIDQgPD0gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgIGJ1ZmZlci5wdXQoMCwgNCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHBhZGRpbmdcbiAgICAgIHdoaWxlIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgJSA4ICE9IDApIHtcbiAgICAgICAgYnVmZmVyLnB1dEJpdChmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHBhZGRpbmdcbiAgICAgIHdoaWxlICh0cnVlKSB7XG5cbiAgICAgICAgaWYgKGJ1ZmZlci5nZXRMZW5ndGhJbkJpdHMoKSA+PSB0b3RhbERhdGFDb3VudCAqIDgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBidWZmZXIucHV0KFBBRDAsIDgpO1xuXG4gICAgICAgIGlmIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgPj0gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyLnB1dChQQUQxLCA4KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNyZWF0ZUJ5dGVzKGJ1ZmZlciwgcnNCbG9ja3MpO1xuICAgIH07XG5cbiAgICBfdGhpcy5hZGREYXRhID0gZnVuY3Rpb24oZGF0YSwgbW9kZSkge1xuXG4gICAgICBtb2RlID0gbW9kZSB8fCAnQnl0ZSc7XG5cbiAgICAgIHZhciBuZXdEYXRhID0gbnVsbDtcblxuICAgICAgc3dpdGNoKG1vZGUpIHtcbiAgICAgIGNhc2UgJ051bWVyaWMnIDpcbiAgICAgICAgbmV3RGF0YSA9IHFyTnVtYmVyKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0FscGhhbnVtZXJpYycgOlxuICAgICAgICBuZXdEYXRhID0gcXJBbHBoYU51bShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdCeXRlJyA6XG4gICAgICAgIG5ld0RhdGEgPSBxcjhCaXRCeXRlKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0thbmppJyA6XG4gICAgICAgIG5ld0RhdGEgPSBxckthbmppKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQgOlxuICAgICAgICB0aHJvdyAnbW9kZTonICsgbW9kZTtcbiAgICAgIH1cblxuICAgICAgX2RhdGFMaXN0LnB1c2gobmV3RGF0YSk7XG4gICAgICBfZGF0YUNhY2hlID0gbnVsbDtcbiAgICB9O1xuXG4gICAgX3RoaXMuaXNEYXJrID0gZnVuY3Rpb24ocm93LCBjb2wpIHtcbiAgICAgIGlmIChyb3cgPCAwIHx8IF9tb2R1bGVDb3VudCA8PSByb3cgfHwgY29sIDwgMCB8fCBfbW9kdWxlQ291bnQgPD0gY29sKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyb3cgKyAnLCcgKyBjb2wpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9tb2R1bGVzW3Jvd11bY29sXTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TW9kdWxlQ291bnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfbW9kdWxlQ291bnQ7XG4gICAgfTtcblxuICAgIF90aGlzLm1ha2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIG1ha2VJbXBsKGZhbHNlLCBnZXRCZXN0TWFza1BhdHRlcm4oKSApO1xuICAgIH07XG5cbiAgICBfdGhpcy5jcmVhdGVUYWJsZVRhZyA9IGZ1bmN0aW9uKGNlbGxTaXplLCBtYXJnaW4pIHtcblxuICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSB8fCAyO1xuICAgICAgbWFyZ2luID0gKHR5cGVvZiBtYXJnaW4gPT0gJ3VuZGVmaW5lZCcpPyBjZWxsU2l6ZSAqIDQgOiBtYXJnaW47XG5cbiAgICAgIHZhciBxckh0bWwgPSAnJztcblxuICAgICAgcXJIdG1sICs9ICc8dGFibGUgc3R5bGU9XCInO1xuICAgICAgcXJIdG1sICs9ICcgYm9yZGVyLXdpZHRoOiAwcHg7IGJvcmRlci1zdHlsZTogbm9uZTsnO1xuICAgICAgcXJIdG1sICs9ICcgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsnO1xuICAgICAgcXJIdG1sICs9ICcgcGFkZGluZzogMHB4OyBtYXJnaW46ICcgKyBtYXJnaW4gKyAncHg7JztcbiAgICAgIHFySHRtbCArPSAnXCI+JztcbiAgICAgIHFySHRtbCArPSAnPHRib2R5Pic7XG5cbiAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgX3RoaXMuZ2V0TW9kdWxlQ291bnQoKTsgciArPSAxKSB7XG5cbiAgICAgICAgcXJIdG1sICs9ICc8dHI+JztcblxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IF90aGlzLmdldE1vZHVsZUNvdW50KCk7IGMgKz0gMSkge1xuICAgICAgICAgIHFySHRtbCArPSAnPHRkIHN0eWxlPVwiJztcbiAgICAgICAgICBxckh0bWwgKz0gJyBib3JkZXItd2lkdGg6IDBweDsgYm9yZGVyLXN0eWxlOiBub25lOyc7XG4gICAgICAgICAgcXJIdG1sICs9ICcgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsnO1xuICAgICAgICAgIHFySHRtbCArPSAnIHBhZGRpbmc6IDBweDsgbWFyZ2luOiAwcHg7JztcbiAgICAgICAgICBxckh0bWwgKz0gJyB3aWR0aDogJyArIGNlbGxTaXplICsgJ3B4Oyc7XG4gICAgICAgICAgcXJIdG1sICs9ICcgaGVpZ2h0OiAnICsgY2VsbFNpemUgKyAncHg7JztcbiAgICAgICAgICBxckh0bWwgKz0gJyBiYWNrZ3JvdW5kLWNvbG9yOiAnO1xuICAgICAgICAgIHFySHRtbCArPSBfdGhpcy5pc0RhcmsociwgYyk/ICcjMDAwMDAwJyA6ICcjZmZmZmZmJztcbiAgICAgICAgICBxckh0bWwgKz0gJzsnO1xuICAgICAgICAgIHFySHRtbCArPSAnXCIvPic7XG4gICAgICAgIH1cblxuICAgICAgICBxckh0bWwgKz0gJzwvdHI+JztcbiAgICAgIH1cblxuICAgICAgcXJIdG1sICs9ICc8L3Rib2R5Pic7XG4gICAgICBxckh0bWwgKz0gJzwvdGFibGU+JztcblxuICAgICAgcmV0dXJuIHFySHRtbDtcbiAgICB9O1xuXG4gICAgX3RoaXMuY3JlYXRlU3ZnVGFnID0gZnVuY3Rpb24oY2VsbFNpemUsIG1hcmdpbikge1xuXG4gICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplIHx8IDI7XG4gICAgICBtYXJnaW4gPSAodHlwZW9mIG1hcmdpbiA9PSAndW5kZWZpbmVkJyk/IGNlbGxTaXplICogNCA6IG1hcmdpbjtcbiAgICAgIHZhciBzaXplID0gX3RoaXMuZ2V0TW9kdWxlQ291bnQoKSAqIGNlbGxTaXplICsgbWFyZ2luICogMjtcbiAgICAgIHZhciBjLCBtYywgciwgbXIsIHFyU3ZnPScnLCByZWN0O1xuXG4gICAgICByZWN0ID0gJ2wnICsgY2VsbFNpemUgKyAnLDAgMCwnICsgY2VsbFNpemUgK1xuICAgICAgICAnIC0nICsgY2VsbFNpemUgKyAnLDAgMCwtJyArIGNlbGxTaXplICsgJ3ogJztcblxuICAgICAgcXJTdmcgKz0gJzxzdmcnO1xuICAgICAgcXJTdmcgKz0gJyB3aWR0aD1cIicgKyBzaXplICsgJ3B4XCInO1xuICAgICAgcXJTdmcgKz0gJyBoZWlnaHQ9XCInICsgc2l6ZSArICdweFwiJztcbiAgICAgIHFyU3ZnICs9ICcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiJztcbiAgICAgIHFyU3ZnICs9ICc+JztcbiAgICAgIHFyU3ZnICs9ICc8cGF0aCBkPVwiJztcblxuICAgICAgZm9yIChyID0gMDsgciA8IF90aGlzLmdldE1vZHVsZUNvdW50KCk7IHIgKz0gMSkge1xuICAgICAgICBtciA9IHIgKiBjZWxsU2l6ZSArIG1hcmdpbjtcbiAgICAgICAgZm9yIChjID0gMDsgYyA8IF90aGlzLmdldE1vZHVsZUNvdW50KCk7IGMgKz0gMSkge1xuICAgICAgICAgIGlmIChfdGhpcy5pc0RhcmsociwgYykgKSB7XG4gICAgICAgICAgICBtYyA9IGMqY2VsbFNpemUrbWFyZ2luO1xuICAgICAgICAgICAgcXJTdmcgKz0gJ00nICsgbWMgKyAnLCcgKyBtciArIHJlY3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHFyU3ZnICs9ICdcIiBzdHJva2U9XCJ0cmFuc3BhcmVudFwiIGZpbGw9XCJibGFja1wiLz4nO1xuICAgICAgcXJTdmcgKz0gJzwvc3ZnPic7XG5cbiAgICAgIHJldHVybiBxclN2ZztcbiAgICB9O1xuXG4gICAgX3RoaXMuY3JlYXRlSW1nVGFnID0gZnVuY3Rpb24oY2VsbFNpemUsIG1hcmdpbikge1xuXG4gICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplIHx8IDI7XG4gICAgICBtYXJnaW4gPSAodHlwZW9mIG1hcmdpbiA9PSAndW5kZWZpbmVkJyk/IGNlbGxTaXplICogNCA6IG1hcmdpbjtcblxuICAgICAgdmFyIHNpemUgPSBfdGhpcy5nZXRNb2R1bGVDb3VudCgpICogY2VsbFNpemUgKyBtYXJnaW4gKiAyO1xuICAgICAgdmFyIG1pbiA9IG1hcmdpbjtcbiAgICAgIHZhciBtYXggPSBzaXplIC0gbWFyZ2luO1xuXG4gICAgICByZXR1cm4gY3JlYXRlSW1nVGFnKHNpemUsIHNpemUsIGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgaWYgKG1pbiA8PSB4ICYmIHggPCBtYXggJiYgbWluIDw9IHkgJiYgeSA8IG1heCkge1xuICAgICAgICAgIHZhciBjID0gTWF0aC5mbG9vciggKHggLSBtaW4pIC8gY2VsbFNpemUpO1xuICAgICAgICAgIHZhciByID0gTWF0aC5mbG9vciggKHkgLSBtaW4pIC8gY2VsbFNpemUpO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5pc0RhcmsociwgYyk/IDAgOiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICB9ICk7XG4gICAgfTtcblxuICAgIF90aGlzLmNyZWF0ZUltZ09iamVjdCA9IGZ1bmN0aW9uKGNlbGxTaXplLCBtYXJnaW4pIHtcblxuICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSB8fCAyO1xuICAgICAgbWFyZ2luID0gKHR5cGVvZiBtYXJnaW4gPT0gJ3VuZGVmaW5lZCcpPyBjZWxsU2l6ZSAqIDQgOiBtYXJnaW47XG5cbiAgICAgIHZhciBzaXplID0gX3RoaXMuZ2V0TW9kdWxlQ291bnQoKSAqIGNlbGxTaXplICsgbWFyZ2luICogMjtcbiAgICAgIHZhciBtaW4gPSBtYXJnaW47XG4gICAgICB2YXIgbWF4ID0gc2l6ZSAtIG1hcmdpbjtcblxuICAgICAgcmV0dXJuIGNyZWF0ZUltZ09iamVjdChzaXplLCBzaXplLCBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIGlmIChtaW4gPD0geCAmJiB4IDwgbWF4ICYmIG1pbiA8PSB5ICYmIHkgPCBtYXgpIHtcbiAgICAgICAgICB2YXIgYyA9IE1hdGguZmxvb3IoICh4IC0gbWluKSAvIGNlbGxTaXplKTtcbiAgICAgICAgICB2YXIgciA9IE1hdGguZmxvb3IoICh5IC0gbWluKSAvIGNlbGxTaXplKTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuaXNEYXJrKHIsIGMpPyAwIDogMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgfSApO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJjb2RlLnN0cmluZ1RvQnl0ZXNcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBxcmNvZGUuc3RyaW5nVG9CeXRlcyA9IGZ1bmN0aW9uKHMpIHtcbiAgICB2YXIgYnl0ZXMgPSBuZXcgQXJyYXkoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIHZhciBjID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgYnl0ZXMucHVzaChjICYgMHhmZik7XG4gICAgfVxuICAgIHJldHVybiBieXRlcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxcmNvZGUuY3JlYXRlU3RyaW5nVG9CeXRlc1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gdW5pY29kZURhdGEgYmFzZTY0IHN0cmluZyBvZiBieXRlIGFycmF5LlxuICAgKiBbMTZiaXQgVW5pY29kZV0sWzE2Yml0IEJ5dGVzXSwgLi4uXG4gICAqIEBwYXJhbSBudW1DaGFyc1xuICAgKi9cbiAgcXJjb2RlLmNyZWF0ZVN0cmluZ1RvQnl0ZXMgPSBmdW5jdGlvbih1bmljb2RlRGF0YSwgbnVtQ2hhcnMpIHtcblxuICAgIC8vIGNyZWF0ZSBjb252ZXJzaW9uIG1hcC5cblxuICAgIHZhciB1bmljb2RlTWFwID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBiaW4gPSBiYXNlNjREZWNvZGVJbnB1dFN0cmVhbSh1bmljb2RlRGF0YSk7XG4gICAgICB2YXIgcmVhZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYiA9IGJpbi5yZWFkKCk7XG4gICAgICAgIGlmIChiID09IC0xKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgcmV0dXJuIGI7XG4gICAgICB9O1xuXG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgdmFyIHVuaWNvZGVNYXAgPSB7fTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBiMCA9IGJpbi5yZWFkKCk7XG4gICAgICAgIGlmIChiMCA9PSAtMSkgYnJlYWs7XG4gICAgICAgIHZhciBiMSA9IHJlYWQoKTtcbiAgICAgICAgdmFyIGIyID0gcmVhZCgpO1xuICAgICAgICB2YXIgYjMgPSByZWFkKCk7XG4gICAgICAgIHZhciBrID0gU3RyaW5nLmZyb21DaGFyQ29kZSggKGIwIDw8IDgpIHwgYjEpO1xuICAgICAgICB2YXIgdiA9IChiMiA8PCA4KSB8IGIzO1xuICAgICAgICB1bmljb2RlTWFwW2tdID0gdjtcbiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgIH1cbiAgICAgIGlmIChjb3VudCAhPSBudW1DaGFycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoY291bnQgKyAnICE9ICcgKyBudW1DaGFycyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB1bmljb2RlTWFwO1xuICAgIH0oKTtcblxuICAgIHZhciB1bmtub3duQ2hhciA9ICc/Jy5jaGFyQ29kZUF0KDApO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhciBieXRlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHZhciBjID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoYyA8IDEyOCkge1xuICAgICAgICAgIGJ5dGVzLnB1c2goYyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGIgPSB1bmljb2RlTWFwW3MuY2hhckF0KGkpXTtcbiAgICAgICAgICBpZiAodHlwZW9mIGIgPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmICggKGIgJiAweGZmKSA9PSBiKSB7XG4gICAgICAgICAgICAgIC8vIDFieXRlXG4gICAgICAgICAgICAgIGJ5dGVzLnB1c2goYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyAyYnl0ZXNcbiAgICAgICAgICAgICAgYnl0ZXMucHVzaChiID4+PiA4KTtcbiAgICAgICAgICAgICAgYnl0ZXMucHVzaChiICYgMHhmZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ5dGVzLnB1c2godW5rbm93bkNoYXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH07XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJNb2RlXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIFFSTW9kZSA9IHtcbiAgICBNT0RFX05VTUJFUiA6ICAgIDEgPDwgMCxcbiAgICBNT0RFX0FMUEhBX05VTSA6IDEgPDwgMSxcbiAgICBNT0RFXzhCSVRfQllURSA6IDEgPDwgMixcbiAgICBNT0RFX0tBTkpJIDogICAgIDEgPDwgM1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgUVJFcnJvckNvcnJlY3Rpb25MZXZlbCA9IHtcbiAgICBMIDogMSxcbiAgICBNIDogMCxcbiAgICBRIDogMyxcbiAgICBIIDogMlxuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSTWFza1BhdHRlcm5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgUVJNYXNrUGF0dGVybiA9IHtcbiAgICBQQVRURVJOMDAwIDogMCxcbiAgICBQQVRURVJOMDAxIDogMSxcbiAgICBQQVRURVJOMDEwIDogMixcbiAgICBQQVRURVJOMDExIDogMyxcbiAgICBQQVRURVJOMTAwIDogNCxcbiAgICBQQVRURVJOMTAxIDogNSxcbiAgICBQQVRURVJOMTEwIDogNixcbiAgICBQQVRURVJOMTExIDogN1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSVXRpbFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBRUlV0aWwgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBQQVRURVJOX1BPU0lUSU9OX1RBQkxFID0gW1xuICAgICAgW10sXG4gICAgICBbNiwgMThdLFxuICAgICAgWzYsIDIyXSxcbiAgICAgIFs2LCAyNl0sXG4gICAgICBbNiwgMzBdLFxuICAgICAgWzYsIDM0XSxcbiAgICAgIFs2LCAyMiwgMzhdLFxuICAgICAgWzYsIDI0LCA0Ml0sXG4gICAgICBbNiwgMjYsIDQ2XSxcbiAgICAgIFs2LCAyOCwgNTBdLFxuICAgICAgWzYsIDMwLCA1NF0sXG4gICAgICBbNiwgMzIsIDU4XSxcbiAgICAgIFs2LCAzNCwgNjJdLFxuICAgICAgWzYsIDI2LCA0NiwgNjZdLFxuICAgICAgWzYsIDI2LCA0OCwgNzBdLFxuICAgICAgWzYsIDI2LCA1MCwgNzRdLFxuICAgICAgWzYsIDMwLCA1NCwgNzhdLFxuICAgICAgWzYsIDMwLCA1NiwgODJdLFxuICAgICAgWzYsIDMwLCA1OCwgODZdLFxuICAgICAgWzYsIDM0LCA2MiwgOTBdLFxuICAgICAgWzYsIDI4LCA1MCwgNzIsIDk0XSxcbiAgICAgIFs2LCAyNiwgNTAsIDc0LCA5OF0sXG4gICAgICBbNiwgMzAsIDU0LCA3OCwgMTAyXSxcbiAgICAgIFs2LCAyOCwgNTQsIDgwLCAxMDZdLFxuICAgICAgWzYsIDMyLCA1OCwgODQsIDExMF0sXG4gICAgICBbNiwgMzAsIDU4LCA4NiwgMTE0XSxcbiAgICAgIFs2LCAzNCwgNjIsIDkwLCAxMThdLFxuICAgICAgWzYsIDI2LCA1MCwgNzQsIDk4LCAxMjJdLFxuICAgICAgWzYsIDMwLCA1NCwgNzgsIDEwMiwgMTI2XSxcbiAgICAgIFs2LCAyNiwgNTIsIDc4LCAxMDQsIDEzMF0sXG4gICAgICBbNiwgMzAsIDU2LCA4MiwgMTA4LCAxMzRdLFxuICAgICAgWzYsIDM0LCA2MCwgODYsIDExMiwgMTM4XSxcbiAgICAgIFs2LCAzMCwgNTgsIDg2LCAxMTQsIDE0Ml0sXG4gICAgICBbNiwgMzQsIDYyLCA5MCwgMTE4LCAxNDZdLFxuICAgICAgWzYsIDMwLCA1NCwgNzgsIDEwMiwgMTI2LCAxNTBdLFxuICAgICAgWzYsIDI0LCA1MCwgNzYsIDEwMiwgMTI4LCAxNTRdLFxuICAgICAgWzYsIDI4LCA1NCwgODAsIDEwNiwgMTMyLCAxNThdLFxuICAgICAgWzYsIDMyLCA1OCwgODQsIDExMCwgMTM2LCAxNjJdLFxuICAgICAgWzYsIDI2LCA1NCwgODIsIDExMCwgMTM4LCAxNjZdLFxuICAgICAgWzYsIDMwLCA1OCwgODYsIDExNCwgMTQyLCAxNzBdXG4gICAgXTtcbiAgICB2YXIgRzE1ID0gKDEgPDwgMTApIHwgKDEgPDwgOCkgfCAoMSA8PCA1KSB8ICgxIDw8IDQpIHwgKDEgPDwgMikgfCAoMSA8PCAxKSB8ICgxIDw8IDApO1xuICAgIHZhciBHMTggPSAoMSA8PCAxMikgfCAoMSA8PCAxMSkgfCAoMSA8PCAxMCkgfCAoMSA8PCA5KSB8ICgxIDw8IDgpIHwgKDEgPDwgNSkgfCAoMSA8PCAyKSB8ICgxIDw8IDApO1xuICAgIHZhciBHMTVfTUFTSyA9ICgxIDw8IDE0KSB8ICgxIDw8IDEyKSB8ICgxIDw8IDEwKSB8ICgxIDw8IDQpIHwgKDEgPDwgMSk7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIHZhciBnZXRCQ0hEaWdpdCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBkaWdpdCA9IDA7XG4gICAgICB3aGlsZSAoZGF0YSAhPSAwKSB7XG4gICAgICAgIGRpZ2l0ICs9IDE7XG4gICAgICAgIGRhdGEgPj4+PSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRpZ2l0O1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRCQ0hUeXBlSW5mbyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBkID0gZGF0YSA8PCAxMDtcbiAgICAgIHdoaWxlIChnZXRCQ0hEaWdpdChkKSAtIGdldEJDSERpZ2l0KEcxNSkgPj0gMCkge1xuICAgICAgICBkIF49IChHMTUgPDwgKGdldEJDSERpZ2l0KGQpIC0gZ2V0QkNIRGlnaXQoRzE1KSApICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKCAoZGF0YSA8PCAxMCkgfCBkKSBeIEcxNV9NQVNLO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRCQ0hUeXBlTnVtYmVyID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIGQgPSBkYXRhIDw8IDEyO1xuICAgICAgd2hpbGUgKGdldEJDSERpZ2l0KGQpIC0gZ2V0QkNIRGlnaXQoRzE4KSA+PSAwKSB7XG4gICAgICAgIGQgXj0gKEcxOCA8PCAoZ2V0QkNIRGlnaXQoZCkgLSBnZXRCQ0hEaWdpdChHMTgpICkgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoZGF0YSA8PCAxMikgfCBkO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRQYXR0ZXJuUG9zaXRpb24gPSBmdW5jdGlvbih0eXBlTnVtYmVyKSB7XG4gICAgICByZXR1cm4gUEFUVEVSTl9QT1NJVElPTl9UQUJMRVt0eXBlTnVtYmVyIC0gMV07XG4gICAgfTtcblxuICAgIF90aGlzLmdldE1hc2tGdW5jdGlvbiA9IGZ1bmN0aW9uKG1hc2tQYXR0ZXJuKSB7XG5cbiAgICAgIHN3aXRjaCAobWFza1BhdHRlcm4pIHtcblxuICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4wMDAgOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaSwgaikgeyByZXR1cm4gKGkgKyBqKSAlIDIgPT0gMDsgfTtcbiAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMDAxIDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGksIGopIHsgcmV0dXJuIGkgJSAyID09IDA7IH07XG4gICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjAxMCA6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpLCBqKSB7IHJldHVybiBqICUgMyA9PSAwOyB9O1xuICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4wMTEgOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaSwgaikgeyByZXR1cm4gKGkgKyBqKSAlIDMgPT0gMDsgfTtcbiAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMTAwIDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGksIGopIHsgcmV0dXJuIChNYXRoLmZsb29yKGkgLyAyKSArIE1hdGguZmxvb3IoaiAvIDMpICkgJSAyID09IDA7IH07XG4gICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjEwMSA6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpLCBqKSB7IHJldHVybiAoaSAqIGopICUgMiArIChpICogaikgJSAzID09IDA7IH07XG4gICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjExMCA6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpLCBqKSB7IHJldHVybiAoIChpICogaikgJSAyICsgKGkgKiBqKSAlIDMpICUgMiA9PSAwOyB9O1xuICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4xMTEgOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaSwgaikgeyByZXR1cm4gKCAoaSAqIGopICUgMyArIChpICsgaikgJSAyKSAlIDIgPT0gMDsgfTtcblxuICAgICAgZGVmYXVsdCA6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYmFkIG1hc2tQYXR0ZXJuOicgKyBtYXNrUGF0dGVybik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLmdldEVycm9yQ29ycmVjdFBvbHlub21pYWwgPSBmdW5jdGlvbihlcnJvckNvcnJlY3RMZW5ndGgpIHtcbiAgICAgIHZhciBhID0gcXJQb2x5bm9taWFsKFsxXSwgMCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9yQ29ycmVjdExlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGEgPSBhLm11bHRpcGx5KHFyUG9seW5vbWlhbChbMSwgUVJNYXRoLmdleHAoaSldLCAwKSApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGE7XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aEluQml0cyA9IGZ1bmN0aW9uKG1vZGUsIHR5cGUpIHtcblxuICAgICAgaWYgKDEgPD0gdHlwZSAmJiB0eXBlIDwgMTApIHtcblxuICAgICAgICAvLyAxIC0gOVxuXG4gICAgICAgIHN3aXRjaChtb2RlKSB7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfTlVNQkVSICAgIDogcmV0dXJuIDEwO1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTSA6IHJldHVybiA5O1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFXzhCSVRfQllURSA6IHJldHVybiA4O1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0tBTkpJICAgICA6IHJldHVybiA4O1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21vZGU6JyArIG1vZGUpO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA8IDI3KSB7XG5cbiAgICAgICAgLy8gMTAgLSAyNlxuXG4gICAgICAgIHN3aXRjaChtb2RlKSB7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfTlVNQkVSICAgIDogcmV0dXJuIDEyO1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTSA6IHJldHVybiAxMTtcbiAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV84QklUX0JZVEUgOiByZXR1cm4gMTY7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfS0FOSkkgICAgIDogcmV0dXJuIDEwO1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21vZGU6JyArIG1vZGUpO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA8IDQxKSB7XG5cbiAgICAgICAgLy8gMjcgLSA0MFxuXG4gICAgICAgIHN3aXRjaChtb2RlKSB7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfTlVNQkVSICAgIDogcmV0dXJuIDE0O1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTSA6IHJldHVybiAxMztcbiAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV84QklUX0JZVEUgOiByZXR1cm4gMTY7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfS0FOSkkgICAgIDogcmV0dXJuIDEyO1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21vZGU6JyArIG1vZGUpO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndHlwZTonICsgdHlwZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLmdldExvc3RQb2ludCA9IGZ1bmN0aW9uKHFyY29kZSkge1xuXG4gICAgICB2YXIgbW9kdWxlQ291bnQgPSBxcmNvZGUuZ2V0TW9kdWxlQ291bnQoKTtcblxuICAgICAgdmFyIGxvc3RQb2ludCA9IDA7XG5cbiAgICAgIC8vIExFVkVMMVxuXG4gICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudDsgcm93ICs9IDEpIHtcbiAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbW9kdWxlQ291bnQ7IGNvbCArPSAxKSB7XG5cbiAgICAgICAgICB2YXIgc2FtZUNvdW50ID0gMDtcbiAgICAgICAgICB2YXIgZGFyayA9IHFyY29kZS5pc0Rhcmsocm93LCBjb2wpO1xuXG4gICAgICAgICAgZm9yICh2YXIgciA9IC0xOyByIDw9IDE7IHIgKz0gMSkge1xuXG4gICAgICAgICAgICBpZiAocm93ICsgciA8IDAgfHwgbW9kdWxlQ291bnQgPD0gcm93ICsgcikge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgYyA9IC0xOyBjIDw9IDE7IGMgKz0gMSkge1xuXG4gICAgICAgICAgICAgIGlmIChjb2wgKyBjIDwgMCB8fCBtb2R1bGVDb3VudCA8PSBjb2wgKyBjKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAociA9PSAwICYmIGMgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGRhcmsgPT0gcXJjb2RlLmlzRGFyayhyb3cgKyByLCBjb2wgKyBjKSApIHtcbiAgICAgICAgICAgICAgICBzYW1lQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzYW1lQ291bnQgPiA1KSB7XG4gICAgICAgICAgICBsb3N0UG9pbnQgKz0gKDMgKyBzYW1lQ291bnQgLSA1KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIExFVkVMMlxuXG4gICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudCAtIDE7IHJvdyArPSAxKSB7XG4gICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50IC0gMTsgY29sICs9IDEpIHtcbiAgICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICAgIGlmIChxcmNvZGUuaXNEYXJrKHJvdywgY29sKSApIGNvdW50ICs9IDE7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93ICsgMSwgY29sKSApIGNvdW50ICs9IDE7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93LCBjb2wgKyAxKSApIGNvdW50ICs9IDE7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93ICsgMSwgY29sICsgMSkgKSBjb3VudCArPSAxO1xuICAgICAgICAgIGlmIChjb3VudCA9PSAwIHx8IGNvdW50ID09IDQpIHtcbiAgICAgICAgICAgIGxvc3RQb2ludCArPSAzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBMRVZFTDNcblxuICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50IC0gNjsgY29sICs9IDEpIHtcbiAgICAgICAgICBpZiAocXJjb2RlLmlzRGFyayhyb3csIGNvbClcbiAgICAgICAgICAgICAgJiYgIXFyY29kZS5pc0Rhcmsocm93LCBjb2wgKyAxKVxuICAgICAgICAgICAgICAmJiAgcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDIpXG4gICAgICAgICAgICAgICYmICBxcmNvZGUuaXNEYXJrKHJvdywgY29sICsgMylcbiAgICAgICAgICAgICAgJiYgIHFyY29kZS5pc0Rhcmsocm93LCBjb2wgKyA0KVxuICAgICAgICAgICAgICAmJiAhcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDUpXG4gICAgICAgICAgICAgICYmICBxcmNvZGUuaXNEYXJrKHJvdywgY29sICsgNikgKSB7XG4gICAgICAgICAgICBsb3N0UG9pbnQgKz0gNDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50OyBjb2wgKz0gMSkge1xuICAgICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudCAtIDY7IHJvdyArPSAxKSB7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93LCBjb2wpXG4gICAgICAgICAgICAgICYmICFxcmNvZGUuaXNEYXJrKHJvdyArIDEsIGNvbClcbiAgICAgICAgICAgICAgJiYgIHFyY29kZS5pc0Rhcmsocm93ICsgMiwgY29sKVxuICAgICAgICAgICAgICAmJiAgcXJjb2RlLmlzRGFyayhyb3cgKyAzLCBjb2wpXG4gICAgICAgICAgICAgICYmICBxcmNvZGUuaXNEYXJrKHJvdyArIDQsIGNvbClcbiAgICAgICAgICAgICAgJiYgIXFyY29kZS5pc0Rhcmsocm93ICsgNSwgY29sKVxuICAgICAgICAgICAgICAmJiAgcXJjb2RlLmlzRGFyayhyb3cgKyA2LCBjb2wpICkge1xuICAgICAgICAgICAgbG9zdFBvaW50ICs9IDQwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBMRVZFTDRcblxuICAgICAgdmFyIGRhcmtDb3VudCA9IDA7XG5cbiAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50OyBjb2wgKz0gMSkge1xuICAgICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudDsgcm93ICs9IDEpIHtcbiAgICAgICAgICBpZiAocXJjb2RlLmlzRGFyayhyb3csIGNvbCkgKSB7XG4gICAgICAgICAgICBkYXJrQ291bnQgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHJhdGlvID0gTWF0aC5hYnMoMTAwICogZGFya0NvdW50IC8gbW9kdWxlQ291bnQgLyBtb2R1bGVDb3VudCAtIDUwKSAvIDU7XG4gICAgICBsb3N0UG9pbnQgKz0gcmF0aW8gKiAxMDtcblxuICAgICAgcmV0dXJuIGxvc3RQb2ludDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9KCk7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJNYXRoXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIFFSTWF0aCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIEVYUF9UQUJMRSA9IG5ldyBBcnJheSgyNTYpO1xuICAgIHZhciBMT0dfVEFCTEUgPSBuZXcgQXJyYXkoMjU2KTtcblxuICAgIC8vIGluaXRpYWxpemUgdGFibGVzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcbiAgICAgIEVYUF9UQUJMRVtpXSA9IDEgPDwgaTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDg7IGkgPCAyNTY7IGkgKz0gMSkge1xuICAgICAgRVhQX1RBQkxFW2ldID0gRVhQX1RBQkxFW2kgLSA0XVxuICAgICAgICBeIEVYUF9UQUJMRVtpIC0gNV1cbiAgICAgICAgXiBFWFBfVEFCTEVbaSAtIDZdXG4gICAgICAgIF4gRVhQX1RBQkxFW2kgLSA4XTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTU7IGkgKz0gMSkge1xuICAgICAgTE9HX1RBQkxFW0VYUF9UQUJMRVtpXSBdID0gaTtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLmdsb2cgPSBmdW5jdGlvbihuKSB7XG5cbiAgICAgIGlmIChuIDwgMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dsb2coJyArIG4gKyAnKScpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gTE9HX1RBQkxFW25dO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXhwID0gZnVuY3Rpb24obikge1xuXG4gICAgICB3aGlsZSAobiA8IDApIHtcbiAgICAgICAgbiArPSAyNTU7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChuID49IDI1Nikge1xuICAgICAgICBuIC09IDI1NTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIEVYUF9UQUJMRVtuXTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9KCk7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJQb2x5bm9taWFsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZnVuY3Rpb24gcXJQb2x5bm9taWFsKG51bSwgc2hpZnQpIHtcblxuICAgIGlmICh0eXBlb2YgbnVtLmxlbmd0aCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG51bS5sZW5ndGggKyAnLycgKyBzaGlmdCk7XG4gICAgfVxuXG4gICAgdmFyIF9udW0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvZmZzZXQgPSAwO1xuICAgICAgd2hpbGUgKG9mZnNldCA8IG51bS5sZW5ndGggJiYgbnVtW29mZnNldF0gPT0gMCkge1xuICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICAgIH1cbiAgICAgIHZhciBfbnVtID0gbmV3IEFycmF5KG51bS5sZW5ndGggLSBvZmZzZXQgKyBzaGlmdCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bS5sZW5ndGggLSBvZmZzZXQ7IGkgKz0gMSkge1xuICAgICAgICBfbnVtW2ldID0gbnVtW2kgKyBvZmZzZXRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9udW07XG4gICAgfSgpO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICBfdGhpcy5nZXRBdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICByZXR1cm4gX251bVtpbmRleF07XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9udW0ubGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy5tdWx0aXBseSA9IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgdmFyIG51bSA9IG5ldyBBcnJheShfdGhpcy5nZXRMZW5ndGgoKSArIGUuZ2V0TGVuZ3RoKCkgLSAxKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGhpcy5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZS5nZXRMZW5ndGgoKTsgaiArPSAxKSB7XG4gICAgICAgICAgbnVtW2kgKyBqXSBePSBRUk1hdGguZ2V4cChRUk1hdGguZ2xvZyhfdGhpcy5nZXRBdChpKSApICsgUVJNYXRoLmdsb2coZS5nZXRBdChqKSApICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHFyUG9seW5vbWlhbChudW0sIDApO1xuICAgIH07XG5cbiAgICBfdGhpcy5tb2QgPSBmdW5jdGlvbihlKSB7XG5cbiAgICAgIGlmIChfdGhpcy5nZXRMZW5ndGgoKSAtIGUuZ2V0TGVuZ3RoKCkgPCAwKSB7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIHJhdGlvID0gUVJNYXRoLmdsb2coX3RoaXMuZ2V0QXQoMCkgKSAtIFFSTWF0aC5nbG9nKGUuZ2V0QXQoMCkgKTtcblxuICAgICAgdmFyIG51bSA9IG5ldyBBcnJheShfdGhpcy5nZXRMZW5ndGgoKSApO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGhpcy5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIG51bVtpXSA9IF90aGlzLmdldEF0KGkpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBudW1baV0gXj0gUVJNYXRoLmdleHAoUVJNYXRoLmdsb2coZS5nZXRBdChpKSApICsgcmF0aW8pO1xuICAgICAgfVxuXG4gICAgICAvLyByZWN1cnNpdmUgY2FsbFxuICAgICAgcmV0dXJuIHFyUG9seW5vbWlhbChudW0sIDApLm1vZChlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSUlNCbG9ja1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBRUlJTQmxvY2sgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBSU19CTE9DS19UQUJMRSA9IFtcblxuICAgICAgLy8gTFxuICAgICAgLy8gTVxuICAgICAgLy8gUVxuICAgICAgLy8gSFxuXG4gICAgICAvLyAxXG4gICAgICBbMSwgMjYsIDE5XSxcbiAgICAgIFsxLCAyNiwgMTZdLFxuICAgICAgWzEsIDI2LCAxM10sXG4gICAgICBbMSwgMjYsIDldLFxuXG4gICAgICAvLyAyXG4gICAgICBbMSwgNDQsIDM0XSxcbiAgICAgIFsxLCA0NCwgMjhdLFxuICAgICAgWzEsIDQ0LCAyMl0sXG4gICAgICBbMSwgNDQsIDE2XSxcblxuICAgICAgLy8gM1xuICAgICAgWzEsIDcwLCA1NV0sXG4gICAgICBbMSwgNzAsIDQ0XSxcbiAgICAgIFsyLCAzNSwgMTddLFxuICAgICAgWzIsIDM1LCAxM10sXG5cbiAgICAgIC8vIDRcbiAgICAgIFsxLCAxMDAsIDgwXSxcbiAgICAgIFsyLCA1MCwgMzJdLFxuICAgICAgWzIsIDUwLCAyNF0sXG4gICAgICBbNCwgMjUsIDldLFxuXG4gICAgICAvLyA1XG4gICAgICBbMSwgMTM0LCAxMDhdLFxuICAgICAgWzIsIDY3LCA0M10sXG4gICAgICBbMiwgMzMsIDE1LCAyLCAzNCwgMTZdLFxuICAgICAgWzIsIDMzLCAxMSwgMiwgMzQsIDEyXSxcblxuICAgICAgLy8gNlxuICAgICAgWzIsIDg2LCA2OF0sXG4gICAgICBbNCwgNDMsIDI3XSxcbiAgICAgIFs0LCA0MywgMTldLFxuICAgICAgWzQsIDQzLCAxNV0sXG5cbiAgICAgIC8vIDdcbiAgICAgIFsyLCA5OCwgNzhdLFxuICAgICAgWzQsIDQ5LCAzMV0sXG4gICAgICBbMiwgMzIsIDE0LCA0LCAzMywgMTVdLFxuICAgICAgWzQsIDM5LCAxMywgMSwgNDAsIDE0XSxcblxuICAgICAgLy8gOFxuICAgICAgWzIsIDEyMSwgOTddLFxuICAgICAgWzIsIDYwLCAzOCwgMiwgNjEsIDM5XSxcbiAgICAgIFs0LCA0MCwgMTgsIDIsIDQxLCAxOV0sXG4gICAgICBbNCwgNDAsIDE0LCAyLCA0MSwgMTVdLFxuXG4gICAgICAvLyA5XG4gICAgICBbMiwgMTQ2LCAxMTZdLFxuICAgICAgWzMsIDU4LCAzNiwgMiwgNTksIDM3XSxcbiAgICAgIFs0LCAzNiwgMTYsIDQsIDM3LCAxN10sXG4gICAgICBbNCwgMzYsIDEyLCA0LCAzNywgMTNdLFxuXG4gICAgICAvLyAxMFxuICAgICAgWzIsIDg2LCA2OCwgMiwgODcsIDY5XSxcbiAgICAgIFs0LCA2OSwgNDMsIDEsIDcwLCA0NF0sXG4gICAgICBbNiwgNDMsIDE5LCAyLCA0NCwgMjBdLFxuICAgICAgWzYsIDQzLCAxNSwgMiwgNDQsIDE2XSxcblxuICAgICAgLy8gMTFcbiAgICAgIFs0LCAxMDEsIDgxXSxcbiAgICAgIFsxLCA4MCwgNTAsIDQsIDgxLCA1MV0sXG4gICAgICBbNCwgNTAsIDIyLCA0LCA1MSwgMjNdLFxuICAgICAgWzMsIDM2LCAxMiwgOCwgMzcsIDEzXSxcblxuICAgICAgLy8gMTJcbiAgICAgIFsyLCAxMTYsIDkyLCAyLCAxMTcsIDkzXSxcbiAgICAgIFs2LCA1OCwgMzYsIDIsIDU5LCAzN10sXG4gICAgICBbNCwgNDYsIDIwLCA2LCA0NywgMjFdLFxuICAgICAgWzcsIDQyLCAxNCwgNCwgNDMsIDE1XSxcblxuICAgICAgLy8gMTNcbiAgICAgIFs0LCAxMzMsIDEwN10sXG4gICAgICBbOCwgNTksIDM3LCAxLCA2MCwgMzhdLFxuICAgICAgWzgsIDQ0LCAyMCwgNCwgNDUsIDIxXSxcbiAgICAgIFsxMiwgMzMsIDExLCA0LCAzNCwgMTJdLFxuXG4gICAgICAvLyAxNFxuICAgICAgWzMsIDE0NSwgMTE1LCAxLCAxNDYsIDExNl0sXG4gICAgICBbNCwgNjQsIDQwLCA1LCA2NSwgNDFdLFxuICAgICAgWzExLCAzNiwgMTYsIDUsIDM3LCAxN10sXG4gICAgICBbMTEsIDM2LCAxMiwgNSwgMzcsIDEzXSxcblxuICAgICAgLy8gMTVcbiAgICAgIFs1LCAxMDksIDg3LCAxLCAxMTAsIDg4XSxcbiAgICAgIFs1LCA2NSwgNDEsIDUsIDY2LCA0Ml0sXG4gICAgICBbNSwgNTQsIDI0LCA3LCA1NSwgMjVdLFxuICAgICAgWzExLCAzNiwgMTIsIDcsIDM3LCAxM10sXG5cbiAgICAgIC8vIDE2XG4gICAgICBbNSwgMTIyLCA5OCwgMSwgMTIzLCA5OV0sXG4gICAgICBbNywgNzMsIDQ1LCAzLCA3NCwgNDZdLFxuICAgICAgWzE1LCA0MywgMTksIDIsIDQ0LCAyMF0sXG4gICAgICBbMywgNDUsIDE1LCAxMywgNDYsIDE2XSxcblxuICAgICAgLy8gMTdcbiAgICAgIFsxLCAxMzUsIDEwNywgNSwgMTM2LCAxMDhdLFxuICAgICAgWzEwLCA3NCwgNDYsIDEsIDc1LCA0N10sXG4gICAgICBbMSwgNTAsIDIyLCAxNSwgNTEsIDIzXSxcbiAgICAgIFsyLCA0MiwgMTQsIDE3LCA0MywgMTVdLFxuXG4gICAgICAvLyAxOFxuICAgICAgWzUsIDE1MCwgMTIwLCAxLCAxNTEsIDEyMV0sXG4gICAgICBbOSwgNjksIDQzLCA0LCA3MCwgNDRdLFxuICAgICAgWzE3LCA1MCwgMjIsIDEsIDUxLCAyM10sXG4gICAgICBbMiwgNDIsIDE0LCAxOSwgNDMsIDE1XSxcblxuICAgICAgLy8gMTlcbiAgICAgIFszLCAxNDEsIDExMywgNCwgMTQyLCAxMTRdLFxuICAgICAgWzMsIDcwLCA0NCwgMTEsIDcxLCA0NV0sXG4gICAgICBbMTcsIDQ3LCAyMSwgNCwgNDgsIDIyXSxcbiAgICAgIFs5LCAzOSwgMTMsIDE2LCA0MCwgMTRdLFxuXG4gICAgICAvLyAyMFxuICAgICAgWzMsIDEzNSwgMTA3LCA1LCAxMzYsIDEwOF0sXG4gICAgICBbMywgNjcsIDQxLCAxMywgNjgsIDQyXSxcbiAgICAgIFsxNSwgNTQsIDI0LCA1LCA1NSwgMjVdLFxuICAgICAgWzE1LCA0MywgMTUsIDEwLCA0NCwgMTZdLFxuXG4gICAgICAvLyAyMVxuICAgICAgWzQsIDE0NCwgMTE2LCA0LCAxNDUsIDExN10sXG4gICAgICBbMTcsIDY4LCA0Ml0sXG4gICAgICBbMTcsIDUwLCAyMiwgNiwgNTEsIDIzXSxcbiAgICAgIFsxOSwgNDYsIDE2LCA2LCA0NywgMTddLFxuXG4gICAgICAvLyAyMlxuICAgICAgWzIsIDEzOSwgMTExLCA3LCAxNDAsIDExMl0sXG4gICAgICBbMTcsIDc0LCA0Nl0sXG4gICAgICBbNywgNTQsIDI0LCAxNiwgNTUsIDI1XSxcbiAgICAgIFszNCwgMzcsIDEzXSxcblxuICAgICAgLy8gMjNcbiAgICAgIFs0LCAxNTEsIDEyMSwgNSwgMTUyLCAxMjJdLFxuICAgICAgWzQsIDc1LCA0NywgMTQsIDc2LCA0OF0sXG4gICAgICBbMTEsIDU0LCAyNCwgMTQsIDU1LCAyNV0sXG4gICAgICBbMTYsIDQ1LCAxNSwgMTQsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI0XG4gICAgICBbNiwgMTQ3LCAxMTcsIDQsIDE0OCwgMTE4XSxcbiAgICAgIFs2LCA3MywgNDUsIDE0LCA3NCwgNDZdLFxuICAgICAgWzExLCA1NCwgMjQsIDE2LCA1NSwgMjVdLFxuICAgICAgWzMwLCA0NiwgMTYsIDIsIDQ3LCAxN10sXG5cbiAgICAgIC8vIDI1XG4gICAgICBbOCwgMTMyLCAxMDYsIDQsIDEzMywgMTA3XSxcbiAgICAgIFs4LCA3NSwgNDcsIDEzLCA3NiwgNDhdLFxuICAgICAgWzcsIDU0LCAyNCwgMjIsIDU1LCAyNV0sXG4gICAgICBbMjIsIDQ1LCAxNSwgMTMsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI2XG4gICAgICBbMTAsIDE0MiwgMTE0LCAyLCAxNDMsIDExNV0sXG4gICAgICBbMTksIDc0LCA0NiwgNCwgNzUsIDQ3XSxcbiAgICAgIFsyOCwgNTAsIDIyLCA2LCA1MSwgMjNdLFxuICAgICAgWzMzLCA0NiwgMTYsIDQsIDQ3LCAxN10sXG5cbiAgICAgIC8vIDI3XG4gICAgICBbOCwgMTUyLCAxMjIsIDQsIDE1MywgMTIzXSxcbiAgICAgIFsyMiwgNzMsIDQ1LCAzLCA3NCwgNDZdLFxuICAgICAgWzgsIDUzLCAyMywgMjYsIDU0LCAyNF0sXG4gICAgICBbMTIsIDQ1LCAxNSwgMjgsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI4XG4gICAgICBbMywgMTQ3LCAxMTcsIDEwLCAxNDgsIDExOF0sXG4gICAgICBbMywgNzMsIDQ1LCAyMywgNzQsIDQ2XSxcbiAgICAgIFs0LCA1NCwgMjQsIDMxLCA1NSwgMjVdLFxuICAgICAgWzExLCA0NSwgMTUsIDMxLCA0NiwgMTZdLFxuXG4gICAgICAvLyAyOVxuICAgICAgWzcsIDE0NiwgMTE2LCA3LCAxNDcsIDExN10sXG4gICAgICBbMjEsIDczLCA0NSwgNywgNzQsIDQ2XSxcbiAgICAgIFsxLCA1MywgMjMsIDM3LCA1NCwgMjRdLFxuICAgICAgWzE5LCA0NSwgMTUsIDI2LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzMFxuICAgICAgWzUsIDE0NSwgMTE1LCAxMCwgMTQ2LCAxMTZdLFxuICAgICAgWzE5LCA3NSwgNDcsIDEwLCA3NiwgNDhdLFxuICAgICAgWzE1LCA1NCwgMjQsIDI1LCA1NSwgMjVdLFxuICAgICAgWzIzLCA0NSwgMTUsIDI1LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzMVxuICAgICAgWzEzLCAxNDUsIDExNSwgMywgMTQ2LCAxMTZdLFxuICAgICAgWzIsIDc0LCA0NiwgMjksIDc1LCA0N10sXG4gICAgICBbNDIsIDU0LCAyNCwgMSwgNTUsIDI1XSxcbiAgICAgIFsyMywgNDUsIDE1LCAyOCwgNDYsIDE2XSxcblxuICAgICAgLy8gMzJcbiAgICAgIFsxNywgMTQ1LCAxMTVdLFxuICAgICAgWzEwLCA3NCwgNDYsIDIzLCA3NSwgNDddLFxuICAgICAgWzEwLCA1NCwgMjQsIDM1LCA1NSwgMjVdLFxuICAgICAgWzE5LCA0NSwgMTUsIDM1LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzM1xuICAgICAgWzE3LCAxNDUsIDExNSwgMSwgMTQ2LCAxMTZdLFxuICAgICAgWzE0LCA3NCwgNDYsIDIxLCA3NSwgNDddLFxuICAgICAgWzI5LCA1NCwgMjQsIDE5LCA1NSwgMjVdLFxuICAgICAgWzExLCA0NSwgMTUsIDQ2LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzNFxuICAgICAgWzEzLCAxNDUsIDExNSwgNiwgMTQ2LCAxMTZdLFxuICAgICAgWzE0LCA3NCwgNDYsIDIzLCA3NSwgNDddLFxuICAgICAgWzQ0LCA1NCwgMjQsIDcsIDU1LCAyNV0sXG4gICAgICBbNTksIDQ2LCAxNiwgMSwgNDcsIDE3XSxcblxuICAgICAgLy8gMzVcbiAgICAgIFsxMiwgMTUxLCAxMjEsIDcsIDE1MiwgMTIyXSxcbiAgICAgIFsxMiwgNzUsIDQ3LCAyNiwgNzYsIDQ4XSxcbiAgICAgIFszOSwgNTQsIDI0LCAxNCwgNTUsIDI1XSxcbiAgICAgIFsyMiwgNDUsIDE1LCA0MSwgNDYsIDE2XSxcblxuICAgICAgLy8gMzZcbiAgICAgIFs2LCAxNTEsIDEyMSwgMTQsIDE1MiwgMTIyXSxcbiAgICAgIFs2LCA3NSwgNDcsIDM0LCA3NiwgNDhdLFxuICAgICAgWzQ2LCA1NCwgMjQsIDEwLCA1NSwgMjVdLFxuICAgICAgWzIsIDQ1LCAxNSwgNjQsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM3XG4gICAgICBbMTcsIDE1MiwgMTIyLCA0LCAxNTMsIDEyM10sXG4gICAgICBbMjksIDc0LCA0NiwgMTQsIDc1LCA0N10sXG4gICAgICBbNDksIDU0LCAyNCwgMTAsIDU1LCAyNV0sXG4gICAgICBbMjQsIDQ1LCAxNSwgNDYsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM4XG4gICAgICBbNCwgMTUyLCAxMjIsIDE4LCAxNTMsIDEyM10sXG4gICAgICBbMTMsIDc0LCA0NiwgMzIsIDc1LCA0N10sXG4gICAgICBbNDgsIDU0LCAyNCwgMTQsIDU1LCAyNV0sXG4gICAgICBbNDIsIDQ1LCAxNSwgMzIsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM5XG4gICAgICBbMjAsIDE0NywgMTE3LCA0LCAxNDgsIDExOF0sXG4gICAgICBbNDAsIDc1LCA0NywgNywgNzYsIDQ4XSxcbiAgICAgIFs0MywgNTQsIDI0LCAyMiwgNTUsIDI1XSxcbiAgICAgIFsxMCwgNDUsIDE1LCA2NywgNDYsIDE2XSxcblxuICAgICAgLy8gNDBcbiAgICAgIFsxOSwgMTQ4LCAxMTgsIDYsIDE0OSwgMTE5XSxcbiAgICAgIFsxOCwgNzUsIDQ3LCAzMSwgNzYsIDQ4XSxcbiAgICAgIFszNCwgNTQsIDI0LCAzNCwgNTUsIDI1XSxcbiAgICAgIFsyMCwgNDUsIDE1LCA2MSwgNDYsIDE2XVxuICAgIF07XG5cbiAgICB2YXIgcXJSU0Jsb2NrID0gZnVuY3Rpb24odG90YWxDb3VudCwgZGF0YUNvdW50KSB7XG4gICAgICB2YXIgX3RoaXMgPSB7fTtcbiAgICAgIF90aGlzLnRvdGFsQ291bnQgPSB0b3RhbENvdW50O1xuICAgICAgX3RoaXMuZGF0YUNvdW50ID0gZGF0YUNvdW50O1xuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH07XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIHZhciBnZXRSc0Jsb2NrVGFibGUgPSBmdW5jdGlvbih0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCkge1xuXG4gICAgICBzd2l0Y2goZXJyb3JDb3JyZWN0aW9uTGV2ZWwpIHtcbiAgICAgIGNhc2UgUVJFcnJvckNvcnJlY3Rpb25MZXZlbC5MIDpcbiAgICAgICAgcmV0dXJuIFJTX0JMT0NLX1RBQkxFWyh0eXBlTnVtYmVyIC0gMSkgKiA0ICsgMF07XG4gICAgICBjYXNlIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWwuTSA6XG4gICAgICAgIHJldHVybiBSU19CTE9DS19UQUJMRVsodHlwZU51bWJlciAtIDEpICogNCArIDFdO1xuICAgICAgY2FzZSBRUkVycm9yQ29ycmVjdGlvbkxldmVsLlEgOlxuICAgICAgICByZXR1cm4gUlNfQkxPQ0tfVEFCTEVbKHR5cGVOdW1iZXIgLSAxKSAqIDQgKyAyXTtcbiAgICAgIGNhc2UgUVJFcnJvckNvcnJlY3Rpb25MZXZlbC5IIDpcbiAgICAgICAgcmV0dXJuIFJTX0JMT0NLX1RBQkxFWyh0eXBlTnVtYmVyIC0gMSkgKiA0ICsgM107XG4gICAgICBkZWZhdWx0IDpcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0UlNCbG9ja3MgPSBmdW5jdGlvbih0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCkge1xuXG4gICAgICB2YXIgcnNCbG9jayA9IGdldFJzQmxvY2tUYWJsZSh0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcnNCbG9jayA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBycyBibG9jayBAIHR5cGVOdW1iZXI6JyArIHR5cGVOdW1iZXIgK1xuICAgICAgICAgICAgJy9lcnJvckNvcnJlY3Rpb25MZXZlbDonICsgZXJyb3JDb3JyZWN0aW9uTGV2ZWwpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbGVuZ3RoID0gcnNCbG9jay5sZW5ndGggLyAzO1xuXG4gICAgICB2YXIgbGlzdCA9IG5ldyBBcnJheSgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgdmFyIGNvdW50ID0gcnNCbG9ja1tpICogMyArIDBdO1xuICAgICAgICB2YXIgdG90YWxDb3VudCA9IHJzQmxvY2tbaSAqIDMgKyAxXTtcbiAgICAgICAgdmFyIGRhdGFDb3VudCA9IHJzQmxvY2tbaSAqIDMgKyAyXTtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvdW50OyBqICs9IDEpIHtcbiAgICAgICAgICBsaXN0LnB1c2gocXJSU0Jsb2NrKHRvdGFsQ291bnQsIGRhdGFDb3VudCkgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9KCk7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJCaXRCdWZmZXJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgcXJCaXRCdWZmZXIgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBfYnVmZmVyID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIF9sZW5ndGggPSAwO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICBfdGhpcy5nZXRCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfYnVmZmVyO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRBdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICB2YXIgYnVmSW5kZXggPSBNYXRoLmZsb29yKGluZGV4IC8gOCk7XG4gICAgICByZXR1cm4gKCAoX2J1ZmZlcltidWZJbmRleF0gPj4+ICg3IC0gaW5kZXggJSA4KSApICYgMSkgPT0gMTtcbiAgICB9O1xuXG4gICAgX3RoaXMucHV0ID0gZnVuY3Rpb24obnVtLCBsZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgX3RoaXMucHV0Qml0KCAoIChudW0gPj4+IChsZW5ndGggLSBpIC0gMSkgKSAmIDEpID09IDEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGhJbkJpdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfbGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy5wdXRCaXQgPSBmdW5jdGlvbihiaXQpIHtcblxuICAgICAgdmFyIGJ1ZkluZGV4ID0gTWF0aC5mbG9vcihfbGVuZ3RoIC8gOCk7XG4gICAgICBpZiAoX2J1ZmZlci5sZW5ndGggPD0gYnVmSW5kZXgpIHtcbiAgICAgICAgX2J1ZmZlci5wdXNoKDApO1xuICAgICAgfVxuXG4gICAgICBpZiAoYml0KSB7XG4gICAgICAgIF9idWZmZXJbYnVmSW5kZXhdIHw9ICgweDgwID4+PiAoX2xlbmd0aCAlIDgpICk7XG4gICAgICB9XG5cbiAgICAgIF9sZW5ndGggKz0gMTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyTnVtYmVyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHFyTnVtYmVyID0gZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgdmFyIF9tb2RlID0gUVJNb2RlLk1PREVfTlVNQkVSO1xuICAgIHZhciBfZGF0YSA9IGRhdGE7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLmdldE1vZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfbW9kZTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gICAgICByZXR1cm4gX2RhdGEubGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuXG4gICAgICB2YXIgZGF0YSA9IF9kYXRhO1xuXG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIHdoaWxlIChpICsgMiA8IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgIGJ1ZmZlci5wdXQoc3RyVG9OdW0oZGF0YS5zdWJzdHJpbmcoaSwgaSArIDMpICksIDEwKTtcbiAgICAgICAgaSArPSAzO1xuICAgICAgfVxuXG4gICAgICBpZiAoaSA8IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCAtIGkgPT0gMSkge1xuICAgICAgICAgIGJ1ZmZlci5wdXQoc3RyVG9OdW0oZGF0YS5zdWJzdHJpbmcoaSwgaSArIDEpICksIDQpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGVuZ3RoIC0gaSA9PSAyKSB7XG4gICAgICAgICAgYnVmZmVyLnB1dChzdHJUb051bShkYXRhLnN1YnN0cmluZyhpLCBpICsgMikgKSwgNyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHN0clRvTnVtID0gZnVuY3Rpb24ocykge1xuICAgICAgdmFyIG51bSA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgbnVtID0gbnVtICogMTAgKyBjaGF0VG9OdW0ocy5jaGFyQXQoaSkgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudW07XG4gICAgfTtcblxuICAgIHZhciBjaGF0VG9OdW0gPSBmdW5jdGlvbihjKSB7XG4gICAgICBpZiAoJzAnIDw9IGMgJiYgYyA8PSAnOScpIHtcbiAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKSAtICcwJy5jaGFyQ29kZUF0KDApO1xuICAgICAgfVxuICAgICAgdGhyb3cgJ2lsbGVnYWwgY2hhciA6JyArIGM7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxckFscGhhTnVtXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHFyQWxwaGFOdW0gPSBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICB2YXIgX21vZGUgPSBRUk1vZGUuTU9ERV9BTFBIQV9OVU07XG4gICAgdmFyIF9kYXRhID0gZGF0YTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgX3RoaXMuZ2V0TW9kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9tb2RlO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGggPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgICAgIHJldHVybiBfZGF0YS5sZW5ndGg7XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyKSB7XG5cbiAgICAgIHZhciBzID0gX2RhdGE7XG5cbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgd2hpbGUgKGkgKyAxIDwgcy5sZW5ndGgpIHtcbiAgICAgICAgYnVmZmVyLnB1dChcbiAgICAgICAgICBnZXRDb2RlKHMuY2hhckF0KGkpICkgKiA0NSArXG4gICAgICAgICAgZ2V0Q29kZShzLmNoYXJBdChpICsgMSkgKSwgMTEpO1xuICAgICAgICBpICs9IDI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpIDwgcy5sZW5ndGgpIHtcbiAgICAgICAgYnVmZmVyLnB1dChnZXRDb2RlKHMuY2hhckF0KGkpICksIDYpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0Q29kZSA9IGZ1bmN0aW9uKGMpIHtcblxuICAgICAgaWYgKCcwJyA8PSBjICYmIGMgPD0gJzknKSB7XG4gICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCkgLSAnMCcuY2hhckNvZGVBdCgwKTtcbiAgICAgIH0gZWxzZSBpZiAoJ0EnIDw9IGMgJiYgYyA8PSAnWicpIHtcbiAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKSAtICdBJy5jaGFyQ29kZUF0KDApICsgMTA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2ggKGMpIHtcbiAgICAgICAgY2FzZSAnICcgOiByZXR1cm4gMzY7XG4gICAgICAgIGNhc2UgJyQnIDogcmV0dXJuIDM3O1xuICAgICAgICBjYXNlICclJyA6IHJldHVybiAzODtcbiAgICAgICAgY2FzZSAnKicgOiByZXR1cm4gMzk7XG4gICAgICAgIGNhc2UgJysnIDogcmV0dXJuIDQwO1xuICAgICAgICBjYXNlICctJyA6IHJldHVybiA0MTtcbiAgICAgICAgY2FzZSAnLicgOiByZXR1cm4gNDI7XG4gICAgICAgIGNhc2UgJy8nIDogcmV0dXJuIDQzO1xuICAgICAgICBjYXNlICc6JyA6IHJldHVybiA0NDtcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgdGhyb3cgJ2lsbGVnYWwgY2hhciA6JyArIGM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyOEJpdEJ5dGVcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgcXI4Qml0Qnl0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgIHZhciBfbW9kZSA9IFFSTW9kZS5NT0RFXzhCSVRfQllURTtcbiAgICB2YXIgX2RhdGEgPSBkYXRhO1xuICAgIHZhciBfYnl0ZXMgPSBxcmNvZGUuc3RyaW5nVG9CeXRlcyhkYXRhKTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgX3RoaXMuZ2V0TW9kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9tb2RlO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGggPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgICAgIHJldHVybiBfYnl0ZXMubGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfYnl0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYnVmZmVyLnB1dChfYnl0ZXNbaV0sIDgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJLYW5qaVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBxckthbmppID0gZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgdmFyIF9tb2RlID0gUVJNb2RlLk1PREVfS0FOSkk7XG4gICAgdmFyIF9kYXRhID0gZGF0YTtcbiAgICB2YXIgX2J5dGVzID0gcXJjb2RlLnN0cmluZ1RvQnl0ZXMoZGF0YSk7XG5cbiAgICAhZnVuY3Rpb24oYywgY29kZSkge1xuICAgICAgLy8gc2VsZiB0ZXN0IGZvciBzamlzIHN1cHBvcnQuXG4gICAgICB2YXIgdGVzdCA9IHFyY29kZS5zdHJpbmdUb0J5dGVzKGMpO1xuICAgICAgaWYgKHRlc3QubGVuZ3RoICE9IDIgfHwgKCAodGVzdFswXSA8PCA4KSB8IHRlc3RbMV0pICE9IGNvZGUpIHtcbiAgICAgICAgdGhyb3cgJ3NqaXMgbm90IHN1cHBvcnRlZC4nO1xuICAgICAgfVxuICAgIH0oJ1xcdTUzY2InLCAweDk3NDYpO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICBfdGhpcy5nZXRNb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX21vZGU7XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aCA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAgICAgcmV0dXJuIH5+KF9ieXRlcy5sZW5ndGggLyAyKTtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcblxuICAgICAgdmFyIGRhdGEgPSBfYnl0ZXM7XG5cbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgd2hpbGUgKGkgKyAxIDwgZGF0YS5sZW5ndGgpIHtcblxuICAgICAgICB2YXIgYyA9ICggKDB4ZmYgJiBkYXRhW2ldKSA8PCA4KSB8ICgweGZmICYgZGF0YVtpICsgMV0pO1xuXG4gICAgICAgIGlmICgweDgxNDAgPD0gYyAmJiBjIDw9IDB4OUZGQykge1xuICAgICAgICAgIGMgLT0gMHg4MTQwO1xuICAgICAgICB9IGVsc2UgaWYgKDB4RTA0MCA8PSBjICYmIGMgPD0gMHhFQkJGKSB7XG4gICAgICAgICAgYyAtPSAweEMxNDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgJ2lsbGVnYWwgY2hhciBhdCAnICsgKGkgKyAxKSArICcvJyArIGM7XG4gICAgICAgIH1cblxuICAgICAgICBjID0gKCAoYyA+Pj4gOCkgJiAweGZmKSAqIDB4QzAgKyAoYyAmIDB4ZmYpO1xuXG4gICAgICAgIGJ1ZmZlci5wdXQoYywgMTMpO1xuXG4gICAgICAgIGkgKz0gMjtcbiAgICAgIH1cblxuICAgICAgaWYgKGkgPCBkYXRhLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyAnaWxsZWdhbCBjaGFyIGF0ICcgKyAoaSArIDEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gR0lGIFN1cHBvcnQgZXRjLlxuICAvL1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGJ5dGVBcnJheU91dHB1dFN0cmVhbVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBieXRlQXJyYXlPdXRwdXRTdHJlYW0gPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBfYnl0ZXMgPSBuZXcgQXJyYXkoKTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgX3RoaXMud3JpdGVCeXRlID0gZnVuY3Rpb24oYikge1xuICAgICAgX2J5dGVzLnB1c2goYiAmIDB4ZmYpO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZVNob3J0ID0gZnVuY3Rpb24oaSkge1xuICAgICAgX3RoaXMud3JpdGVCeXRlKGkpO1xuICAgICAgX3RoaXMud3JpdGVCeXRlKGkgPj4+IDgpO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZUJ5dGVzID0gZnVuY3Rpb24oYiwgb2ZmLCBsZW4pIHtcbiAgICAgIG9mZiA9IG9mZiB8fCAwO1xuICAgICAgbGVuID0gbGVuIHx8IGIubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBfdGhpcy53cml0ZUJ5dGUoYltpICsgb2ZmXSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlU3RyaW5nID0gZnVuY3Rpb24ocykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIF90aGlzLndyaXRlQnl0ZShzLmNoYXJDb2RlQXQoaSkgKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMudG9CeXRlQXJyYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfYnl0ZXM7XG4gICAgfTtcblxuICAgIF90aGlzLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcyA9ICcnO1xuICAgICAgcyArPSAnWyc7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9ieXRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICBzICs9ICcsJztcbiAgICAgICAgfVxuICAgICAgICBzICs9IF9ieXRlc1tpXTtcbiAgICAgIH1cbiAgICAgIHMgKz0gJ10nO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBiYXNlNjRFbmNvZGVPdXRwdXRTdHJlYW1cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgYmFzZTY0RW5jb2RlT3V0cHV0U3RyZWFtID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgX2J1ZmZlciA9IDA7XG4gICAgdmFyIF9idWZsZW4gPSAwO1xuICAgIHZhciBfbGVuZ3RoID0gMDtcbiAgICB2YXIgX2Jhc2U2NCA9ICcnO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICB2YXIgd3JpdGVFbmNvZGVkID0gZnVuY3Rpb24oYikge1xuICAgICAgX2Jhc2U2NCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGVuY29kZShiICYgMHgzZikgKTtcbiAgICB9O1xuXG4gICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uKG4pIHtcbiAgICAgIGlmIChuIDwgMCkge1xuICAgICAgICAvLyBlcnJvci5cbiAgICAgIH0gZWxzZSBpZiAobiA8IDI2KSB7XG4gICAgICAgIHJldHVybiAweDQxICsgbjtcbiAgICAgIH0gZWxzZSBpZiAobiA8IDUyKSB7XG4gICAgICAgIHJldHVybiAweDYxICsgKG4gLSAyNik7XG4gICAgICB9IGVsc2UgaWYgKG4gPCA2Mikge1xuICAgICAgICByZXR1cm4gMHgzMCArIChuIC0gNTIpO1xuICAgICAgfSBlbHNlIGlmIChuID09IDYyKSB7XG4gICAgICAgIHJldHVybiAweDJiO1xuICAgICAgfSBlbHNlIGlmIChuID09IDYzKSB7XG4gICAgICAgIHJldHVybiAweDJmO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCduOicgKyBuKTtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGVCeXRlID0gZnVuY3Rpb24obikge1xuXG4gICAgICBfYnVmZmVyID0gKF9idWZmZXIgPDwgOCkgfCAobiAmIDB4ZmYpO1xuICAgICAgX2J1ZmxlbiArPSA4O1xuICAgICAgX2xlbmd0aCArPSAxO1xuXG4gICAgICB3aGlsZSAoX2J1ZmxlbiA+PSA2KSB7XG4gICAgICAgIHdyaXRlRW5jb2RlZChfYnVmZmVyID4+PiAoX2J1ZmxlbiAtIDYpICk7XG4gICAgICAgIF9idWZsZW4gLT0gNjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZmx1c2ggPSBmdW5jdGlvbigpIHtcblxuICAgICAgaWYgKF9idWZsZW4gPiAwKSB7XG4gICAgICAgIHdyaXRlRW5jb2RlZChfYnVmZmVyIDw8ICg2IC0gX2J1ZmxlbikgKTtcbiAgICAgICAgX2J1ZmZlciA9IDA7XG4gICAgICAgIF9idWZsZW4gPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2xlbmd0aCAlIDMgIT0gMCkge1xuICAgICAgICAvLyBwYWRkaW5nXG4gICAgICAgIHZhciBwYWRsZW4gPSAzIC0gX2xlbmd0aCAlIDM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFkbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICBfYmFzZTY0ICs9ICc9JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9iYXNlNjQ7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBiYXNlNjREZWNvZGVJbnB1dFN0cmVhbVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBiYXNlNjREZWNvZGVJbnB1dFN0cmVhbSA9IGZ1bmN0aW9uKHN0cikge1xuXG4gICAgdmFyIF9zdHIgPSBzdHI7XG4gICAgdmFyIF9wb3MgPSAwO1xuICAgIHZhciBfYnVmZmVyID0gMDtcbiAgICB2YXIgX2J1ZmxlbiA9IDA7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLnJlYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgd2hpbGUgKF9idWZsZW4gPCA4KSB7XG5cbiAgICAgICAgaWYgKF9wb3MgPj0gX3N0ci5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoX2J1ZmxlbiA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndW5leHBlY3RlZCBlbmQgb2YgZmlsZS4vJyArIF9idWZsZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGMgPSBfc3RyLmNoYXJBdChfcG9zKTtcbiAgICAgICAgX3BvcyArPSAxO1xuXG4gICAgICAgIGlmIChjID09ICc9Jykge1xuICAgICAgICAgIF9idWZsZW4gPSAwO1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChjLm1hdGNoKC9eXFxzJC8pICkge1xuICAgICAgICAgIC8vIGlnbm9yZSBpZiB3aGl0ZXNwYWNlLlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgX2J1ZmZlciA9IChfYnVmZmVyIDw8IDYpIHwgZGVjb2RlKGMuY2hhckNvZGVBdCgwKSApO1xuICAgICAgICBfYnVmbGVuICs9IDY7XG4gICAgICB9XG5cbiAgICAgIHZhciBuID0gKF9idWZmZXIgPj4+IChfYnVmbGVuIC0gOCkgKSAmIDB4ZmY7XG4gICAgICBfYnVmbGVuIC09IDg7XG4gICAgICByZXR1cm4gbjtcbiAgICB9O1xuXG4gICAgdmFyIGRlY29kZSA9IGZ1bmN0aW9uKGMpIHtcbiAgICAgIGlmICgweDQxIDw9IGMgJiYgYyA8PSAweDVhKSB7XG4gICAgICAgIHJldHVybiBjIC0gMHg0MTtcbiAgICAgIH0gZWxzZSBpZiAoMHg2MSA8PSBjICYmIGMgPD0gMHg3YSkge1xuICAgICAgICByZXR1cm4gYyAtIDB4NjEgKyAyNjtcbiAgICAgIH0gZWxzZSBpZiAoMHgzMCA8PSBjICYmIGMgPD0gMHgzOSkge1xuICAgICAgICByZXR1cm4gYyAtIDB4MzAgKyA1MjtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PSAweDJiKSB7XG4gICAgICAgIHJldHVybiA2MjtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PSAweDJmKSB7XG4gICAgICAgIHJldHVybiA2MztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYzonICsgYyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBnaWZJbWFnZSAoQi9XKVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBnaWZJbWFnZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcblxuICAgIHZhciBfd2lkdGggPSB3aWR0aDtcbiAgICB2YXIgX2hlaWdodCA9IGhlaWdodDtcbiAgICB2YXIgX2RhdGEgPSBuZXcgQXJyYXkod2lkdGggKiBoZWlnaHQpO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICBfdGhpcy5zZXRQaXhlbCA9IGZ1bmN0aW9uKHgsIHksIHBpeGVsKSB7XG4gICAgICBfZGF0YVt5ICogX3dpZHRoICsgeF0gPSBwaXhlbDtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGUgPSBmdW5jdGlvbihvdXQpIHtcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEdJRiBTaWduYXR1cmVcblxuICAgICAgb3V0LndyaXRlU3RyaW5nKCdHSUY4N2EnKTtcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIFNjcmVlbiBEZXNjcmlwdG9yXG5cbiAgICAgIG91dC53cml0ZVNob3J0KF93aWR0aCk7XG4gICAgICBvdXQud3JpdGVTaG9ydChfaGVpZ2h0KTtcblxuICAgICAgb3V0LndyaXRlQnl0ZSgweDgwKTsgLy8gMmJpdFxuICAgICAgb3V0LndyaXRlQnl0ZSgwKTtcbiAgICAgIG91dC53cml0ZUJ5dGUoMCk7XG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBHbG9iYWwgQ29sb3IgTWFwXG5cbiAgICAgIC8vIGJsYWNrXG4gICAgICBvdXQud3JpdGVCeXRlKDB4MDApO1xuICAgICAgb3V0LndyaXRlQnl0ZSgweDAwKTtcbiAgICAgIG91dC53cml0ZUJ5dGUoMHgwMCk7XG5cbiAgICAgIC8vIHdoaXRlXG4gICAgICBvdXQud3JpdGVCeXRlKDB4ZmYpO1xuICAgICAgb3V0LndyaXRlQnl0ZSgweGZmKTtcbiAgICAgIG91dC53cml0ZUJ5dGUoMHhmZik7XG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBJbWFnZSBEZXNjcmlwdG9yXG5cbiAgICAgIG91dC53cml0ZVN0cmluZygnLCcpO1xuICAgICAgb3V0LndyaXRlU2hvcnQoMCk7XG4gICAgICBvdXQud3JpdGVTaG9ydCgwKTtcbiAgICAgIG91dC53cml0ZVNob3J0KF93aWR0aCk7XG4gICAgICBvdXQud3JpdGVTaG9ydChfaGVpZ2h0KTtcbiAgICAgIG91dC53cml0ZUJ5dGUoMCk7XG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBMb2NhbCBDb2xvciBNYXBcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIFJhc3RlciBEYXRhXG5cbiAgICAgIHZhciBsendNaW5Db2RlU2l6ZSA9IDI7XG4gICAgICB2YXIgcmFzdGVyID0gZ2V0TFpXUmFzdGVyKGx6d01pbkNvZGVTaXplKTtcblxuICAgICAgb3V0LndyaXRlQnl0ZShsendNaW5Db2RlU2l6ZSk7XG5cbiAgICAgIHZhciBvZmZzZXQgPSAwO1xuXG4gICAgICB3aGlsZSAocmFzdGVyLmxlbmd0aCAtIG9mZnNldCA+IDI1NSkge1xuICAgICAgICBvdXQud3JpdGVCeXRlKDI1NSk7XG4gICAgICAgIG91dC53cml0ZUJ5dGVzKHJhc3Rlciwgb2Zmc2V0LCAyNTUpO1xuICAgICAgICBvZmZzZXQgKz0gMjU1O1xuICAgICAgfVxuXG4gICAgICBvdXQud3JpdGVCeXRlKHJhc3Rlci5sZW5ndGggLSBvZmZzZXQpO1xuICAgICAgb3V0LndyaXRlQnl0ZXMocmFzdGVyLCBvZmZzZXQsIHJhc3Rlci5sZW5ndGggLSBvZmZzZXQpO1xuICAgICAgb3V0LndyaXRlQnl0ZSgweDAwKTtcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEdJRiBUZXJtaW5hdG9yXG4gICAgICBvdXQud3JpdGVTdHJpbmcoJzsnKTtcbiAgICB9O1xuXG4gICAgdmFyIGJpdE91dHB1dFN0cmVhbSA9IGZ1bmN0aW9uKG91dCkge1xuXG4gICAgICB2YXIgX291dCA9IG91dDtcbiAgICAgIHZhciBfYml0TGVuZ3RoID0gMDtcbiAgICAgIHZhciBfYml0QnVmZmVyID0gMDtcblxuICAgICAgdmFyIF90aGlzID0ge307XG5cbiAgICAgIF90aGlzLndyaXRlID0gZnVuY3Rpb24oZGF0YSwgbGVuZ3RoKSB7XG5cbiAgICAgICAgaWYgKCAoZGF0YSA+Pj4gbGVuZ3RoKSAhPSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdsZW5ndGggb3ZlcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKF9iaXRMZW5ndGggKyBsZW5ndGggPj0gOCkge1xuICAgICAgICAgIF9vdXQud3JpdGVCeXRlKDB4ZmYgJiAoIChkYXRhIDw8IF9iaXRMZW5ndGgpIHwgX2JpdEJ1ZmZlcikgKTtcbiAgICAgICAgICBsZW5ndGggLT0gKDggLSBfYml0TGVuZ3RoKTtcbiAgICAgICAgICBkYXRhID4+Pj0gKDggLSBfYml0TGVuZ3RoKTtcbiAgICAgICAgICBfYml0QnVmZmVyID0gMDtcbiAgICAgICAgICBfYml0TGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaXRCdWZmZXIgPSAoZGF0YSA8PCBfYml0TGVuZ3RoKSB8IF9iaXRCdWZmZXI7XG4gICAgICAgIF9iaXRMZW5ndGggPSBfYml0TGVuZ3RoICsgbGVuZ3RoO1xuICAgICAgfTtcblxuICAgICAgX3RoaXMuZmx1c2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKF9iaXRMZW5ndGggPiAwKSB7XG4gICAgICAgICAgX291dC53cml0ZUJ5dGUoX2JpdEJ1ZmZlcik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9O1xuXG4gICAgdmFyIGdldExaV1Jhc3RlciA9IGZ1bmN0aW9uKGx6d01pbkNvZGVTaXplKSB7XG5cbiAgICAgIHZhciBjbGVhckNvZGUgPSAxIDw8IGx6d01pbkNvZGVTaXplO1xuICAgICAgdmFyIGVuZENvZGUgPSAoMSA8PCBsendNaW5Db2RlU2l6ZSkgKyAxO1xuICAgICAgdmFyIGJpdExlbmd0aCA9IGx6d01pbkNvZGVTaXplICsgMTtcblxuICAgICAgLy8gU2V0dXAgTFpXVGFibGVcbiAgICAgIHZhciB0YWJsZSA9IGx6d1RhYmxlKCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xlYXJDb2RlOyBpICs9IDEpIHtcbiAgICAgICAgdGFibGUuYWRkKFN0cmluZy5mcm9tQ2hhckNvZGUoaSkgKTtcbiAgICAgIH1cbiAgICAgIHRhYmxlLmFkZChTdHJpbmcuZnJvbUNoYXJDb2RlKGNsZWFyQ29kZSkgKTtcbiAgICAgIHRhYmxlLmFkZChTdHJpbmcuZnJvbUNoYXJDb2RlKGVuZENvZGUpICk7XG5cbiAgICAgIHZhciBieXRlT3V0ID0gYnl0ZUFycmF5T3V0cHV0U3RyZWFtKCk7XG4gICAgICB2YXIgYml0T3V0ID0gYml0T3V0cHV0U3RyZWFtKGJ5dGVPdXQpO1xuXG4gICAgICAvLyBjbGVhciBjb2RlXG4gICAgICBiaXRPdXQud3JpdGUoY2xlYXJDb2RlLCBiaXRMZW5ndGgpO1xuXG4gICAgICB2YXIgZGF0YUluZGV4ID0gMDtcblxuICAgICAgdmFyIHMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKF9kYXRhW2RhdGFJbmRleF0pO1xuICAgICAgZGF0YUluZGV4ICs9IDE7XG5cbiAgICAgIHdoaWxlIChkYXRhSW5kZXggPCBfZGF0YS5sZW5ndGgpIHtcblxuICAgICAgICB2YXIgYyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoX2RhdGFbZGF0YUluZGV4XSk7XG4gICAgICAgIGRhdGFJbmRleCArPSAxO1xuXG4gICAgICAgIGlmICh0YWJsZS5jb250YWlucyhzICsgYykgKSB7XG5cbiAgICAgICAgICBzID0gcyArIGM7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGJpdE91dC53cml0ZSh0YWJsZS5pbmRleE9mKHMpLCBiaXRMZW5ndGgpO1xuXG4gICAgICAgICAgaWYgKHRhYmxlLnNpemUoKSA8IDB4ZmZmKSB7XG5cbiAgICAgICAgICAgIGlmICh0YWJsZS5zaXplKCkgPT0gKDEgPDwgYml0TGVuZ3RoKSApIHtcbiAgICAgICAgICAgICAgYml0TGVuZ3RoICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLmFkZChzICsgYyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcyA9IGM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYml0T3V0LndyaXRlKHRhYmxlLmluZGV4T2YocyksIGJpdExlbmd0aCk7XG5cbiAgICAgIC8vIGVuZCBjb2RlXG4gICAgICBiaXRPdXQud3JpdGUoZW5kQ29kZSwgYml0TGVuZ3RoKTtcblxuICAgICAgYml0T3V0LmZsdXNoKCk7XG5cbiAgICAgIHJldHVybiBieXRlT3V0LnRvQnl0ZUFycmF5KCk7XG4gICAgfTtcblxuICAgIHZhciBsendUYWJsZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgX21hcCA9IHt9O1xuICAgICAgdmFyIF9zaXplID0gMDtcblxuICAgICAgdmFyIF90aGlzID0ge307XG5cbiAgICAgIF90aGlzLmFkZCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoX3RoaXMuY29udGFpbnMoa2V5KSApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2R1cCBrZXk6JyArIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgX21hcFtrZXldID0gX3NpemU7XG4gICAgICAgIF9zaXplICs9IDE7XG4gICAgICB9O1xuXG4gICAgICBfdGhpcy5zaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfc2l6ZTtcbiAgICAgIH07XG5cbiAgICAgIF90aGlzLmluZGV4T2YgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIF9tYXBba2V5XTtcbiAgICAgIH07XG5cbiAgICAgIF90aGlzLmNvbnRhaW5zID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgX21hcFtrZXldICE9ICd1bmRlZmluZWQnO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUltZ1RhZyA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIGdldFBpeGVsLCBhbHQpIHtcblxuICAgIHZhciBnaWYgPSBnaWZJbWFnZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGhlaWdodDsgeSArPSAxKSB7XG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpZHRoOyB4ICs9IDEpIHtcbiAgICAgICAgZ2lmLnNldFBpeGVsKHgsIHksIGdldFBpeGVsKHgsIHkpICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGIgPSBieXRlQXJyYXlPdXRwdXRTdHJlYW0oKTtcbiAgICBnaWYud3JpdGUoYik7XG5cbiAgICB2YXIgYmFzZTY0ID0gYmFzZTY0RW5jb2RlT3V0cHV0U3RyZWFtKCk7XG4gICAgdmFyIGJ5dGVzID0gYi50b0J5dGVBcnJheSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGJhc2U2NC53cml0ZUJ5dGUoYnl0ZXNbaV0pO1xuICAgIH1cbiAgICBiYXNlNjQuZmx1c2goKTtcblxuICAgIHZhciBpbWcgPSAnJztcbiAgICBpbWcgKz0gJzxpbWcnO1xuICAgIGltZyArPSAnXFx1MDAyMHNyYz1cIic7XG4gICAgaW1nICs9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsJztcbiAgICBpbWcgKz0gYmFzZTY0O1xuICAgIGltZyArPSAnXCInO1xuICAgIGltZyArPSAnXFx1MDAyMHdpZHRoPVwiJztcbiAgICBpbWcgKz0gd2lkdGg7XG4gICAgaW1nICs9ICdcIic7XG4gICAgaW1nICs9ICdcXHUwMDIwaGVpZ2h0PVwiJztcbiAgICBpbWcgKz0gaGVpZ2h0O1xuICAgIGltZyArPSAnXCInO1xuICAgIGlmIChhbHQpIHtcbiAgICAgIGltZyArPSAnXFx1MDAyMGFsdD1cIic7XG4gICAgICBpbWcgKz0gYWx0O1xuICAgICAgaW1nICs9ICdcIic7XG4gICAgfVxuICAgIGltZyArPSAnLz4nO1xuXG4gICAgcmV0dXJuIGltZztcbiAgfTtcblxuICB2YXIgY3JlYXRlSW1nT2JqZWN0ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgZ2V0UGl4ZWwpIHtcblxuICAgIHZhciBnaWYgPSBnaWZJbWFnZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGhlaWdodDsgeSArPSAxKSB7XG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpZHRoOyB4ICs9IDEpIHtcbiAgICAgICAgZ2lmLnNldFBpeGVsKHgsIHksIGdldFBpeGVsKHgsIHkpICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGIgPSBieXRlQXJyYXlPdXRwdXRTdHJlYW0oKTtcbiAgICBnaWYud3JpdGUoYik7XG5cbiAgICB2YXIgYmFzZTY0ID0gYmFzZTY0RW5jb2RlT3V0cHV0U3RyZWFtKCk7XG4gICAgdmFyIGJ5dGVzID0gYi50b0J5dGVBcnJheSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGJhc2U2NC53cml0ZUJ5dGUoYnl0ZXNbaV0pO1xuICAgIH1cbiAgICBiYXNlNjQuZmx1c2goKTtcblxuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCwnICsgYmFzZTY0O1xuICAgIGltZy53aWR0aCA9IHdpZHRoO1xuICAgIGltZy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICByZXR1cm4gaW1nO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHJldHVybnMgcXJjb2RlIGZ1bmN0aW9uLlxuXG4gIHJldHVybiB7XG4gICAgUVJDb2RlOiBxcmNvZGUsXG4gICAgUVJVdGlsOiBRUlV0aWxcbiAgfTtcbn0oKTtcblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfVxufShmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFFSQ29kZTogcXJjb2RlLlFSQ29kZSxcbiAgICAgIFFSVXRpbDogcXJjb2RlLlFSVXRpbFxuICAgIH07XG59KSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3FyY29kZS5qcyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2l0ZXJhdG9yID0gcmVxdWlyZShcIi4uL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yXCIpO1xuXG52YXIgX2l0ZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2l0ZXJhdG9yKTtcblxudmFyIF9zeW1ib2wgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9zeW1ib2xcIik7XG5cbnZhciBfc3ltYm9sMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N5bWJvbCk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgX2l0ZXJhdG9yMi5kZWZhdWx0ID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCAmJiBvYmogIT09IF9zeW1ib2wyLmRlZmF1bHQucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgX3R5cGVvZihfaXRlcmF0b3IyLmRlZmF1bHQpID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfc3ltYm9sMi5kZWZhdWx0ICYmIG9iaiAhPT0gX3N5bWJvbDIuZGVmYXVsdC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvdHlwZW9mLmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2l0ZXJhdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wvaXRlcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX3drcy1leHQnKS5mKCdpdGVyYXRvcicpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2l0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCAkZW50cmllcyAgID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZFxuICAgICwgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmVcbiAgICAsIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJGFueU5hdGl2ZSl7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UpKTtcbiAgICBpZihJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSl7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanNcbi8vIG1vZHVsZSBpZCA9IDMwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzXG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAzNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZFBzICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgRW1wdHkgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgUFJPVE9UWVBFICAgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0gZW51bUJ1Z0tleXMubGVuZ3RoXG4gICAgLCBsdCAgICAgPSAnPCdcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKXtcbiAgdmFyIHJlc3VsdDtcbiAgaWYoTyAhPT0gbnVsbCl7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBkUCAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpe1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgICA9IGdldEtleXMoUHJvcGVydGllcylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpID0gMFxuICAgICwgUDtcbiAgd2hpbGUobGVuZ3RoID4gaSlkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHBzLmpzXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaGFzICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b0lPYmplY3QgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKVxuICAsIElFX1BST1RPICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIG5hbWVzKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwga2V5O1xuICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qc1xuLy8gbW9kdWxlIGlkID0gMzhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW9iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gNDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qc1xuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanNcbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzXG4vLyBtb2R1bGUgaWQgPSA0M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWF4ICAgICAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLWtleS5qc1xuLy8gbW9kdWxlIGlkID0gNDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qc1xuLy8gbW9kdWxlIGlkID0gNDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL191aWQuanNcbi8vIG1vZHVsZSBpZCA9IDQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gNDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzXG4vLyBtb2R1bGUgaWQgPSA0OVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qc1xuLy8gbW9kdWxlIGlkID0gNTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MuanNcbi8vIG1vZHVsZSBpZCA9IDUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTyl7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ3BvLmpzXG4vLyBtb2R1bGUgaWQgPSA1MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZihwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEl0ZXJhdG9ycy5BcnJheTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gNTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSA1NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hZGQtdG8tdW5zY29wYWJsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLXN0ZXAuanNcbi8vIG1vZHVsZSBpZCA9IDU3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX3drcycpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWV4dC5qc1xuLy8gbW9kdWxlIGlkID0gNThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sLmpzXG4vLyBtb2R1bGUgaWQgPSA1OVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM3LnN5bWJvbC5hc3luYy1pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczcuc3ltYm9sLm9ic2VydmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLlN5bWJvbDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIE1FVEEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWVxuICAsICRmYWlscyAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIHNoYXJlZCAgICAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCB1aWQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgd2tzICAgICAgICAgICAgPSByZXF1aXJlKCcuL193a3MnKVxuICAsIHdrc0V4dCAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpXG4gICwgd2tzRGVmaW5lICAgICAgPSByZXF1aXJlKCcuL193a3MtZGVmaW5lJylcbiAgLCBrZXlPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2tleW9mJylcbiAgLCBlbnVtS2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpXG4gICwgaXNBcnJheSAgICAgICAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgX2NyZWF0ZSAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBnT1BORXh0ICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpXG4gICwgJEdPUEQgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgJERQICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsICRrZXlzICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUEQgICAgICAgICAgID0gJEdPUEQuZlxuICAsIGRQICAgICAgICAgICAgID0gJERQLmZcbiAgLCBnT1BOICAgICAgICAgICA9IGdPUE5FeHQuZlxuICAsICRTeW1ib2wgICAgICAgID0gZ2xvYmFsLlN5bWJvbFxuICAsICRKU09OICAgICAgICAgID0gZ2xvYmFsLkpTT05cbiAgLCBfc3RyaW5naWZ5ICAgICA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeVxuICAsIFBST1RPVFlQRSAgICAgID0gJ3Byb3RvdHlwZSdcbiAgLCBISURERU4gICAgICAgICA9IHdrcygnX2hpZGRlbicpXG4gICwgVE9fUFJJTUlUSVZFICAgPSB3a3MoJ3RvUHJpbWl0aXZlJylcbiAgLCBpc0VudW0gICAgICAgICA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyAgICAgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIE9QU3ltYm9scyAgICAgID0gc2hhcmVkKCdvcC1zeW1ib2xzJylcbiAgLCBPYmplY3RQcm90byAgICA9IE9iamVjdFtQUk9UT1RZUEVdXG4gICwgVVNFX05BVElWRSAgICAgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nXG4gICwgUU9iamVjdCAgICAgICAgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIF9jcmVhdGUoZFAoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIGRQKHRoaXMsICdhJywge3ZhbHVlOiA3fSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgdmFyIHByb3RvRGVzYyA9IGdPUEQoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmKHByb3RvRGVzYylkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbih0YWcpe1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzeW0uX2sgPSB0YWc7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBVU0VfTkFUSVZFICYmIHR5cGVvZiAkU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnID8gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoaXQgPT09IE9iamVjdFByb3RvKSRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmKGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApe1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSlcbiAgICAsIGkgICAgPSAwXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcbiAgICAsIGtleTtcbiAgd2hpbGUobCA+IGkpJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCl7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KXtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIGl0ICA9IHRvSU9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGlmKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSlyZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ09QTih0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBJU19PUCAgPSBpdCA9PT0gT2JqZWN0UHJvdG9cbiAgICAsIG5hbWVzICA9IGdPUE4oSVNfT1AgPyBPUFN5bWJvbHMgOiB0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIVVTRV9OQVRJVkUpe1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCl7XG4gICAgaWYodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBpZih0aGlzID09PSBPYmplY3RQcm90bykkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKXNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0fSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICAkR09QRC5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJERQLmYgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mICA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKS5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi9fbGlicmFyeScpKXtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIHdyYXAod2tzKG5hbWUpKTtcbiAgfVxufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbmZvcih2YXIgc3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBpID0gMDsgc3ltYm9scy5sZW5ndGggPiBpOyApd2tzKHN5bWJvbHNbaSsrXSk7XG5cbmZvcih2YXIgc3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGkgPSAwOyBzeW1ib2xzLmxlbmd0aCA+IGk7ICl3a3NEZWZpbmUoc3ltYm9sc1tpKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioa2V5KXtcbiAgICBpZihpc1N5bWJvbChrZXkpKXJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgICB0aHJvdyBUeXBlRXJyb3Ioa2V5ICsgJyBpcyBub3QgYSBzeW1ib2whJyk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8ICRmYWlscyhmdW5jdGlvbigpe1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7YTogU30pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7XG4gICAgaWYoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgdmFyIGFyZ3MgPSBbaXRdXG4gICAgICAsIGkgICAgPSAxXG4gICAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICByZXBsYWNlciA9IGFyZ3NbMV07XG4gICAgaWYodHlwZW9mIHJlcGxhY2VyID09ICdmdW5jdGlvbicpJHJlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgaWYoJHJlcGxhY2VyIHx8ICFpc0FycmF5KHJlcGxhY2VyKSlyZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICBpZighaXNTeW1ib2wodmFsdWUpKXJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IDYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBNRVRBICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJylcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHNldERlc2MgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGlkICAgICAgID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uKGl0KXtcbiAgc2V0RGVzYyhpdCwgTUVUQSwge3ZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfX0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbihpdCl7XG4gIGlmKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSlzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogICAgICBNRVRBLFxuICBORUVEOiAgICAgZmFsc2UsXG4gIGZhc3RLZXk6ICBmYXN0S2V5LFxuICBnZXRXZWFrOiAgZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbWV0YS5qc1xuLy8gbW9kdWxlIGlkID0gNjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZihuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKWRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHt2YWx1ZTogd2tzRXh0LmYobmFtZSl9KTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZGVmaW5lLmpzXG4vLyBtb2R1bGUgaWQgPSA2M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZ2V0S2V5cyAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19rZXlvZi5qc1xuLy8gbW9kdWxlIGlkID0gNjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgcmVzdWx0ICAgICA9IGdldEtleXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICBpZihnZXRTeW1ib2xzKXtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpXG4gICAgICAsIGlzRW51bSAgPSBwSUUuZlxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoc3ltYm9scy5sZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWtleXMuanNcbi8vIG1vZHVsZSBpZCA9IDY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wcy5qc1xuLy8gbW9kdWxlIGlkID0gNjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtcGllLmpzXG4vLyBtb2R1bGUgaWQgPSA2N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKXtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IDY4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBnT1BOICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmZcbiAgLCB0b1N0cmluZyAgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uKGl0KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qc1xuLy8gbW9kdWxlIGlkID0gNjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLmpzXG4vLyBtb2R1bGUgaWQgPSA3MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcElFICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCBnT1BEICAgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wZC5qc1xuLy8gbW9kdWxlIGlkID0gNzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdhc3luY0l0ZXJhdG9yJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDczXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnb2JzZXJ2YWJsZScpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3ltYm9sLm9ic2VydmFibGUuanNcbi8vIG1vZHVsZSBpZCA9IDc0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIFV0aWwge1xuICBzdGF0aWMgY3JlYXRlQ2FudmFzKHNpemUsIGltYWdlKSB7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy53aWR0aCA9IHNpemU7XG4gICAgY2FudmFzLmhlaWdodCA9IHNpemU7XG4gICAgY2FudmFzLmdldENvbnRleHQoJzJkJykuZHJhd0ltYWdlKGltYWdlLCAwLCAwLCBzaXplLCBzaXplKTtcbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgc3RhdGljIHRocmVzaG9sZChyLCBnLCBiLCB2YWx1ZSkge1xuICAgIHJldHVybiAoMC4yMTI2KnIgKyAwLjcxNTIqZyArIDAuMDcyMipiID49IHZhbHVlKSA/IDI1NSA6IDA7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbC5qcyJdLCJzb3VyY2VSb290IjoiIn0=