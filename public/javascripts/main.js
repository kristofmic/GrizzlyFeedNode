
// assets/javascripts/vendor/lodash_module.js
(function(angular) {

  var
    dependencies = [],
    factoryDefinition;

  factoryDefinition = [
    '$window',
    lodash
  ];

  angular.module('nl.Vendor.LoDash', dependencies)
    .factory('_', factoryDefinition);

  function lodash($window) { return $window._; }

})(angular);

// assets/javascripts/shared/user/user_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [
    'satellizer',
    'http-auth-interceptor',
    'ui.bootstrap',
    'nl.Vendor.LoDash'
  ];

  angular.module('nl.User', dependencies)
    .constant('USER_EVENT', {
      LOGOUT: 'USER:LOGOUT'
    });

})(angular);

// assets/javascripts/shared/user/user.js
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
    'USER_EVENT',
    userFactory
  ];

  angular.module('nl.User')
    .factory('user', definitions);

  function userFactory($window, $rootScope, $http, $auth, authService, $modal, _, USER_EVENT) {
    var
      self = {};

    $rootScope.$on('event:auth-loginRequired', verifyLogin);

    self.init = init;
    self.create = create;
    self.update = update;
    self.login = login;
    self.logout = logout;
    self.resetPassword = resetPassword;
    self.token = getToken;
    self.model = {};

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
      $rootScope.$broadcast(USER_EVENT.LOGOUT);
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

    function setUserFromResponse(res) {
      if (res.data && angular.isObject(res.data)) {
        _.extend(self.model, res.data);
      }
      return self;
    }

    function clear() {
      self.model = {};
    }

    function getToken() {
      return $window.localStorage.nl_token;
    }
  }

})(angular);

// assets/javascripts/shared/active_nav/active_nav_module.js
(function(angular) {

	var
		dependencies;

	dependencies = [
    'ui.router'
  ];

	angular.module('nl.ActiveNav', dependencies);

})(angular);

// assets/javascripts/shared/active_nav/active_nav_directive.js
(function(angular) {

	var
		definitions;

	definitions = [
		'$state',
		activeNavDirective
	];

	angular.module('nl.ActiveNav')
		.directive('nlActiveNav', definitions);

	function activeNavDirective($state) {

		return {
			restrict: 'AC',
			link: link,
			scope: {
				targetState: '@nlActiveNav'
			}
		};

		function link(scope, elem, attrs) {
			scope.$on('$stateChangeSuccess', handleStateChange);

			handleStateChange(null, $state.current, null, {});

			function handleStateChange(e, toState, toParams, fromState) {
				if (toState.name === scope.targetState) {
					elem.addClass('active');
				} else if (fromState.name === scope.targetState) {
					elem.removeClass('active');
				}
			}
		}
	}

})(angular);

// assets/javascripts/shared/infinite_scroll/infinite_scroll_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [];

  angular.module('nl.InfiniteScroll', dependencies)
    .constant('SCROLL_EVENT', {
      MET: 'nl.InfiniteScroll:events:met',
      REGISTER: 'nl.InfiniteScroll:events:register',
      REMOVE: 'nl.InfiniteScroll:events:remove'
    });

})(angular);

// assets/javascripts/shared/infinite_scroll/inifinite_scroll_directive.js
(function(angular) {

	var
		definitions;

	definitions = [
		'$window',
		'$document',
		'SCROLL_EVENT',
		infiniteScrollDirective
	];

	angular.module('nl.InfiniteScroll')
		.directive('nlInfiniteScroll', definitions);

	function infiniteScrollDirective($window, $document, SCROLL_EVENT) {
		return link;

		function link(scope, elem, attrs) {
			var
				screenHeight = $window.innerHeight;

			registerScrollListener();
			scope.$on(SCROLL_EVENT.REGISTER, registerScrollListener);
			scope.$on(SCROLL_EVENT.REMOVE, removeScrollListener);

			function registerScrollListener() {
				removeScrollListener();
				$document.on('scroll', handleScroll);
			}

			function handleScroll() {
				if ($window.scrollY + screenHeight >= elem[0].offsetTop) {
					scope.$emit(SCROLL_EVENT.MET);
					removeScrollListener();
				}
			}

			function removeScrollListener() {
				$document.off('scroll', handleScroll);
			}
		}
	}

})(angular);

// assets/javascripts/shared/messenger/messenger_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [
    'ch.Snackbar'
  ];

  angular.module('nl.Messenger', dependencies);

})(angular);

// assets/javascripts/shared/messenger/messenger.js
(function(angular) {

	var
		definitions;

	definitions = [
		'snackbar',
		messengerFactory
	];

	angular.module('nl.Messenger')
		.factory('messenger', definitions);

	function messengerFactory(snackbar) {
		var
			defaults;

		defaults = {
			error: 'There was a problem processing your request. Please try again.'
		};

		return {
			handleError: handleError
		};

		function handleError(err) {
			if (err && err.data) {
				err = angular.fromJson(err.data);
			}

			err = typeof err === 'string' ? err : defaults.error;
			snackbar.error(err);

		}
	}

})(angular);

// assets/javascripts/main/session/session_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [
    'ui.router',
    'ui.bootstrap',
    'ch.Validator',
    'ch.Snackbar',
    'nl.Messenger',
    'nl.User'
  ];

  angular.module('nl.Session', dependencies);

})(angular);

// assets/javascripts/main/session/email_verification_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$state',
    '$stateParams',
    '$http',
    'snackbar',
    'messenger',
    emailVerificationController
  ];

  angular.module('nl.Session')
    .controller('emailVerificationController', definitions);

  function emailVerificationController($scope, $state, $stateParams, $http, snackbar, messenger) {
    $http.put('/api/users/verify_email', { verificationToken: $stateParams.verificationToken })
      .then(handleSuccess)
      ['catch'](handleError);

    function handleSuccess(res) {
      snackbar.success('Thank you for verifying your email! You may now login.');
      $state.go('main.public.login', null, { location: 'replace' });
    }

    function handleError(err) {
      messenger.handleError(err);
      $state.go('main.public.login', null, { location: 'replace' });
    }
  }

})(angular);

