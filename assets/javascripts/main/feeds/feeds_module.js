(function(angular) {

  var
    dependencies;

  dependencies = [
    'nl.Vendor.LoDash',
    'ch.Snackbar',
    'ui.sortable',
    'nl.User'
  ];

  angular.module('nl.Feeds', dependencies);

})(angular);