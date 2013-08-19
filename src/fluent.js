/**
 * fluent.js
 *
 * Copyright 1000ch<http://1000ch.net/>
 * licensed under the MIT license.
 **/
(function(window, undefined) {
	"use strict";
	var win = window,
		doc = window.document,
		docElem = doc.documentElement,
		loc = window.location;

	//cache empty structure
	var emptyArray = [],
		emptyObject = {},
		emptyElement = doc.createElement("div");

	//cache reference
	var toString = emptyObject.toString,
		arrayForEach = emptyArray.forEach,
		arrayMap = emptyArray.map,
		arraySlice = emptyArray.slice,
		arraySplice = emptyArray.splice,
		arrayIndexOf = emptyArray.indexOf,
		arrayLastIndexOf = emptyArray.lastIndexOf;

	//string polyfills
	if(!String.prototype.repeat) {
		String.prototype.repeat = function(count) {
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
	}
	if(!String.prototype.startsWith) {
		String.prototype.startsWith = function(value, position) {
			return (this.indexOf(value, position |= 0) === position);
		};
	}
	if(!String.prototype.endsWith) {
		String.prototype.endsWith = function(value, position) {
			return (this.lastIndexOf(value, position) === (position >= 0 ? position | 0 : this.length - 1));
		};
	}
	if(!String.prototype.contains) {
		String.prototype.contains = function(value, index) {
			return (this.indexOf(value, index | 0) !== -1);
		};
	}
	if(!String.prototype.toArray) {
		String.prototype.toArray = function(value) {
			return this.split("");
		};
	}

	var rxConciseSelector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,//filter #id, tagName, .className
		rxIdSelector = /^#([\w\-]+)$/,
		rxClassSelector = /^\.([\w\-]+)$/,
		rxTagSelector = /^[\w\-]+$/,
		rxReady = /complete|loaded|interactive/;

	var matches = docElem.matchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.msMatchesSelector ||
		docElem.oMatchesSelector;


	/**
	 * base class
	 * @param {String} obj
	 * @param {String|HTMLElement}
	 */
	function Fluent(selector) {
		return Fluent.prototype.initialize(selector);
	}

	/**
	 * base prototype
	 */
	Fluent.fn = Fluent.prototype = {
		constructor: Fluent,
		length: 0,
		/**
		 * Fluent initializer
		 * @param {String} selector
		 * @returns {Fluent}
		 */
		initialize: function(selector) {
			var elementList = [];
			if(!selector) {
				return this;
			} else if(isString(selector)) {
				//if selector is string
				elementList = __qsaHook(selector);
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
			var len = this.length = elementList.length;
			while(len--) {
				this[len] = elementList[len];
			}
			return this;
		},
		/**
		 * execute function to all element
		 * @param {Function} callback
		 * @return {Fluent}
		 */
		each: function(callback) {
			var args = arraySlice.call(arguments, 1);
			for(var i = 0, len = this.length;i < len;i++) {
				callback(this[i], i);
			}
			return this;
		}
	};

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
		 * find elements which matches selector
		 * @param {String} selector
		 * @return {Fluent}
		 */
		find: function(selector) {
			var array = [];
			for(var i = 0, len = this.length;i < len;i++) {
				if(matches.call(this[i], selector)) {
					__mergeArray(array, this[i]);
				}
			}
			return new Fluent(array);
		}
	};

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
			var datasetAttr = __camelize("data-" + key);
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
	 *
	 * @param {Array} array
	 * @param {String} key
	 * @return {Array}
	 */
	function __pluck(array, key) {
		return arrayMap.call(array, function(value) {
			return value[key];
		});
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

	/**
	 * define function
	 * @param {Object} properties
	 * @param {Function} superClass
	 * @returns {Function}
	 */
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
	function __serialize(data) {
		var ret = [], key, value;
		for(key in data) {
			if(data.hasOwnProperty(key)) {
				ret.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
			}
		}
		return ret.join("&").replace("%20", "+");
	}

	/**
	 * deserialize from query string
	 * @param {String} data
	 * @return {Object}
	 */
	function __deserialize(data) {
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
				ret[decodeURIComponent(buffer[0])] = decodeURIComponent(buffer[1]);
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
	function __stringFormat(str, replacement) {
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
	function __camelize(str) {
		return str.replace(/-+(.)?/g, function(match, character){
			return character ? character.toUpperCase() : "";
		});
	}

	/**
	 * dasherize
	 * @param {String} str
	 * @return {String}
	 */
	function __dasherize(str) {
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
	function __loadScript(path, callback, async, defer) {
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
		doc.querySelector("head").appendChild(script);
	}

	/**
	 * escape html string
	 * @param {String} value
	 * @return {String}
	 */
	function __escapeHTML(value) {
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
	function __unescapeHTML(value) {
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
	function __qsaHook(selector, context) {
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
		var tokenIndex = -1, tokenList = selector.split(" ");
		tokenList.some(function(token, index, array) {
			if(rxIdSelector.test(token)) {
				tokenIndex = index;
				return true;
			}
		});
		if(tokenIndex !== -1) {
			var idSelector = tokenList[tokenIndex];
			if(tokenIndex == tokenList.length - 1) {
				return [doc.querySelector(idSelector)];
			} else {
				return __qsaHook(tokenList.slice(tokenIndex + 1).join(" "), doc.querySelector(idSelector));
			}
		}

		return context.querySelectorAll(selector);
	}

	/**
	 * merge array or object (like an array) into array
	 * @param {Array} srcList
	 * @param {Array|* which has length property}
	 */
	function __mergeArray(srcList, mergeList) {
		arrayForEach.call(mergeList, function(mergeElement) {
			if(arrayIndexOf.call(srcList, mergeElement) < 0) {
				srcList[srcList.length] = mergeElement;
			}
		});
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
	 * create callback closure
	 * @param {HTMLElement} parent
	 * @param {String} selector
	 * @param {Function} eventHandler
	 */
	function __createDelegateClosure(parent, selector, eventHandler) {
		var closure = function(e) {
			var children = __qsaHook(selector, parent);
			arrayForEach.call(children, function(child) {
				if(child.compareDocumentPosition(e.target) === 0) {
					eventHandler.call(child, e);
				}
			});
		};
		return closure;
	}

	/**
	 * delegate
	 * @param {Array} targetList
	 * @param {String} type
	 * @param {String} selector
	 * @param {Function} callback
	 */
	function __delegate(targetList, type, selector, callback) {
		var closure = null;
		var closures = null;
		arrayForEach.call(targetList, function(target) {
			if(!target.eventStore) {
				target.eventStore = {};
			}
			if(!target.eventStore.hasOwnProperty(type)) {
				target.eventStore[type] = [];
			}
			closure = __createDelegateClosure(target, selector, callback);
			closures = __pluck(target.eventStore[type], "closure");
			if(closures.indexOf(closure) === -1) {
				target.eventStore[type].push({
					"selector": selector,
					"callback": callback,
					"closure": closure
				});
			}
			target.addEventListener(type, closure);
		});
	}

	/**
	 * undelegate
	 * @param {Array} targetList
	 * @param {String*} type
	 * @param {String*} selector
	 * @param {Function*} callback
	 */
	function __undelegate(targetList, type, selector, callback) {
		var storedData, callbacks, selectors, index;
		arrayForEach.call(targetList, function(target) {
			if(target.eventStore) {
				if(type && selector && callback) {
					storedData = target.eventStore[type];
					callbacks = __pluck(storedData, "callback");
					index = callbacks.indexOf(callback);
					if(index > -1) {
						target.removeEventListener(type, storedData[index].closure);
						target.eventStore[type].splice(index, 1);
					}
				} else if(type && selector && !callback) {
					storedData = target.eventStore[type];
					selectors = __pluck(storedData, "selector");
					index = selectors.indexOf(selector);
					if(index > -1) {
						target.removeEventListener(type, storedData[index].closure);
						target.eventStore[type].splice(index, 1);
					}
				} else if(type && !selector && !callback) {
					storedData = target.eventStore[type];
					arrayForEach.call(storedData, function(item) {
						target.removeEventListener(type, item.closure);
					});
					delete target.eventStore[type];
				} else {
					Object.keys(target.eventStore).forEach(function(key) {
						storedData = target.eventStore[key];
						arrayForEach.call(storedData, function(item) {
							target.removeEventListener(key, item.closure);
						});
						delete target.eventStore[key];
					});
				}
			}
		});
	}

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

	//extend Fluent prototype
	__extend(Fluent.fn, _FluentEvent);
	__extend(Fluent.fn, _FluentTraversing);
	__extend(Fluent.fn, _FluentManipulation);

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

	Fluent.addClass = __addClass;
	Fluent.removeClass = __removeClass;
	Fluent.toggleClass = __toggleClass;
	Fluent.hasClass = __hasClass;

	Fluent.serialize = __serialize;
	Fluent.deserialize = __deserialize;
	Fluent.loadScript = __loadScript;
	Fluent.is = is;
	Fluent.has = has;
	Fluent.camelize = __camelize;
	Fluent.dasherize = __dasherize;
	Fluent.format = __stringFormat;
	Fluent.escapeHTML = __escapeHTML;
	Fluent.unescapeHTML = __unescapeHTML;

	win.$ = win.Fluent = Fluent;

})(window);
