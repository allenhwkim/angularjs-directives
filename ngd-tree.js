var NGD = NGD || angular.module('ngd',[]);
NGD.directive('ngdTree', function() {
  var defaultStyle = 
    'ul[ngd-tree] li { list-style: none; }\n'+
    'ul[ngd-tree] li:not(.on) ul {  display: none; }\n'+
    'ul[ngd-tree] li:before { content: " "; display: inline-block; width: 7%;}\n'+
    'ul[ngd-tree] li > * { display: inline-block; width: 90%; border-bottom: 1px solid #ddd}\n'+
    'ul[ngd-tree] li.has-ul:before { content: "▸"; }\n'+
    'ul[ngd-tree] li.has-ul.on:before { content: "▾"; }\n';
  return {
    link: function(scope, element, attrs) {
      /**
       * set the default style of ngd-tree if not defined
       */
      var styleTag = document.querySelector("head style#ngd-tree-css");
      if (!styleTag) {
        var head = document.querySelector("head");
        var styleEl =angular.element("<style type='text/css' id='ngd-tree-css'>"+defaultStyle+"</style>");
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
        var targetEl = angular.element(event.target);
        if (targetEl.prop('tagName') == "LI" && targetEl.hasClass("has-ul")) { 
          angular.element(this).toggleClass("on");
          event.stopPropagation();
        }
      });
    }
  };
});
