/**
 * Created by Ammar Ajmal S on 28-01-2016.
 */
noonDirectives
  .directive('ngRightClick', ['$parse', function ($parse) {
    return function (scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function (event) {
        scope.$apply(function () {
          event.preventDefault();
          fn(scope, {$event: event});
        });
      });
    };
  }]);