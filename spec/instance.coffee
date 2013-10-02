expect = chai.expect

describe "Fluent Instance", ->

  describe "Instance", ->

    $element = null

    beforeEach ->
      $element = $(document)

    it "has each()", ->
      expect(!!$element.each).to.equal true
      expect($.isFunction($element.each)).to.equal true

    it "has map()", ->
      expect(!!$element.map).to.equal true
      expect($.isFunction($element.map)).to.equal true

    it "has filter()", ->
      expect(!!$element.filter).to.equal true
      expect($.isFunction($element.filter)).to.equal true

    it "has indexOf()", ->
      expect(!!$element.indexOf).to.equal true
      expect($.isFunction($element.indexOf)).to.equal true

    it "has lastIndexOf()", ->
      expect(!!$element.lastIndexOf).to.equal true
      expect($.isFunction($element.lastIndexOf)).to.equal true

    it "has bind()", ->
      expect(!!$element.bind).to.equal true
      expect($.isFunction($element.bind)).to.equal true

    it "has unbind()", ->
      expect(!!$element.unbind).to.equal true
      expect($.isFunction($element.unbind)).to.equal true

    it "has trigger()", ->
      expect(!!$element.trigger).to.equal true
      expect($.isFunction($element.trigger)).to.equal true

    it "has once()", ->
      expect(!!$element.once).to.equal true
      expect($.isFunction($element.once)).to.equal true

    it "has delegate()", ->
      expect(!!$element.delegate).to.equal true
      expect($.isFunction($element.delegate)).to.equal true

    it "has undelegate()", ->
      expect(!!$element.undelegate).to.equal true
      expect($.isFunction($element.undelegate)).to.equal true

    it "has filter()", ->
      expect(!!$element.filter).to.equal true
      expect($.isFunction($element.filter)).to.equal true

    it "has map()", ->
      expect(!!$element.map).to.equal true
      expect($.isFunction($element.map)).to.equal true

    it "has find()", ->
      expect(!!$element.find).to.equal true
      expect($.isFunction($element.find)).to.equal true

    it "has html()", ->
      expect(!!$element.html).to.equal true
      expect($.isFunction($element.html)).to.equal true

    it "has text()", ->
      expect(!!$element.text).to.equal true
      expect($.isFunction($element.text)).to.equal true

    it "has val()", ->
      expect(!!$element.val).to.equal true
      expect($.isFunction($element.val)).to.equal true

    it "has attr()", ->
      expect(!!$element.attr).to.equal true
      expect($.isFunction($element.attr)).to.equal true

    it "has data()", ->
      expect(!!$element.data).to.equal true
      expect($.isFunction($element.data)).to.equal true

    it "has css()", ->
      expect(!!$element.css).to.equal true
      expect($.isFunction($element.css)).to.equal true

    it "has addClass()", ->
      expect(!!$element.addClass).to.equal true
      expect($.isFunction($element.addClass)).to.equal true

    it "has removeClass()", ->
      expect(!!$element.removeClass).to.equal true
      expect($.isFunction($element.removeClass)).to.equal true

    it "has toggleClass()", ->
      expect(!!$element.toggleClass).to.equal true
      expect($.isFunction($element.toggleClass)).to.equal true

    it "has append()", ->
      expect(!!$element.append).to.equal true
      expect($.isFunction($element.append)).to.equal true

  describe "Core", ->

    it "can initialize with document", ->
      expect($(document).length).to.equal 1
      expect(Fluent(document).length).to.equal 1
      expect(Fluent.prototype.initialize(document).length).to.equal 1

    it "can initialize without arguments", ->
      expect($().length).to.equal Fluent().length

    it "can initialize by id selector", ->
      expect($("#id3")[0]).to.equal document.getElementById "id3"

    it "can initialize by class selector", ->
      expect($(".class2").length).to.equal document.getElementsByClassName("class2").length

    it "can initialize by tag selector", ->
      expect($("div").length).to.equal document.getElementsByTagName("div").length

    it "can initialize by name selector", ->
      expect($("[name=name1]").length).to.equal document.getElementsByName("name1").length

    it "can initialize by complex selector a", ->
      expect($("div, .class2").length).to.equal document.querySelectorAll("div, .class2").length

    it "can initialize by complex selector a", ->
      expect($("section#id4").length).to.equal document.querySelectorAll("section#id4").length

    it "can execute optimized search", ->
      expect($("#conatiner div").length).to.equal document.querySelectorAll("#container div").length

    it "can iterate", ->
      $element = $("div")
      count = 0
      $element.each (div) ->
        count++
      expect(count).to.equal $element.length
