(function(angular) {

  var
    definitions;

  definitions = [
    '$rootScope',
    '$http',
    '_',
    'user',
    'USER_EVENT',
    userFeedsFactory
  ];

  angular.module('nl.Feeds')
    .factory('userFeeds', definitions);

  function userFeedsFactory($rootScope, $http, _, user, USER_EVENT) {

    var
      self = {};

    $rootScope.$on(USER_EVENT.LOGOUT, clear);

    self.init = init;
    self.create = create;
    self.updatePositions = updatePositions;
    self.updateEntries = updateEntries;
    self.destroy = destroy;
    self.visitEntry = visitEntry;
    self.refresh = refresh;
    self.model = {};

    return self;

    function init() {
      return $http.get('/api/user_feeds', { headers: { token: user.token() }})
        .then(setUserFeedsFromResponse);

      function setUserFeedsFromResponse(res) {
        var
          userFeedsRes = res.data;

        if (userFeedsRes && angular.isObject(userFeedsRes)) {
          self.model.feeds = userFeedsRes;
          self.model.lastUpdated = new Date();
          self.model.feeds = _.groupBy(self.model.feeds, groupFeeds);

          self.model.feeds[0] = self.model.feeds[0] || [];
          self.model.feeds[1] = self.model.feeds[1] || [];
          self.model.feeds[2] = self.model.feeds[2] || [];
          self.model.feeds[0].col = 0;
          self.model.feeds[1].col = 1;
          self.model.feeds[2].col = 2;
        }

        return self;

        function groupFeeds(userFeedItem) {
          var
            feedUpdated = new Date(userFeedItem.feed.updatedAt);

          if (feedUpdated < self.model.lastUpdated) {
            self.model.lastUpdated = feedUpdated;
          }

          return userFeedItem.userFeed.col;
        }
      }
    }

    function create(feed) {
      return $http.post('/api/user_feeds', { feedId: feed._id }, { headers: { token: user.token() }})
        .then(setUserFromResponse);
    }

    function updatePositions(feeds) {
      return $http.put('/api/user_feeds/positions', { feeds: feeds }, { headers: { token: user.token() }});
    }

    function updateEntries(userFeedItem) {
      return $http.put('/api/user_feeds/entries', { feedId: userFeedItem.feed._id, entries: userFeedItem.userFeed.entries }, { headers: { token: user.token() }});
    }

    function refresh() {
      return $http.get('/api/user_feeds/refresh', { headers: { token: user.token() }})
        .then(setNewEntries);

      function setNewEntries(res) {
        var
          newEntries = res.data;

        _.each(newEntries, setNewFeedEntries);

        function setNewFeedEntries(newFeedEntries, feedId) {
          var
            userFeedItemToUpdate = findFeed(feedId);

          _.eachRight(newFeedEntries, setNewFeedEntry);

          function setNewFeedEntry(newEntry) {
            userFeedItemToUpdate.feed.entries.pop();
            userFeedItemToUpdate.feed.entries.unshift(newEntry);
          }
        }
      }
    }

    function destroy(feed) {
      return $http.delete('/api/user_feeds/' + feed._id, { headers: { token: user.token() }})
        .then(setUserFromResponse);
    }

    function visitEntry(entry) {
      return $http.post('/api/user_feed_entries/', { entryId: entry._id }, { headers: { token: user.token() }});
    }

    function findFeed(feedId) {
      var
        foundFeed;

      _.each(self.model.feeds, searchColumns);

      return foundFeed;

      function searchColumns(colFeeds, col) {
        foundFeed = _.find(colFeeds, searchColumn);

        if (foundFeed) { return false; }

        function searchColumn(colFeed) {
          return colFeed.feed._id === feedId;
        }
      }
    }

    function setUserFromResponse(res) {
      var
        feedsRes = res.data;

      if (feedsRes && angular.isObject(feedsRes)) {
        user.model.feeds = feedsRes.feeds;
      }

      return self;
    }

    function clear() {
      self.model = {};
    }

  }

})(angular);