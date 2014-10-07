/**
 * To show customized modal window on full document or a specific element
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive('ngdOverlay', ['$compile', '$window', function($compile, $window) {
  return {
    link: function(scope, element, attrs) {
      var overlayId = attrs.ngdOverlay;
      var overlayStyle = attrs.ngdOverlayStyle;
      var overlayDfltCss = (attrs.ngdOverlayNocss === undefined);
      /**
       * change the element to have background and contents
       */
      var contentsEl = element[0].querySelector(".ngd-overlay-contents");
      if (!contentsEl) {
        var contentsElHtml = 
          "<div class='ngd-overlay-contents'>"+
            element.html()+
          "</div>"; 
        element.html(contentsElHtml);
        $compile(element.contents())(scope);
      }
      element.css({
        display: 'none',
        top: 0,
        left: 0,
        zIndex: 100,
        background: (overlayDfltCss && "rgba(0,0,0,0.5)")
      });

      /**
       * provide ngdOverlay functions to scope
       */
      scope.ngdOverlays = scope.ngdOverlays || {};
      scope.ngdOverlays[overlayId] = element;
      scope.ngdOverlay = {
        show : function(overlayId, targetEl) {
          var overlayEl = scope.ngdOverlays[overlayId];
          var supportPageOffset = window.pageXOffset !== undefined;
          var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
          var scrollX = supportPageOffset ? window.pageXOffset : 
                  isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
          var scrollY = supportPageOffset ? window.pageYOffset : 
                  isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

          if (typeof targetEl == "string") {
            targetEl = document.querySelector(targetEl);
          }
          if (targetEl) {
            /**
             * Move the overlay to the bottom of the document
             */
            document.querySelector('body').appendChild(element[0]);
            var targetBCR = targetEl.getBoundingClientRect();
            var targetElHeight;
            if (overlayEl) {
              if (targetEl.tagName == "BODY") {
                overlayEl.css({
                  position: 'fixed',
                  display: 'block',
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%"
                });
                targetElHeight = $window.innerHeight;
                targetElWidth = $window.innerWidth;
              } else {
                overlayEl.css({
                  position: 'absolute',
                  display: 'block',
                  top: scrollY + targetBCR.top + 'px',
                  left: scrollX +targetBCR.left +  'px',
                  width: targetBCR.width + "px",
                  height: targetBCR.height + "px",
                });
                targetElHeight = targetBCR.height;
                targetElWidth = targetBCR.width;
              }
              var contentsEl = overlayEl[0].querySelector(".ngd-overlay-contents");
              var contentsElCss = overlayDfltCss ? {
                background: "#fff",
                display: 'inline-block',
                position: 'absolute',
                textAlign: 'center',
                minWidth: '300px',
                minHeight: '100px'
              } : {};
              angular.element(contentsEl).css(contentsElCss); // <-- !important
              var contentsBCR = contentsEl.getBoundingClientRect();
              console.log('contentsBCR', contentsBCR);
              console.log('targetElWidth', targetElWidth);
              console.log('targetElHeight', targetElHeight);
              angular.extend(contentsElCss, {
                top : Math.max((targetElHeight - contentsBCR.height)/2, 0) + 'px',
                left: Math.max((targetElWidth - contentsBCR.width)/2, 0) + 'px'
              });
              angular.element(contentsEl).css(contentsElCss);
            }
          } else { 
            throw "invalid overlay target given, " + targetEl;
          }
        },  // show: {
        hide: function(overlayId) {
          var overlayEl = scope.ngdOverlays[overlayId];
          if (overlayEl) {
            overlayEl.css({
              position: null,
              display: 'none',
              width: null,
              height: null,
              zindex: null
            });
          }
        }  // hide : {
      }; // scope.ngdOverlay
    } // link
  }; // return
}]);
