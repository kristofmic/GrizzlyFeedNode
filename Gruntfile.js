module.exports = gruntConfig;

function gruntConfig(grunt) {
  var
    pkg = grunt.file.readJSON('package.json'),
    tasks = require('./tasks/grunt');

  grunt.initConfig({
    jsPath: 'assets/javascripts',
    componentsPath: 'assets/components',
    cssPath: 'assets/stylesheets',
    htmlPath: 'assets/templates',
    imagePath: 'assets/images',
    pubJsPath: 'public/javascripts',
    pubCssPath: 'public/stylesheets',
    pubImagePath: 'public/images',
    pubFontPath: 'public/fonts',

    concat: tasks.concat,
    watch: tasks.watch,
    copy: tasks.copy,
    sass: tasks.sass,
    ngtemplates: tasks.ngtemplates,
    uglify: tasks.uglify,
    bgShell: tasks.bgShell,
    mochaTest: tasks.mochaTest
  });

  for (var task in pkg.devDependencies) {
    if (task !== 'grunt' && !task.indexOf('grunt')) {
      grunt.loadNpmTasks(task);
    }
  }

  grunt.registerTask('build:dev', [
    'copy',
    'ngtemplates',
    'concat',
    'sass'
  ]);
  grunt.registerTask('build:dist', [
    'build:dev',
    'uglify'

  ]);
  grunt.registerTask('test:dev:server', [
    'mochaTest'
  ]);
  grunt.registerTask('test:dist', [
    'build:dist',
    'mochaTest'
  ]);
  grunt.registerTask('server', ['bgShell:server']);
  grunt.registerTask('default', [
    'build:dist',
    'server'
  ]);
}