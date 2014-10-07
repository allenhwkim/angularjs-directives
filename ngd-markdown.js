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
