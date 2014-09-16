(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$http',
    'snackbar',
    '$modalInstance',
    'userFeeds',
    editFeedModalController
  ];

  angular.module('nl.Feeds')
    .controller('editFeedModalController', definitions);

  function editFeedModalController($scope, $http, snackbar, modal, userFeeds) {
    $scope.save = save;
    $scope.dismiss = modal.dismiss;


    function save(remove) {
      if (remove) {
        return userFeeds.destroy($scope.feedToEdit.feed)
          .then(handleSuccess)
          .then(modal.close)
          ['catch'](handleError);
      }

      function handleSuccess() {
        snackbar.success('The feed was successfully removed.');
      }

      function handleError(err) {
        snackbar.error(angular.fromJson(err.data));
      }
    }

  }

})(angular);