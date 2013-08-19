expect = chai.expect

describe "Fluent Manipulation", ->

  describe "#addClass", ->

    it "add class to a element", ->
      $element = $("#id1")
      $element.addClass "classTest"
      expect($element[0].className.indexOf("classTest")).to.not.equal -1

  describe "#removeClass", ->

    it "remove class from a element", ->
      $element = $("#id2")
      $element.removeClass "class1"
      expect($element[0].className.indexOf("class1")).to.equal -1

  describe "#toggleClass", ->

    it "toggle class of a element", ->
      $element = $("#id3")
      $element.toggleClass "class1"
      expect($element[0].className.indexOf("class1")).to.equal -1
      $element.toggleClass "class1"
      expect($element[0].className.indexOf("class1")).to.not.equal -1
