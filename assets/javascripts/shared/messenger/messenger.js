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