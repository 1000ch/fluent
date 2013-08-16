expect = chai.expect

describe "Fluent Instance", ->

  it "can initialize with document", ->
    expect($(document).length).to.equal 1
    expect(Fluent(document).length).to.equal 1
    expect(new Fluent(document).length).to.equal 1

  it "can initialize with document", ->
    expect($(document.body).length).to.equal 1

  it "can initialize without arguments", ->
    expect($().length).to.equal new Fluent().length

  it "can initialize by id selector", ->
    expect($("#id3")[0]).to.equal document.getElementById("id3")

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