// assets/javascripts/main/session/forgot_password_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$state',
    '$stateParams',
    'user',
    'snackbar',
    'messenger',
    'VALIDATION_EVENT',
    forgotPasswordController
  ];

  angular.module('nl.Session')
    .controller('forgotPasswordController', definitions);

  function forgotPasswordController($scope, $state, $stateParams, user, snackbar, messenger, VALIDATION_EVENT) {
    $scope.submit = submit;

    function submit(form, password) {
      $scope.$broadcast(VALIDATION_EVENT.VALIDATE);

      if (form.$valid) {
        snackbar.loading('Processing. Please wait.');

        user.resetPassword({
          resetToken: $stateParams.resetToken,
          password: password
        })
        .then(handleSuccess)
        ['catch'](messenger.handleError);
      }

      function handleSuccess(res) {
        snackbar.success('Your password has been reset. You may now login.');
        $state.go('main.public.login', null, { location: 'replace' });
      }

    }
  }

})(angular);

// assets/javascripts/main/session/forgot_password_modal_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$state',
    '$http',
    'snackbar',
    'messenger',
    '$modalInstance',
    forgotPasswordModalController
  ];

  angular.module('nl.Session')
    .controller('forgotPasswordModalController', definitions);

  function forgotPasswordModalController($scope, $state, $http, snackbar, messenger, modal) {
    $scope.submit = submit;
    $scope.dismiss = modal.dismiss;

    function submit(email) {
      if (email) {
        snackbar.loading('Processing. Please wait.');

        $http.post('/api/sessions/forgot_password', { email: email })
          .then(handleSuccess)
          .then(modal.close)
          ['catch'](messenger.handleError);
      }

      function handleSuccess(res) {
        snackbar.success('A link to reset your password has been sent to your email.');
      }

    }
  }

})(angular);

// assets/javascripts/main/session/login_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$state',
    '$modal',
    'user',
    'snackbar',
    'messenger',
    'VALIDATION_EVENT',
    loginController
  ];

  angular.module('nl.Session')
    .controller('loginController', definitions);

  function loginController($scope, $state, $modal, user, snackbar, messenger, VALIDATION_EVENT) {
    $scope.credentials = {};
    $scope.submit = submit;
    $scope.forgotPassword = forgotPassword;

    function submit(form, fields) {
      $scope.$broadcast(VALIDATION_EVENT.VALIDATE);

      if (form.$valid) {
        user.login(fields)
          ['catch'](messenger.handleError);
      }
    }

    function forgotPassword() {
      var
        modalConfig;

      modalConfig = {
        templateUrl: 'forgot_password_modal.html',
        backdrop: true,
        keyboard: true,
        controller: 'forgotPasswordModalController'
      };

      $modal.open(modalConfig);
    }
  }

})(angular);

// assets/javascripts/main/session/login_modal_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$state',
    'user',
    'snackbar',
    'messenger',
    'VALIDATION_EVENT',
    '$modalInstance',
    loginModalController
  ];

  angular.module('nl.Session')
    .controller('loginModalController', definitions);

  function loginModalController($scope, $state, user, snackbar, messenger, VALIDATION_EVENT, modal) {
    $scope.credentials = {};
    $scope.submit = submit;
    $scope.dismiss = dismiss;

    function submit(loginForm, email, password) {
      $scope.$broadcast(VALIDATION_EVENT.VALIDATE);

      if (loginForm.$valid) {
        user.login($scope.credentials)
          .then(modal.close)
          ['catch'](messenger.handleError);
      }
    }

    function dismiss() {
      user.logout();
      modal.dismiss();
      $state.go('main.public.login');
    }
  }

})(angular);

// assets/javascripts/main/session/logout_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$state',
    'user',
    'snackbar',
    logoutController
  ];

  angular.module('nl.Session')
    .controller('logoutController', definitions);

  function logoutController($scope, $state, user, snackbar) {
    user.logout();

    snackbar.success('Successfully logged out.');

    $state.go('main.public.login', null, { location: 'replace' });
  }

})(angular);

// assets/javascripts/main/signup/signup_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [
    'ui.router',
    'ch.Snackbar',
    'ch.Validator',
    'nl.User'
  ];

  angular.module('nl.Signup', dependencies);

})(angular);

// assets/javascripts/main/signup/signup_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$state',
    'VALIDATION_EVENT',
    'snackbar',
    'messenger',
    'user',
    signupController
  ];

  angular.module('nl.Signup')
    .controller('signupController', definitions);

  function signupController($scope, $state, VALIDATION_EVENT, snackbar, messenger, user) {
    $scope.credentials = {};
    $scope.submit = submit;

    function submit(form, fields) {
      $scope.$broadcast(VALIDATION_EVENT.VALIDATE);

      if (form.$valid) {
        snackbar.loading('Processing. Please wait.');

        user.create(fields)
        .then(handleSuccess)
        ['catch'](messenger.handleError);
      }

      function handleSuccess() {
        snackbar.success('An email has been sent to your address for verification. Please verify before logging in.');
      }
    }
  }

})(angular);

// assets/javascripts/main/feeds/feeds_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [
    'nl.Vendor.LoDash',
    'ch.Snackbar',
    'ui.sortable',
    'ui.bootstrap',
    'nl.Messenger',
    'nl.User'
  ];

  angular.module('nl.Feeds', dependencies);

})(angular);

