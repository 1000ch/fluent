/**
 * fluent.js
 *
 * Copyright 2012~, 1000ch<http://1000ch.net/>
 * licensed under the MIT license.
 **/
(function(window, undefined){
"use strict";
var win = window,
	doc = window.document,
	loc = window.location;

//cache empty structure
var emptyArray = [],
	emptyObject = {},
	emptyFunction = function() {},
	emptyElement = doc.createElement("div");

//cache referrence
var arraySlice = Array.prototype.slice,
	arraySplice = Array.prototype.splice;

var arrayIndexOf = function(searchElement) {
	if(this === null) {
		throw new TypeError();
	}
	var t = Object(this);
	var len = t.length >>> 0;
	if(len === 0) {
		return -1;
	}
	var n = 0;
	if(arguments.length > 1) {
		n = Number(arguments[1]);
		if(n !== n) {
			n = 0;
		} else if(n !== 0 && n != Infinity && n != -Infinity) {
			n = (n > 0 || -1) * Math.floor(Math.abs(n));
		}
	}
	if(n >= len) {
			return -1;
	}
	var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
	for (; k < len; k++) {
		if(k in t && t[k] === searchElement) {
			return k;
		}
	}
	return -1;
};
var arrayLastIndexOf = function(searchElement) {
	if(this === null) {
		throw new TypeError();
	}
	var t = Object(this);
	var len = t.length >>> 0;
	if(len === 0) {
		return -1;
	}
	var n = len;
	if(arguments.length > 1) {
		n = Number(arguments[1]);
		if(n != n) {
			n = 0;
		} else if(n !== 0 && n != (1 / 0) && n != -(1 / 0)) {
			n = (n > 0 || -1) * Math.floor(Math.abs(n));
		}
	}
	var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);
	for (; k >= 0; k--) {
		if(k in t && t[k] === searchElement) {
			return k;
		}
	}
	return -1;
};
var arrayForEach = function(callback, scope) {
	for(var i = 0, len = this.length; i < len; ++i) {
		callback.call(scope, this[i], i, this);
	}
};
var arrayEvery = function(callback) {
	if(this === null) {
		throw new TypeError();
	}
	var t = Object(this);
	var len = t.length >>> 0;
	if(typeof callback != "function") {
		throw new TypeError();
	}
	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
		if(i in t && !callback.call(thisp, t[i], i, t)) {
			return false;
		}
	}
	return true;
};
var arraySome = function(callback) {
	if(this === null) {
		throw new TypeError();
	}
	var t = Object(this);
	var len = t.length >>> 0;
	if(typeof callback != "function") {
		throw new TypeError();
	}
	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
		if(i in t && callback.call(thisp, t[i], i, t)) {
			return true;
		}
	}
	return false;
};
var arrayMap = function(callback, thisArg) {
	var T, A, k;
	if(this === null) {
		throw new TypeError(" this is null or not defined");
	}
	var O = Object(this), len = O.length >>> 0;
	if(typeof callback !== "function") {
		throw new TypeError(callback + " is not a function");
	}
	if(thisArg) {
		T = thisArg;
	}
	A = new Array(len);
	k = 0;
	while(k < len) {
		var kValue, mappedValue;
		if(k in O) {
			kValue = O[k];
			mappedValue = callback.call(T, kValue, k, O);
			A[k] = mappedValue;
		}
		k++;
	}
	return A;
};
var arrayFilter = function(callback) {
	if(this === null) {
		throw new TypeError();
	}
	var t = Object(this);
	var len = t.length >>> 0;
	if(typeof callback != "function") {
		throw new TypeError();
	}
	var res = [];
	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
		if(i in t) {
			var val = t[i];
			if(callback.call(thisp, val, i, t)) {
				res.push(val);
			}
		}
	}
	return res;
};
var arrayReduce = function(callback) {
	if(this === null || this === undefined) {
		throw new TypeError("Object is null or undefined");
	}
	var i = 0, l = this.length >> 0, current;
	if(typeof accumulator !== "function") {
		throw new TypeError("First argument is not callable");
	}
	if(arguments.length < 2) {
		if(l === 0) {
			throw new TypeError("Array length is 0 and no second argument");
		}
		current = this[0];
		i = 1;
	} else {
		current = arguments[1];
	}
	while(i < l) {
		if(i in this) {
			current = callback.call(undefined, current, this[i], i, this);
		}
		++i;
	}
	return current;
};
var arrayReduceRight = function(callback) {
	if(this === null) {
		throw new TypeError();
	}
	var t = Object(this);
	var len = t.length >>> 0;
	if(typeof callback != "function") {
		throw new TypeError();
	}
	if(len === 0 && arguments.length === 1) {
		throw new TypeError();
	}
	var k = len - 1;
	var accumulator;
	if(arguments.length >= 2) {
		accumulator = arguments[1];
	} else {
		do {
			if(k in this) {
				accumulator = this[k--];
				break;
			}
			if(--k < 0) {
				throw new TypeError();
			}
		} while(true);
	}
	while(k >= 0) {
		if(k in t) {
			accumulator = callback.call(undefined, accumulator, t[k], k, t);
		}
		k--;
	}
	return accumulator;
};

