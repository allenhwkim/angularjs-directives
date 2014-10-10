var NGD = NGD || angular.module('ngd', []);
NGD.directive('ngdScript', function() {
  return {
    restrict: 'AE',
    link: function(scope, element, attrs) {
      if (attr.type === 'text/javascript-lazy') {
        if( attrs.src !== undefined) {
          var s = document.createElement("script");
          s.type = "text/javascript";                
          s.src = src;
          document.head.appendChild(s);
        } else {
          var code = elem.text();
          var f = new Function(code);
          f();
        }
      } // if
    } // link
  };
});
