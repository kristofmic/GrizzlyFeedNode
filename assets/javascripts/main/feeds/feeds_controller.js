(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    'user',
    'snackbar',
    feedsController
  ];

  angular.module('nl.Feeds')
    .controller('feedsController', definitions);

  function feedsController($scope, user, snackbar) {
    $scope.user = user.props;
  }

})(angular);