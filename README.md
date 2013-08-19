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

    [FluentObject].html(value);
    //set value to innerHTML property
    
    [FluentObject].text(value);
    //set value to textContent property
    
    [FluentObject].val(value);
    //set value to value property
    
    [FluentObject].attr(key, value);
    //set value to attribute
    
    [FluentObject].data(key, value);
    //set value to dataset
    
    [FluentObject].css(key, value);
    //set value to key of style structure
    
    [FluentObject].addClass(value);
    //add class to elements
    
    [FluentObject].removeClass(value);
    //remove class from elements
    
    [FluentObject].toggleClass(value);
    //toggle class of elements
    
    [FluentObject].show()
    //show elements
    
    [FluentObject].append();
    //append element
    
    [FluentObject].prepend();
    //insert element
    
    [FluentObject].hide()
    //hide elements

---

### Animation

    [FluentObject].delay(value);
    //set delay of animation
    
    [FluentObject].duration(value);
    //set duration of animation
    
    [FluentObject].ease(value);
    //set ease type of animation
    
    [FluentObject].skew(x, y);
    //add skew property for animation
    
    [FluentObject].skewX(x);
    //add skewX property for animation
    
    [FluentObject].skewY(y);
    //add skewY property for animation
    
    [FluentObject].translate(x, y);
    //add translate property for animation
    
    [FluentObject].translateX(x);
    //add translateX property for animation
    
    [FluentObject].translateY(y);
    //add translateY property for animation
    
    [FluentObject].scale(x, y);
    //add scale property for animation
    
    [FluentObject].scaleX(x);
    //add scaleX property for animation
    
    [FluentObject].scaleY(y);
    //add scaleY property for animation
    
    [FluentObject].rotate(n);
    //add rotate property for animation
    
    [FluentObject].animate();
    //execute animation basis of stacked properties

---

others are to be announced...

## License

Copyright [1000ch](http://twitter.com/1000ch)  
Lisenced under the GPL Lisence version 3.  