// assets/javascripts/main/feeds/add_feeds_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '_',
    'feeds',
    'userFeeds',
    'snackbar',
    'messenger',
    addFeedsController
  ];

  angular.module('nl.Feeds')
    .controller('addFeedsController', definitions);

  function addFeedsController($scope, _, feeds, userFeeds, snackbar, messenger) {
    feeds.init()
      .then(function(feeds) {
        $scope.finishedLoading = true;
        $scope.feeds = feeds.model;
      });

    $scope.addFeed = addFeed;
    $scope.addUserFeed = addUserFeed;
    $scope.removeUserFeed = removeUserFeed;
    $scope.toggleRemove = toggleRemoveIcon;

    function addFeed(feedUrl) {
      snackbar.loading('Processing. Please wait.');

      feeds.create(feedUrl)
        .then(addAsUserFeed)
        .then(handleSuccess)['catch'](messenger.handleError);

      function addAsUserFeed(feed) {
        return userFeeds.create(feed)
          .then(function() {
            feed.added = true;
            feed.subscribers += 1;
          });
      }

      function handleSuccess() {
        $scope.feedUrl = '';
        snackbar.success('Your feed was successfully added.');
      }
    }

    function addUserFeed(feed) {
      userFeeds.create(feed)
        .then(handleSuccess)['catch'](messenger.handleError);

      function handleSuccess() {
        feed.added = true;
        feed.subscribers += 1;
        snackbar.success('The feed was successfully added.');
      }
    }

    function removeUserFeed(feed) {
      userFeeds.destroy(feed)
        .then(handleSuccess)['catch'](messenger.handleError);

      function handleSuccess() {
        feed.added = false;
        feed.subscribers -= 1;
        snackbar.success('The feed was successfully removed.');
      }
    }

    function toggleRemoveIcon($e, enter) {
      if (enter) {
        angular.element($e.target).addClass('fa-times').removeClass('fa-check');
      } else {
        angular.element($e.target).addClass('fa-check').removeClass('fa-times');
      }
    }

  }

})(angular);

// assets/javascripts/main/feeds/edit_feed_modal_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$http',
    'snackbar',
    '$modalInstance',
    '_',
    'userFeeds',
    'messenger',
    editFeedModalController
  ];

  angular.module('nl.Feeds')
    .controller('editFeedModalController', definitions);

  function editFeedModalController($scope, $http, snackbar, modal, _, userFeeds, messenger) {
    $scope.save = save;
    $scope.dismiss = modal.dismiss;


    function save(remove, entries) {
      snackbar.loading('Processing. Please wait.');

      if (remove) {
        return userFeeds.destroy($scope.feedToEdit.feed)
          .then(removeFeed)
          .then(clearFeedToEdit)
          .then(modal.close)
          .then(handleSuccess('The feed was successfully removed.'))
          ['catch'](messenger.handleError);
      } else {
        return userFeeds.updateEntries($scope.feedToEdit)
          .then(setFeedEntries)
          .then(clearFeedToEdit)
          .then(modal.close)
          .then(handleSuccess('The feed was successfully updated.'))
          ['catch'](messenger.handleError);
      }

      function removeFeed() {
        var
          col = $scope.feedToEdit.userFeed.col;

        _.remove($scope.userFeeds.feeds[col], $scope.feedToEdit);
      }

      function setFeedEntries(res) {
        $scope.feedToEdit.feed.entries = res.data.feed.entries;
      }

      function clearFeedToEdit() {
        $scope.feedToEdit = undefined;
      }

      function handleSuccess(message) {
        return function() {
          snackbar.success(message);
        };
      }
    }

  }

})(angular);

// assets/javascripts/main/feeds/feeds.js
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
      self = {};

    $rootScope.$on(USER_EVENT.LOGOUT, clear);

    self.init = init;
    self.create = create;
    self.model = [];

    return self;

    function init() {
      clear();

      return $http.get('/api/feeds', {
          headers: {
            token: user.token()
          }
        })
        .then(setFeedsFromResponse);

      function setFeedsFromResponse(res) {
        var
          feedsRes = res.data,
          userFeedItems = user.model.feeds;

        if (feedsRes && angular.isObject(feedsRes)) {
          feedsRes = angular.isArray(feedsRes) ? feedsRes : [feedsRes];
          _.each(feedsRes, mapFeed);
        }
        return self;

        function mapFeed(feedItem) {
          feedItem.added = !!_.find(userFeedItems, {
            feed: feedItem._id
          });
          self.model.push(feedItem);
        }
      }
    }

    function create(url) {
      return $http.post('/api/feeds', {
          url: url
        }, {
          headers: {
            token: user.token()
          }
        })
        .then(addFeed);

      function addFeed(res) {
        var
          feed = res.data;

        if (feed && angular.isObject(feed)) {
          self.model.push(feed);
        }
        return feed;
      }
    }

    function clear() {
      self.model = [];
    }

  }

})(angular);

// assets/javascripts/main/feeds/feeds_controller.js
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
    'messenger',
    feedsController
  ];

  angular.module('nl.Feeds')
    .controller('feedsController', definitions);

  function feedsController($scope, $modal, _, user, userFeeds, snackbar, messenger) {
    userFeeds.init()
      .then(function(userFeeds) {
        $scope.finishedLoading = true;
      });

    $scope.userFeeds = userFeeds.model;
    $scope.layout = user.model.layout;

    $scope.sortableConfig = {
      itemMoved: handleItemMoved,
      orderChanged: handleOrderChanged,
      containment: '#feed-container'
    };

    $scope.expand = expandEntry;
    $scope.markAsVisited = visitEntry;
    $scope.editFeed = editFeed;
    $scope.refreshFeeds = refreshUserFeeds;
    $scope.updateLayout = updateLayout;

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

      for (i = item.userFeed.row, len = $scope.userFeeds.feeds[destCol].length; i < len; i++) {
        $scope.userFeeds.feeds[destCol][i].userFeed.row += 1;
      }

      for (i = srcRow - 1, len = $scope.userFeeds.feeds[srcCol].length; i < len; i++) {
        $scope.userFeeds.feeds[srcCol][i].userFeed.row -= 1;
      }

      updateUserFeeds();
    }

    function handleOrderChanged(e) {
      var
        destCol = e.dest.sortableScope.modelValue.col,
        userFeedsToUpdate;

      for (var i = 0, len = $scope.userFeeds.feeds[destCol].length; i < len; i++) {
        $scope.userFeeds.feeds[destCol][i].userFeed.row = i + 1;
      }

      updateUserFeeds();
    }

    function updateUserFeeds() {
      var
        userFeedsToupdate;

      userFeedsToUpdate = _.map($scope.userFeeds.feeds[0].concat($scope.userFeeds.feeds[1]).concat($scope.userFeeds.feeds[2]), mapUserFeed);

      userFeeds.updatePositions(userFeedsToUpdate);

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
      visitEntry(entry);
      entry.expand = !entry.expand;
    }

    function visitEntry(entry) {
      if (!entry.visited) {
        userFeeds.visitEntry(entry);
        entry.visited = true;
      }
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

    function refreshUserFeeds() {
      snackbar.loading('Updating. Please wait.');
      $scope.refreshing = true;

      userFeeds.refresh()
        .then(updateTimestamp)
        .then(handleSuccess('Feeds are up to date.'))
        ['catch'](messenger.handleError)
        ['finally'](finishRefresh);

      function updateTimestamp() {
        $scope.userFeeds.lastUpdated = new Date();
      }

      function finishRefresh() {
        $scope.refreshing = false;
      }
    }

    function updateLayout(newLayout) {
      if ($scope.layout !== newLayout) {
        user.update({ layout: newLayout });
        $scope.layout = newLayout;
      }
    }

    function handleSuccess(message) {
      return function() {
        snackbar.success(message);
      };
    }

  }

})(angular);

