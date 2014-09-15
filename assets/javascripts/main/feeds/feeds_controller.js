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
    var
      userFeedItems = user.props.get('feeds');

    $scope.feeds = _.groupBy(userFeedItems, groupFeeds);
    $scope.feeds[0] = $scope.feeds[0] || [];
    $scope.feeds[1] = $scope.feeds[1] || [];
    $scope.feeds[2] = $scope.feeds[2] || [];
    $scope.feeds[0].col = 0;
    $scope.feeds[1].col = 1;
    $scope.feeds[2].col = 2;

    $scope.sortableConfig = {
      itemMoved: handleItemMoved,
      orderChanged: handleOrderChanged,
      containment: '#feed-container'
    };

    $scope.expand = expandEntry;

    $scope.editFeed = editFeed;

    function groupFeeds(userFeedItem) {
      return userFeedItem.userFeed.col;
    }

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

      for (i = item.userFeed.row, len = $scope.feeds[destCol].length; i < len; i++) {
        $scope.feeds[destCol][i].userFeed.row += 1;
      }

      for (i = srcRow - 1, len = $scope.feeds[srcCol].length; i < len; i++) {
        $scope.feeds[srcCol][i].userFeed.row -= 1;
      }

      updateUserFeeds();
    }

    function handleOrderChanged(e) {
      var
        destCol = e.dest.sortableScope.modelValue.col,
        userFeedsToUpdate;

      for (var i = 0, len = $scope.feeds[destCol].length; i < len; i++) {
        $scope.feeds[destCol][i].userFeed.row = i + 1;
      }

      updateUserFeeds();
    }

    function updateUserFeeds() {
      var
        userFeedsToupdate;

      userFeedsToUpdate = _.map($scope.feeds[0].concat($scope.feeds[1]).concat($scope.feeds[2]), mapUserFeed);

      userFeeds.update(userFeedsToUpdate);

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
      entry.expand = !entry.expand;
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
  }

})(angular);