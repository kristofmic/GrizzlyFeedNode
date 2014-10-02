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