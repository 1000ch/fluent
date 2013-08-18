expect = chai.expect

describe "Fluent Event", ->

  describe "#bind", ->
    it "bind function", ->
      spy = sinon.spy()
      $("#id3").bind("click", spy)

  describe "#unbind", ->

  describe "#once", ->

  describe "#delegate", ->

  describe "#undelegate", ->