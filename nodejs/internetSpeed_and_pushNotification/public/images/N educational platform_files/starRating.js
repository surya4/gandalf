/**
 * Created by Ammar Ajmal S on 28-01-2016.
 */
noonDirectives
  .directive('starRating', function () {
    return {
      restrict: 'EA',
      template: '<ul class="star-rating" ng-class="{readonly: readonly}">' +
      '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
      '    <i class="noon-icon-star-rounded"></i>' + // or &#9733
      '  </li>' +
      '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function (scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        if(!scope.ratingValue){
          scope.ratingValue=0;
        }

        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue,
              empty: i >= scope.ratingValue,
            });
          }
        };
        scope.toggle = function (index) {
          if (scope.readonly == undefined || scope.readonly === false) {
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function (oldValue, newValue) {
          updateStars();
        });
      }
    };
  });
