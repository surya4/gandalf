/**
 * Created by ammar on 20/09/16.
 */
noonDirectives
  .directive('ngScroll', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var raw = element[0];
        element.bind('scroll', function () {
          if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
            scope.$apply(attrs.ngScroll);
          }
        });
      }
    };
  });