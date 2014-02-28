# fluent.js [![Build Status](https://travis-ci.org/1000ch/fluent.png?branch=master)](https://travis-ci.org/1000ch/fluent)

## About

fluent.js is light-weight dom library.  
This supports following functions.  

## API

### Core

#### Constructor

```js
$([selector][, context])
```

#### each(callback)

```js
$("div").each(function(element, index) {
    //any process
});
```

---

### Event

#### bind(type, callback)

```js
var clickCallback = function(e) {
    console.log(e);
};
$("#id").bind("click", clickCallback);
//bind event to element
```

#### unbind(type, callback)

```js
var clickCallback = function(e) {
    console.log(e);
};
$(".class").unbind("click", clickCallback);
//unbind event from element
```

#### delegate(type, selector, callback)

```js
var touchstartCallback = function(e) {
    console.log(e);
}
$("#parentId").delegate("touchstart", ".childClass", touchstartCallback);
//start to delegate event
//elements will be searched by selector and fired 
//in context which Fluent object contains
```

#### undelegate(type, selector, callback)

```js
var touchendCallback = function(e) {
    console.log(e);
};
$(".parentClass").undelegate("touchend", ".childClass", touchendCallback);
//end to delegate event
```

---

### Traversing

#### filter(callback)

```js
var filtered = $("article").filter(function() {
    return element.classList.contains("hoge");
});
//filter elements with callback function
```

#### map(callback)

```js
var mapped = $("section").map(function(element) {
    return element.classList.add("hoge")
});
//execute callback to elements,
//and return affected elements as Fluent object
```

#### find(selector)

```js
var foundElements = $("body").find(".className");
```

---

### Manipulation

#### html(value)

```js
$(".className").html("<div>12345</div>");
//set value to innerHTML property
```

#### text(value)

```js
$("li").text("setText");
//set value to textContent property
```

#### val(value)

```js
$("input").val("value");
//set value to value property
```

#### attr(key, value)

```js
$("img").attr("src", "http://.../hoge.png");
//set value to attribute
```

#### data(data, value)

```js
$("span").data("tmp", "keepvalue");
//set value to dataset
```

#### css(key, value)

```js
$("div").css("color", "red");
//set value to key of style structure
```

#### addClass(value)

```js
$(".testClass").addClass("addClass");
//add class to elements
```

#### removeClass(value)

```js
$(".testClass").removeClass("removeClass");
//remove class from elements
```

#### toggleClass(value)

```js
$(".testClass").toggleClass("toggleClass");
//toggle class of elements
```

#### append()

```js
$("#container").append(elements);
//append element
```

#### prepend()

```js
$("#container").prepend(elements);
//insert element
```

#### show()

```js
$(".testClass").show();
//show elements
```

#### hide()

```js
$(".testClass").hide();
//hide elements
```

---

others are to be announced...

## License

Copyright [1000ch](http://twitter.com/1000ch)  
Lisenced under the GPL Lisence version 3.  
