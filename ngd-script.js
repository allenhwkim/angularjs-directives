var NGD = NGD || angular.module('ngd',[]);
NGD.directive('ngdScript', function($http) {
  return {
    restrict: 'E',
    link: function(scope, elem, attrs) {
      if (attrs.src && attrs.scopeVar) {// read src, then assign to a variable
        $http.get(attrs.src)
          .success(function(data) {
            scope[attrs.scopeVar] = data;
          }).error( function() {
            console.error("Failed to read "+attrs.src);
          });
      } else {
        var scriptEl = document.createElement("script");
        scriptEl.type = "text/javascript";                
        if (attrs.src) {           // add <script> to <head>
          scriptEl = attrs.src;
        } else {
          var code = elem.text();
          scriptEl.text = code;
        }
        document.head.appendChild(scriptEl);
      }
      elem.remove();
    } // link
  };
});
