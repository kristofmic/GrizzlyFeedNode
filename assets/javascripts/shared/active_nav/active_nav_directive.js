(function(angular) {

	var
		definitions;

	definitions = [
		activeNavDirective
	];

	angular.module('nl.ActiveNav')
		.directive('nlActiveNav', definitions);

	function activeNavDirective() {

		return {
			restrict: 'AC',
			link: link,
			scope: {
				targetState: '@nlActiveNav'
			}
		};

		function link(scope, elem, attrs) {
			scope.$on('$stateChangeSuccess', handleStateChange);

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