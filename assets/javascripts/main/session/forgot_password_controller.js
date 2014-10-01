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