#fluent.js
======

##About

rambling to reconstruct architect of library.  
to adopt grunt.js system for package build,  
so this extends through "extend" or "fill" function.  

##API

###Core

####Base

    $([selector][, context])
    
    [FluentObject].each(function(element, index) {
    	//any process
    });
    
    var domArray = [FluentObject].toArray();

###Event

    [FluentObject].bind(type, callback);
    //bind event to element
    
    [FluentObject].unbind(type, callback);
    //unbind event from element
    
    [FluentObject].delegate(type, selector, callback);
    //start to delegate event
    //elements will be searched by selector and fired 
    //in context which Fluent object contains
    
    [FluentObject].undelegate(type, selector, callback);
    //end to delegate event

###Traversing

    [FluentObject].filter(callback);
    //filter elements with callback function
    
    [FluentObject].map(callback);
    //execute callback to elements,
    //and return affected elements as Fluent object
    
    var uniqueElements = [FluentObject].unique();
    
    var childElements = [FluentObject].children();

    var foundElements = [FluentObject].find("selector");

###Manipulation

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

###Animation

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

others are to be announced...

##License

Copyright [1000ch.net](http://1000ch.net/)  
Released under the MIT license  

#fluent.js

##ライブラリについて

ライブラリとしての在り方を悠々自適に模索。  
後々のビルドシステムを楽にするため、  
関数はプロトタイプマッピングで拡張。  
コアにはほとんど何も置かない。  

##API

鋭意作成中。

##ライセンスについて

著作権は1000chに帰属します。  
