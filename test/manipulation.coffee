expect = chai.expect

describe "Fluent Manipulation", ->

  it "can add class", ->
    $element = $("#id1")
    $element.addClass("classTest")
    expect($element[0].className.indexOf("classTest")).to.not.equal -1

  it "can remove class", ->
    $element = $("#id2")
    $element.removeClass("class1")
    expect($element[0].className.indexOf("class1")).to.equal -1

  it "can toggle class", ->
    $element = $("#id3")
    $element.toggleClass("class1")
    expect($element[0].className.indexOf("class1")).to.equal -1
    $element.toggleClass("class1")
    expect($element[0].className.indexOf("class1")).to.not.equal -1