if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = arrayIndexOf;
}
if(!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = arrayLastIndexOf;
}
if(!Array.prototype.forEach) {
	Array.prototype.forEach = arrayForEach;
}
if(!Array.prototype.every) {
	Array.prototype.every = arrayEvery;
}
if(!Array.prototype.filter) {
	Array.prototype.filter = arrayFilter;
}
if(!Array.prototype.some) {
	Array.prototype.some = arraySome;
}
if(!Array.prototype.map) {
	Array.prototype.map = arrayMap;
}
if(!Array.prototype.reduce) {
	Array.prototype.reduce = arrayReduce;
}
if(!Array.prototype.reduceRight) {
	Array.prototype.reduceRight = arrayReduceRight;
}

var stringRepeat = function(count) {
	if((count |= 0 ) <= 0) {
		throw new RangeError();
	}
	var result = '', self = this;
	while(count) {
		if(count & 1) {
			result += self;
		}
		if(count >= 1) {
			self += self;
		}
	}
	return result;
};
var stringStartsWith = function(value, position) {
	return (this.indexOf(value, position |= 0) === position);
};
var stringEndsWith = function(value, position) {
	return (this.lastIndexOf(value, position) === (position >= 0 ? position | 0 : this.length - 1));
};
var stringContains = function(value, index) {
	return (this.indexOf(value, index | 0) !== -1);
};
var stringToArray = function(value) {
	return this.split("");
};

if(!String.prototype.repeat) {
	String.prototype.repeat = stringRepeat;
}
if(!String.prototype.startsWith) {
	String.prototype.startsWith = stringStartsWith;
}
if(!String.prototype.endsWith) {
	String.prototype.endsWith = stringEndsWith;
}
if(!String.prototype.contains) {
	String.prototype.contains = stringContains;
}
if(!String.prototype.toArray) {
	String.prototype.toArray = stringToArray;
}

//regular expression
var rxConciseSelector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,//filter #id, tagName, .className
	rxIdSelector = /^#([\w\-]+)$/,
	rxClassSelector = /^\.([\w\-]+)$/,
	rxTagSelector = /^[\w\-]+$/,
	rxReady = /complete|loaded|interactive/;

var qs = "querySelector", 
	qsa = "querySelectorAll",
	hop = "hasOwnProperty",
	_encode = encodeURIComponent,
	_decode = decodeURIComponent;

//detect matchesSelector
var matches = "matchesSelector";
if(emptyElement.webkitMatchesSelector) {
	matches = "webkitMatchesSelector";
} else if(emptyElement.mozMatchesSelector) {
	matches = "mozMatchesSelector";
} else if(emptyElement.msMatchesSelector) {
	matches = "msMatchesSelector";
} else if(emptyElement.oMatchesSelector) {
	matches = "oMatchesSelector";
}
/**
 * value has key or not.
 * @param {String} key
 * @param {Object} value
 * @return {Boolean}
 */
function has(key, value) {
	return (key in value);
}
/**
 * value is typeof key, or not.
 * @param {String} key
 * @param {Object} value
 * @return {Boolean}
 */
function is(key, value) {
	return (Object.prototype.toString.call(value) === "[object " + key + "]");
}
/**
 * value is string or not
 * @param {Object} value
 * @return {Boolean}
 */
function isString(value) {
	return is("String", value);
}
/**
 * value is function or not
 * @param {Object} value
 * @return {Boolean}
 */
function isFunction(value) {
	return is("Function", value);
}
/**
 * value is nodeList or not
 * @param {Object} value
 * @return {Boolean}
 */
function isNodeList(value) {
	return is("NodeList", value);
}
/**
 * value is like an array or not
 * @param {Object} value
 * @return {Boolean}
 */
function isLikeArray(value) {
	return (typeof value.length == "number");
}
/**
 * get computed style of element
 * @param {HTMLDomElement} element
 * @param {String} key
 * @return {String}
 */
