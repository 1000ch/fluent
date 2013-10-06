/**
 * fluent.animation.js
 *
 * Copyright 1000ch<http://1000ch.net/>
 * licensed under the MIT license.
 **/
(function(window, undefined) {
  "use strict";
  var win = window;
  var Fluent = win.Fluent;
  if(!Fluent) {
    return;
  }

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
      this._transform.add(Fluent.format("skew({0}deg, {1}deg)", x, y));
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
      this._transform.add(Fluent.format("skewX({0}deg)", x));
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
      this._transform.add(Fluent.format("skewY({0}deg)", y));
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
      this._transform.add(Fluent.format("translate({0}px, {1}px)", x, y));
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
      this._transform.add(Fluent.format("translateX({0}px)", x));
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
      this._transform.add(Fluent.format("translateY({0}px)", y));
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
      this._transform.add(Fluent.format("scale({0}, {1})", x, y));
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
      this._transform.add(Fluent.format("scaleX({0})", x));
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
      this._transform.add(Fluent.format("scaleY({0})", y));
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
      this._transform.add(Fluent.format("rotate({0}deg)", n));
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
        var key, keys = Object.keys(this._param);
        for(var i = 0, len = keys.length;i < len;i++) {
          key = keys[i];
          element.style[key] = this._param[key];
        }
      });
      this._param = {};
    }
  };

  Fluent.extend(Fluent.fn, _FluentAnimation);

  window.Fluent = Fluent;

})(window);