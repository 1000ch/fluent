expect = chai.expect

describe 'Fluent Class', ->
  it 'has Fluent.ready', ->
    expect(!!Fluent.ready).to.equal true
  it 'has Fluent.bind', ->
    expect(!!Fluent.bind).to.equal true
  it 'has Fluent.unbind', ->
    expect(!!Fluent.unbind).to.equal true
  it 'has Fluent.once', ->
    expect(!!Fluent.once).to.equal true
  it 'has Fluent.delegate', ->
    expect(!!Fluent.delegate).to.equal true
  it 'has Fluent.undelegate', ->
    expect(!!Fluent.undelegate).to.equal true
  it 'has Fluent.extend', ->
    expect(!!Fluent.extend).to.equal true
  it 'has Fluent.fill', ->
    expect(!!Fluent.fill).to.equal true
  it 'has Fluent.each', ->
    expect(!!Fluent.each).to.equal true
  it 'has Fluent.copy', ->
    expect(!!Fluent.copy).to.equal true
  it 'has Fluent.defineClass', ->
    expect(!!Fluent.defineClass).to.equal true
  it 'has Fluent.serialize', ->
    expect(!!Fluent.serialize).to.equal true
  it 'has Fluent.deserialize', ->
    expect(!!Fluent.deserialize).to.equal true
  it 'has Fluent.loadScript', ->
    expect(!!Fluent.loadScript).to.equal true
  it 'has Fluent.is', ->
    expect(!!Fluent.is).to.equal true
  it 'has Fluent.has', ->
    expect(!!Fluent.has).to.equal true
  it 'has Fluent.camelize', ->
    expect(!!Fluent.camelize).to.equal true
  it 'has Fluent.dasherize', ->
    expect(!!Fluent.dasherize).to.equal true
  it 'has Fluent.format', ->
    expect(!!Fluent.format).to.equal true
  it 'has Fluent.escapeHTML', ->
    expect(!!Fluent.escapeHTML).to.equal true
  it 'has Fluent.unescapeHTML', ->
    expect(!!Fluent.unescapeHTML).to.equal true

describe 'Fluent Instance', ->
  it 'can initialize with document', ->
    expect($(document).length).to.equal new Fluent(document).length






