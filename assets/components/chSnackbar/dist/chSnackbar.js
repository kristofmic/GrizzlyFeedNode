
// assets/javascripts/templates_module.js
angular.module('ch.Snackbar.Templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('snackbar.html',
    "<div class=\"snackbar\" role=\"alert\" ng-style=\"styles.wrapper\" ng-class=\"position\"><button type=\"button\" class=\"dismiss\" ng-click=\"dismiss()\"><span aria-hidden=\"true\">&times;</span> <span class=\"sr-only\">Close</span></button><p class=\"snackbar-message\" ng-style=\"styles.message\">{{message}}</p></div>"
  );

}]);


// assets/javascripts/snackbar_module.js
(function(angular) {

  var
    dependencies;

  dependencies = [
    'ngAnimate',
    'ch.Snackbar.Templates'
  ];

  angular.module('ch.Snackbar', dependencies)
    .constant('POSITIONS', {
      TOP_LEFT: 'TOP_LEFT',
      BOTTOM_RIGHT: 'BOTTOM_RIGHT',
      TOP_RIGHT: 'TOP_RIGHT',
      BOTTOM_LEFT: 'BOTTOM_LEFT'
    });

})(angular);

// assets/javascripts/snackbar.js
(function(angular) {

  angular.module('ch.Snackbar')
    .provider('snackbar', snackbarProvider);

  function snackbarProvider() {
    var
      colors,
      definitions;

    colors = {
      success: '#5cb85c',
      error: '#d9534f',
      notice: '#333',
      loading: '#428bca'
    };

    definitions = [
      '$document',
      '$rootScope',
      '$templateCache',
      '$compile',
      '$timeout',
      '$animate',
      'POSITIONS',
      snackbarFactory
    ];

    return {
      setColors: setColors,
      $get: definitions
    };

    function setColors(config) {
      colors.success = config.success || colors.success;
      colors.error = config.error || colors.error;
      colors.notice = config.notice || colors.notice;
      colors.loading = config.loading || colors.loading;
    }

    function snackbarFactory($document, $rootScope, $templateCache, $compile, $timeout, $animate, POSITIONS) {
      var
        templateUrl = 'snackbar.html',
        template = $templateCache.get(templateUrl),
        scope = $rootScope.$new(),
        body = $document[0].body,
        POP_OUT_TIMEOUT = 4000,
        POSITION_CLASSES,
        stack = [];

      POSITION_CLASSES = {
        TOP_LEFT: 'snackbar-top-left',
        BOTTOM_RIGHT: 'snackbar-bottom-right',
        TOP_RIGHT: 'snackbar-top-right',
        BOTTOM_LEFT: 'snackbar-bottom-left'
      };

      scope.dismiss = clear;

      return {
        success: success,
        error: error,
        notice: notice,
        loading: loading,
        clear: clear
      };

      function success(message, pos) {
        var
          successConfig;

        successConfig = {
          'background-color': colors.success
        };

        notice(message, pos, successConfig);
      }

      function error(message, pos) {
        var
          errorConfig;

        errorConfig = {
          'background-color': colors.error
        };

        notice(message, pos, errorConfig);
      }

      function loading(message, pos) {
        var
          loadingConfig;

        loadingConfig = {
          'background-color': colors.loading,
          timeout: false
        };

        notice(message, pos, loadingConfig);
      }

      function notice(message, pos, config) {
        var
          snackbar,
          styles,
          position,
          timeout;

        config = config || {};

        if (message) {
          styles = getStyles();
          position = getPosition();
          timeout = getTimeout();

          scope.message = message;
          scope.styles = styles;
          scope.position = position;

          snackbar = $compile(template)(scope);

          clear();

          insertSnackbar();

          if (timeout) {
            snackbar.timeout = {
              remove: $timeout(removeSnackbar, timeout)
            };
          }
        }

        function insertSnackbar() {
          $animate.enter(snackbar, body, null);
          stack.push(snackbar);
        }

        function removeSnackbar() {
          $animate.leave(snackbar);
          stack.shift();
        }

        function getStyles() {
          return {
            wrapper: {
              'background-color': config['background-color'] || colors.notice,
            },
            message: {
              color: config.color || '#FFF'
            }
          };
        }

        function getPosition() {
          var
            position = POSITIONS[pos];

          return position ? POSITION_CLASSES[position] : POSITION_CLASSES.BOTTOM_LEFT;
        }

        function getTimeout() {
          return (config.timeout || config.timeout === false) ? config.timeout : POP_OUT_TIMEOUT;
        }
      }

      function clear() {
        if (stack.length) {
          for (var i = 0, len = stack.length; i < len; i++) {
            clearSnackbar(stack[i], i);
          }
        }

        function clearSnackbar(item, index) {
          if (item.timeout) $timeout.cancel(item.timeout.remove);
          item.remove();
          stack.splice(index, 1);
        }
      }
    }
  }



})(angular);