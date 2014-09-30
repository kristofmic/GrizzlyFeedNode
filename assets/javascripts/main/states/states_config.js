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