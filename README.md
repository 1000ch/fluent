#ramble.js
======

##About
rambling to reconstruct architect of library.  
to adopt grunt.js system for package build,  
so this extends through "extend" or "fill" function.  

##API
###Core
####Constructor
    $([selector][, context])
####each
    [RambleObject].each(function(element, index) {
    	//any process
    })
###Manipulation
####html
    [RambleObject].html(value);
####text
    [RambleObject].text(value);
####val
    [RambleObject].val(value);
####css
    [RambleObject].css(key, value);
####addClass
    [RambleObject].addClass(value);
####removeClass
    [RambleObject].removeClass(value);
####toggleClass
    [RambleObject].toggleClass(value);

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