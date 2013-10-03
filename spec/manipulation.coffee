expect = chai.expect

describe "Fluent Manipulation", ->

  describe "#addClass", ->

    $element = null

    beforeEach ->
      $element = $("#id1")

    it "add class to a element", ->
      expect($.hasClass($element[0], "classTest")).to.equal false
      $element.addClass "classTest"
      expect($.hasClass($element[0], "classTest")).to.equal true

    it "add multiple classes to a element", ->
      expect($.hasClass($element[0], "foo")).to.equal false
      expect($.hasClass($element[0], "bar")).to.equal false
      $element.addClass "foo bar"
      expect($.hasClass($element[0], "foo")).to.equal true
      expect($.hasClass($element[0], "bar")).to.equal true

  describe "#removeClass", ->

    $element = null

    beforeEach ->
      $element = $("#id2")

    it "remove class from a element", ->
      $element.addClass "classTest"
      expect($.hasClass($element[0], "classTest")).to.equal true
      $element.removeClass "classTest"
      expect($.hasClass($element[0], "classTest")).to.equal false

    it "remove multiple classes from a element", ->
      $element.addClass "foo bar"
      expect($.hasClass($element[0], "foo")).to.equal true
      expect($.hasClass($element[0], "bar")).to.equal true
      $element.removeClass "foo bar"
      expect($.hasClass($element[0], "foo")).to.equal false
      expect($.hasClass($element[0], "bar")).to.equal false

  describe "#toggleClass", ->

    $element = null

    beforeEach ->
      $element = $("#id3")

    it "toggle class of a element", ->
      $element.toggleClass "classTest"
      expect($.hasClass($element[0], "classTest")).to.equal true
      $element.toggleClass "classTest"
      expect($.hasClass($element[0], "classTest")).to.equal false

    it "toggle multiple classes of a element", ->
      $element.toggleClass "foo"
      expect($.hasClass($element[0], "foo")).to.equal true
      expect($.hasClass($element[0], "bar")).to.equal false
      $element.toggleClass "foo bar"
      expect($.hasClass($element[0], "foo")).to.equal false
      expect($.hasClass($element[0], "bar")).to.equal true