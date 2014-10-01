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