(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '_',
    'feeds',
    'userFeeds',
    'snackbar',
    addFeedsController
  ];

  angular.module('nl.Feeds')
    .controller('addFeedsController', definitions);

  function addFeedsController($scope, _, feeds, userFeeds, snackbar) {
    $scope.feeds = feeds.all;
    $scope.addFeed = addFeed;
    $scope.addUserFeed = addUserFeed;
    $scope.removeUserFeed = removeUserFeed;

    function addFeed(feedUrl) {
      snackbar.loading('Processing. Please wait.');

      feeds.create(feedUrl)
        .then(addAsUserFeed)
        .then(handleSuccess)
        ['catch'](handleError);

      function addAsUserFeed(feed) {
        return userFeeds.create(feed)
          .then(function() { feed.added = true; });
      }

      function handleSuccess() {
        $scope.feedUrl = '';
        snackbar.success('Your feed was successfully added.');
      }
    }

    function addUserFeed(feed) {
      userFeeds.create(feed)
        .then(handleSuccess)
        ['catch'](handleError);

      function handleSuccess() {
        feed.added = true;
        snackbar.success('The feed was successfully added.');
      }
    }

    function removeUserFeed(feed) {
      userFeeds.destroy(feed)
        .then(handleSuccess)
        ['catch'](handleError);

      function handleSuccess() {
        feed.added = false;
        snackbar.success('The feed was successfully removed.');
      }
    }

    function handleError(err) {
      snackbar.error(angular.fromJson(err.data));
    }
  }

})(angular);