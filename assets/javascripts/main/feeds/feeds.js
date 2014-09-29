(function(angular) {

  var
    definitions;

  definitions = [
    '$rootScope',
    '$http',
    '_',
    'user',
    'USER_EVENT',
    feedsFactory
  ];

  angular.module('nl.Feeds')
    .factory('feeds', definitions);

  function feedsFactory($rootScope, $http, _, user, USER_EVENT) {
    var
      self = {},
      feeds = [];

    $rootScope.$on(USER_EVENT.LOGOUT, clear);

    self.init = init;
    self.create = create;
    self.all = all;

    return self;

    function init() {
      return $http.get('/api/feeds', { headers: { token: user.token() }})
        .then(setFeedsFromResponse);

      function setFeedsFromResponse(res) {
        var
          feedsRes = res.data,
          userFeedItems = user.model.feeds;

        if (feedsRes && angular.isObject(feedsRes)) {
          feedsRes = angular.isArray(feedsRes) ? feedsRes : [feedsRes];
          feeds = _.map(feedsRes, mapFeed);
        }
        return self;

        function mapFeed(feedItem) {
          feedItem.added = !!_.find(userFeedItems, { feed: feedItem._id });
          return feedItem;
        }
      }
    }

    function create(url) {
      return $http.post('/api/feeds', { url: url }, { headers: { token: user.token() }})
        .then(addFeed);

      function addFeed(res) {
        var
          feed = res.data;

        if (feed && angular.isObject(feed)) {
          feeds.push(feed);
        }
        return feed;
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