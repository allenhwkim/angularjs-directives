/**
 * builds the proper browser understanding code from human understanding code
  */
var NGD = NGD || angular.module('ngd',[]);
NGD.directive('ngdCode', function() {
  return {
    restrict: 'A',
    link: function($scope, elem) {
      var code = elem.html();
      code = code.replace(/^[\r\n]/,"");    //remove the first linefeed
      code = code.replace(/[\r\n]\s+$/,""); //remove the last linefeed 
      var indent = code.match(/^\s+/);      //get the first indentation
      if (indent) {                         //replace all leading indentation
        var re = new RegExp("^"+indent, "gm");
        code = code.replace(re, "");
      }
      elem.html(code);
    }
  };
});
