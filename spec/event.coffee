expect = chai.expect

describe "Fluent Event", ->

  describe "#on (bind)", ->

    it "bind with 2 arguments", ->
      spy = sinon.spy()
      $element = $("#id3")
      $element.on "click", spy
      $element.trigger "click"
      $element.trigger "click"
      expect(spy.callCount).to.equal 2

  describe "#off (unbind)", ->

    it "unbind with 2 arguments", ->
      spy = sinon.spy()
      $element = $("#id3")
      $element.on "click", spy
      $element.trigger "click"
      $element.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.off "click", spy
      $element.trigger "click"
      $element.trigger "click"
      expect(spy.callCount).to.equal 2

  describe "#once", ->

    it "bind callback which will called once", ->
      spy = sinon.spy()
      $element = $("#id3")
      $element.once "click", spy
      $element.trigger "click"
      $element.trigger "click"
      expect(spy.callCount).to.equal 1

  describe "#on (delegate)", ->

    spy = null
    $element = null
    $button = null

    beforeEach ->
      spy = sinon.spy()
      $element = $("#container")
      $button = $(document.querySelector "button")

    afterEach ->
      $element.off()

    it "delegate function 1", ->
      $element.on "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

    it "delegate function 2", ->
      $element.on "click", ".class1", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

  describe "#off (undelegate)", ->

    spy = null
    $element = null
    $button = null

    beforeEach ->
      spy = sinon.spy()
      $element = $("#container")
      $button = $(document.querySelector "button")

    afterEach ->
      $element.off()

    it "undelegate function 1", ->
      $element.on "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.off "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

    it "undelegate function 2", ->
      $element.on "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.off "click", "button"
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

    it "undelegate function 3", ->
      $element.on "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.off "click"
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

    it "undelegate function 4", ->
      $element.on "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.off()
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
