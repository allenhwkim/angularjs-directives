/**
 * usage:
 *  <textarea pagedown-editor ng-repeat="str in arr track by $index" ng-model="arr[$index]"></textarea>
 *  <textarea pagedown-editor>no ng-model assigned</textarea>
 *  <textarea pagedown-editor ng-model="foo">foo</textarea>
 */ 
 
    app.directive('pagedownEditor', function($timeout) {
      if (!Markdown.Converter) {
        throw "pagedown directive requires the following files" +
          " 1. //cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Converter.min.js" +
          " 2. //cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Editor.min.js "+ 
          " 3. //cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Sanitizer.min.js" 
          " 4. //pagedown.googlecode.com/hg/demo/browser/demo.css" 
      }
      var num=0;
      return {
        priority: 1001, //higher than ng-repeat, 1000
        link: function(scope, el, attrs) {
          var uniqNum = scope.$index || num++;
          var wmdPanel = document.createElement('div');
          wmdPanel.className = "wmd-panel";
          var wmdButtonBar = document.createElement('div');
          wmdButtonBar.id = 'wmd-button-bar-'+uniqNum;
          wmdPanel.appendChild(wmdButtonBar);
          el.wrap(wmdPanel); // el is ng-repeat comment, it takes time
          
          var converter = Markdown.getSanitizingConverter();
          var editor = new Markdown.Editor(converter, "-"+uniqNum);
          $timeout(function() {
            wmdPanel.querySelector('textarea').id = 'wmd-input-'+uniqNum;
            wmdPanel.querySelector('textarea').className += ' wmd-input';
            wmdPanel.insertAdjacentHTML('afterend', '<div id="wmd-preview-'+uniqNum+'" '
              +'class="pagedown-preview wmd-panel wmd-preview">');
            editor.run()
          }, 50);
        }
      };
    });
