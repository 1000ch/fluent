(function(window, undefined){
"use strict";
var win = window,
	doc = window.document;

var emptyArray = [],
	emptyObject = {},
	emptyFunction = function() {};

var slice = emptyArray.slice,
	forEach = emptyArray.forEach,
	indexOf = emptyArray.indexOf,
	filter = emptyArray.filter,
	every = emptyArray.every,
	some = emptyArray.some;
var rxConciseSelector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,//filter #id, tagName, .className
	rxReady = /complete|loaded|interactive/,//dom ready state
	rxWhitespace = /\s+/g,
	rxStringFormat = /\{(.+?)\}/g;

/*
 extended querySelectorAll method

 selector branch for hook
     if selector is "#id", call getElementById
     if selector is ".className", call getElementsByClassName
     if selector is "tagName", call getElementsByTagName

 if context is given, search element with selector
 in context (or related condition).
 @param {String} selector css selector
 @param {Element,Array,String} 
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
	}//other case
	if(root.length !== undefined) {
		forEach.call(root, function(element) {
			merge(mergeBuffer, element.getElementsByClassName(m[3]));
		});
		return mergeBuffer;
	} else {
		return root.querySelectorAll(selector);
	}
};
var merge = function(srcList, mergeList) {
	forEach.call(mergeList, function(mergeElement) {
		if(indexOf.call(srcList, mergeElement) < 0) {
			srcList[srcList.length] = mergeElement;
		}
	});
};
var apply = function(obj) {
	var key, arg = arguments[1];
	for(key in arg) {
		//even if "key" property already exist, set into "key"
		if(arg.hasOwnProperty(key)) {
			obj[key] = arg[key];
		}
	}
	return obj;
};
var supply = function(obj) {
	var key, arg = arguments[1];
	for(key in arg) {
		//if "key" is not undefined, "key" will not be rewrite
		if(arg.hasOwnProperty(key) && !(key in obj)) {
			obj[key] = arg[key];
		}
	}
};

/**
 * 文字列かどうかを取得する
 * @param {Object} value
 * @return {Boolean}
 */
var isString = function(value) {
	return (typeof value === "string");
};
/**
 * メソッドかどうかを取得する
 * @param {Object} value
 * @return {Boolean}
 */
var isFunction = function(value) {
	return (typeof value === "function");
};
var isArray = Array.isArray;

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

var Ramble = function(selector, context) {
	var elementList = qsaHook(selector, context), 
		len = elementList.length;
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
	},
	filter: function() {

	},
	every: function() {
		return every.apply(this, arguments);
	},
	some: function() {
		return some.apply(this, arguments);
	}
};
apply(Ramble.prototype, _Prototype);

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
	bind: function(type, callback) {
		this.each(function(element, index) {
			element.addEventListener(type, callback);
		});
	},
	unbind: function(type, callback) {
		this.each(function(element, index) {
			element.removeEventListener(type, callback);
		});
	},
	live: function(type, selector, callback) {
		_eventRegist(document, type, );
	},
	die: function(type, selector, callback) {},
	delegate: function(type, selector, callback) {},
	undelegate: function(type, selector, callback) {}
};
apply(Ramble.prototype, _Event);

var _Manipulation = {
	addClass: function(className) {
		var list = className.split(rxWhitespace);
		this.each(function(element, index) {
			list.forEach(function(name) {
				element.classList.add(name);
			});
		});
	},
	removeClass: function(className) {
		var list = className.split(rxWhitespace);
		this.each(function(element, index) {
			list.forEach(function(name) {
				element.classList.remove(name);
			});
		});
	},
	toggleClass: function(className) {
		var list = className.split(rxWhitespace);
		this.each(function(element, index) {
			list.forEach(function(name) {
				element.classList.toggle(name);
			});
		});
	},
	hasClass: function(className) {
		var list = className.split(rxWhitespace);
		return this.every(function(element, index) {
			return element.classList.contains(name);
		});
	}
};
apply(Ramble.prototype, _Manipulation);

win.$ = function(selector, context) {
	return new Ramble(selector, context);
};

})(window);