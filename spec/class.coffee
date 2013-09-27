expect = chai.expect

describe 'Fluent Class', ->

  it 'has Fluent.isString', ->
    expect(!!$.isString).to.equal true

  it 'has Fluent.isFunction', ->
    expect(!!$.isFunction).to.equal true

  it 'has Fluent.each', ->
    expect(!!$.each).to.equal true

  it 'has Fluent.extend', ->
    expect(!!$.extend).to.equal true

  it 'has Fluent.fill', ->
    expect(!!$.fill).to.equal true

  it 'has Fluent.merge', ->
    expect(!!$.merge).to.equal true

  it 'has Fluent.ready', ->
    expect(!!$.ready).to.equal true

  it 'has Fluent.pluck', ->
    expect(!!$.pluck).to.equal true

  it 'has Fluent.copy', ->
    expect(!!$.copy).to.equal true

  it 'has Fluent.defineClass', ->
    expect(!!$.defineClass).to.equal true

  it 'has Fluent.bind', ->
    expect(!!$.bind).to.equal true

  it 'has Fluent.unbind', ->
    expect(!!$.unbind).to.equal true

  it 'has Fluent.once', ->
    expect(!!$.once).to.equal true

  it 'has Fluent.delegate', ->
    expect(!!$.delegate).to.equal true

  it 'has Fluent.undelegate', ->
    expect(!!$.undelegate).to.equal true

  it 'has Fluent.addClass', ->
    expect(!!$.addClass).to.equal true

  it 'has Fluent.removeClass', ->
    expect(!!$.removeClass).to.equal true

  it 'has Fluent.toggleClass', ->
    expect(!!$.toggleClass).to.equal true

  it 'has Fluent.hasClass', ->
    expect(!!$.hasClass).to.equal true

  it 'has Fluent.serialize', ->
    expect(!!$.serialize).to.equal true

  it 'has Fluent.deserialize', ->
    expect(!!$.deserialize).to.equal true

  it 'has Fluent.format', ->
    expect(!!$.format).to.equal true

  it 'has Fluent.camelize', ->
    expect(!!$.camelize).to.equal true

  it 'has Fluent.dasherize', ->
    expect(!!$.dasherize).to.equal true

  it 'has Fluent.loadScript', ->
    expect(!!$.loadScript).to.equal true

  it 'has Fluent.escapeHTML', ->
    expect(!!$.escapeHTML).to.equal true

  it 'has Fluent.unescapeHTML', ->
    expect(!!$.unescapeHTML).to.equal true