// assets/javascripts/main/feeds/user_feeds.js
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
      clear();

      return $http.get('/api/user_feeds', {
          headers: {
            token: user.token()
          }
        })
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
      return $http.post('/api/user_feeds', {
          feedId: feed._id
        }, {
          headers: {
            token: user.token()
          }
        })
        .then(setUserFromResponse);
    }

    function updatePositions(feeds) {
      return $http.put('/api/user_feeds/positions', {
        feeds: feeds
      }, {
        headers: {
          token: user.token()
        }
      });
    }

    function updateEntries(userFeedItem) {
      return $http.put('/api/user_feeds/entries', {
        feedId: userFeedItem.feed._id,
        entries: userFeedItem.userFeed.entries
      }, {
        headers: {
          token: user.token()
        }
      });
    }

    function refresh() {
      return $http.get('/api/user_feeds/refresh', {
          headers: {
            token: user.token()
          }
        })
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
      return $http.delete('/api/user_feeds/' + feed._id, {
          headers: {
            token: user.token()
          }
        })
        .then(setUserFromResponse);
    }

    function visitEntry(entry) {
      return $http.post('/api/user_feed_entries/', {
        entryId: entry._id
      }, {
        headers: {
          token: user.token()
        }
      });
    }

    function findFeed(feedId) {
      var
        foundFeed;

      _.each(self.model.feeds, searchColumns);

      return foundFeed;

      function searchColumns(colFeeds, col) {
        foundFeed = _.find(colFeeds, searchColumn);

        if (foundFeed) {
          return false;
        }

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

// assets/javascripts/main/entries/entries_module.js
(function(angular) {

	var
		dependencies;

	dependencies = [
		'nl.Vendor.LoDash'
	];

	angular.module('nl.Entries', dependencies);

})(angular);

// assets/javascripts/main/entries/entries.js
(function(angular) {

	var
		definitions;

	definitions = [
		'$http',
		'_',
		entriesFactory
	];

	angular.module('nl.Entries')
		.factory('entries', definitions);

	function entriesFactory($http, _) {
		var
			self = {},
			column = 0;

		self.init = init;
		self.get = get;
		self.model = [
			[],
			[],
			[]
		];

		return self;

		function init() {
			clear();

			return $http.get('/api/entries')
				.then(setEntriesFromResponse);
		}

		function get(offset) {
			return $http.get('/api/entries?offset=' + offset)
				.then(setEntriesFromResponse);
		}

		function setEntriesFromResponse(res) {
			if (res && res.data) {
				_.each(res.data, breakIntoColumns);
			}

			return self;

			function breakIntoColumns(entry) {
				self.model[column].push(entry);

				if ((column += 1) === 3) {
					column = 0;
				}
			}
		}

		function clear() {
			self.model = [
				[],
				[],
				[]
			];
		}
	}

})(angular);

// assets/javascripts/main/account/account_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [
    'ch.Validator',
    'ch.Snackbar',
    'nl.Messenger',
    'nl.User'
  ];

  angular.module('nl.Account', dependencies);

})(angular);

// assets/javascripts/main/account/account_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    'user',
    'VALIDATION_EVENT',
    'snackbar',
    'messenger',
    accountController
  ];

  angular.module('nl.Account')
    .controller('accountController', definitions);

  function accountController($scope, user, VALIDATION_EVENT, snackbar, messenger) {
    $scope.user = user.model;
    $scope.credentials = {};
    $scope.submit = submit;

    function submit(form, fields) {
      $scope.$broadcast(VALIDATION_EVENT.VALIDATE);

      if (form.$valid) {
        snackbar.loading('Processing. Please wait.');

        user.update(fields)
          .then(handleSuccess)['catch'](messenger.handleError);
      }

      function handleSuccess() {
        snackbar.success('Password successfully updated.');
        $scope.changePassword = false;
        $scope.credentials = {};
        $scope.newPasswordConfirmation = '';
      }

    }
  }

})(angular);

// assets/javascripts/main/home/home_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [
    'nl.Entries',
    'nl.InfiniteScroll'
  ];

  angular.module('nl.Home', dependencies);

})(angular);

// assets/javascripts/main/home/home_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    'SCROLL_EVENT',
    'entries',
    homeController
  ];

  angular.module('nl.Home')
    .controller('homeController', definitions);

  function homeController($scope, SCROLL_EVENT, entries) {
    var
      multiplier = 1,
      offset = 25;

    entries.init()
      .then(function(entries) {
        $scope.entries = entries.model;
      });

    $scope.$on(SCROLL_EVENT.MET, handleScrollEvent);
    $scope.$on('$stateChangeStart', removeScrollListener);

    function handleScrollEvent() {
      entries.get(offset * multiplier++)
        .then(registerScrollListener);
    }

    function registerScrollListener() {
      $scope.$broadcast(SCROLL_EVENT.REGISTER);
    }

    function removeScrollListener() {
      $scope.$broadcast(SCROLL_EVENT.REMOVE);
    }
  }

})(angular);

