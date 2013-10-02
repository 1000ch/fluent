expect = chai.expect

describe 'Fluent Class', ->

  describe 'Fluent.isFunction', ->
    it 'exists', ->
      expect(!!$.isFunction).to.equal true
    it 'return true when the argument is function', ->
      expect($.isFunction(()->)).to.equal true
    it 'return false when the argument is string', ->
      expect($.isFunction("")).to.equal false
    it 'return false when the argument is number', ->
      expect($.isFunction(1)).to.equal false
    it 'return false when the argument is array', ->
      expect($.isFunction([])).to.equal false
    it 'return false when the argument is object', ->
      expect($.isFunction({})).to.equal false
    it 'return false when the argument is null', ->
      expect($.isFunction(null)).to.equal false
    it 'return false when the argument is undefined', ->
      expect($.isFunction(undefined)).to.equal false

  describe 'Fluent.isString', ->
    it 'exists', ->
      expect(!!$.isString).to.equal true
    it 'is function', ->
      expect($.isFunction($.isString)).to.equal true
    it 'return false when the argument is function', ->
      expect($.isString(()->)).to.equal false
    it 'return true when the argument is string', ->
      expect($.isString("")).to.equal true
    it 'return false when the argument is number', ->
      expect($.isString(1)).to.equal false
    it 'return false when the argument is array', ->
      expect($.isString([])).to.equal false
    it 'return false when the argument is object', ->
      expect($.isString({})).to.equal false
    it 'return false when the argument is null', ->
      expect($.isString(null)).to.equal false
    it 'return false when the argument is undefined', ->
      expect($.isString(undefined)).to.equal false

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
    it 'exists', ->
      expect(!!$.extend).to.equal true
    it 'is function', ->
      expect($.isFunction($.extend)).to.equal true

  describe 'Fluent.fill', ->
    it 'exists', ->
      expect(!!$.fill).to.equal true
    it 'is function', ->
      expect($.isFunction($.fill)).to.equal true

  describe 'Fluent.merge', ->
    it 'exists', ->
      expect(!!$.merge).to.equal true
    it 'is function', ->
      expect($.isFunction($.merge)).to.equal true

  describe 'Fluent.ready', ->
    it 'exists', ->
      expect(!!$.ready).to.equal true
    it 'is function', ->
      expect($.isFunction($.ready)).to.equal true

  describe 'Fluent.pluck', ->
    it 'exists', ->
      expect(!!$.pluck).to.equal true
    it 'is function', ->
      expect($.isFunction($.pluck)).to.equal true

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
    it 'exists', ->
      expect(!!$.addClass).to.equal true
    it 'is function', ->
      expect($.isFunction($.addClass)).to.equal true

  describe 'Fluent.removeClass', ->
    it 'exists', ->
      expect(!!$.removeClass).to.equal true
    it 'is function', ->
      expect($.isFunction($.removeClass)).to.equal true

  describe 'Fluent.toggleClass', ->
    it 'exists', ->
      expect(!!$.toggleClass).to.equal true
    it 'is function', ->
      expect($.isFunction($.toggleClass)).to.equal true

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

  describe 'Fluent.dasherize', ->
    it 'exists', ->
      expect(!!$.dasherize).to.equal true
    it 'is function', ->
      expect($.isFunction($.dasherize)).to.equal true

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

  describe 'Fluent.unescapeHTML', ->
    it 'exists', ->
      expect(!!$.unescapeHTML).to.equal true
    it 'is function', ->
      expect($.isFunction($.unescapeHTML)).to.equal true