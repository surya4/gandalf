/**
 * Created by Ammar Ajmal S on 28-01-2016.
 */
noonDirectives
  .directive('stringToNumber', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (value) {
          return '' + value;
        });
        ngModel.$formatters.push(function (value) {
          return parseFloat(value, 10);
        });
      }
    };
  });