// assets/javascripts/main/states/states_module.js
(function(angular) {
  var
    dependencies;

  dependencies = [
    'ui.router',
    'satellizer'
  ];

  angular.module('nl.States', dependencies);

})(angular);

// assets/javascripts/main/states/states_config.js
(function(angular) {
  var
    definition,
    runDefinition;

  definition = [
    '$stateProvider',
    '$urlRouterProvider',
    statesConfig
  ];

  runDefinition = [
    '$rootScope',
    '$state',
    '$auth',
    unAuthenticatedRedirect
  ];

  angular.module('nl.States')
    .config(definition)
    .run(runDefinition);

  function statesConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .rule(authenticatedRedirect)
      .otherwise('/home');

    $stateProvider
      .state('main', {
        abstract: true,
        templateUrl: 'main.html',
        controller: 'mainController',
        resolve: {
          userInit: ['user',
            function initUser(user) {
              return user.init();
            }
          ]
        }
      })

    .state('main.public', {
      abstract: true,
      template: '<div ui-view></div>',
      data: {
        auth: false
      }
    })
      .state('main.public.home', {
        url: '/home',
        templateUrl: 'home.html',
        controller: 'homeController'
      })
      .state('main.public.login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'loginController'
      })
      .state('main.public.signup', {
        url: '/signup',
        templateUrl: 'signup.html',
        controller: 'signupController'
      })
      .state('main.public.forgotPassword', {
        url: '/forgot_password/:resetToken',
        templateUrl: 'forgot_password.html',
        controller: 'forgotPasswordController'
      })
      .state('main.public.emailVerification', {
        url: '/email_verification/:verificationToken',
        controller: 'emailVerificationController'
      })

    .state('main.private', {
      abstract: true,
      template: '<div ui-view></div>',
      data: {
        auth: true
      }
    })
      .state('main.private.logout', {
        url: '/logout',
        controller: 'logoutController'
      })
      .state('main.private.feeds', {
        url: '/feeds',
        templateUrl: 'feeds.html',
        controller: 'feedsController'
      })
      .state('main.private.addFeeds', {
        url: '/add',
        templateUrl: 'add_feeds.html',
        controller: 'addFeedsController'
      })
      .state('main.private.account', {
        url: '/account',
        templateUrl: 'account.html',
        controller: 'accountController'
      });
  }

  function unAuthenticatedRedirect($rootScope, $state, $auth) {
    $rootScope.$on('$stateChangeStart', authorizeState);

    function authorizeState(e, toState) {
      if (toState.data.auth && !$auth.isAuthenticated()) {
        e.preventDefault();
        $state.go('main.public.login', null, {
          location: 'replace'
        });
      }
    }
  }

  function authenticatedRedirect($injector, $location) {
    var
      path = $location.path(),
      $auth = $injector.get('$auth'),
      login = '/login',
      signup = '/signup';

    if ($auth.isAuthenticated() && redirectPath()) {
      $location.path('/home').replace();
    }

    function redirectPath() {
      return path === login || path === signup;
    }
  }

})(angular);

