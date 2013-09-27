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
    initialize: function(selector) {
      var elementList = [];
      if(!selector) {
        return this;
      } else if(Fluent.isString(selector)) {
        //if selector is string
        elementList = __qsaHook(selector);
      } else if(selector.nodeType) {
        //if selector is single dom element
        elementList.push(selector);
      } else if(__likeArray(selector)) {
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
    each: arrayForEach
  };

  Fluent.fn.initialize.prototype = Fluent.fn;

  /**
   * value is typeof key, or not.
   * @param {String} key
   * @param {Object} value
   * @return {Boolean}
   */
  function __is(type, value) {
    return (toString.call(value) === "[object " + type + "]");
  }

  /**
   * value is string or not
   * @param {Object} value
   * @return {Boolean}
   */
  Fluent.isString = function(value) {
    return __is("String", value);
  };
  /**
   * value is function or not
   * @param {Object} value
   * @return {Boolean}
   */
  Fluent.isFunction = function(value) {
    return __is("Function", value);
  };
  /**
   * value is like an array or not
   * @param {Object} value
   * @return {Boolean}
   */
  function __likeArray(value) {
    return (typeof value.length == "number");
  }
  /**
   * is appendable node or not
   * @param {HTMLElement} element
   * @return {Boolean}
   */
  function __isAppendable(element) {
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
  function __computedStyle(element, key) {
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
  function __createElement(tagName, attributes) {
    var element = doc.createElement(tagName);
    if(attributes) {
      for(var key in attributes) {
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
   * create callback closure
   * @param {HTMLElement} parentNode
   * @param {String} selector
   * @param {Function} callback
   */
  function __createDelegateClosure(parentNode, selector, callback) {
    var closure = function(e) {
      var parent = parentNode;
      var children = __qsaHook(selector, parent);
      arrayForEach.call(children, function(child) {
        if(child.compareDocumentPosition(e.target) === 0) {
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
  function __normalizeNode(value) {
    var nodeList = [];
    if(value.nodeType) {
      nodeList.push(value);
    } else if(__likeArray(value)) {
      for(var i = 0, len = value.length;i < len;i++) {
        if(value[i].nodeType) {
          nodeList[nodeList.length] = value[i];
        }
      }
    }
    return nodeList;
  }
  /**
   * generic each function
   * @description if callback function returns false, break loop.
   * @param {Object} target
   * @param {Function} callback
   * @return {Object}
   */
  Fluent.each = function(target, callback) {
    var args = arraySlice.call(arguments, 2);
    var i, len = target.length, key, result;
    if(args.length !== 0) {
      //if args is not "false"
      if(__likeArray(target)) {
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
      if(__likeArray(target)) {
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
  };
  /**
   * extend object hardly
   * @description if same property exist, it will be overriden
   * @param {Object} target
   * @param {Object} src
   * @return {Object}
   */
  Fluent.extend = function(target, src) {
    var key, keys = Object.keys(src);
    for(var i = 0, len = keys.length;i < len;i++) {
      key = keys[i];
      //even if "key" property already exist, set into "key"
      if(src.hasOwnProperty(key)) {
        target[key] = src[key];
      }
    }
    return target;
  };
  /**
   * extend object softly
   * @description if same property exist, it will not be overriden
   * @param {Object} target
   * @param {Object} src
   * @return {Object}
   */
  Fluent.fill = function(target, src) {
    var key, keys = Object.keys(src);
    for(var i = 0, len = keys.length;i < len;i++) {
      key = keys[i];
      //if "key" is not undefined, "key" will not be rewrite
      if(src.hasOwnProperty(key) && !(key in target)) {
        target[key] = src[key];
      }
    }
    return target;
  };
  /**
   * merge array or object (like an array) into array
   * @param {Array} srcList
   * @param {Array|* which has length property}
   */
  Fluent.merge = function(srcList, mergeList) {
    arrayForEach.call(mergeList, function(mergeElement) {
      if(arrayIndexOf.call(srcList, mergeElement) < 0) {
        srcList[srcList.length] = mergeElement;
      }
    });
  };
  /**
   * execute callback when dom content loaded
   * @param {Function} callback
   */
  Fluent.ready = function(callback) {
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
  };
  /**
   *
   * @param {Array} array
   * @param {String} key
   * @return {Array}
   */
  Fluent.pluck = function(array, key) {
    return arrayMap.call(array, function(value) {
      return value[key];
    });
  };
  /**
   * copy object
   * @param {Object} target
   * @return {Object}
   */
  Fluent.copy = function(target) {
    var buffer = Object.create(Object.getPropertyOf(target));
    var propertyNames = Object.getOwnPropertyNames(target);

    arrayForEach.call(propertyNames, function(name) {
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
  Fluent.defineClass = function(properties, superClass) {
    var Constructor = properties.hasOwnProperty("constructor") ? properties.constructor : function() {};
    var Class = function() {};
    if(superClass) {
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
  Fluent.bind = function(targetNode, type, callback, useCapture) {
    if(targetNode && targetNode.addEventListener) {
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
  Fluent.unbind = function(targetNode, type, callback, useCapture) {
    if(targetNode && targetNode.removeEventListener) {
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
  Fluent.once = function(targetNode, type, callback, useCapture) {
    var wrapOnce = function(e) {
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
  Fluent.delegate = function(targetNode, type, selector, callback) {
    if(!targetNode.eventStore) {
      targetNode.eventStore = {};
    }
    if(!targetNode.eventStore.hasOwnProperty(type)) {
      targetNode.eventStore[type] = [];
    }
    var closure = __createDelegateClosure(targetNode, selector, callback);
    var closures = Fluent.pluck(targetNode.eventStore[type], "closure");
    if(closures.indexOf(closure) === -1) {
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
   * @param {String*} type
   * @param {String*} selector
   * @param {Function*} callback
   */
  Fluent.undelegate = function(targetNode, type, selector, callback) {
    var storedData, callbacks, selectors, index;
    if(targetNode.eventStore) {
      if(type && selector && callback) {
        storedData = targetNode.eventStore[type];
        callbacks = Fluent.pluck(storedData, "callback");
        index = callbacks.indexOf(callback);
        if(index > -1) {
          targetNode.removeEventListener(type, storedData[index].closure);
          targetNode.eventStore[type].splice(index, 1);
        }
      } else if(type && selector && !callback) {
        storedData = targetNode.eventStore[type];
        selectors = Fluent.pluck(storedData, "selector");
        index = selectors.indexOf(selector);
        if(index > -1) {
          targetNode.removeEventListener(type, storedData[index].closure);
          targetNode.eventStore[type].splice(index, 1);
        }
      } else if(type && !selector && !callback) {
        storedData = targetNode.eventStore[type];
        arrayForEach.call(storedData, function(item) {
          targetNode.removeEventListener(type, item.closure);
        });
        delete targetNode.eventStore[type];
      } else {
        Object.keys(targetNode.eventStore).forEach(function(key) {
          storedData = targetNode.eventStore[key];
          arrayForEach.call(storedData, function(item) {
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
  Fluent.addClass = function(targetNode, value) {
    var classList = (value + "").split(" ");
    var oldClass = targetNode.className + "";
    var arrayBuffer = oldClass.split(" ");
    var valueIndex = -1;
    for(var i = 0, len = classList.length;i < len;i++) {
      valueIndex = arrayBuffer.indexOf(classList[i]);
      if(valueIndex === -1) {
        arrayBuffer.push(classList[i]);
      }
    }
    var newClass = arrayBuffer.join(" ");
    if(newClass != oldClass) {
      //if className is updated
      targetNode.className = newClass;
    }
  };
  /**
   * remove class from element
   * @param {HTMLElement} targetNode
   * @param {String} value
   */
  Fluent.removeClass = function(targetNode, value) {
    var classList = (value + "").split(" ");
    var oldClass = targetNode.className + "";
    var arrayBuffer = oldClass.split(" ");
    var valueIndex = -1;
    for(var i = 0, len = classList.length;i < len;i++) {
      valueIndex = arrayBuffer.indexOf(classList[i]);
      if(valueIndex !== -1) {
        arrayBuffer.splice(valueIndex, 1);
      }
    }
    var newClass = arrayBuffer.join(" ");
    if(newClass != oldClass) {
      //if className is updated
      targetNode.className = newClass;
    }
  };
  /**
   * toggle class of element
   * @param {HTMLElement} targetNode
   * @param {String} value
   */
  Fluent.toggleClass = function(targetNode, value) {
    var classList = (value + "").split(" ");
    var oldClass = targetNode.className + "";
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
    var newClass = arrayBuffer.join(" ");
    if(newClass != oldClass) {
      //if className is updated
      targetNode.className = newClass;
    }
  };
  /**
   * target has class or not.
   * @param {HTMLElement} targetNode
   * @param {String} value
   */
  Fluent.hasClass = function(targetNode, value) {
    var arrayBuffer = targetNode.className.split(" ");
    return (arrayBuffer.indexOf(value + "") != -1);
  };
  /**
   * serialize object to query string
   * @param {Object} data
   * @return {String}
   */
  Fluent.serialize = function(data) {
    var ret = [], key, value;
    for(key in data) {
      if(data.hasOwnProperty(key)) {
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
  Fluent.deserialize = function(data) {
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
  };
  /**
   * string format
   * @param {String} str
   * @param {Object} replacement
   * @return {String}
   */
  Fluent.format = function(str, replacement) {
    if (typeof replacement != "object") {
      replacement = arraySlice.call(arguments);
    }
    return str.replace(/\{(.+?)\}/g, function(m, c) {
      return (replacement[c] !== null) ? replacement[c] : m;
    });
  };
  /**
   * camelize
   * @param {String} str
   * @return {String}
   */
  Fluent.camelize = function(str) {
    return str.replace(/-+(.)?/g, function(match, character){
      return character ? character.toUpperCase() : "";
    });
  };
  /**
   * dasherize
   * @param {String} str
   * @return {String}
   */
  Fluent.dasherize = function(str) {
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
  Fluent.loadScript = function(path, callback, async, defer) {
    var script = __createElement("script", {
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
  };
  /**
   * escape html string
   * @param {String} value
   * @return {String}
   */
  Fluent.escapeHTML = function(value) {
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
  };
  /**
   * unescape html string
   * @param {String} value
   * @return {String}
   */
  Fluent.unescapeHTML = function(value) {
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
      return this.each(function(element, index) {
        element.addEventListener(type, eventHandler, useCapture);
      });
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
      return this.each(function(element, index) {
        element.removeEventListener(type, eventHandler, useCapture);
      });
    },
    /**
     * dispatch event
     * @param {String} type
     * @returns {Fluent}
     */
    trigger: function(type) {
      return this.each(function(element, index) {
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
    once: function(type, eventHandler, useCapture) {
      this.each(function(element, index) {
        Fluent.once(element, type, eventHandler, useCapture);
      });
      return this;
    },
    /**
     * begin propagation event
     * @param {String} type
     * @param {Function} eventHandler
     * @return {Fluent}
     */
    delegate: function(type, selector, eventHandler) {
      return this.each(function(element, index) {
        Fluent.delegate(element, type, selector, eventHandler);
      });
    },
    /**
     * finish propagation event
     * @param {String} type
     * @param {Function} eventHandler
     * @return {Fluent}
     */
    undelegate: function(type, selector, eventHandler) {
      return this.each(function(element, index) {
        Fluent.undelegate(element, type, selector, eventHandler);
      });
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
      var datasetAttr = Fluent.camelize("data-" + key);
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
          Fluent.addClass(element, list[i]);
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
          Fluent.removeClass(element, list[i]);
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
          Fluent.toggleClass(element, list[i]);
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
      Fluent.each(this, function(element) {
        for(var i = 0, len = nodeList.length;i < len;i++) {
          if(__isAppendable(nodeList[i])) {
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
      Fluent.each(this, function(element) {
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
        if(__computedStyle(this[i], "display") === "none") {
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

  //extend Fluent prototype
  Fluent.extend(Fluent.fn, _FluentEvent);
  Fluent.extend(Fluent.fn, _FluentTraversing);
  Fluent.extend(Fluent.fn, _FluentManipulation);

  win.$ = win.Fluent = Fluent;

})(window);
