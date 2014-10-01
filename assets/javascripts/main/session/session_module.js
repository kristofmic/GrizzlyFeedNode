(function(angular) {

  var
    dependencies;

  dependencies = [
    'ui.router',
    'ui.bootstrap',
    'ch.Validator',
    'ch.Snackbar',
    'nl.Messenger',
    'nl.User'
  ];

  angular.module('nl.Session', dependencies);

})(angular);