// assets/javascripts/main/templates_module.js
angular.module('nl.Templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('account.html',
    "<div class=\"row\"><div class=\"col-sm-6\"><h2 class=\"page-heading\"><small>{{user.email}}</small></h2></div><div class=\"col-sm-6\"><p class=\"text-right\"><small>Member since: {{user.createdAt | date:'longDate'}}</small></p></div></div><div class=\"divider\"></div><div class=\"row\"><div class=\"col-sm-12 account-section\"><div class=\"col-md-2 hidden-sm hidden-xs\"><h5><strong>Password</strong></h5></div><div class=\"col-sm-2\"><button class=\"btn btn-link\" ng-click=\"changePassword = !changePassword\">Change password</button></div><div class=\"col-md-8 col-sm-10\"><form class=\"form-inline\" role=\"form\" name=\"passwordForm\" novalidate ng-show=\"changePassword\" ng-submit=\"submit(passwordForm, credentials)\"><div class=\"form-group\"><label class=\"sr-only\" for=\"password\">Current password</label><input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Current password\" ng-model=\"credentials.password\" ch-validator=\"required password\"></div><div class=\"form-group\"><label class=\"sr-only\" for=\"newPassword\">New password</label><input type=\"password\" class=\"form-control\" id=\"newPassword\" placeholder=\"New password\" ng-model=\"credentials.newPassword\" ch-validator=\"required password\"></div><div class=\"form-group\"><label class=\"sr-only\" for=\"newPasswordConfirmation\">Password confirmation</label><input type=\"password\" class=\"form-control\" id=\"newPasswordConfirmation\" placeholder=\"Password confirmation\" ng-model=\"newPasswordConfirmation\" ch-validator=\"required password confirm:credentials.newPassword\"></div><button type=\"submit\" class=\"btn btn-default\">Change</button></form></div></div></div>"
  );


  $templateCache.put('_feed_item.html',
    "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h5 class=\"panel-title\"><a ng-href=\"{{userFeed.feed.link}}\" target=\"_blank\">{{userFeed.feed.title}}</a></h5><div class=\"feed-icons\"><span class=\"handle feed-icon\" sortable-item-handle><span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span></span> <i class=\"fa fa-cog feed-icon\" ng-click=\"editFeed(userFeed)\"></i></div></div><div class=\"panel-body\"><ol class=\"list-unstyled feed-entries\"><li ng-repeat=\"entry in userFeed.feed.entries\" class=\"feed-entry\"><div class=\"entry-read-icons\"><i class=\"fa fa-play expand\" ng-class=\"{'fa-rotate-90':entry.expand}\" ng-click=\"expand(entry)\"></i> <i class=\"fa fa-eye-slash read\" ng-click=\"markAsVisited(entry)\"></i></div><div class=\"entry-snapshot\"><a ng-href=\"{{entry.link}}\" class=\"entry-title\" ng-class=\"{visited: entry.visited}\" target=\"_blank\" ng-click=\"markAsVisited(entry)\">{{entry.title}}</a><p class=\"entry-meta\"><small><span ng-if=\"entry.pubdate\">{{entry.pubdate | date:\"EEE MMM d, y 'at' h:mm a\"}}</span> <span ng-if=\"entry.author\">| {{entry.author}}</span> <span class=\"entry-feed-title\">| via <a ng-href=\"{{userFeed.feed.link}}\">{{userFeed.feed.title}}</a></span></small></p><p class=\"entry-meta\"><small class=\"entry-categories-separator\" ng-if=\"entry.categories.length\">|</small> <small class=\"entry-category\" ng-repeat=\"category in entry.categories | limitTo:3\">#{{category}}</small></p></div><p class=\"entry-summary clearfix\" ng-show=\"entry.expand\" ng-bind-html=\"entry.description || entry.summary\"></p></li></ol></div></div>"
  );


  $templateCache.put('add_feeds.html',
    "<div class=\"row\"><div class=\"col-sm-6 hidden-xs\"><h2 class=\"page-heading\"><small>Find & Add Feeds</small></h2></div><div class=\"col-sm-6 col-xs-12\" id=\"new-form-feeds-container\"><div class=\"new-forms\" ng-class=\"{toggle:toggle}\"><i class=\"fa fa-link new-form-toggle\" ng-click=\"toggle = !toggle\"></i><form class=\"form-horizontal\" name=\"searchForm\" role=\"form\" novalidate><div class=\"form-group\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" placeholder=\"Search feeds\" ng-model=\"search\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"submit\"><i class=\"fa fa-search\"></i></button></span></div><!-- /input-group --></div></form><i class=\"fa fa-search new-form-toggle\" ng-click=\"toggle = !toggle\"></i><form class=\"form-horizontal\" name=\"addForm\" role=\"form\" novalidate ng-submit=\"addFeed(feedUrl)\"><div class=\"form-group\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" placeholder=\"Add a feed URL\" ng-model=\"feedUrl\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"submit\"><i class=\"fa fa-link\"></i></button></span></div><!-- /input-group --></div></form></div></div></div><div class=\"divider\"></div><div class=\"row\" ng-if=\"!finishedLoading\"><div ng-include=\"'_loading.html'\"></div></div><div class=\"row\"><div class=\"col-sm-12\"><ul class=\"list-unstyled new-feeds\"><li class=\"new-feed col-sm-3\" ng-repeat=\"feed in feeds | orderBy:'title' | filter:search\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><h5 class=\"panel-title\"><a ng-href=\"{{feed.link}}\" target=\"_blank\">{{feed.title}}</a></h5><span ng-switch=\"feed.added\"><i class=\"fa fa-check pull-right\" ng-switch-when=\"true\" ng-click=\"removeUserFeed(feed)\" ng-mouseenter=\"toggleRemove($event, true)\" ng-mouseleave=\"toggleRemove($event, false)\"></i> <i class=\"fa fa-plus pull-right\" ng-switch-when=\"false\" ng-click=\"addUserFeed(feed)\"></i></span></div><div class=\"panel-body\"><ul class=\"list-unstyled\"><li><small ng-pluralize count=\"feed.subscribers\" when=\"{'one': '{} subscriber', 'other': '{} subscribers'}\"></small></li><li><small>Last updated {{feed.updatedAt | date:\"EEE MMM d, y 'at' h:mm a\"}}</small></li><li><a ng-href=\"{{feed.xmlurl}}\" target=\"_blank\"><small>{{feed.xmlurl}}</small></a></li></ul></div></div></li></ul></div></div>"
  );


  $templateCache.put('edit_feed_modal.html',
    "<div class=\"modal-header\"><h4 class=\"modal-title\">{{feedToEdit.feed.title}}</h4></div><div class=\"modal-body\"><div class=\"row\"><div class=\"col-sm-3\"><h5><strong>Entries to Display</strong></h5></div><div class=\"col-sm-9\"><div class=\"form-group\"><label for=\"display-entries\" class=\"sr-only\">Entries to display</label><select id=\"display-entries\" class=\"form-control\" ng-model=\"feedToEdit.userFeed.entries\"><option value=\"1\">1</option><option value=\"2\">2</option><option value=\"3\">3</option><option value=\"4\">4</option><option value=\"5\">5</option><option value=\"6\">6</option><option value=\"7\">7</option><option value=\"8\">8</option><option value=\"9\">9</option><option value=\"10\">10</option><option value=\"15\">15</option><option value=\"20\">20</option><option value=\"25\">25</option></select></div></div></div><div class=\"row\"><div class=\"col-sm-3\"><h5><strong>Remove Feed</strong></h5></div><div class=\"col-sm-9\"><div class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"removeUserFeed\"> Remove feed</label><p class=\"text-danger\" ng-show=\"removeUserFeed\"><small>This feed will be removed from you feeds page. If you change your mind, you can add it back later.</small></p></div></div></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"dismiss()\">Close</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"save(removeUserFeed)\">Save changes</button></div>"
  );


  $templateCache.put('feeds.html',
    "<div id=\"feed-container\"><div class=\"row\"><div class=\"col-sm-4\"><i class=\"fa fa-th feed-layout-option\" ng-class=\"{active:layout === 'th'}\" ng-click=\"updateLayout('th')\"></i> <i class=\"fa fa-th-large feed-layout-option\" ng-class=\"{active:layout === 'thLarge'}\" ng-click=\"updateLayout('thLarge')\"></i> <i class=\"fa fa-list feed-layout-option\" ng-class=\"{active:layout === 'list'}\" ng-click=\"updateLayout('list')\"></i></div><div class=\"col-sm-4 col-sm-offset-4\"><button type=\"button\" id=\"refresh\" class=\"btn btn-default pull-right\" ng-click=\"refreshFeeds()\" ng-disabled=\"refreshing\"><i class=\"fa fa-refresh\"></i></button> <small class=\"refresh-text pull-right\">Last updated: {{ userFeeds.lastUpdated | date:\"EEE MMM d, y 'at' h:mm a\" }}</small></div></div><div class=\"row\" ng-if=\"!finishedLoading\"><div ng-include=\"'_loading.html'\"></div></div><div class=\"row\"><div class=\"col-sm-4 user-feed-column layout-{{layout}}\"><ul class=\"user-feeds list-unstyled\" data-sortable=\"sortableConfig\" ng-model=\"userFeeds.feeds[0]\"><li ng-repeat=\"userFeed in userFeeds.feeds[0]\" ng-include=\"'_feed_item.html'\" sortable-item class=\"{{layout}}-view\"></li></ul></div><div class=\"col-sm-4 user-feed-column layout-{{layout}}\"><ul class=\"user-feeds list-unstyled\" data-sortable=\"sortableConfig\" ng-model=\"userFeeds.feeds[1]\"><li ng-repeat=\"userFeed in userFeeds.feeds[1]\" ng-include=\"'_feed_item.html'\" sortable-item class=\"{{layout}}-view\"></li></ul></div><div class=\"col-sm-4 user-feed-column layout-{{layout}}\"><ul class=\"user-feeds list-unstyled\" data-sortable=\"sortableConfig\" ng-model=\"userFeeds.feeds[2]\"><li ng-repeat=\"userFeed in userFeeds.feeds[2]\" ng-include=\"'_feed_item.html'\" sortable-item class=\"{{layout}}-view\"></li></ul></div></div></div>"
  );


  $templateCache.put('_entry_item.html',
    "<div class=\"panel panel-default\"><div class=\"panel-body\"><div class=\"entry-snapshot\"><a ng-href=\"{{entry.link}}\" class=\"entry-title\" target=\"_blank\">{{entry.title}}</a><p class=\"entry-meta\"><small>{{entry.pubdate | date:\"EEE MMM d, y 'at' h:mm a\"}} <span ng-if=\"entry.author\">| {{entry.author}}</span></small></p><p class=\"entry-meta\"><small class=\"entry-categories\" ng-repeat=\"category in entry.categories | limitTo:3\">#{{category}}</small></p></div><p class=\"entry-summary\" ng-bind-html=\"entry.summary || entry.description\"></p></div></div>"
  );


  $templateCache.put('home.html',
    "<div class=\"row\"><div class=\"col-sm-4 home-entries-column\"><ul class=\"home-entries list-unstyled\"><li ng-repeat=\"entry in entries[0]\" ng-include=\"'_entry_item.html'\"></li><div ng-include=\"'_loading.html'\" nl-infinite-scroll></div></ul></div><div class=\"col-sm-4 home-entries-column\"><ul class=\"home-entries list-unstyled\"><li ng-repeat=\"entry in entries[1]\" ng-include=\"'_entry_item.html'\"></li></ul><div ng-include=\"'_loading.html'\" nl-infinite-scroll></div></div><div class=\"col-sm-4 home-entries-column\"><ul class=\"home-entries list-unstyled\"><li ng-repeat=\"entry in entries[2]\" ng-include=\"'_entry_item.html'\"></li></ul><div ng-include=\"'_loading.html'\" nl-infinite-scroll></div></div></div>"
  );


  $templateCache.put('main.html',
    "<div ng-include=\"'_header.html'\"></div><div class=\"container\" ui-view></div>"
  );


  $templateCache.put('_header.html',
    "<nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"container\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#nav-links\"><span class=\"sr-only\">Toggle navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <a class=\"navbar-brand\" href=\"/\">Grizzly Feed <img src=\"/images/grizzly_feed_logo_bear.png\"></a></div><div class=\"collapse navbar-collapse\" id=\"nav-links\"><ul class=\"nav navbar-nav navbar-right\" ng-switch=\"isAuthenticated()\"><li ng-switch-when=\"true\" nl-active-nav=\"main.private.feeds\"><a ui-sref=\"main.private.feeds\"><i class=\"fa fa-newspaper-o fa-lg\"></i></a></li><li ng-switch-when=\"true\" nl-active-nav=\"main.private.addFeeds\"><a ui-sref=\"main.private.addFeeds\"><i class=\"fa fa-search-plus fa-lg\"></i></a></li><li ng-switch-when=\"true\" nl-active-nav=\"main.private.account\"><a ui-sref=\"main.private.account\"><i class=\"fa fa-user fa-lg\"></i></a></li><li ng-switch-when=\"true\"><a ui-sref=\"main.private.logout\"><i class=\"fa fa-sign-out fa-lg\"></i></a></li><li ng-switch-when=\"true\"><p class=\"navbar-text\">{{user.model.email}}</p></li><li ng-switch-when=\"false\" nl-active-nav=\"main.public.signup\"><a ui-sref=\"main.public.signup\">Sign up</a></li><li ng-switch-when=\"false\" nl-active-nav=\"main.public.login\"><a ui-sref=\"main.public.login\">Login</a></li></ul></div></div></nav>"
  );


  $templateCache.put('_loading.html',
    "<div class=\"loading-spinner\"><div class=\"loading-spinner-container loading-spinner-container1\"><div class=\"loading-spinner-circle1\"></div><div class=\"loading-spinner-circle2\"></div><div class=\"loading-spinner-circle3\"></div><div class=\"loading-spinner-circle4\"></div></div><div class=\"loading-spinner-container loading-spinner-container2\"><div class=\"loading-spinner-circle1\"></div><div class=\"loading-spinner-circle2\"></div><div class=\"loading-spinner-circle3\"></div><div class=\"loading-spinner-circle4\"></div></div></div>"
  );


  $templateCache.put('forgot_password.html',
    "<div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><h2><small>Enter a new password</small></h2></div></div><div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><div class=\"panel panel-default\"><div class=\"panel-body\"><form name=\"forgotPasswordForm\" class=\"form-horizontal\" ng-submit=\"submit(forgotPasswordForm, password)\" novalidate><div class=\"form-group\"><label for=\"password\" class=\"control-label sr-only\">Password</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"password\" ch-validator=\"required password\"></div></div><div class=\"form-group\"><label for=\"passwordConfirmation\" class=\"control-label sr-only\">Password Confirmation</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"passwordConfirmation\" name=\"passwordConfirmation\" class=\"form-control\" placeholder=\"Re-enter Password\" ng-model=\"passwordConfirmation\" ch-validator=\"required password confirm:password\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-primary\">Reset</button> <a class=\"btn btn-link\" ui-sref=\"main.public.login\">Log in</a></div></div></form></div></div></div></div>"
  );


  $templateCache.put('forgot_password_modal.html',
    "<div class=\"modal-header\"><h4 class=\"modal-title\">Please enter your email address</h4></div><div class=\"modal-body\"><form name=\"forgotPasswordForm\" class=\"form-horizontal\" ng-submit=\"submit(email)\" novalidate><div class=\"form-group\"><label for=\"email\" class=\"control-label sr-only\">Email Address</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" placeholder=\"Email address\" ng-model=\"email\" ch-validator=\"email\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-primary\">Reset</button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"dismiss()\">Cancel</button></div></div></form></div>"
  );


  $templateCache.put('login.html',
    "<div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><h2><small>Login</small></h2></div></div><div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><div class=\"panel panel-default\"><div class=\"panel-body\"><form name=\"loginForm\" class=\"form-horizontal\" ng-submit=\"submit(loginForm, credentials)\" novalidate><div class=\"form-group\"><label for=\"email\" class=\"control-label sr-only\">Email Address</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" placeholder=\"Email address\" ng-model=\"credentials.email\" ch-validator=\"required email\"></div></div><div class=\"form-group\"><label for=\"password\" class=\"control-label sr-only\">Password</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"credentials.password\" ch-validator=\"required password\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-primary\">Login</button> <button type=\"button\" class=\"btn btn-link\" ng-click=\"forgotPassword()\">Forgot password</button></div></div></form></div></div></div></div>"
  );


  $templateCache.put('login_modal.html',
    "<div class=\"modal-header\"><h4 class=\"modal-title\">Please login again to verify your identity</h4></div><div class=\"modal-body\"><form name=\"loginForm\" class=\"form-horizontal\" ng-submit=\"submit(loginForm, email, password)\" novalidate><div class=\"form-group\"><label for=\"email\" class=\"control-label sr-only\">Email Address</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" placeholder=\"Email address\" ng-model=\"credentials.email\" ch-validator=\"required email\"></div></div><div class=\"form-group\"><label for=\"password\" class=\"control-label sr-only\">Password</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"credentials.password\" ch-validator=\"required password\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-primary\">Login</button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"dismiss()\">Cancel</button></div></div></form></div>"
  );


  $templateCache.put('signup.html',
    "<div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><h2><small>Sign up</small></h2></div></div><div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><div class=\"panel panel-default\"><div class=\"panel-body\"><form name=\"signupForm\" class=\"form-horizontal\" ng-submit=\"submit(signupForm, credentials)\" novalidate><div class=\"form-group\"><label for=\"email\" class=\"control-label sr-only\">Email Address</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" placeholder=\"Email address\" ng-model=\"credentials.email\" ch-validator=\"required email\"></div></div><div class=\"form-group\"><label for=\"password\" class=\"control-label sr-only\">Password</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"credentials.password\" ch-validator=\"required password\"></div></div><div class=\"form-group\"><label for=\"passwordConfirmation\" class=\"control-label sr-only\">Password Confirmation</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"passwordConfirmation\" name=\"passwordConfirmation\" class=\"form-control\" placeholder=\"Re-enter Password\" ng-model=\"passwordConfirmation\" ch-validator=\"required password confirm:credentials.password\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-primary\">Signup</button> <a class=\"btn btn-link\" ui-sref=\"main.public.login\">Log in</a></div></div></form></div></div></div></div>"
  );

}]);


