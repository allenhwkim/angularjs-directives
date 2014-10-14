/* global jQuery */
var NGD= NGD|| angular.module('ngd', []);

NGD.isElementIn = function(innerEl, outerEl) {
  innerEl.length && (innerEl = innerEl[0]);
  outerEl.length && (outerEl = outerEl[0]);

  (typeof jQuery === "function" && innerEl instanceof jQuery) && (innerEl = innerEl[0]);
  (typeof jQuery === "function" && outerEl instanceof jQuery) && (outerEl = outerEl[0]);
  var innerRect = innerEl.getBoundingClientRect();
  if (outerEl.constructor.name == "Window") {
    return (
      innerRect.top >= 0 && innerRect.left >= 0 &&
      innerRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
      innerRect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  } else {
    var outerRect = outerEl.getBoundingClientRect();
    return (
      innerRect.top >= outerRect.top && 
      innerRect.left >= outerRect.left &&
      innerRect.bottom <= outerRect.bottom &&
      innerRect.right <= outerRect.right
    );
  }
};

NGD.service('NgdViewport', function() {
  return { 
    currentEl: null, 
    elements : {},
    selectorToSpy: null,
    attrToSpy: 'id',
    selectorToNav: null,
    attrToNav: 'href',
    classForNav: 'active'
  };
});

/**
 * collect all elements matching the selecor
 * then, set the element in the current viewport while scrolling
 */
NGD.directive('ngdViewport', ['$window', 'NgdViewport',
  function($window, NgdViewport) {
    return {
      link: function(scope, element, attrs) {
        if (NgdViewport.selectorToSpy) {
          throw "Only one ngd-viewport is allowed in a document";
        }
        NgdViewport.selectorToSpy = attrs.ngdViewport || "a[id]";
        var matches = NgdViewport.selectorToSpy.match(/\[(.*)\]/);
        NgdViewport.attrToSpy = matches[1];
        var elementsToSpy = element[0].querySelectorAll(NgdViewport.selectorToSpy);
        for (var i=0; i<elementsToSpy.length; i++) {
          var viewportEl = elementsToSpy[i];
          var viewportElAttr = viewportEl.getAttribute(NgdViewport.attrToSpy);
          if (viewportElAttr) {
            NgdViewport.elements[viewportElAttr] = viewportEl; 
          } else {
            throw "requires value in attribute, "+NgdViewport.selectorToSpy+" in ng-viewport";
          }
        }
        var outerEl = element.prop('tagName') == 'BODY' ? angular.element($window) : element;
        outerEl.bind('scroll', function() {
          for (var key in NgdViewport.elements) {
            var innerEl = NgdViewport.elements[key];
            if (NGD.isElementIn(innerEl, outerEl)) {
              NgdViewport.currentEl = innerEl;
              scope.$apply();
              break;
            }
          } 
        });
      } // link
    }; // return
  } // function 
]);

/**
 * set class name to matching element of NgdViewport.currentEl
 */
NGD.directive('ngdViewportNav', ['NgdViewport',
  function(NgdViewport) {
    return {
      link: function(scope, element, attrs) {
        if (NgdViewport.selectorToNav) {
          throw "Only one ngd-viewport-nav is allowed in a document";
        }
        scope.NgdViewport = NgdViewport;
        NgdViewport.selectorToNav = attrs.ngdViewportNav || "a[href]";
        var matches = NgdViewport.selectorToNav.match(/\[(.*)\]/);
        if (!matches) {
          throw "invalid selector for ngdViewportNav";
        }
        NgdViewport.attrToNav = matches[1];
        scope.$watch('NgdViewport.currentEl', function(currentEl) {
          if (currentEl) {
            var links = element[0].querySelectorAll(NgdViewport.selectorToNav);
            for (var i=0; i<links.length; i++) {
              var navEl = angular.element(links[i]);
              var navAttrVal = links[i].getAttribute(NgdViewport.attrToNav);
              var elAttrVal = currentEl.getAttribute(NgdViewport.attrToSpy);
              if ( navAttrVal.match(new RegExp("#"+elAttrVal+'$'))) {
                navEl.addClass(NgdViewport.classForNav);
              } else {
                navEl.removeClass(NgdViewport.classForNav);
              }
            }
          }
        });
      }
    };
  } //function 
]);

/**
 * Sets classname of selected navigation section
 */
NGD.directive('ngdViewportNavClass', ['NgdViewport',
  function(NgdViewport) {
    return {
      link: function(scope, element, attrs) {
        NgdViewport.classForNav = attrs.ngdViewportNavClass;
      }
    };
  }
]);

/**
 * Only used when watch-viewport-selector is dynamically updated, ie. ng-repeat
 */
NGD.directive('ngdViewportEl', ['NgdViewport', 
  function(NgdViewport) {
    return {
      link: function(scope, element, attrs) {
        var id = ((""+attrs.ngdViewportEl) === "")? attrs.id : attrs.ngdViewportEl;
        NgdViewport.elements[id] = element[0];
      }
    };
  }
]);
