var NGD = NGD || angular.module('ngd',[]);
NGD.directive('ngdList', function() {
  var defaultStyle = 
    'ul[ngd-list] li { list-style: none; }\n'+
    'ul[ngd-list] li:not(.on) ul {  display: none; }\n'+
    'ul[ngd-list] li:before { content: " "; display: inline-block; width: 20px;}\n'+
    'ul[ngd-list] li.has-ul:before { content: "▸"; }\n'+
    'ul[ngd-list] li.has-ul.on:before { content: "▾"; }\n';
  return {
    link: function(scope, element, attrs) {
      /**
       * set the default style of ngd-list if not defined
       */
      var styleTag = document.querySelector("head style#ngd-list");
      if (!styleTag) {
        var head = document.querySelector("head");
        var styleEl =angular.element("<style type='text/css' id='ngd-list'>"+defaultStyle+"</style>");
        head.appendChild(styleEl[0]);
      }
      
      /**
       * find all <li> element that has <ul>, then set "has-ul" class
       */
      var liEls = element.find("li");
      for (var i=0; i<liEls.length; i++) {
        var li = liEls[i];
        if (li.querySelector("ul")) {
          angular.element(li).addClass("has-ul");
        }
      }
      
      /**
       * attach click event listener for on/off collapsing
       */
      element.find("li").on("click", function(event) {
        angular.element(this).toggleClass("on");
        event.stopPropagation();
      });
    }
  };
});
