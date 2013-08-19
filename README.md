# fluent.js [![Build Status](https://travis-ci.org/1000ch/fluent.png?branch=master)](https://travis-ci.org/1000ch/fluent)

## About

fluent.js is light-weight dom library.  
This supports following functions.  

## API

### Core

#### Constructor

    $([selector][, context])

#### each(callback)

    $("div").each(function(element, index) {
    	//any process
    });

---

### Event

#### bind(type, callback)

    var clickCallback = function(e) {
        console.log(e);
    };
    $("#id").bind("click", clickCallback);
    //bind event to element

#### unbind(type, callback)

    var clickCallback = function(e) {
        console.log(e);
    };
    $(".class").unbind("click", clickCallback);
    //unbind event from element


#### delegate(type, selector, callback)

    var touchstartCallback = function(e) {
        console.log(e);
    }
    $("#parentId").delegate("touchstart", ".childClass", touchstartCallback);
    //start to delegate event
    //elements will be searched by selector and fired 
    //in context which Fluent object contains

#### undelegate(type, selector, callback)

    var touchendCallback = function(e) {
        console.log(e);
    };
    $(".parentClass").undelegate("touchend", ".childClass", touchendCallback);
    //end to delegate event

---

### Traversing

#### filter(callback)

    var filtered = $("article").filter(function() {
        return element.classList.contains("hoge");
    });
    //filter elements with callback function

#### map(callback)

    var mapped = $("section").map(function(element) {
        return element.classList.add("hoge")
    });
    //execute callback to elements,
    //and return affected elements as Fluent object

#### find(selector)

    var foundElements = $("body").find(".className");

---

### Manipulation

#### html(value)

    $(".className").html("<div>12345</div>");
    //set value to innerHTML property

#### text(value)

    $("li").text("setText");
    //set value to textContent property

#### val(value)

    $("input").val("value");
    //set value to value property

#### attr(key, value)

    $("img").attr("src", "http://.../hoge.png");
    //set value to attribute

#### data(data, value)

    $("span").data("tmp", "keepvalue");
    //set value to dataset

#### css(key, value)

    $("div").css("color", "red");
    //set value to key of style structure

#### addClass(value)

    $(".testClass").addClass("addClass");
    //add class to elements

#### removeClass(value)

    $(".testClass").removeClass("removeClass");
    //remove class from elements

#### toggleClass(value)

    $(".testClass").toggleClass("toggleClass");
    //toggle class of elements

#### append()

    $("#container").append(elements);
    //append element

#### prepend()

    $("#container").prepend(elements);
    //insert element

#### show()

    $(".testClass").show();
    //show elements

#### hide()

    $(".testClass").hide();
    //hide elements

---

others are to be announced...

## License

Copyright [1000ch](http://twitter.com/1000ch)  
Lisenced under the GPL Lisence version 3.  