function computedStyle(element, key) {
	if(element.currentStyle) {
		return element.currentStyle[key];
	} else if(win.getComputedStyle) {
		return win.getComputedStyle(element, null).getPropertyValue(key);
	}
	return null;
}
/**
 * generic each function
 * @description if callback function returns false, break loop.
 * @param {Object} target
 * @param {Function} callback
 * @return {Object}
 */
function commonEach(target, callback) {
	var args = arraySlice.call(arguments, 2);
	var i, len = target.length, key, result;
	if(args.length !== 0) {
		//if args is not "false"
		if(isLikeArray(target)) {
			for(i = 0;i < len;i++) {
				result = callback.apply(target[i], args);
				if(result === false) {
					break;
				}
			}
		} else {
			for(key in target) {
				result = callback.apply(target[key], args);
				if(result === false) {
					break;
				}
			}
		}
	} else {
		//if args is null, undefined, 0, ""
		if(isLikeArray(target)) {
			for(i = 0;i < len;i++) {
				result = callback.call(target[i], target[i], i);
				if(result === false) {
					break;
				}
			}
		} else {
			for(key in target) {
				result = callback.call(target[key], target[key], i);
				if(result === false) {
					break;
				}
			}
		}
	}
	return target;
}
/**
 * copy object
 * @param {Object} target
 * @return {Object}
 */
function commonCopy(target) {
	var copy = Object.create(Object.getPropertyOf(target));
	var propertyNames = Object.getOwnPropertyNames(target);

	arrayForEach.call(propertyNames, function(name) {
		Object.defineProperty(copy, name, Object.getOwnPropertyDescriptor(target, name));
	});
	return copy;
}
/**
 * extend object hardly
 * @description if same property exist, it will be overriden
 * @param {Object} obj
 * @return {Object}
 */
function commonExtend(obj) {
	var key, arg, args = arraySlice.call(arguments, 1);
	for(var i = 0, len = args.length;i < len;i++) {
		arg = args[i];
		for(key in arg) {
			//even if "key" property already exist, set into "key"
			if(arg[hop](key)) {
				obj[key] = arg[key];
			}
		}
	}
	return obj;
}
/**
 * extend object softly
 * @description if same property exist, it will not be overriden
 * @param {Object} obj
 * @return {Object}
 */
function commonFill(obj) {
	var key, arg, args = arraySlice.call(arguments, 1);
	for(var i = 0, len = args.length;i < len;i++) {
		arg = args[i];
		for(key in arg) {
			//if "key" is not undefined, "key" will not be rewrite
			if(arg[hop](key) && !(key in obj)) {
				obj[key] = arg[key];
			}
		}
	}
	return obj;
}
/**
 * serialize object to query string
 * @param {Object} data
 * @return {String}
 */
function commonSerialize(data) {
	var ret = [], key, value;
	for(key in data) {
		if(data[hop](key)) {
			ret.push(_encode(key) + "=" + _encode(value));
		}
	}
	return ret.join("&").replace("%20", "+");
}
/**
 * deserialize query string
 * @param {String} data
 * @return {Object}
 */
function commonDeserialize(data) {
	var ret = {}, query = "";
	if(data) {
		query = data;
	} else {
		var href = loc.href, index = href.indexOf("?");
		query = href.substring(index + 1);
	}
	if(query.charAt(0) == "?") {
		query = query.substring(1);
	}
	var array = query.split("&"), buffer = [];
	for(var i = 0, len = array.length;i < len;i++) {
		buffer = array[i].split("=");
		if(buffer.length == 2) {
			ret[_decode(buffer[0])] = _decode(buffer[1]);
		}
	}
	return ret;
}
/**
 * string format
 * @param {String} str
 * @param {Object} replacement
 * @return {String}
 */
function stringFormat(str, replacement) {
	if (typeof replacement != "object") {
		replacement = arraySlice.call(arguments);
	}
	return str.replace(/\{(.+?)\}/g, function(m, c) {
		return (replacement[c] !== null) ? replacement[c] : m;
	});
}
/**
 * camelize
 * @param {String} str
 * @return {String}
 */
function stringCamelize(str) {
	return str.replace(/-+(.)?/g, function(match, character){
		return character ? character.toUpperCase() : "";
	});
}
/**
 * dasherize
 * @param {String} str
 * @return {String}
 */
