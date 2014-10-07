/**
 * Set the height of textarea automatically by the height of contents
 */
var NGD = NGD || angular.module('ngd',[]);
NGD.directive('ngdAutoHeight', function() {
  return {
    restrict: 'A',
    link: function($scope, elem) {
      setTimeout( function() { // Expand the textarea as soon as it is added to the DOM
        if ( elem.val() ) {
          var height = elem[0].scrollHeight;
          elem.css({height:height+'px'});
        }
      }, 0);
    }
  };
});

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

/**
 * use Enter Key pressed on element
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive('ngdEnter', ['$parse', '$rootScope', function ($parse, $rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      var fn = $parse(attrs.ngdEnter);
      element.on('keypress', function(event) {
        if (event.which === 13) {
          var callback = function() {
            fn(scope, {$event:event});
          };
          if ($rootScope.$$phase) {
            scope.$evalAsync(callback);
          } else {
            scope.$apply(callback);
          }
        }
      });
     }
  };
}]);

/**
 * Set top position under the given element
 */
var NGD = NGD || angular.module('ngd',[]);

NGD.directive('ngdFixedUnder', function($window) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var header = document.querySelector(attrs.ngdFixedUnder);
      if (header) {
        angular.element($window).bind('scroll', function() {
          var rect = header.getBoundingClientRect();
          if (parseFloat(rect.bottom)<0) {
            element.css({position:'fixed', top: 0});
          } else {
            element.css({position:'absolute', top: null});
          }
        });
      } else {
        throw "ngd-fixed-under, no element found by value";
      } // if
    } // link
  }; // return
});

/**
 * show unsaved changes warning on the form if changed and not submitted
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive('ngdFormUnsaved', function($window, $parse) {
  return {
    restrict: 'A',
    require: 'form', // we must require form to get access to formController
    link: function(scope, formElement, attrs, formController) {
      /** 
       * when form is submitted, set onSubmit flag, so that no warning to show up
       */
      formElement.bind('submit', function() {
        formController.onSubmit = true;
      });
      var prevHandler = $window.onbeforeunload;
      var onbeforeunloadFunc = function(event) {
        event.preventDefault();
        prevHandler && prevHandler(event);
        if (!formController.onSubmit && formController.$dirty) {
          return attrs.ngdFormUnsaved || "Are You Sure?";
        } 
      }
      $window.onbeforeunload = onbeforeunloadFunc;
    } // link
  };
});

/**
 * To perform action when image is dragged and dropped on and element
 * You can drop image from your file browser as a file or web browser as a url
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive("ngdImageDrop", ['$parse', function ($parse) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      var ngdImageDrop = $parse(attrs.ngdImageDrop); 

      element.bind("dragover", function (e) {
        e.preventDefault();
        element.addClass("dragover");
      });

      element.bind("dragleave", function(e) {
        e.preventDefault();
        angular.element(document.body).removeClass('dragover');
      });
      
      element.bind("drop", function (e) {
        e.preventDefault();
        element.removeClass('dragover');
        var files = [];
        for (var i=0; i<e.dataTransfer.files.length; i++) {
          if (e.dataTransfer.files[i].type.match("image")) {
            files.push(e.dataTransfer.files[i]);
          }
        }
        if (files.length > 0) {
          console.log('files', {files: files});
          scope.$emit("ngd-image-dropped", {files: (files.length ? files : [files])});
          scope.$apply(ngdImageDrop(scope));
        }

        var url = e.dataTransfer.getData('URL');
        if (url.match(/\.(png|gif|jpg)$/)) {
          console.log('url', {url: url});
          scope.$emit("ngd-image-dropped", {url:url});
          scope.$apply(ngdImageDrop(scope));
        }
      });
    }
  };
}]);


/**
 * To perform action when image is pasted to the document
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive("ngdImagePaste", function ($parse, $http) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      var ngdImagePaste = $parse(attrs.ngdImagePaste); 

      element.bind("paste", function (e) {
        var imageFiles = [];
        var items =  (event.clipboardData || event.originalEvent.clipboardData).items;
        console.log('items.length', items.length);
        for (var i=0; i<items.length; i++) {
        console.log('items[i]', items[i]);
          if (items[i].getAsFile().type.match("image")) {
            console.log('adding');
            imageFiles.push(items[i].getAsFile());
          }
        }
        if (imageFiles.length > 0) {
          console.log('emitting');
          scope.$emit('ngd-image-dropped', {files: imageFiles});
          scope.$apply(ngdImagePaste(scope));
        }
      }); // bind
    } // link
  }; // return
});


/**
 * To preview images by adding/removing image files from controller scope
 */
