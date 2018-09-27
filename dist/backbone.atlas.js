(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define("Atlas", ["backbone", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["Atlas"] = factory(require("backbone"), require("underscore"));
	else
		root["Atlas"] = factory(root["Backbone"], root["_"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_backbone__, __WEBPACK_EXTERNAL_MODULE_underscore__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Collection.js":
/*!***********************!*\
  !*** ./Collection.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.Collection = undefined;\n\nvar _underscore = __webpack_require__(/*! underscore */ \"underscore\");\n\nvar _underscore2 = _interopRequireDefault(_underscore);\n\nvar _backbone = __webpack_require__(/*! backbone */ \"backbone\");\n\nvar _backbone2 = _interopRequireDefault(_backbone);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar Collection = exports.Collection = _backbone2.default.Collection.extend({\n    model: null,\n\n    parent: null,\n\n    filters: {},\n\n    /**\n     * Override the default `initialize` to support nested models by default.\n     * If overriding this method, make sure you always call BaseModel.prototype.initialize.apply(this, options) first.\n     *\n     * @param models\n     * @param options\n     */\n    initialize: function initialize() {\n        var models = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n\n        _backbone2.default.Collection.prototype.initialize.call(this, models, options);\n\n        this.parent = options.parent || null;\n\n        // Allow extended classes to specify different default filters\n        this.filters = _underscore2.default.clone(this.filters);\n        _underscore2.default.assign(this.filters, options.filters);\n    },\n\n\n    /**\n     * Override default `url` method so that url can be derived from associated model.\n     *\n     * @returns {string}\n     */\n    url: function url() {\n        var base = this.parent ? this.parent.url() : \"\";\n        var urlRoot = this.urlRoot ? this.urlRoot : this.model.prototype.urlRoot;\n\n        return base + urlRoot;\n    },\n    sync: function sync(method, model, options) {\n        var _this = this;\n\n        var beforeSend = options.beforeSend;\n        options.beforeSend = function (jqXHR, settings) {\n            settings.url = (_this.model.prototype.baseUrl ? _this.model.prototype.baseUrl : \"\") + settings.url;\n            settings.crossDomain = true;\n\n            _underscore2.default.each(_this.model.prototype.headers, function (value, header) {\n                jqXHR.setRequestHeader(header, value);\n            });\n\n            if (beforeSend) {\n                return beforeSend.call(_this, jqXHR, settings);\n            }\n\n            return null;\n        };\n\n        return _backbone2.default.Collection.prototype.sync.call(this, method, model, options);\n    },\n    fetch: function fetch() {\n        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n        _underscore2.default.defaults(options, { data: {} });\n        _underscore2.default.extend(options.data, this.filters);\n\n        return _backbone2.default.Collection.prototype.fetch.apply(this, [options]);\n    }\n});\n\n//# sourceURL=webpack://Atlas/./Collection.js?");

/***/ }),

/***/ "./Model.js":
/*!******************!*\
  !*** ./Model.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.Model = undefined;\n\nvar _underscore = __webpack_require__(/*! underscore */ \"underscore\");\n\nvar _underscore2 = _interopRequireDefault(_underscore);\n\nvar _backbone = __webpack_require__(/*! backbone */ \"backbone\");\n\nvar _backbone2 = _interopRequireDefault(_backbone);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar Model = exports.Model = _backbone2.default.Model.extend({\n    baseUrl: null,\n    urlRoot: null,\n    headers: {},\n\n    parent: null,\n    parentUrlRoot: null,\n\n    filters: {},\n\n    /**\n     * Override the default `initialize` to support nested models by default.\n     * If overriding this method, make sure you always call BaseModel.prototype.initialize.apply(this, options) first.\n     *\n     * @param {object} attributes\n     * @param {object} [options={}]\n     */\n    initialize: function initialize(attributes) {\n        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n\n        _underscore2.default.defaults(options, {\n            baseUrl: null,\n            urlRoot: null,\n            headers: {},\n            parent: _underscore2.default.result(options.collection, \"parent\", null),\n            filters: {}\n        });\n\n        this.baseUrl = options.baseUrl || this.baseUrl;\n        this.urlRoot = options.urlRoot || this.urlRoot;\n        this.headers = _underscore2.default.clone(this.headers);\n        _underscore2.default.assign(this.headers, options.headers);\n        this.parent = options.parent;\n        this.filters = _underscore2.default.clone(this.filters);\n        _underscore2.default.assign(this.filters, options.filters);\n    },\n\n\n    /**\n     * Override the default `url` method so that nested urls can be constructed.\n     *\n     * @param {(string|null)} [urlRoot=null]\n     * @returns {string}\n     */\n    url: function url() {\n        var urlRoot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n\n        var parentUrl = this.parent ? this.parent.url(this.parentUrlRoot) : \"\";\n\n        var url = void 0;\n        if (urlRoot) {\n            if (this.isNew()) {\n                url = urlRoot;\n            } else {\n                var id = this.get(this.idAttribute);\n                // eslint-disable-next-line no-useless-escape\n                url = urlRoot.replace(/[^\\/]$/, \"$&/\") + encodeURIComponent(id);\n            }\n        } else {\n            url = _backbone2.default.Model.prototype.url.apply(this);\n        }\n\n        return parentUrl + url;\n    },\n    sync: function sync(method, model, options) {\n        var _this = this;\n\n        var beforeSend = options.beforeSend;\n        options.beforeSend = function (jqXHR, settings) {\n            settings.url = (_this.baseUrl ? _this.baseUrl : \"\") + settings.url;\n            settings.crossDomain = true;\n\n            _underscore2.default.each(_this.headers, function (value, header) {\n                jqXHR.setRequestHeader(header, value);\n            });\n\n            if (beforeSend) {\n                return beforeSend.call(_this, jqXHR, settings);\n            }\n\n            return null;\n        };\n\n        return _backbone2.default.Model.prototype.sync.call(this, method, model, options);\n    },\n    fetch: function fetch() {\n        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n        _underscore2.default.defaults(options, {\n            data: {}\n        });\n        _underscore2.default.extend(options.data, this.filters);\n\n        return _backbone2.default.Model.prototype.fetch.call(this, options);\n    }\n});\n\n//# sourceURL=webpack://Atlas/./Model.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _Collection = __webpack_require__(/*! ./Collection */ \"./Collection.js\");\n\nvar _Model = __webpack_require__(/*! ./Model */ \"./Model.js\");\n\nmodule.exports = {\n    Collection: _Collection.Collection,\n    Model: _Model.Model\n};\n\n//# sourceURL=webpack://Atlas/./index.js?");

/***/ }),

/***/ "backbone":
/*!**************************************************************************************************!*\
  !*** external {"commonjs":"backbone","commonjs2":"backbone","amd":"backbone","root":"Backbone"} ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_backbone__;\n\n//# sourceURL=webpack://Atlas/external_%7B%22commonjs%22:%22backbone%22,%22commonjs2%22:%22backbone%22,%22amd%22:%22backbone%22,%22root%22:%22Backbone%22%7D?");

/***/ }),

/***/ "underscore":
/*!*************************************************************************************************!*\
  !*** external {"commonjs":"underscore","commonjs2":"underscore","amd":"underscore","root":"_"} ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_underscore__;\n\n//# sourceURL=webpack://Atlas/external_%7B%22commonjs%22:%22underscore%22,%22commonjs2%22:%22underscore%22,%22amd%22:%22underscore%22,%22root%22:%22_%22%7D?");

/***/ })

/******/ });
});