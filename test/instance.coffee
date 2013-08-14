expect = chai.expect

describe 'Fluent Instance', ->
  it 'can initialize with document', ->
    expect($(document).length).to.equal new Fluent(document).length