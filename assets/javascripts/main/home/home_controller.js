(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    'SCROLL_EVENT',
    'entries',
    homeController
  ];

  angular.module('nl.Home')
    .controller('homeController', definitions);

  function homeController($scope, SCROLL_EVENT, entries) {
    var
      multiplier = 1,
      offset = 25;

    entries.init()
      .then(function(entries) {
        $scope.entries = entries.model;
      });

    $scope.$on(SCROLL_EVENT.MET, handleScrollEvent);
    $scope.$on('$stateChangeStart', removeScrollListener);

    function handleScrollEvent() {
      entries.get(offset * multiplier++)
        .then(registerScrollListener);
    }

    function registerScrollListener() {
      $scope.$broadcast(SCROLL_EVENT.REGISTER);
    }

    function removeScrollListener() {
      $scope.$broadcast(SCROLL_EVENT.REMOVE);
    }
  }

})(angular);