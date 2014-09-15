(function(angular) {

  var
    definitions;

  definitions = [
    '$http',
    '_',
    'user',
    userFeedsFactory
  ];

  angular.module('nl.Feeds')
    .factory('userFeeds', definitions);

  function userFeedsFactory($http, _, user) {

    var
      self = {};

    self.init = init;
    self.create = create;
    self.update = update;
    self.destroy = destroy;
    self.includes = includes;

    return self;

    function init() {
      return $http.get('/api/user_feeds', { headers: { token: user.token() }})
        .then(setUserFeedsFromResponse);
    }

    function create(feed) {
      return $http.post('/api/user_feeds', { feedId: feed._id }, { headers: { token: user.token() }})
        .then(setUserFeedsFromResponse);
    }

    function update(feeds) {
      return $http.put('/api/user_feeds', { feeds: feeds }, { headers: { token: user.token() }})
        .then(setUserFeedsFromResponse);
    }

    function destroy(feed) {
      return $http.delete('/api/user_feeds/' + feed._id, { headers: { token: user.token() }})
        .then(setUserFeedsFromResponse);
    }

    function includes(feedItem) {
      return !!_.find(user.props.get('feeds'), { feed: { _id: feedItem._id }});
    }

    function setUserFeedsFromResponse(res) {
      if (res.data && angular.isObject(res.data)) {
        user.props.set('feeds', res.data.feeds || res.data);
      }
    }

  }

})(angular);