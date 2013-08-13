/**
 * fluent.js
 *
 * Copyright 1000ch<http://1000ch.net/>
 * licensed under the MIT license.
 **/
(function(window, undefined){
"use strict";
var win = window, doc = window.document, loc = window.location;

//cache empty structure
var emptyArray = [],
	emptyObject = {},
	emptyElement = doc.createElement("div");

//cache referrence
var toString = emptyObject.toString,
	arrayForEach = emptyArray.forEach,
	arraySlice = emptyArray.slice,
	arraySplice = emptyArray.splice;

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
	return (toString.call(value) === "[object " + key + "]");
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
 * is appendable node or not
 * @param {HTMLElement} element
 * @return {Boolean}
 */
function isAppendable(element) {
	if(element.nodeType) {
		var nodeType = element.nodeType;
		if(nodeType === 1 || nodeType === 11 || nodeType === 9) {
			return !!element.appendChild;
		}
	}
	return false;
}
/**
 * get computed style of element
 * @param {HTMLElement} element
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
 * create element with attributes
 * @param {String} tagName
 * @param {Object} attributes
 */
function createElement(tagName, attributes) {
	var element = doc.createElement(tagName);
	if(attributes) {
		for(var key in attributes) {
			element.setAttribute(key, attributes[key]);
		}
	}
	return element;
}

/**
 * generic each function
 * @description if callback function returns false, break loop.
 * @param {Object} target
 * @param {Function} callback
 * @return {Object}
 */
function __each(target, callback) {
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
function __copy(target) {
	var buffer = Object.create(Object.getPropertyOf(target));
	var propertyNames = Object.getOwnPropertyNames(target);

	arrayForEach.call(propertyNames, function(name) {
		Object.defineProperty(buffer, name, Object.getOwnPropertyDescriptor(target, name));
	});
	return buffer;
}
function __defineClass(properties, superClass) {
	var Constructor = properties.hasOwnProperty("constructor") ? properties.constructor : function() {};
	var Class = function() {};
	if(superClass) {
		Class.prototype = Object.create(superClass.prototype);
	} else {
		Class.constructor = Constructor;
	}
	__extend(Class.prototype, properties);
	return Class;
}
/**
 * extend object hardly
 * @description if same property exist, it will be overriden
 * @param {Object} target
 * @param {Object} src
 * @return {Object}
 */
function __extend(target, src) {
	var key, keys = Object.keys(src);
	for(var i = 0, len = keys.length;i < len;i++) {
		key = keys[i];
		//even if "key" property already exist, set into "key"
		if(src.hasOwnProperty(key)) {
			target[key] = src[key];
		}
	}
	return target;
}
/**
 * extend object softly
 * @description if same property exist, it will not be overriden
 * @param {Object} target
 * @param {Object} src
 * @return {Object}
 */
function __fill(target, src) {
	var key, keys = Object.keys(src);
	for(var i = 0, len = keys.length;i < len;i++) {
		key = keys[i];
		//if "key" is not undefined, "key" will not be rewrite
		if(src.hasOwnProperty(key) && !(key in target)) {
			target[key] = src[key];
		}
	}
	return target;
}
/**
 * serialize object to query string
 * @param {Object} data
 * @return {String}
 */
function serialize(data) {
	var ret = [], key, value;
	for(key in data) {
		if(data.hasOwnProperty(key)) {
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
function deserialize(data) {
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
function camelize(str) {
	return str.replace(/-+(.)?/g, function(match, character){
		return character ? character.toUpperCase() : "";
	});
}
/**
 * dasherize
 * @param {String} str
 * @return {String}
 */
function dasherize(str) {
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
	var script = createElement("script", {
		src: path,
		charset: "utf-8",
		type: "text/javascript",
		async: (async === undefined ? false : async),
		defer: (defer === undefined ? false : defer)
	});

	script.onload = script.onreadystatechange = function() {
		script.onload = script.onreadystatechange = null;
		if(callback) {
			callback();
		}
	};

	doc[qs]("head").appendChild(script);
}
/**
 * escape html string
 * @param {String} value
 * @return {String}
 */
function escapeHTML(value) {
	value = value + "";
	var escapeMap = {
		"&": "&amp;",
		'"': "&quot;",
		"<": "&lt;",
		">": "&gt;"
	};
	return value.replace(/(&|"|<|>)/g, function(c) {
		return escapeMap[c];
	});
}
/**
 * unescape html string
 * @param {String} value
 * @return {String}
 */
function unescapeHTML(value) {
	value = value + "";
	var unescapeMap = {
		"&amp;": "&",
		"&quot;": '"',
		"&lt;": "<",
		"&gt;": ">"
	};
	return value.replace(/(&amp;|&quot;|&lt;|&gt;)/g, function(c) {
		return unescapeMap[c];
	});
}
/**
 * execute callback when dom content loaded
 * @param {Function} callback
 */
function __ready(callback) {
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
	if(!selector) {
	} else if(isString(selector)) {
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
	return __each(this, callback, args);
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
function __bind(targetList, type, eventHandler, useCapture) {
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
function __unbind(targetList, type, eventHandler, useCapture) {
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
function __once(targetList, type, eventHandler, useCapture) {
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
			if(child.compareDocumentPosition(e.target) === 0) {
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
function __delegate(targetList, type, selector, eventHandler) {
	var closure = null;
	arrayForEach.call(targetList, function(target) {
		if(!target.closureList) {
			target.closureList = {};
		}
		if(!target.closureList.hasOwnProperty(type)) {
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
function __undelegate(targetList, type, selector, eventHandler) {
	var array, index;
	arrayForEach.call(targetList, function(target) {
		if(target.closureList && target.closureList.hasOwnProperty(type)) {
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
		__bind(this, type, eventHandler, useCapture);
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
		__unbind(this, type, eventHandler, useCapture);
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
		__once(this, type, eventHandler, useCapture);
		return this;
	},
	/**
	 * begin propagation event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @return {Fluent}
	 */
	delegate: function(type, selector, eventHandler) {
		__delegate(this, type, selector, eventHandler);
		return this;
	},
	/**
	 * finish propagation event
	 * @param {String} type
	 * @param {Function} eventHandler
	 * @return {Fluent}
	 */
	undelegate: function(type, selector, eventHandler) {
		__undelegate(this, type, selector, eventHandler);
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
function __addClass(targetNode, value) {
	var classList = (value + "").split(" ");
	var newClass = "", oldClass = targetNode.className + "";
	var arrayBuffer = oldClass.split(" ");
	var valueIndex = -1;
	for(var i = 0, len = classList.length;i < len;i++) {
		valueIndex = arrayBuffer.indexOf(classList[i]);
		if(valueIndex === -1) {
			arrayBuffer.push(classList[i]);
		}
	}
	newClass = arrayBuffer.join(" ");
	if(newClass != oldClass) {
		//if className is updated
		targetNode.className = newClass;
	}
}

/**
 * remove class from element
 * @param {HTMLElement} targetNode
 * @param {String} value
 */
function __removeClass(targetNode, value) {
	var classList = (value + "").split(" ");
	var newClass = "", oldClass = targetNode.className + "";
	var arrayBuffer = oldClass.split(" ");
	var valueIndex = -1;
	for(var i = 0, len = classList.length;i < len;i++) {
		valueIndex = arrayBuffer.indexOf(classList[i]);
		if(valueIndex !== -1) {
			arrayBuffer.splice(valueIndex, 1);
		}
	}
	newClass = arrayBuffer.join(" ");
	if(newClass != oldClass) {
		//if className is updated
		targetNode.className = newClass;
	}
}

/**
 * toggle class of element
 * @param {HTMLElement} targetNode
 * @param {String} value
 */
function __toggleClass(targetNode, value) {
	var classList = (value + "").split(" ");
	var newClass = "", oldClass = targetNode.className + "";
	var arrayBuffer = oldClass.split(" ");
	var valueIndex = -1;
	for(var i = 0, len = classList.length;i < len;i++) {
		valueIndex = arrayBuffer.indexOf(classList[i]);
		if(valueIndex === -1) {
			//if does not exist
			arrayBuffer.push(value);
		} else {
			//if exist
			arrayBuffer.splice(valueIndex, 1);
		}
	}
	newClass = arrayBuffer.join(" ");
	if(newClass != oldClass) {
		//if className is updated
		targetNode.className = newClass;
	}
}

/**
 * target has class or not.
 * @param {HTMLElement} targetNode
 * @param {String} value
 */
function __hasClass(targetNode, value) {
	var arrayBuffer = targetNode.className.split(" ");
	return (arrayBuffer.indexOf(value + "") != -1);
}

/**
 * normalize object to node array.
 * @param {Fluent|NodeList|Array} value
 */
function __normalizeNode(value) {
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
		var datasetAttr = camelize("data-" + key);
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
				__addClass(element, list[i]);
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
				__removeClass(element, list[i]);
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
				__toggleClass(element, list[i]);
			}
		});
	},
	/**
	 * append element
	 * @param {HTMLElement}
	 * @return {Fluent}
	 */
	append: function(value) {
		var nodeList = __normalizeNode(value);
		__each(this, function(element) {
			for(var i = 0, len = nodeList.length;i < len;i++) {
				if(isAppendable(nodeList[i])) {
					element.appendChild(nodeList[i]);
				}
			}
		});
		return this;
	},
	/**
	 * insert element
	 * @param {HTMLElement}
	 * @return {Fluent}
	 */
	insert: function(value) {
		var nodeList = __normalizeNode(value);
		__each(this, function(element) {
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
__extend(Fluent.fn, _FluentEvent);
__extend(Fluent.fn, _FluentTraversing);
__extend(Fluent.fn, _FluentManipulation);
__extend(Fluent.fn, _FluentAnimation);

Fluent.ready = __ready;
Fluent.bind = __bind;
Fluent.unbind = __unbind;
Fluent.once = __once;
Fluent.delegate = __delegate;
Fluent.undelegate = __undelegate;

Fluent.extend = __extend;
Fluent.fill = __fill;
Fluent.each = __each;
Fluent.copy = __copy;
Fluent.defineClass = __defineClass;

Fluent.serialize = serialize;
Fluent.deserialize = deserialize;
Fluent.loadScript = loadScript;
Fluent.is = is;
Fluent.has = has;
Fluent.camelize = camelize;
Fluent.dasherize = dasherize;
Fluent.format = stringFormat;
Fluent.escapeHTML = escapeHTML;
Fluent.unescapeHTML = unescapeHTML;

win.Fluent = Fluent;

//set $ as constructor alias to global
win.$ = function(selector, context) {
	return new Fluent(selector, context);
};

})(window);
