module.exports = function(grunt) {
 
  // Project configuration.
  grunt.initConfig({
    // This line makes your node configurations available for use
    pkg: grunt.file.readJSON('package.json'),
    // This is where we configure JSHint
    jshint: {
      // You get to make the name
      // The paths tell JSHint which files to validate
      myFiles: ['app/**/*.js']
    },
    watch: {
      scripts: {
        files: ['app/**/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      },
      apidoc: {
        files: ['app/**/*.js'],
        tasks: ['apidoc'],
        options: {
          livereload: {
            host: 'localhost',
            port: 35730,
          },
        },
      },
      css: {
        files: ['assets/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      },
      files: {
        files: ['app/**/*.html', 'index.html'],
        options: {
          livereload: true,
        },
      },
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'assets/sass/',
          src: ['*.scss'],
          dest: 'assets/css',
          ext: '.css'
        }]
      },
    },
    apidoc: {
      extranet: {
        src: "app/",
        dest: "apidoc/",
        template: 'apidocTemplate/',
        options: {
          debug: false,
          log: true
        }
      }
    }
  });
  // Each plugin must be loaded following this pattern
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-apidoc');
 
};