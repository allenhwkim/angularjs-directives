/**
 * To preview markdown text as html
 * Usage 
 *  <script src="http://cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Converter.js"></script>
 *  <div markdown-preview="markdown"></div>
 */
app.directive('markdownPreview', function () {
  var MarkdownPreview = function(s, e, a) {
    this.scope = s;
    this.element = e;
    this.attrs = a;
    var converter = new Markdown.Converter();
    this.run = function(markdown) {
      this.element.html(converter.makeHtml(markdown)||'');
    };
    return this;
  };
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.markdownPreview = new MarkdownPreview(scope, element, attrs);
    }
  };
});
