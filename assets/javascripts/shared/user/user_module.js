(function(angular) {

  var
    dependencies;

  dependencies = [
    'satellizer',
    'http-auth-interceptor',
    'ui.bootstrap',
    'nl.Vendor.LoDash'
  ];

  angular.module('nl.User', dependencies)
    .constant('USER_EVENT', {
      LOGOUT: 'USER:LOGOUT'
    });

})(angular);