var NGD = NGD || angular.module('ngd',[]);

/**
 * When your partial has <script src="partial-controller.js"></scipt> 
 * and your partial is loaded by ng-include, it will have an error
 *
 * When <script> is inside ng-include, it executes, but not before you need it.
 * Having `ngd-preload-controller` in script tag, it will load <script> part first
 *
 * How?
 *   * It extracts <script> tag into <head> if not already added
 *   * Then, wait for 0.5 seconds, 
 *   * then, return the response without the <script> tag
 *
 * Usage: 
 *   <script src="my-controller.js" ngd-preload-controller="MyCtrl"></script>
 */

NGD.config(function($httpProvider) {
  var httpDelayHandler = function($q, $timeout, $rootScope) {
    return function(promise) {
      return promise.then(function(response) {
        if (typeof response.data !== "string") { // it does not apply to JSON
          return response;
        }
        var matches = response.data.match(/<script(.*?)src=(.*?)ngd-preload-controller(.*?)><\/script>/g);
        if (!matches) {
          return response;
        }
        for (var i=0; i<matches.length; i++) {
          var scriptTag = matches[i];
          var url = scriptTag.match(/src=['"]([^'"]+)['"]/)[1];
var request = new XMLHttpRequest();
request.onreadystatechange = function () {
  var DONE = this.DONE || 4;
  if (this.readyState === DONE){
    console.log('NGD', NGD);
    console.log('xxxxx', this.responseText);
    eval(this.responseText);
$rootScope.$apply();
  }
};
request.open('GET', url, true);
request.send(null);  // No data needs to be sent along with the request.
          //if (!document.head.querySelector('script[src="'+url+'"]')) {
          //  var el = angular.element(scriptTag);
          //  document.head.appendChild(el[0]);
          //  response.data = response.data.replace(scriptTag, "");
          //}
        }
        // instead of timeout 500ms, we can poll `$controller(controllerName)` 
        return $timeout(function() {
          return response;
        }, 2000);
        
      }, function(response) {
        return $q.reject(response);
      });
    };
  };

  $httpProvider.responseInterceptors.push(httpDelayHandler);
});
