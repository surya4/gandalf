/**
 * Created by Ammar Ajmal S on 28-01-2016.
 */
noonDirectives
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });
          event.preventDefault();
        }
      });
    };
  })
  .directive('ngEscape', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 27) {// 27 = esc key
          scope.$apply(function () {
            scope.$eval(attrs.ngEscape);
          });
          event.preventDefault();
        }
      });
    };
  });

