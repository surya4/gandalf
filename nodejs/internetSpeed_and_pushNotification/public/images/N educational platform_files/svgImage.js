/**
 * Created by Ammar Ajmal S on 28-01-2016.
 */
noonDirectives
  .directive('svgImage', ['$http', function ($http) {
    return {
      restrict: 'E',
      link: function (scope, element) {
        var imgURL = element.attr('src');
        // if you want to use ng-include, then
        // instead of the above line write the bellow:
        // var imgURL = element.attr('ng-include');
        var request = $http.get(
          imgURL,
          {'Content-Type': 'application/xml'}
        );

        scope.manipulateImgNode = function (data, elem) {
          var $svg = angular.element(data)[4] || angular.element(data)[3] || angular.element(data)[2] || angular.element(data)[0];
          var imgClass = elem.attr('class');
          if (typeof(imgClass) !== 'undefined') {
            var classes = imgClass.split(' ');
            for (var i = 0; i < classes.length; ++i) {
              $svg.classList.add(classes[i]);
            }
          }
          $svg.removeAttribute('xmlns:a');
          return $svg;
        };

        request.success(function (data) {
          element.replaceWith(scope.manipulateImgNode(data, element));
        });
      }
    };
  }]);
