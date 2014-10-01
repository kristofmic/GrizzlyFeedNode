(function(angular) {

  var
    dependencies;

  dependencies = [];

  angular.module('nl.InfiniteScroll', dependencies)
    .constant('SCROLL_EVENT', {
      MET: 'nl.InfiniteScroll:events:met',
      REGISTER: 'nl.InfiniteScroll:events:register',
      REMOVE: 'nl.InfiniteScroll:events:remove'
    });

})(angular);