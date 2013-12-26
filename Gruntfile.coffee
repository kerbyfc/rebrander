module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    coffee:
      compile:
        options:
          bare: true
        files:
          "rebrander.js": ["rebrander.coffee"]

    uglify:
      compile:
        files:
          "rebrander.min.js": ["rebrander.js"]

    watch:
      coffee:
        files: ["rebrander.coffee", "Gruntfile.coffee"]
        tasks: ["coffee", "uglify"]


  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  grunt.registerTask "default", ["coffee", "uglify", "watch"]
