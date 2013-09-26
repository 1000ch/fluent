expect = chai.expect

describe "Fluent Event", ->

  describe "#bind", ->

    it "bind function", ->
      spy = sinon.spy()
      $element = $("#id3")
      $element.bind "click", spy
      $element.trigger "click"
      $element.trigger "click"
      expect(spy.callCount).to.equal 2

  describe "#unbind", ->

    it "unbind function", ->
      spy = sinon.spy()
      $element = $("#id3")
      $element.bind "click", spy
      $element.trigger "click"
      $element.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.unbind "click", spy
      $element.trigger "click"
      $element.trigger "click"
      expect(spy.callCount).to.equal 2

  describe "#once", ->

    it "bind function which will called once", ->
      spy = sinon.spy()
      $element = $("#id3")
      $element.once "click", spy
      $element.trigger "click"
      $element.trigger "click"
      expect(spy.callCount).to.equal 1

  describe "#delegate", ->

    spy = null
    $element = null
    $button = null

    beforeEach ->
      spy = sinon.spy()
      $element = $("#container")
      $button = $(document.querySelector "button")

    afterEach ->
      $element.undelegate()

    it "delegate function 1", ->
      $element.delegate "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

    it "delegate function 2", ->
      $element.delegate "click", ".class1", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

  describe "#undelegate", ->

    spy = null
    $element = null
    $button = null

    beforeEach ->
      spy = sinon.spy()
      $element = $("#container")
      $button = $(document.querySelector "button")

    afterEach ->
      $element.undelegate()

    it "undelegate function 1", ->
      $element.delegate "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.undelegate "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

    it "undelegate function 2", ->
      $element.delegate "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.undelegate "click", "button"
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

    it "undelegate function 3", ->
      $element.delegate "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.undelegate "click"
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2

    it "undelegate function 4", ->
      $element.delegate "click", "button", spy
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
      $element.undelegate()
      $button.trigger "click"
      $button.trigger "click"
      expect(spy.callCount).to.equal 2
