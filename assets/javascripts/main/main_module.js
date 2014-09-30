(function(angular) {

  var
    dependencies,
    authConfigDefinition,
    snackbarConfigDefinition;

  dependencies = [
    'ngTouch',
    'ngSanitize',
    'satellizer',
    'ch.Snackbar',
    'nl.Templates',
    'nl.States',
    'nl.Home',
    'nl.Session',
    'nl.Signup',
    'nl.Feeds',
    'nl.Account',
    'nl.ActiveNav'
  ];

  authConfigDefinition = [
    '$authProvider',
    configAuth
  ];

  snackbarConfigDefinition = [
    'snackbarProvider',
    configSnackbar
  ];

  angular.module('nl.Main', dependencies)
    .config(authConfigDefinition)
    .config(snackbarConfigDefinition);

  function configAuth($authProvider) {
    $authProvider.signupUrl = '/api/users';
    $authProvider.signupRedirect = '/signup';
    $authProvider.loginOnSignup = false;

    $authProvider.loginUrl = '/api/sessions';
    $authProvider.loginRedirect = '/feeds';

    $authProvider.logoutRedirect = null;

    $authProvider.tokenPrefix = 'nl';
    $authProvider.tokenName = 'token';
  }

  function configSnackbar(snackbarProvider) {
    snackbarProvider.setColors({
      success: '#259b24',
      error: '#e51c23',
      notice: 'rgba(0, 0, 0, .87)',
      loading: '#4e6cef'
    });
  }

})(angular);