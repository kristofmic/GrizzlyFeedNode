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