// assets/javascripts/main/main_module.js
(function(angular) {

  var
    dependencies,
    authConfigDefinition,
    snackbarConfigDefinition;

  dependencies = [
    'ngTouch',
    'ngSanitize',
    'satellizer',
    'ch.Snackbar',
    'nl.Templates',
    'nl.States',
    'nl.Home',
    'nl.Session',
    'nl.Signup',
    'nl.Feeds',
    'nl.Account',
    'nl.ActiveNav'
  ];

  authConfigDefinition = [
    '$authProvider',
    configAuth
  ];

  snackbarConfigDefinition = [
    'snackbarProvider',
    configSnackbar
  ];

  angular.module('nl.Main', dependencies)
    .config(authConfigDefinition)
    .config(snackbarConfigDefinition);

  function configAuth($authProvider) {
    $authProvider.signupUrl = '/api/users';
    $authProvider.signupRedirect = '/signup';
    $authProvider.loginOnSignup = false;

    $authProvider.loginUrl = '/api/sessions';
    $authProvider.loginRedirect = '/feeds';

    $authProvider.logoutRedirect = null;

    $authProvider.tokenPrefix = 'nl';
    $authProvider.tokenName = 'token';
  }

  function configSnackbar(snackbarProvider) {
    snackbarProvider.setColors({
      success: '#259b24',
      error: '#e51c23',
      notice: 'rgba(0, 0, 0, .87)',
      loading: '#4e6cef'
    });
  }

})(angular);

// assets/javascripts/main/main_controller.js
(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    '$auth',
    'user',
    mainController
  ];

  angular.module('nl.Main')
    .controller('mainController', definitions);

  function mainController($scope, $auth, user) {
    $scope.isAuthenticated = $auth.isAuthenticated;
    $scope.user = user;
  }

})(angular);