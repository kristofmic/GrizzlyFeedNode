(function(angular) {

  var
    definitions;

  definitions = [
    '$rootScope',
    '$http',
    '_',
    'user',
    'userFeeds',
    'USER_EVENT',
    feedsFactory
  ];

  angular.module('nl.Feeds')
    .factory('feeds', definitions);

  function feedsFactory($rootScope, $http, _, user, userFeeds, USER_EVENT) {
    var
      self = {},
      feeds = [];

    $rootScope.$on(USER_EVENT.LOGOUT, clear);

    self.init = init;
    self.create = create;
    self.all = all;

    return self;

    function init() {
      if (!_.isEmpty(feeds)) {
        return self;
      }
      else {
        return $http.get('/api/feeds', { headers: { token: user.token() }})
          .then(setFeedsFromResponse);
      }
    }

    function create(url) {
      return $http.post('/api/feeds', { url: url }, { headers: { token: user.token() }})
        .then(setFeedsFromResponse);
    }

    function setFeedsFromResponse(res) {
      var
        feedsRes = res.data;

      if (feedsRes && angular.isObject(feedsRes)) {
        feedsRes = angular.isArray(feedsRes) ? feedsRes : [feedsRes];
        _.each(feedsRes, setFeed);
      }
      return self;

      function setFeed(feedItem) {
        feedItem.added = userFeeds.includes(feedItem);
        feeds.push(feedItem);
      }
    }

    function all() {
      return feeds;
    }

    function clear() {
      feeds = [];
    }

  }

})(angular);