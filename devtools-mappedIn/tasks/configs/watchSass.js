'use strict';
module.exports.tasks = {
  watch: {
    sass: {
      files: [ '<%= workspacePath %>/**/*.scss' ],
      tasks: [ 'compileSass' ],
      options: {
        spawn: false
      }
    }
  }
};
