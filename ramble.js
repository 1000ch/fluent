/**
 * ramble.js
 *
 * Copyright 2012~, 1000ch<http://1000ch.net/>
 * licensed under the MIT license.
 **/
(function(window, undefined){
"use strict";
var win = window,
	doc = window.document;

//cache empty structure
var emptyArray = [],
	emptyObject = {},
	emptyFunction = function() {},
	emptyElement = doc.createElement("div");

//cache referrence
var objectToString = emptyObject.toString,
	objectCreate = Object.create,
	objectDefineProperty = Object.defineProperty,
	objectGetPropertyOf = Object.getPropertyOf,
	objectGetOwnPropertyNames = Object.getOwnPropertyNames,
	objectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
	arraySlice = emptyArray.slice,
	arraySplice = emptyArray.splice,
	arrayIndexOf = emptyArray.indexOf,
	arrayLastIndexOf = emptyArray.lastIndexOf,
	arrayForEach = emptyArray.forEach,
	arrayEvery = emptyArray.every,
	arraySome = emptyArray.some,
	arrayMap = emptyArray.map,
	arrayFilter = emptyArray.filter,
	arrayReduce = emptyArray.reduce,
	arrayReduceRight = emptyArray.reduceRight;

//array polyfill
if(!arrayIndexOf) {
	arrayIndexOf = function(searchElement) {
		if(this == null) {
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
			if(n != n) {
				n = 0;
			} else if(n != 0 && n != Infinity && n != -Infinity) {
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
}

if(!arrayLastIndexOf) {
	arrayLastIndexOf = function(searchElement) {
		if(this == null) {
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
			} else if(n != 0 && n != (1 / 0) && n != -(1 / 0)) {
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
}

if(!arrayForEach) {
	arrayForEach = function(callback, scope) {
		for(var i = 0, len = this.length; i < len; ++i) {
			callback.call(scope, this[i], i, this);
		}
	};
}

if(!arrayEvery) {
	arrayEvery = function(callback) {
		if(this == null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if(typeof fun != "function") {
			throw new TypeError();
		}
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if(i in t && !fun.call(thisp, t[i], i, t)) {
				return false;
			}
		}
		return true;
	};
}

if(!arraySome) {
	arraySome = function(callback) {
		if(this == null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if(typeof fun != "function") {
			throw new TypeError();
		}
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if(i in t && fun.call(thisp, t[i], i, t)) {
				return true;
			}
		}
		return false;
	};
}

if(!arrayMap) {
	arrayMap = function(callback, thisArg) {
		var T, A, k;
		if(this == null) {
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
}

if(!arrayFilter) {
	arrayFilter = function(callback) {
		if(this == null) {
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
}

if(!arrayReduce) {
	arrayReduce = function(callback) {
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
}

if(!arrayReduceRight) {
	arrayReduceRight = function(callback) {
		if(this == null) {
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
}

//regular expression
var rxConciseSelector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,//filter #id, tagName, .className
	rxIdSelector = /^#([\w-]+)$/,
	rxClassSelector = /^\.([\w-]+)$/,
	rxTagSelector = /^[\w-]+$/,
	rxReady = /complete|loaded|interactive/,//dom ready state
	rxWhitespace = /\s+/g;

var qs = "querySelector", 
	qsa = "querySelectorAll",
	hop = "hasOwnProperty";

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
 * value is string or not
 * @param {Object} value
 * @return {Boolean}
 */
function isString(value) {
	return (typeof value === "string");
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
 * value is nodeList or not
 * @param {Object} value
 * @return {Boolean}
 */
function isNodeList(value) {
	return (String(value) === "[object NodeList]");
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
 * @return {Object} target
 */
function commonEach(target, callback) {
	var args = arraySlice.call(arguments, 2);
	var i, len = target.length, key, result;
	if(args.length != 0) {
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
				result = callback.apply(target[key], target[key], i);
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
 * @param {Object} copy
 */
function commonCopy(target) {
	var copy = objectCreate(objectGetPropertyOf(target));
	var propertyNames = objectGetOwnPropertyNames(target);

	arrayForEach.call(propertyNames, function(name) {
		objectDefineProperty(copy, name, objectGetOwnPropertyDescriptor(target, name));
	});
	return copy;
}
/**
 * extend object hardly
 * @description if same property exist, it will be overriden
 * @param {Object} obj
 * @return {Object} obj
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
 * @return {Object} obj
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
		return (replacement[c] != null) ? replacement[c] : m;
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
		callback && callback();
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
		!args ? callback() : callback(args);
	} else {
		doc.addEventListener("DOMContentLoaded", function() {
			!args ? callback() : callback(args);
		}, false);
	}
}
/*
 * extend and hook querySelectorAll
 * evaluate selector concisely
 * 	if selector is "#id", call getElementById
 * 	if selector is ".className", call getElementsByClassName
 * 	if selector is "tagName", call getElementsByTagName

 * if context is given, search element with selector
 * in context (or related condition).
 * @param {String} selector css selector
 * @param {HTMLElement} context
 * @return {Array}
 */
function qsaHook(selector, context) {
	context = context ? context : doc;
	var m = rxConciseSelector.exec(selector);

	if (m) {//regex result is not undefined
		if (m[1]) {//if selector is "#id"
			return [doc.getElementById(m[1])];
		} else if (m[2]) {//if selector is "tagName"
			return arraySlice.call(context.getElementsByTagName(selector));
		} else if (m[3]) {//if selector is ".className"
			return arraySlice.call(context.getElementsByClassName(m[3]));
		}
	}
	return arraySlice.call(context[qsa](selector));
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
var Ramble = function(selector) {
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
var _RamblePrototype = {
	constructor: Ramble,
	length: 0,
	/**
	 * execute function to all element
	 * @param {Function} callback
	 * @return {Ramble}
	 */
	each: function(callback) {
		var args = arraySlice.call(arguments, 1);
		return commonEach(this, callback, args);
	},
	/**
	 * get all element
	 * @description not return Ramble object
	 * @return {Array<HTMLElement>}
	 */
	slice: function(from, to) {
		if(from) {
			if(to) {
				return arraySlice.call(this, from, to);
			} else {
				return arraySlice.call(this, from);
			}
		} else {
			return arraySlice.call(this);
		}
	},
	/**
	 * get all element
	 * @return {Array<HTMLElement>}
	 */
	toArray: function() {
		return arraySlice.call(this);
	}
};

/**
 * bind
 * @param {Array} targetList
 * @param {String} type
 * @param {Function} eventHandler
 * @param {Boolean} useCapture
 */
function bind(targetList, type, eventHandler, useCapture) {
	nativeForEach.call(targetList, function(target) {
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
function unbind(targetList, type, eventHandler, useCapture) {
	nativeForEach.call(targetList, function(target) {
		target.removeEventListener(type, eventHandler, useCapture);
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
function createClosure(parent, selector, eventHandler) {
	var closure = function(e) {
		var children = qsaHook(selector, parent);
		nativeForEach.call(children, function(child) {
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
function delegate(targetList, type, selector, eventHandler) {
	var closure = null;
	nativeForEach.call(targetList, function(target) {
		if(!target.closureList) {
			target.closureList = {};
		}
		if(!target.closureList.hasOwnProperty(type)) {
			target.closureList[type] = [];
		}
		closure = createClosure(target, selector, eventHandler);
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
function undelegate(targetList, type, selector, eventHandler) {
	nativeForEach.call(targetList, function(target) {
		if(target.closureList && target.closureList.hasOwnProperty(type)) {
			if(type && selector && eventHandler) {
				var array = target.closureList[type];
				var idx = searchIndex(array, EVENT_HANDLER, eventHandler);
				if(idx > -1) {
					target.removeEventListener(type, array[idx][CLOSURE]);
					target.closureList[type].splice(idx, 1);
				}
			} else if(type && selector && !eventHandler) {
				var array = target.closureList[type];
				var idx = searchIndex(array, SELECTOR, selector);
				if(idx > -1) {
					target.removeEventListener(type, array[idx][CLOSURE]);
					target.closureList[type].splice(idx, 1);
				}
			} else if(type && !selector && !eventHandler) {
				var itemList = target.closureList[type];
				nativeForEach.call(itemList, function(item) {
					target.removeEventListener(type, item[CLOSURE]);
				});
				delete target.closureList[type];
			}
		}
	});
}

var _RambleEvent = {
	/**
	 * bind event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture 
	 * @return {Ramble}
	 */
	bind: function(type, eventHandler, useCapture) {
		bind(this, type, eventHandler, useCapture);
		return this;
	},
	/**
	 * unbind event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture
	 * @return {Ramble}
	 */
	unbind: function(type, eventHandler, useCapture) {
		unbind(this, type, eventHandler, useCapture);
		return this;
	},
	/**
	 * begin propagation event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @return {Ramble}
	 */
	delegate: function(type, selector, eventHandler) {
		delegate(this, type, selector, eventHandler);
		return this;
	},
	/**
	 * finish propagation event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @return {Ramble}
	 */
	undelegate: function(type, selector, eventHandler) {
		undelegate(this, type, selector, eventHandler);
		return this;
	}
};
var _RambleTraversing = {
	/**
	 * get elements by search with callback
	 * @param {Function} callback
	 * @return {Ramble}
	 */
	filter: function(callback) {
		return new Ramble(arrayFilter.call(this, callback));
	},
	/**
	 * apply callback and get elements
	 * @param {Function} callback
	 * @return {Ramble}
	 */
	map: function(callback) {
		var array = [], element;
		for(var i = 0, len = this.length;i < len;i++) {
			element = callback(this[i], i);
			if(element != null) {
				array.push(element);
			}
		}
		return new Ramble(array);
	},
	/**
	 * get unique elements
	 * @return {Ramble}
	 */
	unique: function() {
		var array = this.slice();
		return new Ramble(arrayFilter.call(array, function(item, index){
			return array.indexOf(item) == index;
		}));
	},
	/**
	 * get all children
	 * @return {Ramble}
	 */
	children: function() {
		var array = [];
		for(var i = 0, len = this.length;i < len;i++) {
			array.push(arrayMap.call(this[i].childNodes, function(node) {
				if(node.nodeType == 1) {
					return node;
				}
			}));
		}
		return new Ramble(array);
	},
	/**
	 * @return {String} selector
	 */
	find: function(selector) {
		var array = [];
		for(var i = 0, len = this.length;i < len;i++) {
			mergeArray(array, qsaHook(selector, this[i]));
		}
		return new Ramble(array);
	}
};
var _RambleManipulation = {
	/**
	 * set innerHTML property of element
	 * @param {String} value
	 * @return {Ramble}
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
	 * @return {Ramble}
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
	 * @return {Ramble}
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
	 * @return {Ramble}
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
	 * @return {Ramble}
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
	 * @return {Ramble}
	 */
	css: function(key, value) {
		return this.each(function(element, index) {
			element.style[key] = value;
		});
	},
	/**
	 * add class to element
	 * @param {String} className
	 * @return {Ramble}
	 */
	addClass: function(className) {
		var list = className.split(rxWhitespace);
		return this.each(function(element, index) {
			list.forEach(function(name) {
				element.classList.add(name);
			});
		});
	},
	/**
	 * remove class from element
	 * @param {String} className
	 * @return {Ramble}
	 */
	removeClass: function(className) {
		if(!className){
			var classList, len;
			return this.each(function(element, index) {
				classList = element.classList, len = classList.length;
				while(len--) {
					classList.remove(classList[len]);
				}
			});
		}
		var list = className.split(rxWhitespace);
		return this.each(function(element, index) {
			list.forEach(function(name) {
				element.classList.remove(name);
			});
		});
	},
	/**
	 * toggle class of element
	 * @param {String} className
	 * @return {Ramble}
	 */
	toggleClass: function(className) {
		var list = className.split(rxWhitespace);
		return this.each(function(element, index) {
			list.forEach(function(name) {
				element.classList.toggle(name);
			});
		});
	},
	/**
	 * append element
	 * @param 
	 * @return {Ramble}
	 */
	append: function(value) {
		var nodeList = [];
		if(value instanceof Ramble) {
			nodeList = value.slice();
		} else if(isNodeList(value)) {
			nodeList = value;
		} else if(isLikeArray(value)) {
			for(var i = 0, len = value.length;i < len;i++) {
				if(value[i].nodeType) {
					nodeList[nodeList.length] = value[i];
				}
			}
		}
		return this;
	},
	/**
	 * prepend element
	 * @param
	 * @return {Ramble}
	 */
	prepend: function(value) {
		return this;
	},
	/**
	 * show all element as computed styles
	 */
	show: function() {
		for(var i = 0, len = this.length;i < len;i++) {
			this[i].style.display = "";
			(computedStyle(this[i], "display") === "none") ? this[i].style.display = "block" : 0;
		}
	},
	/**
	 * hide all element
	 */
	hide: function() {
		return this.css("display", "none");
	}
};
var _RambleAnimation = {
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
	 * @return {Ramble}
	 */
	delay: function(value) {
		this._delay.value = value;
		return this;
	},
	/**
	 * set duration
	 * @param {String} value
	 * @return {Ramble}
	 */
	duration: function(value) {
		this._duration.value = value;
		return this;
	},
	/**
	 * set ease
	 * @param {String} value
	 * @return {Ramble}
	 */
	ease: function(value) {
		this._ease.value = value;
		return this;
	},
	/**
	 * set skew
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Ramble}
	 */
	skew: function(x, y) {
		if(x == undefined || y == undefined) {
			return this;
		}
		this._transform.add(stringFormat("skew({0}deg, {1}deg)", x, y));
		return this;
	},
	/**
	 * set skewX
	 * @param {Number} x
	 * @return {Ramble}
	 */
	skewX: function(x) {
		if(x == undefined) {
			return this;
		}
		this._transform.add(stringFormat("skewX({0}deg)", x));
		return this;
	},
	/**
	 * set skewY
	 * @param {Number} y
	 * @return {Ramble}
	 */
	skewY: function(y) {
		if(y == undefined) {
			return this;
		}
		this._transform.add(stringFormat("skewY({0}deg)", y));
		return this;
	},
	/**
	 * set translate
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Ramble}
	 */
	translate: function(x, y) {
		if(x == undefined || y == undefined) {
			return this;
		}
		this._transform.add(stringFormat("translate({0}px, {1}px)", x, y));
		return this;
	},
	/**
	 * set translateX
	 * @param {Number} x
	 * @return {Ramble}
	 */
	translateX: function(x) {
		if(x == undefined) {
			return this;
		}
		this._transform.add(stringFormat("translateX({0}px)", x));
		return this;
	},
	/**
	 * set translateY
	 * @param {Number} y
	 * @return {Ramble}
	 */
	translateY: function(y) {
		if(y == undefined) {
			return this;
		}
		this._transform.add(stringFormat("translateY({0}px)", y));
		return this;
	},
	/**
	 * set scale
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Ramble}
	 */
	scale: function(x, y) {
		if(x == undefined || y == undefined) {
			return this;
		}
		this._transform.add(stringFormat("scale({0}, {1})", x, y));
		return this;
	},
	/**
	 * set scaleX
	 * @param {Number} x
	 * @return {Ramble}
	 */
	scaleX: function(x) {
		if(x == undefined) {
			return this;
		}
		this._transform.add(stringFormat("scaleX({0})", x));
		return this;
	},
	/**
	 * set scaleY
	 * @param {Number} y
	 * @return {Ramble}
	 */
	scaleY: function(y) {
		if(y == undefined) {
			return this;
		}
		this._transform.add(stringFormat("scaleY({0})", y));
		return this;
	},
	/**
	 * set rotate
	 * @param {Number} n
	 * @return {Ramble}
	 */
	rotate: function(n) {
		if(n == undefined) {
			return this;
		}
		this._transform.add(stringFormat("rotate({0}deg)", n));
		return this;
	},
	/**
	 * insert animation properties
	 * @return {Ramble}
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
		var key, p = this._param;
		for(key in p) {
			this.each(function(element, index){
				element.style[key] = p[key];
			});
		}
		this._param = {};
	}
};

//extend Ramble prototype
commonExtend(Ramble.prototype, _RamblePrototype);
commonExtend(Ramble.prototype, _RambleEvent);
commonExtend(Ramble.prototype, _RambleTraversing);
commonExtend(Ramble.prototype, _RambleManipulation);
commonExtend(Ramble.prototype, _RambleAnimation);

win.Ramble = Ramble;

//set $ as constructor alias to global
win.$ = function(selector, context) {
	return new Ramble(selector, context);
};

win.$.ready = onDocumentReady;
win.$.loadScript = loadScript;
win.$.extend = commonExtend;
win.$.fill = commonFill;

})(window);