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
    feeds.init()
      .then(function(feeds) {
        $scope.finishedLoading = true;
        $scope.feeds = feeds.model;
      });

    $scope.addFeed = addFeed;
    $scope.addUserFeed = addUserFeed;
    $scope.removeUserFeed = removeUserFeed;
    $scope.toggleRemove = toggleRemoveIcon;

    function addFeed(feedUrl) {
      snackbar.loading('Processing. Please wait.');

      feeds.create(feedUrl)
        .then(addAsUserFeed)
        .then(handleSuccess)['catch'](handleError);

      function addAsUserFeed(feed) {
        return userFeeds.create(feed)
          .then(function() {
            feed.added = true;
            feed.subscribers += 1;
          });
      }

      function handleSuccess() {
        $scope.feedUrl = '';
        snackbar.success('Your feed was successfully added.');
      }
    }

    function addUserFeed(feed) {
      userFeeds.create(feed)
        .then(handleSuccess)['catch'](handleError);

      function handleSuccess() {
        feed.added = true;
        feed.subscribers += 1;
        snackbar.success('The feed was successfully added.');
      }
    }

    function removeUserFeed(feed) {
      userFeeds.destroy(feed)
        .then(handleSuccess)['catch'](handleError);

      function handleSuccess() {
        feed.added = false;
        feed.subscribers -= 1;
        snackbar.success('The feed was successfully removed.');
      }
    }

    function toggleRemoveIcon($e, enter) {
      if (enter) {
        angular.element($e.target).addClass('fa-times').removeClass('fa-check');
      } else {
        angular.element($e.target).addClass('fa-check').removeClass('fa-times');
      }
    }

    function handleError(err) {
      snackbar.error(angular.fromJson(err.data));
    }
  }

})(angular);