var NGD  = NGD || angular.module('ngd', []);
NGD.directive("ngdImagePreview", function() {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      scope.$on('ngd-image-dropped', function(event, options) {
        var getImage = function(src) {
          var width = attrs.ngdImagePreviewWidth;
          var height = attrs.ngdImagePreiewHeight;
          var image = new Image();
          image.src = src;
          width && (image.width = width);
          height && (image.height = height);
          return image;
        }
        var fileOnLoad = function(event) {
          var image = getImage(event.target.result);
          var imgEl = element[0].querySelector("img[src=\""+event.target.result+"\"]");
          if (!imgEl) {
            element[0].appendChild(image);
          }
        };
        if (options.files) {
          for (var i = 0; i< options.files.length; i++) {
            var file = options.files[i];
            var fileReader = new FileReader();
            fileReader.onload = fileOnLoad;
            fileReader.readAsDataURL(file);
          }
        } else if (options.url) {
          var imgEl = element[0].querySelector("img[src=\""+options.url+"\"]");
          if (!imgEl) {
            var image = getImage(options.url);
            element[0].appendChild(image);
          }
        }
      });
    } // link
  }; // return
});

/**
 * Provides a service to preview markdown inside an element
 *
 * Example
 *  <script src="http://cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Converter.js"></script>
 *  <textarea ng-model="markdown">
 *  Header
 *  ======
 *  *italic*
 *  </textarea>
 *  <a href="" ng-click="ngdMarkdown.preview('foo',markdown)">Preview</a>
 *  <div ngd-markdown="foo">
 *    Markdown preview goes here
 *  </div>
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive('ngdMarkdown', function() {
  if (!Markdown.Converter) {
    throw "no Markdown.Converter.js included. please add "+
      "script tag with \"http://cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Converter.js\"";
  }
  var converter = new Markdown.Converter();
  return {
    link: function(scope, element, attrs) {
      scope.markdowns = scope.markdowns || {};
      var markdownId = attrs.ngdMarkdown;
      scope.markdowns[markdownId] = element;
      scope.ngdMarkdown = {
        preview: function(elKey, txt) {
          var previewEl = scope.markdowns[elKey];
          if (previewEl) {
            var markdown = txt || '';
            var html = converter.makeHtml(markdown);
            angular.element(previewEl).html(html);
          } else {
            throw "no markdown element found by key, "+ elKey;
          }
        }
      };
    }
  };
});

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

var NGD =  NGD || angular.module("ngd", []);

NGD.directive('ngdPlnkrScope', function() {
  var urlToHtmlTag = function(url) {
    var linkTag   = '<link rel="stylesheet" href="' + url + '"/>';
    var scriptTag = '<script src="' + url +'"></'+'script>';
    return url.match(/\.css$/) ? linkTag : scriptTag;
  };

  return {
    controller: ['$scope', 
      function($scope) {
        this.html = null;
        this.js = null;
        this.css = null;
        this.libs = ["script.js", "style.css"];
        
        this.submitToPlnkr = function(postData) {
          var form = document.createElement('form');
          form.style.display = 'none';
          form.target = '_blank';
          form.method = 'post';
          form.action = 'http://plnkr.co/edit/?p=preview';
          for(var key in postData) {
            if (key) {
              var input = document.createElement('input');
              input.type = "hidden";
              input.name = key;
              input.value = postData[key];
              form.appendChild(input);
            }
          }
          form.submit();
          form.remove();
        };
      
        this.getPostData = function() {
          var contents = this.html;
          var js  = this.js||'';
          var css = this.css;
          var appName = this.moduleName;
          js = js.replace(/,[ '"]*plunkr['"]?/,'');
      
          var headTags = [];
          for (var i=0; i<this.libs.length; i++) {
            var url = this.libs[i];
            headTags.push(urlToHtmlTag(url));
          }
      
          var postData = {};
          postData.description = "AngularJS Google Maps Directive";
          postData.private = true;
          postData['tags[]'] = 'auglarjs';
          postData['files[script.js]'] = js;
          postData['files[style.css]'] = css;
          postData['files[index.html]'] = 
            '<!doctype html>\n' +
            '<html ng-app="' + appName + '">\n' +
            '  <head>\n' +
                 headTags.join('\n') + '\n' +
            '  </head>\n' +
            '  <body>\n' +
                 contents + '\n' +
            '  </body>\n' +
            '</html>\n';
      
          return postData;
        };
      } // function
    ] // controller : [ '$scope', 
  }; // return
});

NGD.directive('ngdPlnkrCode', function() {
  return {
    require: '^ngdPlnkrScope',
    compile: function(el, attrs) {
      return {
        pre: function(scope, element, attrs, controller) {
          var key = attrs.ngdPlnkrCode;
          var code = el.html();
          controller[key] = code;
        }
      };
    }
  };
});

NGD.directive('ngdPlnkrLib', function() {
  return {
    require: '^ngdPlnkrScope',
    compile: function(el, attrs) {
      return {
        pre: function(scope, element, attrs, controller) {
          var url = attrs.src || attrs.href;
          controller.libs.push(url);
        }
      };
    }
  };
});

NGD.directive('ngdPlnkrEdit', function() {
  return {
    require: '^ngdPlnkrScope',
    link: function(scope, element, attrs, controller) {
      element.on('click', function() {
        var postData = controller.getPostData();
        controller.submitToPlnkr(postData);
      });
    }
  }
});

NGD.directive('ngdPlnkrShow', ['$compile', '$timeout', function($compile, $timeout) {
  var defaultTemplate = 
    '<style>\n' +
    '  .tabs {position: relative; top: 1px}\n' +
    '  .tabs::after {display:table; content:""; clear:both}\n' +
    '  .tabs a {display:block; background:#ccc; float:left; padding: 5px; border:1px solid #333; border-bottom:none}\n' +
    '  .tabs a:not(:first-child) {border-left: none}\n' +
    '  .tabs a.hide {display:none}\n' +
    '  .tabs a.active {background: #fff;}\n' +
    '  .tab-contents {border: 1px solid #333}\n' +
    '  .tab-contents * {width: 100%; white-space: pre; font:0.9em Courier New; overflow:auto}\n' +
    '</style>\n' +
    '<div>\n' +
    '  <div class="tabs" ng-init="tab=1">\n' +
    '    <a ng-class="{active:tab==1,hide:!html}" ng-click="tab=1">HTML</a>\n' +
    '    <a ng-class="{active:tab==2,hide:!js}" ng-click="tab=2">Script</a>\n' +
    '    <a ng-class="{active:tab==3,hide:!css}" ng-click="tab=3">CSS</a>\n' +
    '    <a href="#" ngd-plnkr-edit>Edit</a>\n' +
    '  </div>\n' +
    '  <div class="tab-contents">\n' +
    '    <div ng-show="tab==1">{{html}}</div>\n' +
    '    <div ng-show="tab==2">{{js}}</div>\n' +
    '    <div ng-show="tab==3">{{css}}</div>\n' +
    '  </div>\n' +
    '</div>';
  return {
    scope: {}, //isolate the scope to have its own
    require: '^ngdPlnkrScope',
    link: function(scope, element, attrs, controller) {
      $timeout(function() { //give some time to read html code when it comes after this directive
        controller.moduleName = attrs.moduleName;
        scope.html= controller.html;
        scope.js = controller.js;
        scope.css= controller.css;
        if (!attrs.ngInclude) {  // if no template given from user, use default template
          element.html(defaultTemplate);
          $compile(element.contents())(scope);
        }
      },100);
    } 
  };
}]); 

/* global jQuery */
var NGD= NGD|| angular.module('ngd', []);
NGD.camelCase = NGD.camelCase || function(name) {
  var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  var MOZ_HACK_REGEXP = /^moz([A-Z])/;  
  return name.
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
};

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
              if ( navAttrVal.match(new RegExp("#"+elAttrVal))) {
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
