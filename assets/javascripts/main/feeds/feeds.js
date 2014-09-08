(function(angular) {

  var
    definitions;

  definitions = [
    '$http',
    '_',
    'user',
    feedsFactory
  ];

  angular.module('nl.Feeds')
    .factory('feeds', definitions);

  function feedsFactory($http, _, user) {

    var
      self = {},
      feedsStore = {};

    self.init = init;

    return self;

    function init() {
      if (_.isEmpty(feedsStore)) {
        return self;
      }
      else {
        return $http.get('/api/feeds', { headers: { token: user.token() }})
          .then(setFeedsFromResponse);
      }
    }

    function setFeedsFromResponse(res) {
      if (res.data && angular.isObject(res.data)) {
        _.extend(feedsStore, res.data);
      }
      return self;
    }

  }

})(angular);