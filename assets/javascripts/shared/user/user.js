(function(angular) {

  var
    definitions;

  definitions = [
    '$window',
    '$rootScope',
    '$http',
    '$auth',
    'authService',
    '$modal',
    '_',
    userFactory
  ];

  angular.module('nl.User')
    .factory('user', definitions);

  function userFactory($window, $rootScope, $http, $auth, authService, $modal, _) {
    var
      self = {},
      userStore = {};

    $rootScope.$on('event:auth-loginRequired', verifyLogin);

    self.init = init;
    self.create = create;
    self.update = update;
    self.login = login;
    self.logout = logout;
    self.resetPassword = resetPassword;
    self.token = getToken();
    self.props = {
      get: getProp,
      set: setProp
    };

    return self;

    function init() {
      var
        token = getToken();

      if (token) {
        return $http.get('/api/session', { headers: { token: token }})
          .then(setUserFromResponse);
      }
      else {
        return self;
      }
    }

    function create(userParams) {
      return $auth.signup(userParams)
        .then(setUserFromResponse);
    }

    function update(userParams) {
      var
        token = getToken();

      if (token) {
        return $http.put('/api/users', userParams, { headers: { token: token}})
          .then(setUserFromResponse);
      }
      else {
        return self;
      }
    }

    function login(credentials) {
      return $auth.login(credentials)
        .then(setUserFromResponse)
        .then(confirmLogin);
    }

    function logout() {
      var
        token = getToken();

      if (token) {
        $http.delete('/api/sessions', { headers: { token: token }});
      }

      clear();
      $auth.logout();
    }

    function resetPassword(config) {
      return $http.put('/api/users/reset_password', config);
    }

    function verifyLogin(e, res) {
      var
        modalConfig;

      modalConfig = {
        templateUrl: 'login_modal.html',
        backdrop: 'static',
        keyboard: false,
        controller: 'loginModalController'
      };

      $modal.open(modalConfig);
    }

    function confirmLogin() {
      authService.loginConfirmed(null, updateConfig);

      function updateConfig(httpConfig) {
        httpConfig.headers.token = getToken();
        return httpConfig;
      }
    }

    function getProp(prop) {
      return userStore[prop];
    }

    function setProp(prop, val) {
      userStore[prop] = val;
    }

    function setUserFromResponse(res) {
      if (res.data && angular.isObject(res.data)) {
        _.extend(userStore, res.data);
      }
      return self;
    }

    function clear() {
      userStore = {};
    }

    function getToken() {
      return $window.localStorage.nl_token;
    }
  }

})(angular);