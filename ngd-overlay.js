/**
 * To show customized modal window on full document or a specific element
 * Usage :
 *    <div id="my-contents" style="width:400px; height: 150px; background:#ddd">
 *      block 1
 *    </div>
 *    <div ngd-overlay="my-overlay" ngd-overlay-target="#my-contents" style="background:red;opacity:0.5">
 *      This is overlay
 *    </div>
 *   <button ng-click="ngdOverlay.show('my-overlay')">Show Overlay</button>
 *   <button ng-click="ngdOverlay.hide('my-overlay')">Hide Overlay</button>
 */
app.directive('ngd-overlay', function() {
  return {
    link: function(scope, element, attrs) {
      element.css("display", "none");
      scope.overlay = {};
      scope[attrs.id].show = function(selector, options) {
        var targetEl = document.querySelector(selector || attrs.target);
        if (!targetEl) {
          throw "invalid overlay target selector";
        } else {
          var targetBCR = targetEl.getBoundingClientRect();
          element.css("position", "absolute");
          element.css("width", targetBCR.width + "px");
          element.css("height", targetBCR.height + "px");
          element.css("zIndex", 100);
          for (var key in (options||{})) {
            element.css(key, options[key]);
          }
          targetEl.parentElement.insertBefore(element[0], targetEl);
          element.css("display", "block");
        }
      };
      scope[attrs.id].hide = function() {
        element.css("display", "none");
      };
    }
  };
});
