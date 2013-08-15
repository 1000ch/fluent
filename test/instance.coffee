expect = chai.expect

describe "Fluent Instance", ->

  it "can initialize with document", ->
    expect($(document).length).to.equal 1
    expect(new Fluent(document).length).to.equal 1

  it "can search with id", ->
    expect($("#id3")[0]).to.equal document.getElementById("id3")

  it "can search with class", ->
    expect($(".class2").length).to.equal document.getElementsByClassName("class2").length

  it "can search with tag", ->
    expect($("div").length).to.equal document.getElementsByTagName("div").length

  it "can search with name", ->
    expect($("[name=name1]").length).to.equal document.getElementsByName("name1").length





