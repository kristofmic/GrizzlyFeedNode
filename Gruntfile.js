module.exports = gruntConfig;

function gruntConfig(grunt) {
  var
    pkg = grunt.file.readJSON('package.json'),
    tasks = require('./tasks/grunt'),
    config;

  config = {
    jsPath: 'assets/javascripts',
    componentsPath: 'assets/components',
    cssPath: 'assets/stylesheets',
    htmlPath: 'assets/templates',
    imagePath: 'assets/images',
    pubJsPath: 'public/javascripts',
    pubCssPath: 'public/stylesheets',
    pubImagePath: 'public/images',
    pubFontPath: 'public/fonts',
  };

  for (var task in tasks) {
    config[task] = tasks[task];
  }

  grunt.initConfig(config);

  for (var dependency in pkg.devDependencies) {
    if (dependency !== 'grunt' && !dependency.indexOf('grunt')) {
      grunt.loadNpmTasks(dependency);
    }
  }

  grunt.registerTask('build:dev', [
    'clean',
    'copy',
    'ngtemplates',
    'concat',
    'sass'
  ]);
  grunt.registerTask('build:dist', [
    'build:dev',
    'uglify',
    'filerev',
    'userev'
  ]);
  grunt.registerTask('test:dev:server', [
    'mochaTest'
  ]);
  grunt.registerTask('test:dist', [
    'mochaTest'
  ]);
  grunt.registerTask('server', ['bgShell:server']);
  grunt.registerTask('default', [
    'build:dist',
    'server'
  ]);
}