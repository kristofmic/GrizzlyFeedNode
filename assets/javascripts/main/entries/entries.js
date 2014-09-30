(function(angular) {

	var
		definitions;

	definitions = [
		'$http',
		'_',
		entriesFactory
	];

	angular.module('nl.Entries')
		.factory('entries', definitions);

	function entriesFactory($http, _) {
		var
			self = {},
			column = 0;

		self.init = init;
		self.model = [
			[],
			[],
			[]
		];

		return self;

		function init() {
			clear();

			return $http.get('/api/entries')
				.then(setEntriesFromResponse);

			function setEntriesFromResponse(res) {
				if (res && res.data) {
					_.each(res.data, breakIntoColumns);
				}

				return self;
			}
		}

		function breakIntoColumns(entry) {
			self.model[column].push(entry);

			if ((column += 1) === 3) {
				column = 0;
			}
		}

		function clear() {
			self.model = [
				[],
				[],
				[]
			];
		}
	}

})(angular);