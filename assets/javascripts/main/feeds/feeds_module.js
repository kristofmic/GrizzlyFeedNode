(function(angular) {

  var
    dependencies;

  dependencies = [
    'nl.Vendor.LoDash',
    'ch.Snackbar',
    'ui.sortable',
    'ui.bootstrap',
    'nl.Messenger',
    'nl.User'
  ];

  angular.module('nl.Feeds', dependencies);

})(angular);