function stringDasherize(str) {
	return str.replace(/::/g, '/')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
		.replace(/([a-z\d])([A-Z])/g, '$1_$2')
		.replace(/_/g, '-')
		.toLowerCase();
}
/**
 * load script immediately or asynchronously
 * @param {String} path
 * @param {Function} callback
 * @param {String} async
 * @param {String} defer
 */
function loadScript(path, callback, async, defer) {
	var script = doc.createElement("script");

	script.src = path;
	script.charset = "utf-8";
	script.type = "text/javascript";
	script.async = (async === undefined ? false : async);
	script.defer = (defer === undefined ? false : defer);

	script.onload = script.onreadystatechange = function() {
		script.onload = script.onreadystatechange = null;
		if(callback) {
			callback();
		}
	};

	doc[qs]("head").appendChild(script);
}
/**
 * execute callback when dom content loaded
 * @param {Function} callback
 */
function onDocumentReady(callback) {
	var args = arraySlice.call(arguments, 1);
	if (rxReady.test(doc.readyState)) {
		if(!args) {
			callback.call(doc);
		} else {
			callback.apply(doc, args);
		}
	} else {
		doc.addEventListener("DOMContentLoaded", function() {
			if(!args) {
				callback.call(doc);
			} else {
				callback.apply(doc, args);
			}
		}, false);
	}
}
/*
 * extend and hook querySelectorAll
 * evaluate selector concisely
 * if selector is "#id", call getElementById
 * if selector is ".className", call getElementsByClassName
 * if selector is "tagName", call getElementsByTagName

 * if context is given, search element with selector
 * in context (or related condition).
 * @param {String} selector css selector
 * @param {HTMLElement} context
 * @return {Array}
 */
function qsaHook(selector, context) {
	context = context ? context : doc;

	var m = rxConciseSelector.exec(selector);

	if(m) {//regex result is not undefined
		if(m[1]) {//if selector is "#id"
			return [doc.getElementById(m[1])];
		} else if(m[2]) {//if selector is "tagName"
			return context.getElementsByTagName(m[2]);
		} else if(m[3]) {//if selector is ".className"
			return context.getElementsByClassName(m[3]);
		}
	}

	//process for case of "#id [any selector]"
	var token, tokenList = selector.split(" ");
	var tokenIndex = arrayLastIndexOf.call(tokenList, rxIdSelector);
	if(tokenIndex > -1) {
		//last id selector
		token = tokenList.slice(tokenIndex + 1).join(" ");
		if(tokenIndex + 1 == tokenList.length) {
			return [doc.getElementById(tokenList[tokenList + 1])];
		} else {
			return qsaHook(token, doc.getElementById(tokenList[tokenIndex]));
		}
	}

	return context[qsa](selector);
}
/**
 * merge array or object (like an array) into array
 * @param {Array} srcList
 * @param {Array|* which has length property}
 */
function mergeArray(srcList, mergeList) {
	arrayForEach.call(mergeList, function(mergeElement) {
		if(arrayIndexOf.call(srcList, mergeElement) < 0) {
			srcList[srcList.length] = mergeElement;
		}
	});
}
/**
 * base class
 * @param {String} obj
 * @param {String|HTMLElement}
 */
var Fluent = function(selector) {
	var elementList = [], len;
	if(isString(selector)) {
		//if selector is string
		elementList = qsaHook(selector);
	} else if(selector.nodeType) {
		//if selector is single dom element
		elementList = [selector];
	} else if(isLikeArray(selector)) {
		//if selector is array,
		//select only dom element
		elementList = arrayFilter.call(selector, function(item) {
			return !!item.nodeType;
		});
	}
	len = this.length = elementList.length;
	while(len--) {
		this[len] = elementList[len];
	}
};
/**
 * base prototype
 */
Fluent.fn = { constructor: Fluent };

//mapping fn to prototype
Fluent.prototype = Fluent.fn;

/**
 * execute function to all element
 * @param {Function} callback
 * @return {Fluent}
 */
Fluent.fn.each = function(callback) {
	var args = arraySlice.call(arguments, 1);
	return commonEach(this, callback, args);
};

/**
 * get all element
 * @return {Array<HTMLElement>}
 */
Fluent.fn.toArray = function() {
	return arraySlice.call(this);
};

/**
 * create proxy
 * @param {Function} callback
 * @param {Object} target
 */
function proxy(callback, target) {
	return function() {
		return callback.apply(target, arguments);
	};
}
/**
 * bind
 * @param {Array} targetList
 * @param {String} type
 * @param {Function} eventHandler
 * @param {Boolean} useCapture
 */
