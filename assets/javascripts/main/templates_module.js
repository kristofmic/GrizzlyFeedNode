angular.module('nl.Templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('account.html',
    "<div class=\"row\"><div class=\"col-sm-6\"><h2 class=\"page-heading\"><small>{{user.email}}</small></h2></div><div class=\"col-sm-6\"><p class=\"text-right\"><small>Member since: {{user.createdAt | date:'longDate'}}</small></p></div></div><div class=\"divider\"></div><div class=\"row\"><div class=\"col-sm-12\"><div class=\"col-md-2 hidden-sm hidden-xs\"><h5>Password</h5></div><div class=\"col-sm-2\"><button class=\"btn btn-link\" ng-click=\"changePassword = !changePassword\">Change password</button></div><div class=\"col-md-8 col-sm-10\"><form class=\"form-inline\" role=\"form\" name=\"passwordForm\" novalidate ng-show=\"changePassword\" ng-submit=\"submit(passwordForm, credentials)\"><div class=\"form-group\"><label class=\"sr-only\" for=\"password\">Current password</label><input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Current password\" ng-model=\"credentials.password\" ch-validator=\"required password\"></div><div class=\"form-group\"><label class=\"sr-only\" for=\"newPassword\">New password</label><input type=\"password\" class=\"form-control\" id=\"newPassword\" placeholder=\"New password\" ng-model=\"credentials.newPassword\" ch-validator=\"required password\"></div><div class=\"form-group\"><label class=\"sr-only\" for=\"newPasswordConfirmation\">Password confirmation</label><input type=\"password\" class=\"form-control\" id=\"newPasswordConfirmation\" placeholder=\"Password confirmation\" ng-model=\"newPasswordConfirmation\" ch-validator=\"required password confirm:credentials.newPassword\"></div><button type=\"submit\" class=\"btn btn-default\">Change</button></form></div></div></div>"
  );


  $templateCache.put('_feed_item.html',
    "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a ng-href=\"{{userFeed.feed.link}}\" target=\"_blank\">{{userFeed.feed.title}}</a></h4><div class=\"feed-icons\"><span class=\"handle feed-icon\" sortable-item-handle><span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span> <span class=\"handlebar\"></span></span> <i class=\"fa fa-cog feed-icon\" ng-click=\"editFeed(userFeed)\"></i></div></div><div class=\"panel-body\"><ol class=\"list-unstyled feed-entries\"><li ng-repeat=\"entry in userFeed.feed.entries\" class=\"feed-entry\"><div class=\"entry-read-icons\"><i class=\"fa fa-play expand\" ng-class=\"{'fa-rotate-90':entry.expand}\" ng-click=\"expand(entry)\"></i> <i class=\"fa fa-eye-slash read\" ng-click=\"markAsVisited(entry)\"></i></div><div class=\"entry-snapshot\"><a ng-href=\"{{entry.link}}\" class=\"entry-title\" ng-class=\"{visited: entry.visited}\" target=\"_blank\" ng-click=\"markAsVisited(entry)\">{{entry.title}}</a><p class=\"entry-meta\"><small>{{entry.pubdate | date:\"EEE MMM d, y 'at' h:mm a\"}} <span ng-if=\"entry.author\">| {{entry.author}}</span> <span class=\"entry-feed-title\">| via <a ng-href=\"{{userFeed.feed.link}}\">{{userFeed.feed.title}}</a></span></small></p><p class=\"entry-meta\"><small class=\"entry-categories-separator\" ng-if=\"entry.categories.length\">|</small> <small class=\"entry-category\" ng-repeat=\"category in entry.categories | limitTo:3\">#{{category}}</small></p></div><p class=\"entry-summary clearfix\" ng-show=\"entry.expand\" ng-bind-html=\"entry.description || entry.summary\"></p></li></ol></div></div>"
  );


  $templateCache.put('add_feeds.html',
    "<div class=\"row\"><div class=\"col-sm-6 hidden-xs\"><h2 class=\"page-heading\"><small>Find & Add Feeds</small></h2></div><div class=\"col-sm-6 col-xs-12\" id=\"new-form-feeds-container\"><div class=\"new-forms\" ng-class=\"{toggle:toggle}\"><i class=\"fa fa-link new-form-toggle\" ng-click=\"toggle = !toggle\"></i><form class=\"form-horizontal\" name=\"searchForm\" role=\"form\" novalidate><div class=\"form-group\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" placeholder=\"Search feeds\" ng-model=\"search\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"submit\"><i class=\"fa fa-search\"></i></button></span></div><!-- /input-group --></div></form><i class=\"fa fa-search new-form-toggle\" ng-click=\"toggle = !toggle\"></i><form class=\"form-horizontal\" name=\"addForm\" role=\"form\" novalidate ng-submit=\"addFeed(feedUrl)\"><div class=\"form-group\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" placeholder=\"Add a feed URL\" ng-model=\"feedUrl\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"submit\"><i class=\"fa fa-link\"></i></button></span></div><!-- /input-group --></div></form></div></div></div><div class=\"divider\"></div><div class=\"row\" ng-if=\"!finishedLoading\"><div ng-include=\"'_loading.html'\"></div></div><div class=\"row\"><div class=\"col-sm-12\"><ul class=\"list-unstyled new-feeds\"><li class=\"new-feed col-sm-3\" ng-repeat=\"feed in feeds | orderBy:'title' | filter:search\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><h5 class=\"panel-title\"><a ng-href=\"{{feed.link}}\" target=\"_blank\">{{feed.title}}</a></h5><span ng-switch=\"feed.added\"><i class=\"fa fa-check-square pull-right\" ng-switch-when=\"true\" ng-click=\"removeUserFeed(feed)\"></i> <i class=\"fa fa-plus-square pull-right\" ng-switch-when=\"false\" ng-click=\"addUserFeed(feed)\"></i></span></div><div class=\"panel-body\"><ul class=\"list-unstyled\"><li><!-- TODO: Figure out the # of subscribers --><small>0 subscribers</small></li><li><small>Last updated {{feed.date | date:\"EEE MMM d, y 'at' h:mm a\"}}</small></li><li><a class=\"btn btn-link\" ng-href=\"{{feed.feed_url}}\" target=\"_blank\"><small>{{feed.xmlurl}}</small></a></li></ul></div></div></li></ul></div></div>"
  );


  $templateCache.put('edit_feed_modal.html',
    "<div class=\"modal-header\"><h4 class=\"modal-title\">{{feedToEdit.feed.title}}</h4></div><div class=\"modal-body\"><div class=\"row\"><div class=\"col-sm-3\"><h5><strong>Entries to Display</strong></h5></div><div class=\"col-sm-9\"><div class=\"form-group\"><label for=\"display-entries\" class=\"sr-only\">Entries to display</label><select id=\"display-entries\" class=\"form-control\" ng-model=\"feedToEdit.userFeed.entries\"><option value=\"1\">1</option><option value=\"2\">2</option><option value=\"3\">3</option><option value=\"4\">4</option><option value=\"5\">5</option><option value=\"6\">6</option><option value=\"7\">7</option><option value=\"8\">8</option><option value=\"9\">9</option><option value=\"10\">10</option><option value=\"15\">15</option><option value=\"20\">20</option><option value=\"25\">25</option></select></div></div></div><div class=\"row\"><div class=\"col-sm-3\"><h5><strong>Remove Feed</strong></h5></div><div class=\"col-sm-9\"><div class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"removeUserFeed\"> Remove feed</label><p class=\"text-danger\" ng-show=\"removeUserFeed\"><small>This feed will be removed from you feeds page. If you change your mind, you can add it back later.</small></p></div></div></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"dismiss()\">Close</button> <button type=\"button\" class=\"btn btn-success\" ng-click=\"save(removeUserFeed)\">Save changes</button></div>"
  );


  $templateCache.put('feeds.html',
    "<div id=\"feed-container\"><div class=\"row\"><div class=\"col-sm-4\"><i class=\"fa fa-th feed-layout-option\" ng-class=\"{active:layout === 'th'}\" ng-click=\"updateLayout('th')\"></i> <i class=\"fa fa-th-large feed-layout-option\" ng-class=\"{active:layout === 'thLarge'}\" ng-click=\"updateLayout('thLarge')\"></i> <i class=\"fa fa-list feed-layout-option\" ng-class=\"{active:layout === 'list'}\" ng-click=\"updateLayout('list')\"></i></div><div class=\"col-sm-4 col-sm-offset-4\"><button type=\"button\" id=\"refresh\" class=\"btn btn-default pull-right\" ng-click=\"refreshFeeds()\" ng-disabled=\"refreshing\"><i class=\"fa fa-refresh\"></i></button> <small class=\"refresh-text pull-right\">Last updated: {{ userFeeds.lastUpdated | date:\"EEE MMM d, y 'at' h:mm a\" }}</small></div></div><div class=\"row\" ng-if=\"!finishedLoading\"><div ng-include=\"'_loading.html'\"></div></div><div class=\"row\"><div class=\"col-sm-4 user-feed-column layout-{{layout}}\"><ul class=\"user-feeds list-unstyled\" data-sortable=\"sortableConfig\" ng-model=\"userFeeds.feeds[0]\"><li ng-repeat=\"userFeed in userFeeds.feeds[0]\" ng-include=\"'_feed_item.html'\" sortable-item class=\"{{layout}}-view\"></li></ul></div><div class=\"col-sm-4 user-feed-column layout-{{layout}}\"><ul class=\"user-feeds list-unstyled\" data-sortable=\"sortableConfig\" ng-model=\"userFeeds.feeds[1]\"><li ng-repeat=\"userFeed in userFeeds.feeds[1]\" ng-include=\"'_feed_item.html'\" sortable-item class=\"{{layout}}-view\"></li></ul></div><div class=\"col-sm-4 user-feed-column layout-{{layout}}\"><ul class=\"user-feeds list-unstyled\" data-sortable=\"sortableConfig\" ng-model=\"userFeeds.feeds[2]\"><li ng-repeat=\"userFeed in userFeeds.feeds[2]\" ng-include=\"'_feed_item.html'\" sortable-item class=\"{{layout}}-view\"></li></ul></div></div></div>"
  );


  $templateCache.put('home.html',
    "<h1>I'm home!</h1>"
  );


  $templateCache.put('main.html',
    "<div ng-include=\"'_header.html'\"></div><div class=\"container\" ui-view></div>"
  );


  $templateCache.put('_header.html',
    "<nav class=\"navbar navbar-default navbar-static-top\" role=\"navigation\"><div class=\"container\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#nav-links\"><span class=\"sr-only\">Toggle navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <a class=\"navbar-brand\" href=\"/\">Grizzly Feed</a></div><div class=\"collapse navbar-collapse\" id=\"nav-links\"><ul class=\"nav navbar-nav navbar-right\" ng-switch=\"isAuthenticated()\"><li ng-switch-when=\"true\"><a ui-sref=\"main.private.feeds\"><i class=\"fa fa-newspaper-o fa-lg\"></i></a></li><li ng-switch-when=\"true\"><a ui-sref=\"main.private.addFeeds\"><i class=\"fa fa-search-plus fa-lg\"></i></a></li><li ng-switch-when=\"true\"><a ui-sref=\"main.private.account\"><i class=\"fa fa-user fa-lg\"></i></a></li><li ng-switch-when=\"true\"><a ui-sref=\"main.private.logout\"><i class=\"fa fa-sign-out fa-lg\"></i></a></li><li ng-switch-when=\"true\"><p class=\"navbar-text\">{{user.email}}</p></li><li ng-switch-when=\"false\"><a ui-sref=\"main.public.signup\">Signup</a></li><li ng-switch-when=\"false\"><a ui-sref=\"main.public.login\">Login</a></li></ul></div></div></nav>"
  );


  $templateCache.put('_loading.html',
    "<div class=\"loading-spinner\"><div class=\"loading-spinner-container loading-spinner-container1\"><div class=\"loading-spinner-circle1\"></div><div class=\"loading-spinner-circle2\"></div><div class=\"loading-spinner-circle3\"></div><div class=\"loading-spinner-circle4\"></div></div><div class=\"loading-spinner-container loading-spinner-container2\"><div class=\"loading-spinner-circle1\"></div><div class=\"loading-spinner-circle2\"></div><div class=\"loading-spinner-circle3\"></div><div class=\"loading-spinner-circle4\"></div></div><div class=\"loading-spinner-container loading-spinner-container3\"><div class=\"loading-spinner-circle1\"></div><div class=\"loading-spinner-circle2\"></div><div class=\"loading-spinner-circle3\"></div><div class=\"loading-spinner-circle4\"></div></div></div>"
  );


  $templateCache.put('forgot_password.html',
    "<div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><h2><small>Enter a new password</small></h2></div></div><div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><div class=\"panel panel-default\"><div class=\"panel-body\"><form name=\"forgotPasswordForm\" class=\"form-horizontal\" ng-submit=\"submit(forgotPasswordForm, password)\" novalidate><div class=\"form-group\"><label for=\"password\" class=\"control-label sr-only\">Password</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"password\" ch-validator=\"required password\"></div></div><div class=\"form-group\"><label for=\"passwordConfirmation\" class=\"control-label sr-only\">Password Confirmation</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"passwordConfirmation\" name=\"passwordConfirmation\" class=\"form-control\" placeholder=\"Re-enter Password\" ng-model=\"passwordConfirmation\" ch-validator=\"required password confirm:password\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-success\">Reset</button></div></div><div class=\"form-group\"><div class=\"col-sm-5 col-sm-offset-1\"><a class=\"btn btn-link\" ui-sref=\"main.public.login\">Log in</a></div></div></form></div></div></div></div>"
  );


  $templateCache.put('forgot_password_modal.html',
    "<div class=\"modal-header\"><h4 class=\"modal-title\">Please enter your email address</h4></div><div class=\"modal-body\"><form name=\"forgotPasswordForm\" class=\"form-horizontal\" ng-submit=\"submit(email)\" novalidate><div class=\"form-group\"><label for=\"email\" class=\"control-label sr-only\">Email Address</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" placeholder=\"Email address\" ng-model=\"email\" ch-validator=\"email\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-success\">Reset</button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"dismiss()\">Cancel</button></div></div></form></div>"
  );


  $templateCache.put('login.html',
    "<div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><h2><small>Login</small></h2></div></div><div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><div class=\"panel panel-default\"><div class=\"panel-body\"><form name=\"loginForm\" class=\"form-horizontal\" ng-submit=\"submit(loginForm, credentials)\" novalidate><div class=\"form-group\"><label for=\"email\" class=\"control-label sr-only\">Email Address</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" placeholder=\"Email address\" ng-model=\"credentials.email\" ch-validator=\"required email\"></div></div><div class=\"form-group\"><label for=\"password\" class=\"control-label sr-only\">Password</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"credentials.password\" ch-validator=\"required password\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-success\">Login</button></div></div><div class=\"form-group\"><div class=\"col-sm-5 col-sm-offset-1\"><button type=\"button\" class=\"btn btn-link\" ng-click=\"forgotPassword()\">Forgot password</button></div></div></form></div></div></div></div>"
  );


  $templateCache.put('login_modal.html',
    "<div class=\"modal-header\"><h4 class=\"modal-title\">Please login again to verify your identity</h4></div><div class=\"modal-body\"><form name=\"loginForm\" class=\"form-horizontal\" ng-submit=\"submit(loginForm, email, password)\" novalidate><div class=\"form-group\"><label for=\"email\" class=\"control-label sr-only\">Email Address</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" placeholder=\"Email address\" ng-model=\"credentials.email\" ch-validator=\"required email\"></div></div><div class=\"form-group\"><label for=\"password\" class=\"control-label sr-only\">Password</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"credentials.password\" ch-validator=\"required password\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-success\">Login</button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"dismiss()\">Cancel</button></div></div></form></div>"
  );


  $templateCache.put('signup.html',
    "<div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><h2><small>Sign up</small></h2></div></div><div class=\"row\"><div class=\"col-sm-8 col-sm-offset-2\"><div class=\"panel panel-default\"><div class=\"panel-body\"><form name=\"signupForm\" class=\"form-horizontal\" ng-submit=\"submit(signupForm, credentials)\" novalidate><div class=\"form-group\"><label for=\"email\" class=\"control-label sr-only\">Email Address</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"email\" id=\"email\" name=\"email\" class=\"form-control\" placeholder=\"Email address\" ng-model=\"credentials.email\" ch-validator=\"required email\"></div></div><div class=\"form-group\"><label for=\"password\" class=\"control-label sr-only\">Password</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"credentials.password\" ch-validator=\"required password\"></div></div><div class=\"form-group\"><label for=\"passwordConfirmation\" class=\"control-label sr-only\">Password Confirmation</label><div class=\"col-sm-10 col-sm-offset-1\"><input type=\"password\" id=\"passwordConfirmation\" name=\"passwordConfirmation\" class=\"form-control\" placeholder=\"Re-enter Password\" ng-model=\"passwordConfirmation\" ch-validator=\"required password confirm:credentials.password\"></div></div><div class=\"form-group\"><div class=\"col-sm-10 col-sm-offset-1\"><button type=\"submit\" class=\"btn btn-success\">Signup</button></div></div><div class=\"form-group\"><div class=\"col-sm-5 col-sm-offset-1\"><a class=\"btn btn-link\" ui-sref=\"main.public.login\">Log in</a></div></div></form></div></div></div></div>"
  );

}]);
