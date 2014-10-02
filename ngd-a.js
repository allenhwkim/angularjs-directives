/* ng-include changes the default behaviour of "a href='#XXX'". This is a work-around */
NGD.directive('ngdA', function() {
  return {
    link: function(scope, element) {
      element.attr('href', '#' + element.attr('href'));
    }
  };
});
