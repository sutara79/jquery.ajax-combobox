'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
      ' * @file <%= pkg.name %>\n' +
      ' * @version <%= pkg.version %>\n' +
      ' * @author <%= pkg.author %>\n' +
      ' * @license <%= pkg.license %>\n' +
      ' */',

    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      dist: {
        files: [
          {
            src: 'src/js/*.js',
            dest: 'dist/js/<%= pkg.name %>.js'
          }
        ]
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: [
          {
            src: 'dist/js/<%= pkg.name %>.js',
            dest: 'dist/js/<%= pkg.name %>.min.js'
          }
        ]
      }
    },
    qunit: {
      options: {
        timeout: 30000,
        '--web-security': 'no',
        coverage: {
          src: ['dist/js/<%= pkg.name %>.js'],
          instrumentedFiles: 'temp/',
          lcovReport: 'coverage/js/',
          linesThresholdPct: 0
        }
      },
      files: ['test/js/index.html']
    },
    watch: {
      files: "<%= concat.dist.files[0].src %>",
      tasks: ['concat']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-qunit-istanbul');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['watch']);

};
