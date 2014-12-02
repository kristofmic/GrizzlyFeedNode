module.exports = {
  components: {
    src: [
      '<%= componentsPath %>/jquery/dist/jquery.js',
      '<%= componentsPath %>/bootstrap/dist/js/bootstrap.js',
      '<%= componentsPath %>/angular/angular.js',
      '<%= componentsPath %>/angular-animate/angular-animate.js',
      '<%= componentsPath %>/angular-touch/angular-touch.js',
      '<%= componentsPath %>/angular-sanitize/angular-sanitize.js',
      '<%= componentsPath %>/angular-ui-router/release/angular-ui-router.js',
      '<%= componentsPath %>/angular-http-auth/src/http-auth-interceptor.js',
      '<%= componentsPath %>/satellizer/satellizer.js',
      '<%= componentsPath %>/angular-bootstrap/ui-bootstrap-tpls.js',
      '<%= componentsPath %>/ng-sortable/dist/ng-sortable.js',
      '<%= componentsPath %>/lodash/dist/lodash.js',
      '<%= componentsPath %>/chSnackbar/dist/chSnackbar.js',
      '<%= componentsPath %>/chValidator/dist/chValidator.js'
    ],
    dest: '<%= pubJsPath %>/components.js'
  },
  main: {
    options: {
      process: function(src, filepath) {
        return '\n// ' + filepath + '\n' + src;
      }
    },
    src: [
      '<%= jsPath %>/vendor/**/*.js',
      '<%= jsPath %>/shared/user/user_module.js',
      '<%= jsPath %>/shared/user/*.js',
      '<%= jsPath %>/shared/active_nav/active_nav_module.js',
      '<%= jsPath %>/shared/active_nav/*.js',
      '<%= jsPath %>/shared/infinite_scroll/infinite_scroll_module.js',
      '<%= jsPath %>/shared/infinite_scroll/*.js',
      '<%= jsPath %>/shared/messenger/messenger_module.js',
      '<%= jsPath %>/shared/messenger/*.js',
      '<%= jsPath %>/main/session/session_module.js',
      '<%= jsPath %>/main/session/*.js',
      '<%= jsPath %>/main/signup/signup_module.js',
      '<%= jsPath %>/main/signup/*.js',
      '<%= jsPath %>/main/feeds/feeds_module.js',
      '<%= jsPath %>/main/feeds/*.js',
      '<%= jsPath %>/main/entries/entries_module.js',
      '<%= jsPath %>/main/entries/*.js',
      '<%= jsPath %>/main/account/account_module.js',
      '<%= jsPath %>/main/account/*.js',
      '<%= jsPath %>/main/home/home_module.js',
      '<%= jsPath %>/main/home/*.js',
      '<%= jsPath %>/main/states/states_module.js',
      '<%= jsPath %>/main/states/*.js',
      '<%= jsPath %>/main/templates_module.js',
      '<%= jsPath %>/main/main_module.js',
      '<%= jsPath %>/main/**/*.js',
    ],
    dest: '<%= pubJsPath %>/main.js'
  }
};