function eventBind(targetList, type, eventHandler, useCapture) {
	arrayForEach.call(targetList, function(target) {
		target.addEventListener(type, eventHandler, useCapture);
	});
}
/**
 * unbind
 * @param {Array} targetList
 * @param {String} type
 * @param {Function} eventHandler
 * @param {Boolean} useCapture
 */
function eventUnbind(targetList, type, eventHandler, useCapture) {
	arrayForEach.call(targetList, function(target) {
		target.removeEventListener(type, eventHandler, useCapture);
	});
}
/**
 * once
 * @param {Array} targetList
 * @param {String} type
 * @param {Function} eventHandler
 * @param {Boolean} useCapture
 */
function eventOnce(targetList, type, eventHandler, useCapture) {
	arrayForEach.call(targetList, function(target) {
		var wrapOnce = function(e) {
			eventHandler.call(target, e);
			target.removeEventListener(type, wrapOnce, useCapture);
		};
		target.addEventListener(type, wrapOnce, useCapture);
	});
}
/**
 * search index
 * @param {Array} array
 * @param {String} propertyName
 * @param {Object} compareData
 */
function searchIndex(array, propertyName, compareData) {
	var data;
	for(var i = 0, len = array.length;i < len;i++) {
		data = array[i];
		if(data[propertyName] == compareData) {
			return i;
		}
	}
	return -1;
}
/**
 * create callback closure
 * @param {HTMLElement} parent
 * @param {String} selector
 * @param {Function} eventHandler
 */
function _createDelegateClosure(parent, selector, eventHandler) {
	var closure = function(e) {
		var children = qsaHook(selector, parent);
		arrayForEach.call(children, function(child) {
			if(e.target === child) {
				eventHandler.call(child, e);
			}
		});
	};
	return closure;
}

//constant
var CLOSURE = "closure";
var EVENT_HANDLER = "eventHandler";
var SELECTOR = "selector";

/**
 * delegate
 * @param {Array} targetList
 * @param {String} type
 * @param {String} selector
 * @param {Function} eventHandler
 */
function eventDelegate(targetList, type, selector, eventHandler) {
	var closure = null;
	arrayForEach.call(targetList, function(target) {
		if(!target.closureList) {
			target.closureList = {};
		}
		if(!target.closureList[hop](type)) {
			target.closureList[type] = [];
		}
		closure = _createDelegateClosure(target, selector, eventHandler);
		if(searchIndex(target.closureList[type], CLOSURE, closure) < 0) {
			target.closureList[type].push({
				selector: selector,
				eventHandler: eventHandler,
				closure: closure
			});
		}
		target.addEventListener(type, closure);
	});
}

/**
 * undelegate
 * @param {Array} targetList
 * @param {String} type
 * @param {String*} selector
 * @param {Function*} eventHandler
 */
function eventUndelegate(targetList, type, selector, eventHandler) {
	var array, index;
	arrayForEach.call(targetList, function(target) {
		if(target.closureList && target.closureList[hop](type)) {
			if(type && selector && eventHandler) {
				array = target.closureList[type];
				index = searchIndex(array, EVENT_HANDLER, eventHandler);
				if(index > -1) {
					target.removeEventListener(type, array[index][CLOSURE]);
					target.closureList[type].splice(index, 1);
				}
			} else if(type && selector && !eventHandler) {
				array = target.closureList[type];
				index = searchIndex(array, SELECTOR, selector);
				if(index > -1) {
					target.removeEventListener(type, array[index][CLOSURE]);
					target.closureList[type].splice(index, 1);
				}
			} else if(type && !selector && !eventHandler) {
				var itemList = target.closureList[type];
				arrayForEach.call(itemList, function(item) {
					target.removeEventListener(type, item[CLOSURE]);
				});
				delete target.closureList[type];
			}
		}
	});
}

