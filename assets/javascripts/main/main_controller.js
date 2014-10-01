(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$auth',
    'user',
    mainController
  ];

  angular.module('nl.Main')
    .controller('mainController', definitions);

  function mainController($scope, $auth, user) {
    $scope.isAuthenticated = $auth.isAuthenticated;
    $scope.user = user;
  }

})(angular);