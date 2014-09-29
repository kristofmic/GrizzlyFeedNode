(function(angular) {

  var
    definitions;

  definitions = [
    '$scope',
    'user',
    'VALIDATION_EVENT',
    'snackbar',
    accountController
  ];

  angular.module('nl.Account')
    .controller('accountController', definitions);

  function accountController($scope, user, VALIDATION_EVENT, snackbar) {
    $scope.user = user.model;
    $scope.credentials = {};
    $scope.submit = submit;

    function submit(form, fields) {
      $scope.$broadcast(VALIDATION_EVENT.VALIDATE);

      if (form.$valid) {
        snackbar.loading('Processing. Please wait.');

        user.update(fields)
          .then(handleSuccess)
          ['catch'](handleError);
      }

      function handleSuccess() {
        snackbar.success('Password successfully updated.');
        $scope.changePassword = false;
        $scope.credentials = {};
        $scope.newPasswordConfirmation = '';
      }

      function handleError(err) {
        snackbar.error(angular.fromJson(err.data));
      }
    }
  }

})(angular);