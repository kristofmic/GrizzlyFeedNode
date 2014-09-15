(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$http',
    'snackbar',
    '$modalInstance',
    editFeedModalController
  ];

  angular.module('nl.Feeds')
    .controller('editFeedModalController', definitions);

  function editFeedModalController($scope, $http, snackbar, modal) {

    $scope.dismiss = modal.dismiss;


  }

})(angular);