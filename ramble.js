(function(window, undefined){
"use strict";
var 	doc = window.document;

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
var _qsaHook = function(selector, context) {
	var con = isString(context) ? _qsaHook(selector) : context;
	var root = con ? con : doc;
	var mergeBuffer = [];
	var m = rxConciseSelector.exec(selector);
	if (m) {//regex result is not undefined
		if (m[1]) {//if selector is "#id"
			return doc.getElementById(m[1]);
		} else if (m[2]) {//if selector is "tagName"
			if(root.length !== undefined) {
				forEach.call(root, function(element) {
					_merge(mergeBuffer, element.getElementsByTagName(selector));
				});
				return mergeBuffer;
			} else {
				return root.getElementsByTagName(selector);
			}
		} else if (m[3]) {//if selector is ".className"
			if(root.length !== undefined) {
				forEach.call(root, function(element) {
					_merge(mergeBuffer, element.getElementsByClassName(m[3]));
				});
				return mergeBuffer;
			} else {
				return root.getElementsByClassName(m[3]);
			}
		}
	}
	if(root.length !== undefined) {
		forEach.call(root, function(element) {
			_merge(mergeBuffer, element.getElementsByClassName(m[3]));
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
var _merge = function(srcList, mergeList) {
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
var _extend = function(obj) {
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
var _fill = function(obj) {
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

var RambleFactory = {
	/**
	 * extend ramble object hardly
	 * @description if same property exist, it will be overriden
	 * @param {Object} obj
	 */
	extend: function(obj) {
		_extend(Ramble.prototype, obj);
	},
	/**
	 * extend ramble object softly
	 * @description if same property exist, it will not be overriden
	 * @param {Object} obj
	 */
	fill: function(obj) {
		_fill(Ramble.prototype, obj);
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
		elementList = [selector];
	} else if(isArray(selector)) {
		elementList = selector.filter(function(item) {
			return !!item.nodeType;
		});
	} else if(isString(selector)) {
		elementList = _qsaHook(selector, context);
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
	},
	slice: function() {
		return slice.call(this);
	}
};
var _CLOSURE_STORE = "CLOSURE_STORE";
var _closure = function(selector, context, callback) {
	return function(e) {
		var found = _qsaHook(selector, context);
		if(isArray(found)) {
			found = slice.call(found);
		}
		var i, len = found.length, element;
		for(i = 0;i < len;i++) {
			element = found[i];
			if(element == e.target) {
				callback.call(element);
				e.stopPropagation();
				break;
			}
		}
	};
};

var _Event = {
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
	delegate: function(type, selector, callback) {
		var context = this.slice();
		var store, element, len = context.length;
		var closure = _closure(selector, context, callback);
		while(len--) {
			element = context[len];
			store = element[_CLOSURE_STORE] || (element[_CLOSURE_STORE] = {
				closure: {}, selector: {}, listener: {}
			});

			store.closure[type] || (store.closure[type] = []);
			store.selector[type] || (store.selector[type] = []);
			store.listener[type] || (store.listener[type] = []);

			store.closure[type].push(closure);
			store.selector[type].push(selector);
			store.listener[type].push(callback);

			element.addEventListener(type, closure, true);
		}
	},
	undelegate: function(type, selector, callback) {
		var context = this.slice();
		var store, closures, selectors, listeners, element, len = context.length;
		while(len--) {
			element = context[len];
			store = element[_CLOSURE_STORE];
			if(!store) {
				continue;
			}

			closures = store.closure ? store.closure[type] : undefined;
			selectors = store.selector ? store.selector[type] : undefined;
			listeners = store.listener ? store.listener[type] : undefined;
			if(!closures || !selectors || !listeners) {
				continue;
			}

			var i, length = listeners.length;
			for(i = 0;i < length;i++) {
				if(listeners[i] == callback) {
					element.removeEventListener(type, closures[i], true);
					closures.splice(i, 1);
					selectors.splice(i, 1);
					listeners.splice(i, 1);
					break;
				}
			}
		}
	}
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
_extend(Ramble.prototype, _Prototype);
_extend(Ramble.prototype, _Event);
_extend(Ramble.prototype, _Manipulation);

window.RambleFactory = RambleFactory;
window.Ramble = Ramble;

if(typeof define === "function" && define.amd) {
	define("Ramble", [], function() {
		return window.Ramble;
	});
}

window.$ = function(selector, context) {
	return new Ramble(selector, context);
};

})(window);