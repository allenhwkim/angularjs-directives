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
