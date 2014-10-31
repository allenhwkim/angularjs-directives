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
 *  <a href="" ng-click="markdownPreview.convert(markdown)">Preview</a>
 *  <div ngd-markdown-preview>
 *    Markdown preview goes here
 *  </div>
 */
if(typeof Markdown === "undefined") {
  var scriptEl = document.createElement('script');
  scriptEl.src = "http://cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Converter.js";
  document.head.appendChild(scriptEl);
}
var NGD = NGD || angular.module('ngd', []);
NGD.directive('ngdMarkdownPreview', function() {
  return {
    link: function(scope, element, attrs) {
      var converter = new Markdown.Converter();
      element[0].convert = function(markdown) {
        markdown = markdown || element.html();
        var html = converter.makeHtml(markdown);
        element[0].innerHTML = html;
      }
      element[0].convert();

      scope.markdownPreviews = scope.markdownPreviews || {};
      if (attrs.id) {
        scope.markdownPreviews[attrs.id] = element[0];
      }
      scope.markdownPreview = element[0];
    }
  };
});
