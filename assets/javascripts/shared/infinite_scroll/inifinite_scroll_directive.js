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