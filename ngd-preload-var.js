var NGD = NGD || angular.module('ngd',[]);

/**
 * AJAX url is not a javascript but a JSON, 
 * Thus, we cannot use AJAX get url with <script> tag. It just perform empty action.
 *
 * Assign script contents to a scope variable
 *
 * Example: 
 *   <script src="foo.json" ngd-preload-var="myVar"></script>
 *
 * This will assign $scope.myVar with foo.json contents
 */
NGD.directive('ngdPreloadVar', function($http) {
  return {
    link: function(scope, elem, attrs) {
      if (elem[0].tagName !== "SCRIPT") {
        throw "Invalid tag. ngd-scope-var only applies to <script> tag";
      } else if (!attrs.ngdPreloadVar) {
        throw "Invalid value. ngd-scope-var requires a scope variable name";
      }
      if (attrs.src) {
        $http.get(attrs.src)
          .success(function(data) {
            scope[attrs.ngdPreloadVar] = data;
            scope.$apply();
          }).error( function() {
            console.error("Failed to read "+attrs.src);
          });
      }
    } // link
  };
});
