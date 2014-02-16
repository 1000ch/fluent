/**
 * fluent.js
 *
 * Copyright 1000ch<http://1000ch.net/>
 * licensed under the MIT license.
 **/
(function (window, undefined) {
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
      arrayFilter = emptyArray.filter,
      arraySlice = emptyArray.slice,
      arraySplice = emptyArray.splice,
      arrayIndexOf = emptyArray.indexOf,
      arrayLastIndexOf = emptyArray.lastIndexOf;

  function _doNothing() {}
  
  //string polyfills
  if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
      if ((count |= 0 ) <= 0) {
        throw new RangeError();
      }
      var result = '', self = this;
      while (count) {
        if (count & 1) {
          result += self;
        }
        if (count >= 1) {
          self += self;
        }
      }
      return result;
    };
  }
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (value, position) {
      return (this.indexOf(value, position |= 0) === position);
    };
  }
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (value, position) {
      return (this.lastIndexOf(value, position) === (position >= 0 ? position | 0 : this.length - 1));
    };
  }
  if (!String.prototype.contains) {
    String.prototype.contains = function (value, index) {
      return (this.indexOf(value, index | 0) !== -1);
    };
  }
  if (!String.prototype.toArray) {
    String.prototype.toArray = function (value) {
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
    return new Fluent.fn.initialize(selector);
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
    initialize: function (selector) {
      var elementList = [];
      if (!selector) {
        return this;
      } else if (Fluent.isString(selector)) {
        //if selector is string
        elementList = _query(selector);
      } else if (selector.nodeType) {
        //if selector is single dom element
        elementList.push(selector);
      } else if (_likeArray(selector)) {
        //if selector is array,
        //select only dom element
        elementList = arrayFilter.call(selector, function (item) {
          return !!item.nodeType;
        });
      }
      var len = this.length = elementList.length;
      while (len--) {
        this[len] = elementList[len];
      }
      return this;
    },
    each: arrayForEach,
    map: arrayMap,
    filter: arrayFilter,
    indexOf: arrayIndexOf,
    lastIndexOf: arrayLastIndexOf
  };

  Fluent.fn.initialize.prototype = Fluent.fn;

  /**
   * value is typeof key, or not.
   * @param {String} key
   * @param {Object} value
   * @return {Boolean}
   */
  Fluent.isType = function (type, value) {
    return (toString.call(value) === "[object " + type + "]");
  };

  /**
   * value is function or not
   * @param {Object} value
   * @return {Boolean}
   */
  Fluent.isFunction = function (value) {
    return Fluent.isType("Function", value);
  };
  /**
   * value is string or not
   * @param {Object} value
   * @return {Boolean}
   */
  Fluent.isString = function (value) {
    return Fluent.isType("String", value);
  };
  /**
   * value is number or not
   * @param {Object} value
   * @return {Boolean}
   */
  Fluent.isNumber = function (value) {
    return Fluent.isType("Number", value);
  };
  /**
   * value is like an array or not
   * @param {Object} value
   * @return {Boolean}
   */
  function _likeArray(value) {
    return (typeof value.length == "number");
  }
  /**
   * get computed style of element
   * @param {HTMLElement} element
   * @param {String} key
   * @return {String}
   */
  function _computedStyle(element, key) {
    if (element.currentStyle) {
      return element.currentStyle[key];
    } else if (win.getComputedStyle) {
      return win.getComputedStyle(element, null).getPropertyValue(key);
    }
    return null;
  }
  /**
   * create element with attributes
   * @param {String} tagName
   * @param {Object} attributes
   */
  function _createElement(tagName, attributes) {
    var element = doc.createElement(tagName);
    if (attributes) {
      for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
      }
    }
    return element;
  }
  /*
   * extend and hook querySelectorAll
   * evaluate selector concisely
   * if selector is "#id", call getElementById
   * if selector is ".className", call getElementsByClassName
   * if selector is "tagName", call getElementsByTagName

   * if context is given, search element with selector
   * in context (or related condition).
   * @param {String} selector
   * @param {HTMLElement} context
   * @return {Array}
   */
  function _query(selector, context) {
    context = context ? context : doc;

    var m = rxConciseSelector.exec(selector);

    if (m) {//regex result is not undefined
      if (m[1]) {//if selector is "#id"
        return [doc.getElementById(m[1])];
      } else if (m[2]) {//if selector is "tagName"
        return context.getElementsByTagName(m[2]);
      } else if (m[3]) {//if selector is ".className"
        return context.getElementsByClassName(m[3]);
      }
    }

    //process for case of "#id [any selector]"
    var tokenIndex = -1, tokenList = selector.split(" ");
    tokenList.some(function (token, index, array) {
      if (rxIdSelector.test(token)) {
        tokenIndex = index;
        return true;
      }
    });
    if (tokenIndex !== -1) {
      var idSelector = tokenList[tokenIndex];
      if (tokenIndex == tokenList.length - 1) {
        return [doc.querySelector(idSelector)];
      } else {
        return _query(tokenList.slice(tokenIndex + 1).join(" "), doc.querySelector(idSelector));
      }
    }

    return context.querySelectorAll(selector);
  }

  Fluent.query = _query;

  /**
   * extend and hook querySelectorAll
   * evaluate selector concisely
   * @param {String} selector
   * @param {HTMLElement} context
   * @returns {HTMLElement}
   */
  Fluent.one = function (selector, context) {
    context = context ? context : doc;
    
    var m;
    if ((m = rxIdSelector.exec(selector))) {
      return doc.getElementById(m[1]);
    } else {
      return context.querySelector(selector);
    }
  };

  /**
   * create callback closure
   * @param {HTMLElement} parentNode
   * @param {String} selector
   * @param {Function} callback
   */
  function _createDelegateClosure(parentNode, selector, callback) {
    var closure = function (e) {
      var parent = parentNode;
      var children = _query(selector, parent);
      arrayForEach.call(children, function (child) {
        if (child.compareDocumentPosition(e.target) === 0) {
          callback.call(child, e);
        }
      });
    };
    return closure;
  }
  /**
   * normalize object to node array.
   * @param {Fluent|NodeList|Array} value
   * @return {Array}
   */
  function _normalizeNode(value) {
    var nodeList = [];
    if (value.nodeType) {
      nodeList.push(value);
    } else if (_likeArray(value)) {
      for (var i = 0, len = value.length;i < len;i++) {
        if (value[i].nodeType) {
          nodeList[nodeList.length] = value[i];
        }
      }
    }
    return nodeList;
  }
  /**
   * generic each function
   * if callback function returns false, break loop.
   * @param {Object} target
   * @param {Function} callback
   * @return {Object}
   */
  Fluent.each = function (target, callback) {
    var args = arraySlice.call(arguments, 2);
    var i, len = target.length, key, result;
    if (args.length !== 0) {
      //if args is not "false"
      if (_likeArray(target)) {
        for (i = 0;i < len;i++) {
          result = callback.apply(target[i], args);
          if (result === false) {
            break;
          }
        }
      } else {
        for (key in target) {
          result = callback.apply(target[key], args);
          if (result === false) {
            break;
          }
        }
      }
    } else {
      //if args is null, undefined, 0, ""
      if (_likeArray(target)) {
        for (i = 0;i < len;i++) {
          result = callback.call(target[i], target[i], i);
          if (result === false) {
            break;
          }
        }
      } else {
        for (key in target) {
          result = callback.call(target[key], target[key], i);
          if (result === false) {
            break;
          }
        }
      }
    }
    return target;
  };
  /**
   * extend object hardly
   * if same property exist, it will be overridden
   * @param {Object} target
   * @param {Object} src
   * @return {Object}
   */
  Fluent.extend = function (target, src) {
    var key, keys = Object.keys(src);
    for (var i = 0, len = keys.length;i < len;i++) {
      key = keys[i];
      //even if "key" property already exist, set into "key"
      target[key] = src[key];
    }
    return target;
  };
  /**
   * extend object softly
   * if same property exist, it will not be overridden
   * @param {Object} target
   * @param {Object} src
   * @return {Object}
   */
  Fluent.fill = function (target, src) {
    var key, keys = Object.keys(src);
    for (var i = 0, len = keys.length;i < len;i++) {
      key = keys[i];
      //if "key" is not undefined, "key" will not be rewrite
      if (target[key] === undefined) {
        target[key] = src[key];
      }
    }
    return target;
  };
  /**
   * merge array or object (like an array) into array
   * @param {Array} srcList
   * @param {Array} mergeList
   */
  Fluent.merge = function (srcList, mergeList) {
    arrayForEach.call(mergeList, function (mergeElement) {
      if (arrayIndexOf.call(srcList, mergeElement) < 0) {
        srcList[srcList.length] = mergeElement;
      }
    });
  };
  /**
   * execute callback when dom content loaded
   * @param {Function} callback
   */
  Fluent.ready = function (callback) {
    var args = arraySlice.call(arguments, 1);
    if (rxReady.test(doc.readyState)) {
      if (!args) {
        callback.call(doc);
      } else {
        callback.apply(doc, args);
      }
    } else {
      doc.addEventListener("DOMContentLoaded", function () {
        if (!args) {
          callback.call(doc);
        } else {
          callback.apply(doc, args);
        }
      }, false);
    }
  };
  /**
   *
   * @param {Array} array
   * @param {String} key
   * @return {Array}
   */
  Fluent.pluck = function (array, key) {
    return arrayMap.call(array, function (value) {
      return value[key];
    });
  };
  /**
   * copy object
   * @param {Object} target
   * @return {Object}
   */
  Fluent.copy = function (target) {
    var buffer = Object.create(Object.getPropertyOf(target));
    var propertyNames = Object.getOwnPropertyNames(target);

    arrayForEach.call(propertyNames, function (name) {
      Object.defineProperty(buffer, name, Object.getOwnPropertyDescriptor(target, name));
    });
    return buffer;
  };
  /**
   * define function
   * @param {Object} properties
   * @param {Function} superClass
   * @returns {Function}
   */
  Fluent.defineClass = function (properties, superClass) {
    var Constructor = properties.hasOwnProperty("constructor") ? properties.constructor : function () {};
    var Class = function () {};
    if (superClass) {
      Class.prototype = Object.create(superClass.prototype);
    } else {
      Class.constructor = Constructor;
    }
    Fluent.extend(Class.prototype, properties);
    return Class;
  };
  /**
   * bind
   * @param {HTMLElement} targetNode
   * @param {String} type
   * @param {Function} callback
   * @param {Boolean} useCapture
   */
  Fluent.bind = function (targetNode, type, callback, useCapture) {
    if (targetNode && targetNode.addEventListener) {
      targetNode.addEventListener(type, callback, useCapture);
    }
  };
  /**
   * unbind
   * @param {HTMLElement} targetNode
   * @param {String} type
   * @param {Function} callback
   * @param {Boolean} useCapture
   */
  Fluent.unbind = function (targetNode, type, callback, useCapture) {
    if (targetNode && targetNode.removeEventListener) {
      targetNode.removeEventListener(type, callback, useCapture);
    }
  };
  /**
   * once
   * @param {HTMLElement} targetNode
   * @param {String} type
   * @param {Function} callback
   * @param {Boolean} useCapture
   */
  Fluent.once = function (targetNode, type, callback, useCapture) {
    var wrapOnce = function (e) {
      callback.call(targetNode, e);
      targetNode.removeEventListener(type, wrapOnce, useCapture);
    };
    targetNode.addEventListener(type, wrapOnce, useCapture);
  };
  /**
   * delegate
   * @param {HTMLElement} targetNode
   * @param {String} type
   * @param {String} selector
   * @param {Function} callback
   */
  Fluent.delegate = function (targetNode, type, selector, callback) {
    if (!targetNode.eventStore) {
      targetNode.eventStore = {};
    }
    if (!targetNode.eventStore.hasOwnProperty(type)) {
      targetNode.eventStore[type] = [];
    }
    var closure = _createDelegateClosure(targetNode, selector, callback);
    var closures = Fluent.pluck(targetNode.eventStore[type], "closure");
    if (closures.indexOf(closure) === -1) {
      targetNode.eventStore[type].push({
        "selector": selector,
        "callback": callback,
        "closure": closure
      });
    }
    targetNode.addEventListener(type, closure);
  };
  /**
   * undelegate
   * @param {HTMLElement} targetNode
   * @param {String} type
   * @param {String} selector
   * @param {Function} callback
   */
  Fluent.undelegate = function (targetNode, type, selector, callback) {
    var storedData, callbacks, selectors, index;
    if (targetNode.eventStore) {
      if (type && selector && callback) {
        storedData = targetNode.eventStore[type];
        callbacks = Fluent.pluck(storedData, "callback");
        index = callbacks.indexOf(callback);
        if (index > -1) {
          targetNode.removeEventListener(type, storedData[index].closure);
          targetNode.eventStore[type].splice(index, 1);
        }
      } else if (type && selector && !callback) {
        storedData = targetNode.eventStore[type];
        selectors = Fluent.pluck(storedData, "selector");
        index = selectors.indexOf(selector);
        if (index > -1) {
          targetNode.removeEventListener(type, storedData[index].closure);
          targetNode.eventStore[type].splice(index, 1);
        }
      } else if (type && !selector && !callback) {
        storedData = targetNode.eventStore[type];
        arrayForEach.call(storedData, function (item) {
          targetNode.removeEventListener(type, item.closure);
        });
        delete targetNode.eventStore[type];
      } else {
        Object.keys(targetNode.eventStore).forEach(function (key) {
          storedData = targetNode.eventStore[key];
          arrayForEach.call(storedData, function (item) {
            targetNode.removeEventListener(key, item.closure);
          });
          delete targetNode.eventStore[key];
        });
      }
    }
  };


  /**
   * add class to element
   * @param {HTMLElement} targetNode
   * @param {String} value
   */
  Fluent.addClass = function (targetNode, value) {
    var classList = (value + "").split(" ");
    var oldClass = targetNode.className + "";
    var arrayBuffer = oldClass.split(" ");
    var valueIndex = -1;
    for (var i = 0, len = classList.length;i < len;i++) {
      valueIndex = arrayBuffer.indexOf(classList[i]);
      if (valueIndex === -1) {
        arrayBuffer.push(classList[i]);
      }
    }
    var newClass = arrayBuffer.join(" ");
    if (newClass != oldClass) {
      //if className is updated
      targetNode.className = newClass;
    }
  };
  /**
   * remove class from element
   * @param {HTMLElement} targetNode
   * @param {String} value
   */
  Fluent.removeClass = function (targetNode, value) {
    var classList = (value + "").split(" ");
    var oldClass = targetNode.className + "";
    var arrayBuffer = oldClass.split(" ");
    var valueIndex = -1;
    for (var i = 0, len = classList.length;i < len;i++) {
      valueIndex = arrayBuffer.indexOf(classList[i]);
      if (valueIndex !== -1) {
        arrayBuffer.splice(valueIndex, 1);
      }
    }
    var newClass = arrayBuffer.join(" ");
    if (newClass != oldClass) {
      //if className is updated
      targetNode.className = newClass;
    }
  };
  /**
   * toggle class of element
   * @param {HTMLElement} targetNode
   * @param {String} value
   */
  Fluent.toggleClass = function (targetNode, value) {
    var classList = (value + "").split(" ");
    var oldClass = targetNode.className + "";
    var arrayBuffer = oldClass.split(" ");
    var valueIndex = -1;
    for (var i = 0, len = classList.length;i < len;i++) {
      valueIndex = arrayBuffer.indexOf(classList[i]);
      if (valueIndex === -1) {
        //if does not exist
        arrayBuffer.push(classList[i]);
      } else {
        //if exist
        arrayBuffer.splice(valueIndex, 1);
      }
    }
    var newClass = arrayBuffer.join(" ");
    if (newClass != oldClass) {
      //if className is updated
      targetNode.className = newClass;
    }
  };
  /**
   * target has class or not.
   * @param {HTMLElement} targetNode
   * @param {String} value
   */
  Fluent.hasClass = function (targetNode, value) {
    var arrayBuffer = targetNode.className.split(" ");
    return (arrayBuffer.indexOf(value + "") != -1);
  };
  /**
   * serialize object to query string
   * @param {Object} data
   * @return {String}
   */
  Fluent.serialize = function (data) {
    var ret = [], key, value;
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        ret.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }
    return ret.join("&").replace("%20", "+");
  };
  /**
   * deserialize from query string
   * @param {String} data
   * @return {Object}
   */
  Fluent.deserialize = function (data) {
    var ret = {}, query = "";
    if (data) {
      query = data;
    } else {
      var href = loc.href, index = href.indexOf("?");
      query = href.substring(index + 1);
    }
    if (query.charAt(0) == "?") {
      query = query.substring(1);
    }
    var array = query.split("&"), buffer = [];
    for (var i = 0, len = array.length;i < len;i++) {
      buffer = array[i].split("=");
      if (buffer.length == 2) {
        ret[decodeURIComponent(buffer[0])] = decodeURIComponent(buffer[1]);
      }
    }
    return ret;
  };
  /**
   * string format
   * @param {String} str
   * @param {Object} replacement
   * @return {String}
   */
  Fluent.format = function (str, replacement) {
    if (typeof replacement != "object") {
      replacement = arraySlice.call(arguments);
    }
    return str.replace(/\{(.+?)\}/g, function (m, c) {
      return (replacement[c] !== null) ? replacement[c] : m;
    });
  };
  /**
   * camelize
   * @param {String} str
   * @return {String}
   */
  Fluent.camelize = function (str) {
    return str.replace(/-+(.)?/g, function (match, character){
      return character ? character.toUpperCase() : "";
    });
  };
  /**
   * dasherize
   * @param {String} str
   * @return {String}
   */
  Fluent.dasherize = function (str) {
    return str.replace(/::/g, '/')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      .replace(/_/g, '-')
      .toLowerCase();
  };
  /**
   * load script immediately or asynchronously
   * @param {String} path
   * @param {Function} callback
   * @param {String} async
   * @param {String} defer
   */
  Fluent.loadScript = function (path, callback, async, defer) {
    var script = _createElement("script", {
      src: path,
      charset: "utf-8",
      type: "text/javascript",
      async: (async === undefined ? false : async),
      defer: (defer === undefined ? false : defer)
    });
    script.onload = script.onreadystatechange = function () {
      script.onload = script.onreadystatechange = null;
      if (callback) {
        callback();
      }
    };
    doc.querySelector("head").appendChild(script);
  };
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  var unescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'"
  };
  var escapeRegex = new RegExp('[' + Object.keys(escapeMap).join('') + ']', 'g');
  var unescapeRegex = new RegExp('(' + Object.keys(unescapeMap).join('|') + ')', 'g');
  /**
   * escape html string
   * @param {String} value
   * @return {String}
   */
  Fluent.escapeHTML = function (value) {
    if (value === null) {
      return '';
    }
    value = value + '';
    return value.replace(escapeRegex, function (match) {
      return escapeMap[match];
    });
  };
  /**
   * unescape html string
   * @param {String} value
   * @return {String}
   */
  Fluent.unescapeHTML = function (value) {
    if (value === null) {
      return '';
    }
    value = value + '';
    return value.replace(unescapeRegex, function (match) {
      return unescapeMap[match];
    });
  };

  var _FluentEvent = {
    /**
     * Bind or delegate event
     * @param {String} type
     * @param {String|Function} callbackOrSelector
     * @param {Function} delegateCallback
     * @returns {Fluent}
     */
    on: function (type, callbackOrSelector, delegateCallback) {
      if (!Fluent.isString(type)) {
        return this;
      }
      var callback;
      var selector;
      if (Fluent.isFunction(callbackOrSelector)) {
        callback = callbackOrSelector;
        return this.each(function (element, index) {
          element.addEventListener(type, callback);
        });
      } else if (Fluent.isString(callbackOrSelector) && Fluent.isFunction(delegateCallback)) {
        selector = callbackOrSelector;
        callback = delegateCallback;
        return this.each(function (element, index) {
          Fluent.delegate(element, type, selector, callback);
        });
      }
    },
    /**
     * Unbind or undelegate event
     * @param {String} type
     * @param {String|Function} callbackOrSelector
     * @param {Function} delegateCallback
     * @returns {Fluent}
     */
    off: function (type, callbackOrSelector, delegateCallback) {
      var callback;
      var selector;
      if (Fluent.isString(type) && Fluent.isFunction(callbackOrSelector)) {
        callback = callbackOrSelector;
        return this.each(function (element, index) {
          element.removeEventListener(type, callback);
        });
      } else if (Fluent.isString(type) && Fluent.isString(callbackOrSelector) && Fluent.isFunction(delegateCallback)) {
        selector = callbackOrSelector;
        callback = delegateCallback;
        return this.each(function (element, index) {
          Fluent.undelegate(element, type, selector, callback);
        });
      } else {
        return this.each(function (element, index) {
          Fluent.undelegate(element, type);
        });
      }
    },
    /**
     * dispatch event
     * @param {String} type
     * @returns {Fluent}
     */
    trigger: function (type) {
      return this.each(function (element, index) {
        var event = doc.createEvent("Event");
        event.initEvent(type, true, false);
        element.dispatchEvent(event);
      });
    },
    /**
     * bind event once
     * @param {String} type
     * @param {Function} eventHandler
     * @param {Boolean} useCapture
     * @return {Fluent}
     */
    once: function (type, eventHandler, useCapture) {
      this.each(function (element, index) {
        Fluent.once(element, type, eventHandler, useCapture);
      });
      return this;
    }
  };

  var _FluentTraversing = {
    /**
     * find elements which matches selector
     * @param {String} selector
     * @return {Fluent}
     */
    find: function (selector) {
      var array = [];
      for (var i = 0, len = this.length;i < len;i++) {
        if (matches.call(this[i], selector)) {
          Fluent.merge(array, this[i]);
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
    html: function (value) {
      return this.each(function (element, index) {
        if (element.innerHTML !== undefined) {
          element.innerHTML = value;
        }
      });
    },
    /**
     * set textContent property of element
     * @param {String} value
     * @return {Fluent}
     */
    text: function (value) {
      return this.each(function (element, index) {
        if (element.textContent !== undefined) {
          element.textContent = value;
        }
      });
    },
    /**
     * set value property of element
     * @param {String} value
     * @return {Fluent}
     */
    val: function (value) {
      return this.each(function (element, index) {
        if (element.value !== undefined) {
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
    attr: function (key, value) {
      return this.each(function (element, index) {
        element.setAttribute(key, value);
      });
    },
    /**
     * set or add dataset
     * @param {String} key
     * @param {String} value
     * @return {Fluent}
     */
    data: function (key, value) {
      var datasetAttr = Fluent.camelize("data-" + key);
      return this.each(function (element, index) {
        element.dataset[datasetAttr] = value;
      });
    },
    /**
     * set style of element
     * @param {String} key
     * @param {String} value
     * @return {Fluent}
     */
    css: function (key, value) {
      return this.each(function (element, index) {
        element.style[key] = value;
      });
    },
    /**
     * add class to element
     * @param {String} className
     * @return {Fluent}
     */
    addClass: function (className) {
      if (!className) {
        return this;
      }
      var list = className.split(" ");
      return this.each(function (element, index) {
        for (var i = 0, len = list.length;i < len;i++) {
          Fluent.addClass(element, list[i]);
        }
      });
    },
    /**
     * remove class from element
     * @param {String} className
     * @return {Fluent}
     */
    removeClass: function (className) {
      if (!className){
        return this;
      }
      var list = className.split(" ");
      return this.each(function (element, index) {
        for (var i = 0, len = list.length;i < len;i++) {
          Fluent.removeClass(element, list[i]);
        }
      });
    },
    /**
     * toggle class of element
     * @param {String} className
     * @return {Fluent}
     */
    toggleClass: function (className) {
      if (!className){
        return this;
      }
      var list = className.split(" ");
      return this.each(function (element, index) {
        for (var i = 0, len = list.length;i < len;i++) {
          Fluent.toggleClass(element, list[i]);
        }
      });
    },
    /**
     * append element
     * @param {HTMLElement} value
     * @return {Fluent}
     */
    append: function (value) {
      var APPEND = [1, 9, 11];
      var nodeList = _normalizeNode(value);
      Fluent.each(this, function (element) {
        var node;
        for (var i = 0, len = nodeList.length;i < len;i++) {
          node = nodeList[i];
          if (APPEND.indexOf(node) !== -1) {
            element.appendChild(node);
          }
        }
      });
      return this;
    },
    /**
     * insert element
     * @param {HTMLElement} value
     * @return {Fluent}
     */
    insert: function (value) {
      var nodeList = _normalizeNode(value);
      Fluent.each(this, function (element) {
        for (var i = 0, len = nodeList.length;i < len;i++) {
          element.insertBefore(nodeList[i], element.firstChild);
        }
      });
      return this;
    },
    /**
     * show all element as computed styles
     */
    show: function () {
      for (var i = 0, len = this.length;i < len;i++) {
        this[i].style.display = "";
        if (_computedStyle(this[i], "display") === "none") {
          this[i].style.display = "block";
        }
      }
    },
    /**
     * hide all element
     */
    hide: function () {
      return this.css("display", "none");
    }
  };

  /**
   * Fluent.Promise object
   * @constructor
   */
  Fluent.Promise = function () {
    this.isPromise = true;
    this.state = Fluent.Promise.PENDING;
    this.value = null;
    this.queue = [];
  };

  // promise status
  Fluent.Promise.PENDING = 0;
  Fluent.Promise.FULFILLED = 1;
  Fluent.Promise.REJECTED = 2;

  /**
   * 
   * @returns {Object}
   *   {
   *     promise: Fluent.Promise,
   *     resolve: resolve,
   *     reject: reject
   *   }
   * @constructor
   */
  Fluent.Promise.Deferred = function () {
    var promise = new Fluent.Promise();
    var deferred = {
      promise: promise,
      resolve: function (value) {
        promise.fullfill(value);
      },
      reject: function (reason) {
        promise.reject(reason);
      }
    };
    return deferred;
  };

  Fluent.Promise.Rejected = function (value) {
    var promise = new Fluent.Promise();
    promise.fullfill(value);
    return promise;
  };

  Fluent.Promise.Rejected = function (reason) {
    var promise = new Fluent.Promise();
    promise.reject(reason);
    return promise;
  };

  /**
   * Change promise state.
   *
   * 1.Promise object can't transition to same state.
   *     PENDING -> PENDING
   *     FULFILLED -> FULFILLED
   *     REJECTED -> REJECTED
   * 2.Promise object can't transition from FULFILLED or REJECTED.
   *     FULFILLED -> *
   *     REJECTED -> *
   * 3.Promise object can't transition to FULFILLED with a null value.
   * 4.Promise object can't transition to REJECTED without a reason.
   *
   * @param state
   * @param value
   * @returns {String}
   */
  Fluent.Promise.prototype.change = function (state, value) {
    if (this.state === state) {
      // Cannot transition to same state
      return this.state;
    }
    if (this.state === Fluent.Promise.FULFILLED ||
        this.state === Fluent.Promise.REJECTED) {
      // Cannot transition from FULFILLED or REJECTED
      return this.state;
    }
    if (state === Fluent.Promise.FULFILLED ||
        state === Fluent.Promise.REJECTED) {
      if (arguments.length < 2) {
        // Cannot transition to FULFILLED and REJECTED without value or reason
        return this.state;
      }
    }
    this.state = state;
    this.value = value;
    this.resolve();
    return this.state;
  };

  /**
   * Execute asynchronously
   * @param {Function} fn
   */
  Fluent.Promise.prototype.async = function (fn) {
    setTimeout(fn, 5);
  };

  /**
   * Change state to fulfilled
   * @param value
   */
  Fluent.Promise.prototype.fulfill = function (value) {
    this.change(Fluent.Promise.FULFILLED, value);
  };

  /**
   * Change state to rejected
   * @param reason
   */
  Fluent.Promise.prototype.reject = function (reason) {
    this.change(Fluent.Promise.REJECTED, reason);
  };

  /**
   * Fulfill proxy
   * @param {Fluent.Promise} promise
   * @returns {Function}
   */
  Fluent.Promise.fulfillProxy = function (promise) {
    return function (value) {
      promise.change(Fluent.Promise.FULFILLED, value);
    };
  };

  /**
   * Reject proxy
   * @param {Fluent.Promise} promise
   * @returns {Function}
   */
  Fluent.Promise.rejectProxy = function (promise) {
    return function (reason) {
      promise.change(Fluent.Promise.REJECTED, reason);
    };
  };

  /**
   * Resolve
   * @returns {Boolean}
   */
  Fluent.Promise.prototype.resolve = function () {
    if (this.state === Fluent.Promise.PENDING) {
      // Cannot resolve on PENDING state
      return false;
    }
    while (this.queue.length) {
      var item = this.queue.shift();
      var callback;
      switch (this.state) {
        case Fluent.Promise.FULFILLED:
          callback = item.fullfill;
          break;
        case Fluent.Promise.REJECTED:
          callback = item.reject;
          break;
        default:
          callback = _doNothing;
          break;
      }
      if (Fluent.isFunction(callback)) {
        try {
          var value = callback(this.value);
          if (value.isPromise) {
            if (item.promise == value) {
              var typeError = new TypeError("Promise objects refer to same object.");
              item.promise.change(REJECTED, typeError);
            }
            var onFulfilled = Fluent.Promise.fulfillProxy(item.promise);
            var onRejected = Fluent.Promise.rejectProxy(item.promise);
            value.then(onFulfilled, onRejected);
          } else {
            item.promise.change(Fluent.Promise.FULFILLED, value);
          }
        } catch (e) {
          item.promise.change(Fluent.Promise.FULFILLED, e);
        }
      } else {
        item.promise.change(this.state, this.value);
      }
    }
  };

  /**
   * Access to current or eventual value or reason
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   * @returns {Fluent.Promise}
   */
  Fluent.Promise.prototype.then = function (onFulfilled, onRejected) {
    
    // initialize queue
    this.queue = this.queue || [];
    
    // create new promise
    var promise = new Fluent.Promise();
    
    var that = this;
    
    // queue
    this.async(function () {
      that.queue.push({
        fullfill: onFulfilled,
        reject: onRejected,
        promise: promise
      });
      that.resolve();
    });
    
    return promise;
  };
  
  Fluent.XML = {
    parse: function (data) {
      if (!data || !Fluent.isString(data)) {
        return null;
      }

      var xml;
      try {
        var tmp = new DOMParser();
        xml = tmp.parseFromString(data, "text/xml");
      } catch (e) {
        xml = null;
      }

      if (!xml || xml.getElementsByTagName("parsererror").length) {
        throw new Error("Invalid XML: " + data);
      }
      return xml;
    }
  };
  
  Fluent.Ajax = {};

  Fluent.Ajax.contents = {
    text: 'text/plain',
    xml:  'application/xml, text/xml',
    html: 'text/html',
    json: 'application/json, text/javascript',
    js:   'application/javascript, text/javascript'
  };

  Fluent.Ajax.responseConverters = {
    text: String,
    html: false,
    xml: Fluent.XML.parse,
    json: JSON.parse
  };

  Fluent.Ajax.responseFields = {
    text: 'responseText',
    html: 'responseText',
    xml: 'responseXML',
    json: 'responseJSON'
  };

  Fluent.Ajax.defaultParameters = {};

  Fluent.Ajax.methodTypes = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
  };

  /**
   * Send XMLHttpRequest
   * @param options
   * @returns {Fluent.Promise}
   */
  Fluent.ajax = function (options) {
    // force options to be object
    options = options || {};
    
    if (!Fluent.isString(options.url)) {
      throw new Error('url is not string:' + options.url);
    }
    
    // build default options
    Fluent.fill(options, Fluent.Ajax.defaultParameters);
    
    // create XMLHttpRequest
    var xhr = new XMLHttpRequest();
    var promise = new Fluent.Promise();

    // initialize XMLHttpRequest
    xhr.open(
      options.type || Fluent.Ajax.methodTypes.GET,
      options.url,
      options.async || true,
      options.user || '',
      options.password || ''
    );
    
    xhr.onerror = function (error) {
      if (options.error) {
        options.error(xhr, xhr.status, error);
      }
    };
    
    function processCallback(text, xhr) {
      var contentType = xhr.getResponseHeader('Content-Type');
      var converter = Fluent.Ajax.responseConverters[options.dataType];

      if (!converter) {
        var type;
        var types = Object.keys(Fluent.Ajax.contents);
        for (var i = 0, l = types.length;i < l;i++ ) {
          type = types[i];
          if (Fluent.Ajax.contents[type].indexOf(contentType)) {
            converter = Fluent.Ajax.responseConverters[type];
            break;
          }
        }
      }

      var data = converter ? converter(text) : text;
      if (options.success) {
        options.success(data, xhr.status, xhr);
      }
    }
    
    xhr.onreadystatechange = function stateChangeHandler() {
      switch (xhr.readyState) {
        case XMLHttpRequest.UNSENT:
        case XMLHttpRequest.OPENED:
        case XMLHttpRequest.HEADERS_RECEIVED:
        case XMLHttpRequest.LOADING:
          break;
        case XMLHttpRequest.DONE:
          processCallback(xhr.responseText, xhr);
          break;
      }
    };

    if (Fluent.isNumber(options.timeout)) {
      win.setTimeout(function () {
        xhr.abort();
      }, options.timeout);
    }
    
    // String, ArrayBuffer, Blob, HTMLDocument, FormData
    xhr.send(options.data || null);

    return promise;
  };

  //extend Fluent prototype
  Fluent.extend(Fluent.fn, _FluentEvent);
  Fluent.extend(Fluent.fn, _FluentTraversing);
  Fluent.extend(Fluent.fn, _FluentManipulation);

  win.$ = win.Fluent = Fluent;

})(window);
