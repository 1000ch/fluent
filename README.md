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