var _FluentEvent = {
	/**
	 * bind event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture 
	 * @return {Fluent}
	 */
	bind: function(type, eventHandler, useCapture) {
		eventBind(this, type, eventHandler, useCapture);
		return this;
	},
	/**
	 * unbind event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture
	 * @return {Fluent}
	 */
	unbind: function(type, eventHandler, useCapture) {
		eventUnbind(this, type, eventHandler, useCapture);
		return this;
	},
	/**
	 * bind event once
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture
	 * @return {Fluent}
	 */
	once: function(type, eventHandler, useCapture) {
		eventOnce(this, type, eventHandler, useCapture);
		return this;
	},
	/**
	 * begin propagation event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @return {Fluent}
	 */
	delegate: function(type, selector, eventHandler) {
		eventDelegate(this, type, selector, eventHandler);
		return this;
	},
	/**
	 * finish propagation event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @return {Fluent}
	 */
	undelegate: function(type, selector, eventHandler) {
		eventUndelegate(this, type, selector, eventHandler);
		return this;
	}
};
var _FluentTraversing = {
	/**
	 * get elements by search with callback
	 * @param {Function} callback
	 * @return {Fluent}
	 */
	filter: function(callback) {
		return new Fluent(arrayFilter.call(this, callback));
	},
	/**
	 * apply callback and get elements
	 * @param {Function} callback
	 * @return {Fluent}
	 */
	map: function(callback) {
		var array = [], element;
		for(var i = 0, len = this.length;i < len;i++) {
			element = callback(this[i], i);
			if(element !== null) {
				array.push(element);
			}
		}
		return new Fluent(array);
	},
	/**
	 * get unique elements
	 * @return {Fluent}
	 */
	unique: function() {
		var array = this.toArray();
		return new Fluent(arrayFilter.call(array, function(item, index){
			return array.indexOf(item) == index;
		}));
	},
	/**
	 * get all children
	 * @return {Fluent}
	 */
	children: function() {
		var array = [];
		for(var i = 0, len = this.length;i < len;i++) {
			if(this[i].firstChild) {
				var childNodes = this[i].childNodes;
				for(var j = 0, nodeLen = childNodes.length;j < nodeLen;j++) {
					array.push(childNodes[j]);
				}
			}
		}
		return new Fluent(array);
	},
	/**
	 * @return {String} selector
	 */
	find: function(selector) {
		var array = [];
		for(var i = 0, len = this.length;i < len;i++) {
			mergeArray(array, qsaHook(selector, this[i]));
		}
		return new Fluent(array);
	}
};

/**
 * add class to element
 * @param {HTMLElement} targetNode
 * @param {String} value
 */
function _addClass(targetNode, value) {
	var arrayBuffer = targetNode.className.split(" ");
	var valueIndex = arrayBuffer.indexOf(value + "");
	if(valueIndex == -1) {
		//if does not exist
		targetNode.className = arrayBuffer.push(value).join(" ");
	}
}

/**
 * remove class from element
 * @param {HTMLElement} targetNode
 * @param {String} value
 */
function _removeClass(targetNode, value) {
	var arrayBuffer = targetNode.className.split(" ");
	var valueIndex = arrayBuffer.indexOf(value + "");
	if(valueIndex != -1) {
		//if exist
		arrayBuffer.splice(valueIndex, 1);
		targetNode.className = arrayBuffer.join(" ");
	}
}

/**
 * toggle class of element
 * @param {HTMLElement} targetNode
 * @param {String} value
 */
function _toggleClass(targetNode, value) {
	var arrayBuffer = targetNode.className.split(" ");
	var valueIndex = arrayBuffer.indexOf(value + "");
	if(valueIndex == -1) {
		//if does not exist
		targetNode.className = arrayBuffer.push(value).join(" ");
	} else {
		//if exist
		arrayBuffer.splice(valueIndex, 1);
		targetNode.className = arrayBuffer.join(" ");
	}
}

/**
 * target has class or not.
 * @param {HTMLElement} targetNode
 * @param {String} value
 */
function _hasClass(targetNode, value) {
	var arrayBuffer = targetNode.className.split(" ");
	return (arrayBuffer.indexOf(value + "") != -1);
}

/**
 * normalize object to node array.
 * @param {Fluent|NodeList|Array} value
 */
function _normalizeNode(value) {
	var nodeList = [];
	if(value.nodeType) {
		nodeList.push(value);
	} else if(value instanceof Fluent) {
		nodeList = value.toArray();
	} else if(isNodeList(value)) {
		nodeList = value;
	} else if(isLikeArray(value)) {
		for(var i = 0, len = value.length;i < len;i++) {
			if(value[i].nodeType) {
				nodeList[nodeList.length] = value[i];
			}
		}
	}
	return nodeList;
}

