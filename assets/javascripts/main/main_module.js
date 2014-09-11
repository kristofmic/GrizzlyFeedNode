(function(angular) {

  var
    dependencies,
    authConfigDefinition;

  dependencies = [
    'ngTouch',
    'satellizer',
    'nl.Templates',
    'nl.States',
    'nl.Home',
    'nl.Session',
    'nl.Signup',
    'nl.Feeds',
    'nl.Account'
  ];

  authConfigDefinition = [
    '$authProvider',
    configAuth
  ];

  angular.module('nl.Main', dependencies)
    .config(authConfigDefinition);

  function configAuth($authProvider) {
    $authProvider.signupUrl = '/api/users';
    $authProvider.signupRedirect = '/signup';
    $authProvider.loginOnSignup = false;

    $authProvider.loginUrl = '/api/sessions';
    $authProvider.loginRedirect = '/account';

    $authProvider.logoutRedirect = null;

    $authProvider.tokenPrefix = 'nl';
    $authProvider.tokenName = 'token';
  }

})(angular);