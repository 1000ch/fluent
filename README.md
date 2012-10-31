#ramble.js
======

##About
rambling to reconstruct architect of library.  
to adopt grunt.js system for package build,  
so this extends through "extend" or "fill" function.  

##API
###Core
####Base
    $([selector][, context])
    
    [RambleObject].each(function(element, index) {
    	//any process
    })
    
    var domArray = [RambleObject].slice();
    //get dom element as array which ramble object contains
    //array is not a nodeList and ramble object
###Event
    [RambleObject].bind(type, callback);
    //bind event to element
    
    [RambleObject].unbind(type, callback);
    //unbind event from element
    
    [RambleObject].delegate(type, selector, callback);
    //start to delegate event
    //elements will be searched by selector and fired 
    //in context which ramble object contains
    
    [RambleObject].undelegate(type, selector, callback);
    //end to delegate event
###Traversing
    [RambleObject].filter(callback);
    //filter elements with callback function
    
    [RambleObject].map(callback);
    //execute callback to elements,
    //and return affected elements as ramble object
###Manipulation
    [RambleObject].html(value);
    //set value to innerHTML property
    
    [RambleObject].text(value);
    //set value to textContent property
    
    [RambleObject].val(value);
    //set value to value property
    
    [RambleObject].css(key, value);
    //set value to key of style structure
    
    [RambleObject].addClass(value);
    //add class to elements
    
    [RambleObject].removeClass(value);
    //remove class from elements
    
    [RambleObject].removeAllClass();
    //remove all class from elements
    
    [RambleObject].toggleClass(value);
    //toggle class of elements
###Animation
    [RambleObject].delay(value);
    //set delay of animation
    
    [RambleObject].duration(value);
    //set duration of animation
    
    [RambleObject].ease(value);
    //set ease type of animation
    
    [RambleObject].skew(x, y);
    //add skew property for animation
    
    [RambleObject].skewX(x);
    //add skewX property for animation
    
    [RambleObject].skewY(y);
    //add skewY property for animation
    
    [RambleObject].translate(x, y);
    //add translate property for animation
    
    [RambleObject].translateX(x);
    //add translateX property for animation
    
    [RambleObject].translateY(y);
    //add translateY property for animation
    
    [RambleObject].scale(x, y);
    //add scale property for animation
    
    [RambleObject].scaleX(x);
    //add scaleX property for animation
    
    [RambleObject].scaleY(y);
    //add scaleY property for animation
    
    [RambleObject].rotate(n);
    //add rotate property for animation
    
    [RambleObject].animate();
    //execute animation basis of stacked properties
others are to be announced...

##License
Copyright 2012 [1000ch.net]  
Released under the MIT license  

#ramble.js

##ライブラリについて  
ライブラリとしての在り方を悠々自適に模索。  
後々のビルドシステムを楽にするため、  
関数はプロトタイプマッピングで拡張。  
コアにはほとんど何も置かない。  

##API
鋭意作成中。

##ライセンスについて
著作権は1000chに帰属します。  

[1000ch.net]: http://1000ch.net/ "1000ch.net"