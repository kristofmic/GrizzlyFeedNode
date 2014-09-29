(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$modal',
    '_',
    'user',
    'userFeeds',
    'snackbar',
    feedsController
  ];

  angular.module('nl.Feeds')
    .controller('feedsController', definitions);

  function feedsController($scope, $modal, _, user, userFeeds, snackbar) {
    userFeeds.init()
      .then(function(userFeeds) {
        $scope.finishedLoading = true;
      });

    $scope.userFeeds = userFeeds.model;
    $scope.layout = user.model.layout;

    $scope.sortableConfig = {
      itemMoved: handleItemMoved,
      orderChanged: handleOrderChanged,
      containment: '#feed-container'
    };

    $scope.expand = expandEntry;
    $scope.markAsVisited = visitEntry;
    $scope.editFeed = editFeed;
    $scope.refreshFeeds = refreshUserFeeds;
    $scope.updateLayout = updateLayout;

    function handleItemMoved(e) {
      var
        item = e.source.itemScope.modelValue,
        srcCol = item.userFeed.col,
        srcRow = item.userFeed.row,
        destCol = e.dest.sortableScope.modelValue.col,
        i,
        len,
        userFeedsToUpdate;

      item.userFeed.col = destCol;
      item.userFeed.row = e.dest.index + 1;

      for (i = item.userFeed.row, len = $scope.userFeeds.feeds[destCol].length; i < len; i++) {
        $scope.userFeeds.feeds[destCol][i].userFeed.row += 1;
      }

      for (i = srcRow - 1, len = $scope.userFeeds.feeds[srcCol].length; i < len; i++) {
        $scope.userFeeds.feeds[srcCol][i].userFeed.row -= 1;
      }

      updateUserFeeds();
    }

    function handleOrderChanged(e) {
      var
        destCol = e.dest.sortableScope.modelValue.col,
        userFeedsToUpdate;

      for (var i = 0, len = $scope.userFeeds.feeds[destCol].length; i < len; i++) {
        $scope.userFeeds.feeds[destCol][i].userFeed.row = i + 1;
      }

      updateUserFeeds();
    }

    function updateUserFeeds() {
      var
        userFeedsToupdate;

      userFeedsToUpdate = _.map($scope.userFeeds.feeds[0].concat($scope.userFeeds.feeds[1]).concat($scope.userFeeds.feeds[2]), mapUserFeed);

      userFeeds.updatePositions(userFeedsToUpdate);

      function mapUserFeed(userFeedItem) {
        return {
          userFeed: userFeedItem.userFeed,
          feed: {
            _id: userFeedItem.feed._id
          }
        };
      }
    }

    function expandEntry(entry) {
      visitEntry(entry);
      entry.expand = !entry.expand;
    }

    function visitEntry(entry) {
      if (!entry.visited) {
        userFeeds.visitEntry(entry);
        entry.visited = true;
      }
    }

    function editFeed(userFeed) {
      var
        modalConfig;

      $scope.feedToEdit = userFeed;

      modalConfig = {
        templateUrl: 'edit_feed_modal.html',
        backdrop: 'static',
        keyboard: false,
        controller: 'editFeedModalController',
        scope: $scope
      };

      $modal.open(modalConfig);
    }

    function refreshUserFeeds() {
      snackbar.loading('Updating. Please wait.');
      $scope.refreshing = true;

      userFeeds.refresh()
        .then(updateTimestamp)
        .then(handleSuccess('Feeds are up to date.'))
        ['catch'](handleError)
        ['finally'](finishRefresh);

      function updateTimestamp() {
        $scope.userFeeds.lastUpdated = new Date();
      }

      function finishRefresh() {
        $scope.refreshing = false;
      }
    }

    function updateLayout(newLayout) {
      if ($scope.layout !== newLayout) {
        user.update({ layout: newLayout });
        $scope.layout = newLayout;
      }
    }

    function handleSuccess(message) {
      return function() {
        snackbar.success(message);
      };
    }

    function handleError(err) {
      snackbar.error(angular.fromJson(err.data));
    }

  }

})(angular);