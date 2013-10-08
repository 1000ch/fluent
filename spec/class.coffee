expect = chai.expect

describe 'Fluent Class', ->

  describe 'Fluent.isFunction', ->

    it 'exists', ->
      expect(!!$.isFunction).to.equal true

    it 'return appropriate value with any argument', ->
      expect($.isFunction(()->)).to.equal true
      expect($.isFunction("")).to.equal false
      expect($.isFunction(1)).to.equal false
      expect($.isFunction([])).to.equal false
      expect($.isFunction({})).to.equal false
      expect($.isFunction(null)).to.equal false
      expect($.isFunction(undefined)).to.equal false

  describe 'Fluent.isString', ->

    it 'exists', ->
      expect(!!$.isString).to.equal true

    it 'is function', ->
      expect($.isFunction($.isString)).to.equal true

    it 'return appropriate value with any argument', ->
      expect($.isString(()->)).to.equal false
      expect($.isString("")).to.equal true
      expect($.isString(1)).to.equal false
      expect($.isString([])).to.equal false
      expect($.isString({})).to.equal false
      expect($.isString(null)).to.equal false
      expect($.isString(undefined)).to.equal false

  describe 'Fluent.qsa', ->

    it 'exists', ->
      expect(!!$.qsa).to.equal true

    it 'is function', ->
      expect($.isFunction($.qsa)).to.equal true

  describe 'Fluent.each', ->

    it 'exists', ->
      expect(!!$.each).to.equal true

    it 'is function', ->
      expect($.isFunction($.each)).to.equal true

    it 'can iterate array', ->
      array = [1, 2, 3]
      count = 0
      $.each(array, ->
        count++
      )
      expect(count).to.equal array.length

    it 'can iterate object', ->
      obj = {
        key1: 1
        key2: 2
        key3: 3
        key4: 4
        key5: 5
      }
      count = 0
      $.each(obj, ->
        count++
      )
      expect(count).to.equal Object.keys(obj).length

  describe 'Fluent.extend', ->

    obj1 = null
    obj2 = null
    obj3 = null
    obj4 = null

    beforeEach ->
      obj1 = {
        key1: 1
        key2: 2
      }
      obj2 = {
        key2: 10
        key3: 3
      }
      obj3 = {
        key1: 1
        key2: 10
        key3: 3
      }
      obj4 = {
        key1: 1
        key2: 2
        key3: 3
      }

    it 'exists', ->
      expect(!!$.extend).to.equal true

    it 'is function', ->
      expect($.isFunction($.extend)).to.equal true

    it 'extends object pattern1', ->
      $.extend(obj1, obj2)
      expect(obj1.key1).to.equal obj3.key1
      expect(obj1.key2).to.equal obj3.key2
      expect(obj1.key3).to.equal obj3.key3

    it 'extends object pattern2', ->
      $.extend(obj2, obj1)
      expect(obj2.key1).to.equal obj4.key1
      expect(obj2.key2).to.equal obj4.key2
      expect(obj2.key3).to.equal obj4.key3

  describe 'Fluent.fill', ->

    obj1 = null
    obj2 = null
    obj3 = null
    obj4 = null

    beforeEach ->
      obj1 = {
        key1: 1
        key2: 2
      }
      obj2 = {
        key2: 10
        key3: 3
      }
      obj3 = {
        key1: 1
        key2: 2
        key3: 3
      }
      obj4 = {
        key1: 1
        key2: 10
        key3: 3
      }


    it 'exists', ->
      expect(!!$.fill).to.equal true

    it 'is function', ->
      expect($.isFunction($.fill)).to.equal true

    it 'fill object pattern1', ->
      $.fill(obj1, obj2)
      expect(obj1.key1).to.equal obj3.key1
      expect(obj1.key2).to.equal obj3.key2
      expect(obj1.key3).to.equal obj3.key3

    it 'fill object pattern2', ->
      $.fill(obj2, obj1)
      expect(obj2.key1).to.equal obj4.key1
      expect(obj2.key2).to.equal obj4.key2
      expect(obj2.key3).to.equal obj4.key3

  describe 'Fluent.merge', ->

    array1 = null
    array2 = null
    array3 = null
    array4 = null

    beforeEach ->
      array1 = []
      array2 = [1, 2, 3]
      array3 = [4, 5]
      array4 = [1, 2, 3, 4, 5]

    it 'exists', ->
      expect(!!$.merge).to.equal true

    it 'is function', ->
      expect($.isFunction($.merge)).to.equal true

    it 'merge array pattern1', ->
      $.merge(array1, array2)
      expect(array1.toString()).to.equal array2.toString()

    it 'merge array pattern2', ->
      $.merge(array2, array3)
      expect(array2.toString()).to.equal array4.toString()

    it 'merge array pattern3', ->
      $.merge(array1, array2)
      $.merge(array1, array3)
      expect(array1.toString()).to.equal array4.toString()

  describe 'Fluent.ready', ->

    it 'exists', ->
      expect(!!$.ready).to.equal true

    it 'is function', ->
      expect($.isFunction($.ready)).to.equal true

  describe 'Fluent.pluck', ->

    array = [{key1: 1, key2: 2, key3: 3}, {key1: 10, key2: 20, key3: 30}, {key1: 100, key2: 200}]

    it 'exists', ->
      expect(!!$.pluck).to.equal true

    it 'is function', ->
      expect($.isFunction($.pluck)).to.equal true

    it 'map array key1', ->
      expect($.pluck(array, 'key1').toString()).to.equal [1, 10, 100].toString()

    it 'map array key2', ->
      expect($.pluck(array, 'key2').toString()).to.equal [2, 20, 200].toString()

    it 'map array key3', ->
      expect($.pluck(array, 'key3').toString()).to.equal [3, 30, undefined].toString()

  describe 'Fluent.copy', ->

    it 'exists', ->
      expect(!!$.copy).to.equal true

    it 'is function', ->
      expect($.isFunction($.copy)).to.equal true

  describe 'Fluent.defineClass', ->

    it 'exists', ->
      expect(!!$.defineClass).to.equal true

    it 'is function', ->
      expect($.isFunction($.defineClass)).to.equal true

  describe 'Fluent.bind', ->

    it 'exists', ->
      expect(!!$.bind).to.equal true

    it 'is function', ->
      expect($.isFunction($.bind)).to.equal true

  describe 'Fluent.unbind', ->

    it 'exists', ->
      expect(!!$.unbind).to.equal true

    it 'is function', ->
      expect($.isFunction($.unbind)).to.equal true

  describe 'Fluent.once', ->

    it 'exists', ->
      expect(!!$.once).to.equal true

    it 'is function', ->
      expect($.isFunction($.once)).to.equal true

  describe 'Fluent.delegate', ->

    it 'exists', ->
      expect(!!$.delegate).to.equal true

    it 'is function', ->
      expect($.isFunction($.delegate)).to.equal true

  describe 'Fluent.undelegate', ->

    it 'exists', ->
      expect(!!$.undelegate).to.equal true

    it 'is function', ->
      expect($.isFunction($.undelegate)).to.equal true

  describe 'Fluent.addClass', ->

    elements = null

    beforeEach ->
      elements = $.qsa("#id1")

    it 'exists', ->
      expect(!!$.addClass).to.equal true

    it 'is function', ->
      expect($.isFunction($.addClass)).to.equal true

    it "add class to a element", ->
      expect($.hasClass(elements[0], "classTest")).to.equal false
      $.addClass elements[0], "classTest"
      expect($.hasClass(elements[0], "classTest")).to.equal true

    it "add multiple classes to a element", ->
      expect($.hasClass(elements[0], "foo")).to.equal false
      expect($.hasClass(elements[0], "bar")).to.equal false
      $.addClass elements[0], "foo bar"
      expect($.hasClass(elements[0], "foo")).to.equal true
      expect($.hasClass(elements[0], "bar")).to.equal true


  describe 'Fluent.removeClass', ->

    elements = null

    beforeEach ->
      elements = $.qsa("#id2")

    it 'exists', ->
      expect(!!$.removeClass).to.equal true

    it 'is function', ->
      expect($.isFunction($.removeClass)).to.equal true

    it "remove class from a element", ->
      $.addClass elements[0], "classTest"
      expect($.hasClass(elements[0], "classTest")).to.equal true
      $.removeClass elements[0], "classTest"
      expect($.hasClass(elements[0], "classTest")).to.equal false

    it "remove multiple classes from a element", ->
      $.addClass elements[0], "foo bar"
      expect($.hasClass(elements[0], "foo")).to.equal true
      expect($.hasClass(elements[0], "bar")).to.equal true
      $.removeClass elements[0], "foo bar"
      expect($.hasClass(elements[0], "foo")).to.equal false
      expect($.hasClass(elements[0], "bar")).to.equal false

  describe 'Fluent.toggleClass', ->

    elements = null

    beforeEach ->
      elements = $.qsa("#id3")

    it 'exists', ->
      expect(!!$.toggleClass).to.equal true

    it 'is function', ->
      expect($.isFunction($.toggleClass)).to.equal true

    it "toggle class of a element", ->
      $.toggleClass elements[0], "classTest"
      expect($.hasClass(elements[0], "classTest")).to.equal true
      $.toggleClass elements[0], "classTest"
      expect($.hasClass(elements[0], "classTest")).to.equal false

    it "toggle multiple classes of a element", ->
      $.toggleClass elements[0], "foo"
      expect($.hasClass(elements[0], "foo")).to.equal true
      expect($.hasClass(elements[0], "bar")).to.equal false
      $.toggleClass elements[0], "foo bar"
      expect($.hasClass(elements[0], "foo")).to.equal false
      expect($.hasClass(elements[0], "bar")).to.equal true

  describe 'Fluent.hasClass', ->

    it 'exists', ->
      expect(!!$.hasClass).to.equal true

    it 'is function', ->
      expect($.isFunction($.hasClass)).to.equal true

  describe 'Fluent.serialize', ->

    it 'exists', ->
      expect(!!$.serialize).to.equal true

    it 'is function', ->
      expect($.isFunction($.serialize)).to.equal true

  describe 'Fluent.deserialize', ->

    it 'exists', ->
      expect(!!$.deserialize).to.equal true

    it 'is function', ->
      expect($.isFunction($.deserialize)).to.equal true

  describe 'Fluent.format', ->

    it 'exists', ->
      expect(!!$.format).to.equal true

    it 'is function', ->
      expect($.isFunction($.format)).to.equal true

  describe 'Fluent.camelize', ->

    it 'exists', ->
      expect(!!$.camelize).to.equal true

    it 'is function', ->
      expect($.isFunction($.camelize)).to.equal true

    it 'camerize', ->
      expect($.camelize('hello')).to.equal 'hello'
      expect($.camelize('HELLO')).to.equal 'HELLO'
      expect($.camelize('hello-world-test')).to.equal 'helloWorldTest'
      expect($.camelize('helloWorld')).to.equal 'helloWorld'

  describe 'Fluent.dasherize', ->

    it 'exists', ->
      expect(!!$.dasherize).to.equal true

    it 'is function', ->
      expect($.isFunction($.dasherize)).to.equal true

    it 'dasherize', ->
      expect($.dasherize('hello')).to.equal 'hello'
      expect($.dasherize('HELLO')).to.equal 'hello'
      expect($.dasherize('helloWorldTest')).to.equal 'hello-world-test'
      expect($.dasherize('hello-world')).to.equal 'hello-world'

  describe 'Fluent.loadScript', ->

    it 'exists', ->
      expect(!!$.loadScript).to.equal true

    it 'is function', ->
      expect($.isFunction($.loadScript)).to.equal true

  describe 'Fluent.escapeHTML', ->

    it 'exists', ->
      expect(!!$.escapeHTML).to.equal true

    it 'is function', ->
      expect($.isFunction($.escapeHTML)).to.equal true

    it 'escape', ->
      expect($.escapeHTML("Curly & Moe")).to.equal "Curly &amp; Moe"
      expect($.escapeHTML('<a href="http://moe.com">Curly & Moe\'s</a>')).to.equal '&lt;a href=&quot;http://moe.com&quot;&gt;Curly &amp; Moe&#x27;s&lt;/a&gt;'
      expect($.escapeHTML("Curly &amp; Moe")).to.equal "Curly &amp;amp; Moe"
      expect($.escapeHTML(null)).to.equal ""

  describe 'Fluent.unescapeHTML', ->

    it 'exists', ->
      expect(!!$.unescapeHTML).to.equal true

    it 'is function', ->
      expect($.isFunction($.unescapeHTML)).to.equal true

    it 'unescape', ->
      expect($.unescapeHTML("Curly &amp; Moe")).to.equal "Curly & Moe"
      expect($.unescapeHTML('&lt;a href=&quot;http://moe.com&quot;&gt;Curly &amp; Moe&#x27;s&lt;/a&gt;')).to.equal '<a href="http://moe.com">Curly & Moe\'s</a>'
      expect($.unescapeHTML("Curly &amp;amp; Moe")).to.equal "Curly &amp; Moe"
      expect($.unescapeHTML(null)).to.equal ''