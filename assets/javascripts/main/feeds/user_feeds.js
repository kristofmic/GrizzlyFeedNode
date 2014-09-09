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

    self.create = create;
    self.destroy = destroy;
    self.includes = includes;

    return self;

    function create(feed) {
      return $http.post('/api/user_feeds', { feedId: feed._id }, { headers: { token: user.token() }})
        .then(setUserFeedsFromResponse);
    }

    function destroy(feed) {
      return $http.delete('/api/user_feeds/' + feed._id, { headers: { token: user.token() }})
        .then(setUserFeedsFromResponse);
    }

    function includes(feed) {
      return _.contains(user.props.get('feeds'), feed._id);
    }

    function setUserFeedsFromResponse(res) {
      if (res.data && angular.isObject(res.data)) {
        user.props.set('feeds', res.data);
      }
    }

  }

})(angular);