var _FluentManipulation = {
	/**
	 * set innerHTML property of element
	 * @param {String} value
	 * @return {Fluent}
	 */
	html: function(value) {
		return this.each(function(element, index) {
			if(element.innerHTML !== undefined) {
				element.innerHTML = value;
			}
		});
	},
	/**
	 * set textContent property of element
	 * @param {String} value
	 * @return {Fluent}
	 */
	text: function(value) {
		return this.each(function(element, index) {
			if(element.textContent !== undefined) {
				element.textContent = value;
			}
		});
	},
	/**
	 * set value property of element
	 * @param {String} value
	 * @return {Fluent}
	 */
	val: function(value) {
		return this.each(function(element, index) {
			if(element.value !== undefined) {
				element.value = value;
			}
		});
	},
	/**
	 * set or add attribute
	 * @param {String} key
	 * @param {String} value
	 * @return {Fluent}
	 */
	attr: function(key, value) {
		return this.each(function(element, index) {
			element.setAttribute(key, value);
		});
	},
	/**
	 * set or add dataset
	 * @param {String} key
	 * @param {String} value
	 * @return {Fluent}
	 */
	data: function(key, value) {
		var datasetAttr = stringCamelize("data-" + key);
		return this.each(function(element, index) {
			element.dataset[datasetAttr] = value;
		});
	},
	/**
	 * set style of element
	 * @param {String} key
	 * @param {String} value
	 * @return {Fluent}
	 */
	css: function(key, value) {
		return this.each(function(element, index) {
			element.style[key] = value;
		});
	},
	/**
	 * add class to element
	 * @param {String} className
	 * @return {Fluent}
	 */
	addClass: function(className) {
		if(!className) {
			return this;
		}
		var list = className.split(" ");
		return this.each(function(element, index) {
			for(var i = 0, len = list.length;i < len;i++) {
				_addClass(element, list[i]);
			}
		});
	},
	/**
	 * remove class from element
	 * @param {String} className
	 * @return {Fluent}
	 */
	removeClass: function(className) {
		if(!className){
			return this;
		}
		var list = className.split(" ");
		return this.each(function(element, index) {
			for(var i = 0, len = list.length;i < len;i++) {
				_removeClass(element, list[i]);
			}
		});
	},
	/**
	 * remove all class from element
	 * @return {Fluent}
	 */
	removeAllClass: function() {
		var classList, len;
		return this.each(function(element, index) {
			classList = element.classList, len = classList.length;
			while(len--) {
				classList.remove(classList[len]);
			}
		});
	},
	/**
	 * toggle class of element
	 * @param {String} className
	 * @return {Fluent}
	 */
	toggleClass: function(className) {
		if(!className){
			return this;
		}
		var list = className.split(" ");
		return this.each(function(element, index) {
			for(var i = 0, len = list.length;i < len;i++) {
				_toggleClass(element, list[i]);
			}
		});
	},
	/**
	 * append element
	 * @param 
	 * @return {Fluent}
	 */
	append: function(value) {
		var nodeList = _normalizeNode(value);
		commonEach(this, function(element) {
			for(var i = 0, len = nodeList.length;i < len;i++) {
				element.appendChild(nodeList[i]);
			}
		});
		return this;
	},
	/**
	 * insert element
	 * @param
	 * @return {Fluent}
	 */
	insert: function(value) {
		var nodeList = _normalizeNode(value);
		commonEach(this, function(element) {
			for(var i = 0, len = nodeList.length;i < len;i++) {
				element.insertBefore(nodeList[i], element.firstChild);
			}
		});
		return this;
	},
	/**
	 * show all element as computed styles
	 */
	show: function() {
		for(var i = 0, len = this.length;i < len;i++) {
			this[i].style.display = "";
			if(computedStyle(this[i], "display") === "none") {
				this[i].style.display = "block";
			}
		}
	},
	/**
	 * hide all element
	 */
	hide: function() {
		return this.css("display", "none");
	}
};
var _FluentAnimation = {
	_param: {},
	_prefix: ["-webkit-", "-moz-", "-ms-", "-o-", ""],
	_transform: {
		key: "transform",
		values: [],
		add: function(value) {
			if(this.values.indexOf(value) < 0) {
				this.values.push(value);
			}
		}
	},
	_transitionProperties: {
		key: "transition-properties",
		values: [],
		add: function(value) {
			if(this.values.indexOf(value) < 0) {
				this.values.push(value);
			}
		}
	},
	_delay: {
		key: "transition-delay",
		value: "0ms"
	},
	_duration: {
		key: "transition-duration",
		value: "1000ms"
	},
	_ease: {
		key: "transition-timing-function",
		value: "ease"
	},
	_setProperty: function(key, value) {
		this._param[key] = value;
	},
	/**
	 * set delay
	 * @param {String} value
	 * @return {Fluent}
	 */
	delay: function(value) {
		this._delay.value = value;
		return this;
	},
	/**
	 * set duration
	 * @param {String} value
	 * @return {Fluent}
	 */
	duration: function(value) {
		this._duration.value = value;
		return this;
	},
	/**
	 * set ease
	 * @param {String} value
	 * @return {Fluent}
	 */
	ease: function(value) {
		this._ease.value = value;
		return this;
	},
	/**
	 * set skew
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Fluent}
	 */
	skew: function(x, y) {
		if(x === undefined || y === undefined) {
			return this;
		}
		this._transform.add(stringFormat("skew({0}deg, {1}deg)", x, y));
		return this;
	},
	/**
	 * set skewX
	 * @param {Number} x
	 * @return {Fluent}
	 */
	skewX: function(x) {
		if(x === undefined) {
			return this;
		}
		this._transform.add(stringFormat("skewX({0}deg)", x));
		return this;
	},
	/**
	 * set skewY
	 * @param {Number} y
	 * @return {Fluent}
	 */
	skewY: function(y) {
		if(y === undefined) {
			return this;
		}
		this._transform.add(stringFormat("skewY({0}deg)", y));
		return this;
	},
	/**
	 * set translate
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Fluent}
	 */
	translate: function(x, y) {
		if(x === undefined || y === undefined) {
			return this;
		}
		this._transform.add(stringFormat("translate({0}px, {1}px)", x, y));
		return this;
	},
	/**
	 * set translateX
	 * @param {Number} x
	 * @return {Fluent}
	 */
	translateX: function(x) {
		if(x === undefined) {
			return this;
		}
		this._transform.add(stringFormat("translateX({0}px)", x));
		return this;
	},
	/**
	 * set translateY
	 * @param {Number} y
	 * @return {Fluent}
	 */
	translateY: function(y) {
		if(y === undefined) {
			return this;
		}
		this._transform.add(stringFormat("translateY({0}px)", y));
		return this;
	},
	/**
	 * set scale
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Fluent}
	 */
	scale: function(x, y) {
		if(x === undefined || y === undefined) {
			return this;
		}
		this._transform.add(stringFormat("scale({0}, {1})", x, y));
		return this;
	},
	/**
	 * set scaleX
	 * @param {Number} x
	 * @return {Fluent}
	 */
	scaleX: function(x) {
		if(x === undefined) {
			return this;
		}
		this._transform.add(stringFormat("scaleX({0})", x));
		return this;
	},
	/**
	 * set scaleY
	 * @param {Number} y
	 * @return {Fluent}
	 */
	scaleY: function(y) {
		if(y === undefined) {
			return this;
		}
		this._transform.add(stringFormat("scaleY({0})", y));
		return this;
	},
	/**
	 * set rotate
	 * @param {Number} n
	 * @return {Fluent}
	 */
	rotate: function(n) {
		if(n === undefined) {
			return this;
		}
		this._transform.add(stringFormat("rotate({0}deg)", n));
		return this;
	},
	/**
	 * insert animation properties
	 * @return {Fluent}
	 */
	animate: function() {
		var prefix;
		for(var i = 0, len = this._prefix.length;i < len;i ++) {
			prefix = this._prefix[i];
			this._setProperty(prefix + this._ease.key, this._ease.value);
			this._setProperty(prefix + this._delay.key, this._delay.value);
			this._setProperty(prefix + this._duration.key, this._duration.value);
			this._setProperty(prefix + this._transform.key, this._transform.values.join(" "));
			this._setProperty(prefix + this._transitionProperties.key, this._transitionProperties.values.join(", "));
		}
		this.each(function(element, index){
			var key, p = this._param;
			for(key in p) {
				element.style[key] = p[key];
			}
		});
		this._param = {};
	}
};

//extend Fluent prototype
commonExtend(Fluent.fn, _FluentEvent);
commonExtend(Fluent.fn, _FluentTraversing);
commonExtend(Fluent.fn, _FluentManipulation);
commonExtend(Fluent.fn, _FluentAnimation);

win.Fluent = Fluent;

//set $ as constructor alias to global
win.$ = function(selector, context) {
	return new Fluent(selector, context);
};

win.Event = {
	ready: onDocumentReady,
	bind: eventBind,
	unbind: eventUnbind,
	once: eventOnce,
	delegate: eventDelegate,
	undelegate: eventDelegate
};
win.CommonUtil = {
	extend: commonExtend,
	fill: commonFill,
	each: commonEach,
	copy: commonCopy,
	serialize: commonSerialize,
	deserialize: commonDeserialize,
	loadScript: loadScript,
	is: is,
	has: has
};
win.StringUtil = {
	camelize: stringCamelize,
	dasherize: stringDasherize,
	format: stringFormat
};

})(window);