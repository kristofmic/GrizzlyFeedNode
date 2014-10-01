(function(angular) {

  var
    dependencies;

  dependencies = [
    'ch.Validator',
    'ch.Snackbar',
    'nl.Messenger',
    'nl.User'
  ];

  angular.module('nl.Account', dependencies);

})(angular);