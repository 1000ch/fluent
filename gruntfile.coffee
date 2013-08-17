module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    jshint:
      all: ["./src/fluent.js", "./src/fluent.animation.js"]
    uglify:
      js:
        files:
          "./dist/fluent.min.js": ["./src/fluent.js"],
          "./dist/fluent.animation.min.js": ["./src/fluent.animation.js"]
    plato:
      dist:
        src: ['src/*.js']
        dest: 'reports'
    watch:
      files: ["./src/fluent.js", "./src/fluent.animation.js"]
      tasks: ["jshint"]

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-plato'

  grunt.registerTask "default", "watch"
  grunt.registerTask "build", ["uglify", "plato"]