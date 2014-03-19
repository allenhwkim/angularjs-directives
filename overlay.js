/**
 * Usage :
 *    <div id="div1" style="width:400px; height: 150px; background:#ddd">
 *      block 1
 *    </div>
 *    <div overlay id="overlay1" target="#div1" style="background:red;opacity:0.5">
 *      This is overlay
 *    </div>
 *   <button ng-click="overlay1.show()">Show Overlay</button>
 *   <button ng-click="overlay1.hide()">Hide Overlay</button>
 */
app.directive('overlay', function() {
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
