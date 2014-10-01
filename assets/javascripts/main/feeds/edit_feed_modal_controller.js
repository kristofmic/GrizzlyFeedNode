(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$http',
    'snackbar',
    '$modalInstance',
    '_',
    'userFeeds',
    'messenger',
    editFeedModalController
  ];

  angular.module('nl.Feeds')
    .controller('editFeedModalController', definitions);

  function editFeedModalController($scope, $http, snackbar, modal, _, userFeeds, messenger) {
    $scope.save = save;
    $scope.dismiss = modal.dismiss;


    function save(remove, entries) {
      snackbar.loading('Processing. Please wait.');

      if (remove) {
        return userFeeds.destroy($scope.feedToEdit.feed)
          .then(removeFeed)
          .then(clearFeedToEdit)
          .then(modal.close)
          .then(handleSuccess('The feed was successfully removed.'))
          ['catch'](messenger.handleError);
      } else {
        return userFeeds.updateEntries($scope.feedToEdit)
          .then(setFeedEntries)
          .then(clearFeedToEdit)
          .then(modal.close)
          .then(handleSuccess('The feed was successfully updated.'))
          ['catch'](messenger.handleError);
      }

      function removeFeed() {
        var
          col = $scope.feedToEdit.userFeed.col;

        _.remove($scope.userFeeds.feeds[col], $scope.feedToEdit);
      }

      function setFeedEntries(res) {
        $scope.feedToEdit.feed.entries = res.data.feed.entries;
      }

      function clearFeedToEdit() {
        $scope.feedToEdit = undefined;
      }

      function handleSuccess(message) {
        return function() {
          snackbar.success(message);
        };
      }
    }

  }

})(angular);