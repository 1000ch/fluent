(function(window, undefined){
"use strict";
var win = window,
	doc = window.document;

var emptyArray = [],
	emptyObject = {},
	emptyFunction = function() {};

var slice = emptyArray.slice,
	forEach = emptyArray.forEach,
	indexOf = emptyArray.indexOf;
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
var extend = function(obj) {
	var key, arg = arguments[1];
	if(!arg) {
		return obj;
	}
	for(key in arg) {
		if(arg.hasOwnProperty(key)) {
			obj[key] = arg[key];
		}
	}
	return obj;
};

var isString = function(value) {
	return (typeof value === "string");
};
var isFunction = function(value) {
	return (typeof value === "function");
};
var isArray = Array.isArray;

var format = function() {};
var proxy = function(key, fn) {};

var Prototype = {
	constructor: Ramble,
	length: 0, 
	each: function(callback) {
		var len = this.length;
		while(len--) {
			callback(this[len], len);
		}
	},
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
		var list = className.split(rxWhitespace), ret = true;
		this.each(function(element, index) {
			list.forEach(function(name) {
				if(!element.classList.contains(name)) {
					ret = false;
				}
			});
		});
		return ret;
	}
};

var Ramble = function(selector, context) {
	var elementList = qsaHook(selector, context), 
		len = elementList.length;
	while(len--) {
		this[len] = elementList[len];
	}
};
 = ;

extend(Ramble.prototype, Prototype);

win.$ = function(selector, context) {
	return new Ramble(selector, context);
};

})(window);