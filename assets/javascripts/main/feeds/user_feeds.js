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
      userFeeds = [],
      self = {};

    $rootScope.$on(USER_EVENT.LOGOUT, clear);

    self.init = init;
    self.create = create;
    self.updatePositions = updatePositions;
    self.updateEntries = updateEntries;
    self.destroy = destroy;
    self.visitEntry = visitEntry;
    self.all = all;

    return self;

    function init() {
      return $http.get('/api/user_feeds', { headers: { token: user.token() }})
        .then(setUserFeedsFromResponse);

      function setUserFeedsFromResponse(res) {
        var
          userFeedsRes = res.data;

        if (userFeedsRes && angular.isObject(userFeedsRes)) {
          userFeeds = userFeedsRes;
        }

        return self;
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

    function destroy(feed) {
      return $http.delete('/api/user_feeds/' + feed._id, { headers: { token: user.token() }})
        .then(setUserFromResponse);
    }

    function visitEntry(entry) {
      return $http.post('/api/user_feed_entries/', { entryId: entry._id }, { headers: { token: user.token() }});
    }

    function setUserFromResponse(res) {
      var
        feedsRes = res.data;

      if (feedsRes && angular.isObject(feedsRes)) {
        user.props.set('feeds', feedsRes.feeds);
      }

      return self;
    }

    function all() {
      return userFeeds;
    }

    function clear() {
      userFeeds = [];
    }

  }

})(angular);