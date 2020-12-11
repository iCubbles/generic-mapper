'use strict';
module.exports = function (grunt) {
  grunt.registerTask('compileSass', 'Compile all *.scss files', ['sass:dist']);
};
