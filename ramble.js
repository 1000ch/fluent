(function(window, undefined){
"use strict";
var 	win = window,
		doc = window.document;

var 	emptyArray = [],
		emptyObject = {},
		emptyFunction = function() {};

var 	slice = emptyArray.slice,
		forEach = emptyArray.forEach,
		indexOf = emptyArray.indexOf,
		filter = emptyArray.filter,
		every = emptyArray.every,
		some = emptyArray.some;
var 	rxConciseSelector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,//filter #id, tagName, .className
		rxReady = /complete|loaded|interactive/,//dom ready state
		rxWhitespace = /\s+/g,
		rxStringFormat = /\{(.+?)\}/g;

/**
 * argument is string or not
 * @param {Object} value
 * @return {Boolean}
 */
var isString = function(value) {
	return (typeof value === "string");
};
/**
 * argument is function or not
 * @param {Object} value
 * @return {Boolean}
 */
var isFunction = function(value) {
	return (typeof value === "function");
};
/**
 * argument is array or not
 * @param {Object} value
 * @return {Boolean}
 */
var isArray = Array.isArray || function(value) {
	return !!value && value.length;
};

/*
 extend and hook querySelectorAll

 selector branch for hook
     if selector is "#id", call getElementById
     if selector is ".className", call getElementsByClassName
     if selector is "tagName", call getElementsByTagName

 if context is given, search element with selector
 in context (or related condition).
 @param {String} selector css selector
 @param {HTMLElement|Array|String} 
 */
var qsaHook = function(selector, context) {
	var con = isString(context) ? qsaHook(selector) : context;
	var root = con ? con : doc;
	var mergeBuffer = [];
	var m = rxConciseSelector.exec(selector);
	if (m) {//regex result is not undefined
		if (m[1]) {//if selector is "#id"
			return doc.getElementById(m[1]);
		} else if (m[2]) {//if selector is "tagName"
			if(root.length !== undefined) {
				forEach.call(root, function(element) {
					merge(mergeBuffer, element.getElementsByTagName(selector));
				});
				return mergeBuffer;
			} else {
				return root.getElementsByTagName(selector);
			}
		} else if (m[3]) {//if selector is ".className"
			if(root.length !== undefined) {
				forEach.call(root, function(element) {
					merge(mergeBuffer, element.getElementsByClassName(m[3]));
				});
				return mergeBuffer;
			} else {
				return root.getElementsByClassName(m[3]);
			}
		}
	}
	if(root.length !== undefined) {
		forEach.call(root, function(element) {
			merge(mergeBuffer, element.getElementsByClassName(m[3]));
		});
		return mergeBuffer;
	} else {
		return root.querySelectorAll(selector);
	}
};

/**
 * merge array or object (like an array) into array
 * @param {Array} srcList
 * @param {Array|* which has length property}
 */
var merge = function(srcList, mergeList) {
	forEach.call(mergeList, function(mergeElement) {
		if(indexOf.call(srcList, mergeElement) < 0) {
			srcList[srcList.length] = mergeElement;
		}
	});
};

/**
 * extend object hardly
 * @description if same property exist, it will be overriden
 * @param {Object} obj
 * @param {Object}
 */
var extend = function(obj) {
	var key, arg, args = slice.call(arguments, 1),
		i = 0, len = args.length;
	for(;i < len;i++) {
		arg = args[i];
		for(key in arg) {
			//even if "key" property already exist, set into "key"
			if(arg.hasOwnProperty(key)) {
				obj[key] = arg[key];
			}
		}
	}
};

/**
 * extend object softly
 * @description if same property exist, it will not be overriden
 * @param {Object} obj
 * @param {Object}
 */
var fill = function(obj) {
	var key, arg, args = slice.call(arguments, 1),
		i = 0, len = args.length;
	for(;i < len;i++) {
		arg = args[i];
		for(key in arg) {
			//if "key" is not undefined, "key" will not be rewrite
			if(arg.hasOwnProperty(key) && !(key in obj)) {
				obj[key] = arg[key];
			}
		}
	}
};

var StringExtender = {
	format: function(replacement) {
		if (typeof replacement != "object") {
			replacement = slice.call(arguments);
		}
		return this.replace(/\{(.+?)\}/g, function(m, c) {
			return (replacement[c] != null) ? replacement[c] : m;
		});
	}
};

/**
 * base class
 * @param {String} obj
 * @param {String|HTMLElement}
 */
var Ramble = function(selector, context) {
	var elementList = [], len;
	if(selector.nodeType) {
		elementList = slice.call(selector);
	} else if(isArray(selector)) {
		elementList = selector.filter(function(item) {
			return !!item.nodeType;
		});
	} else if(isString(selector)) {
		elementList = qsaHook(selector, context);
	}
	len = this.length = elementList.length;
	while(len--) {
		this[len] = elementList[len];
	}
};

var _Prototype = {
	constructor: Ramble,
	length: 0, 
	each: function(callback) {
		var len = this.length;
		while(len--) {
			callback(this[len], len);
		}
		return this;
	}
};

var _Event = {
	_eventRegist: function(type, context, selector, callback) {
		var param = {
			context: context,
			param: {
				type: type,
				selector: selector,
				callback: callback
			}
		};
	},
	_eventHolder: [],
	ready: function(callback) {
		if (rxReady.test(doc.readyState)) {
			callback(this);
		} else {
			doc.addEventListener("DOMContentLoaded", function() {
				callback(this);
			}, false);
		}
	},
	bind: function(type, callback) {
		return this.each(function(element, index) {
			element.addEventListener(type, callback);
		});
	},
	unbind: function(type, callback) {
		return this.each(function(element, index) {
			element.removeEventListener(type, callback);
		});
	},
	live: function(type, selector, callback) {
		return this._eventRegist(document, type, function() {});
	},
	die: function(type, selector, callback) {},
	delegate: function(type, selector, callback) {},
	undelegate: function(type, selector, callback) {}
};

var _Manipulation = {
	filter: function(callback) {
		return new Ramble(filter.call(this, callback));
	},
	html: function(value) {
		return this.each(function(element, index) {
			if(element.innerHTML !== undefined) {
				element.innerHTML = value;
			}
		});
	},
	text: function(value) {
		return this.each(function(element, index) {
			if(element.textContent !== undefined) {
				element.textContent = value;
			}
		});
	},
	val: function(value) {
		return this.each(function(element, index) {
			if(element.value !== undefined) {
				element.value = value;
			}
		});
	},
	css: function(key, value) {
		return this.each(function(element, index) {
			element.style[key] = value;
		});
	},
	addClass: function(className) {
		var list = className.split(rxWhitespace);
		return this.each(function(element, index) {
			list.forEach(function(name) {
				element.classList.add(name);
			});
		});
	},
	removeClass: function(className) {
		var list = className.split(rxWhitespace);
		return this.each(function(element, index) {
			list.forEach(function(name) {
				element.classList.remove(name);
			});
		});
	},
	toggleClass: function(className) {
		var list = className.split(rxWhitespace);
		return this.each(function(element, index) {
			list.forEach(function(name) {
				element.classList.toggle(name);
			});
		});
	}
};

//extend Ramble prototype
extend(Ramble.prototype, _Prototype);
extend(Ramble.prototype, _Event);
extend(Ramble.prototype, _Manipulation);

if(typeof define === "function" && define.amd) {
	define();
}

win.$ = function(selector, context) {
	return new Ramble(selector, context);
};

})(window);