(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    'entries',
    homeController
  ];

  angular.module('nl.Home')
    .controller('homeController', definitions);

  function homeController($scope, entries) {
    entries.init()
      .then(function(entries) {
        $scope.entries = entries.model;
        $scope.finishedLoading = true;
        console.log($scope.entries);
      });
  }

})(angular);