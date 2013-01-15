/**
 * ramble.js JavaScript Library ver0.3
 *
 * Copyright 2012~, 1000ch<http://1000ch.net/>
 * licensed under the MIT license.
 **/
(function(window, undefined){
"use strict";
var doc = window.document;

var emptyArray = [],
	emptyObject = {},
	emptyFunction = function() {};

var slice = emptyArray.slice,
	splice = emptyArray.splice,
	forEach = emptyArray.forEach,
	indexOf = emptyArray.indexOf,
	filter = emptyArray.filter,
	map = emptyArray.map;

var rxConciseSelector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,//filter #id, tagName, .className
	rxReady = /complete|loaded|interactive/,//dom ready state
	rxWhitespace = /\s+/g;

var qs = "querySelector", 
	qsa = "querySelectorAll";

/**
 * argument is string or not
 * @param {Object} value
 * @return {Boolean}
 */
function isString(value) {
	return (typeof value === "string");
}
/**
 * argument is like an array or not
 * @param {Object} value
 * @return {Boolean}
 */
function isLikeArray(value) {
	return (typeof value.length == "number");
}
/**
 * argument is nodeList or not
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
function compuredStyle(element, key) {
	if(element.currentStyle) {
		return element.currentStyle[key];
	} else if(window.getComputedStyle) {
		return window.getComputedStyle(element, null).getPropertyValue(key);
	}
	return null;
}

//public utilities

/**
 * string format
 * @param {String} str
 * @param {Object} replacement
 * @return {String}
 */
function stringFormat(str, replacement) {
	if (typeof replacement != "object") {
		replacement = slice.call(arguments);
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
 * extend object hardly
 * @description if same property exist, it will be overriden
 * @param {Object} obj
 * @return {Object} obj
 */
function extend(obj) {
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
	return obj;
}
/**
 * extend object softly
 * @description if same property exist, it will not be overriden
 * @param {Object} obj
 * @return {Object} obj
 */
function fill(obj) {
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
	return obj;
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
	var args = slice.call(arguments.length - 1);
	if (rxReady.test(doc.readyState)) {
		if(!args) {
			callback();
		} else {
			callback(args)
		}
	} else {
		doc.addEventListener("DOMContentLoaded", function() {
			if(!args) {
				callback();
			} else {
				callback(args)
			}
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
 * @param {HTMLElement|Array|String}
 * @return {Array}
 */
function _qsaHook(selector, context) {
	var con = isString(context) ? _qsaHook(context) : context;
	var root = con ? con : doc;
	var mergeBuffer = [], m = rxConciseSelector.exec(selector);

	if (m) {//regex result is not undefined
		if (m[1]) {//if selector is "#id"
			return [doc.getElementById(m[1])];
		} else if (m[2]) {//if selector is "tagName"
			if(root.length !== undefined) {
				forEach.call(root, function(element) {
					_mergeArray(mergeBuffer, element.getElementsByTagName(selector));
				});
				return mergeBuffer;
			} else {
				return slice.call(root.getElementsByTagName(selector));
			}
		} else if (m[3]) {//if selector is ".className"
			if(root.length !== undefined) {
				forEach.call(root, function(element) {
					_mergeArray(mergeBuffer, element.getElementsByClassName(m[3]));
				});
				return mergeBuffer;
			} else {
				return slice.call(root.getElementsByClassName(m[3]));
			}
		}
	}
	if(root.length !== undefined) {
		forEach.call(root, function(element) {
			_mergeArray(mergeBuffer, element[qsa](selector));
		});
		return mergeBuffer;
	} else {
		return slice.call(root[qsa](selector));
	}
}
/**
 * merge array or object (like an array) into array
 * @param {Array} srcList
 * @param {Array|* which has length property}
 */
function _mergeArray(srcList, mergeList) {
	forEach.call(mergeList, function(mergeElement) {
		if(indexOf.call(srcList, mergeElement) < 0) {
			srcList[srcList.length] = mergeElement;
		}
	});
}

/**
 * base class
 * @param {String} obj
 * @param {String|HTMLElement}
 */
var Ramble = function(selector, context) {
	var elementList = [], len;
	if(isString(selector)) {
		//if selector is string
		elementList = _qsaHook(selector, context);
	} else if(selector.nodeType) {
		//if selector is single dom element
		elementList = [selector];
	} else if(isLikeArray(selector)) {
		//if selector is array,
		//select only dom element
		elementList = filter.call(selector, function(item) {
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
		var len = this.length;
		while(len--) {
			callback(this[len], len);
		}
		return this;
	},
	/**
	 * get all element
	 * @description not return Ramble object
	 * @return {Array<HTMLElement>}
	 */
	slice: function(from, to) {
		if(from) {
			if(to) {
				return slice.call(this, from, to);
			} else {
				return slice.call(this, from);
			}
		} else {
			return slice.call(this);
		}
	}
};

var _RambleEvent = {
	/**
	 * bind event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @param {Boolean} useCapture 
	 * @return {Ramble}
	 */
	bind: function(type, eventHandler, useCapture) {
		var i, len = this.length;
		for(i = 0;i < len;i++) {
			this[i].addEventListener(type, eventHandler, useCapture);
		}
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
		var i, len = this.length;
		for(i = 0;i < len;i++) {
			this[i].removeEventListener(type, eventHandler, useCapture);
		}
		return this;
	},
	_delegateCache: "delegateCache",
	_delegateClosure: function(selector, context, eventHandler) {
		return function(e) {
			var found = _qsaHook(selector, context);
			var i, len = found.length, element;
			for(i = 0;i < len;i++) {
				element = found[i];
				if(element == e.target) {
					eventHandler.call(element);
					e.stopPropagation();
					break;
				}
			}
		};
	},
	/**
	 * begin propagation event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @return {Ramble}
	 */
	delegate: function(type, selector, eventHandler) {
		var context = this.slice();
		var store, element, len = context.length;
		var closure = this._delegateClosure(selector, context, eventHandler);
		while(len--) {
			element = context[len];
			store = element[this._delegateCache] || (element[this._delegateCache] = {
				closure: {}, selector: {}, listener: {}
			});

			store.closure[type] || (store.closure[type] = []);
			store.selector[type] || (store.selector[type] = []);
			store.listener[type] || (store.listener[type] = []);

			store.closure[type].push(closure);
			store.selector[type].push(selector);
			store.listener[type].push(eventHandler);

			element.addEventListener(type, closure, true);
		}
	},
	/**
	 * finish propagation event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @return {Ramble}
	 */
	undelegate: function(type, selector, eventHandler) {
		var context = this.slice();
		var store, closures, selectors, listeners, element, len = context.length;
		while(len--) {
			element = context[len];
			store = element[this._delegateCache];
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

var _RambleTraversing = {
	/**
	 * get elements by search with callback
	 * @param {Function} callback
	 * @return {Ramble}
	 */
	filter: function(callback) {
		return new Ramble(filter.call(this, callback));
	},
	/**
	 * apply callback and get elements
	 * @param {Function} callback
	 * @return {Ramble}
	 */
	map: function(callback) {
		var array = [], element;
		var i, len = array.length;
		for(i = 0;i < len;i++) {
			data = callback(this[i], i);
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
		return new Ramble(filter.call(array, function(item, index){
			return array.indexOf(item) == index;
		}));
	},
	children: function() {
		return this.map(function() {

		});
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
			var i, len = value.length;
			for(i = 0;i < len;i++) {
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
		var i, len = this.length;
		for(i = 0;i < len;i++) {
			this[i].style.display = "";
			(compuredStyle(element, "display") === "none") ? element.style.display = "block" : 0;
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
	animate: function() {
		var prefix, i, len = this._prefix.length;
		for(i = 0;i < len;i ++) {
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
extend(Ramble.prototype, _RamblePrototype);
extend(Ramble.prototype, _RambleEvent);
extend(Ramble.prototype, _RambleTraversing);
extend(Ramble.prototype, _RambleManipulation);
extend(Ramble.prototype, _RambleAnimation);

window.Ramble = Ramble;

//set $ as constructor alias to global
window.$ = function(selector, context) {
	return new Ramble(selector, context);
};

window.$.ready = onDocumentReady;
window.$.loadScript = loadScript;
window.$.extend = extend;
window.$.fill = fill;

})(window);