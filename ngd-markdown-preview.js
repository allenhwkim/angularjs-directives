/**
 * Provides a service to preview markdown inside an element
 *
 * Example
 *  &lt;script src="http://cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Converter.js">&lt;/script>
 *  &lt;textarea ng-model="markdown">
 *  Header
 *  ======
 *  **bold**
 *  &lt;/textarea>
 *  &lt;button ng-click="Markdown.preview(markdown, '#preview')">Preview&lt;button>
 */
var NGD = NGD || angular.module('ngd', []);
NGD.service('Markdown', function() {
  if (!Markdown.Converter) {
    throw "no Markdown.Converter.js included. please add "+
      "script tag with \"http://cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Converter.js\"";
  }
  return {
    preview: function(txt, selector) {
      var converter = new Markdown.Converter();
      var previewEl = document.querySelector(selector);
      if (previewEl) {
        var markdown = txt || '';
        var html = converter.makeHtml(markdown);
        angular.element(previewEl).html(html);
      } else {
        throw "no element by selector, "+ selector;
      }

    }
  }
});
