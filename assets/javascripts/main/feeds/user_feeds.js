// TODO: Move UserFeeds (position, entries, feed info) to this servier
// User should only know of what feeds it is subscribed to, not full feed information

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
    self.destroy = destroy;
    self.all = all;

    return self;

    function init() {
      return $http.get('/api/user_feeds', { headers: { token: user.token() }})
        .then(setUserFeedsFromResponse);

      function setUserFeedsFromResponse(res) {
        var
          userFeedsRes = res.data;

        if (userFeedsRes && angular.isObject(userFeedsRes)) {
          userFeeds = userFeedsRes.feeds || userFeedsRes;
        }

        return self;
      }
    }

    function create(feed) {
      return $http.post('/api/user_feeds', { feedId: feed._id }, { headers: { token: user.token() }});
    }

    function updatePositions(feeds) {
      return $http.put('/api/user_feeds/positions', { feeds: feeds }, { headers: { token: user.token() }});
    }

    function destroy(feed) {
      return $http.delete('/api/user_feeds/' + feed._id, { headers: { token: user.token() }});
    }

    function all() {
      return userFeeds;
    }

    function clear() {
      userFeeds = [];
    }

  }

})(angular);