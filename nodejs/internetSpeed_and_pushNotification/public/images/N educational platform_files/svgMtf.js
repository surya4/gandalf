noonDirectives
  .directive('svgMtf', [ function () {
    return {
      restrict: 'E',
      replace: 'true',
      scope: { optionLeft: '=',selectedAnswer: '@',keyValue: '@' },
      template: '<svg class="svg-MTF" style=" width:{{widthBetweenCol}}px;right: 113px;top: 29px;">' +
      '<path ng-attr-d="M{{moveToX}},{{moveToY}} L{{lineToX}},{{lineToY}}" class="path-MTF" style="stroke:{{strokeColor}};"/>' +
      '</svg>',
      link: function (scope, element, attrs) {

        var diffBetweenBoxes = attrs.diffBetweenBoxes || 52;
        var midOfBox = attrs.midOfBox || 22;
        scope.widthBetweenCol = attrs.widthBetweenCol || 32;

        var strokeColor = ['#e53949','#00c188','#13a7e6','#13a7e6','#00c188','#e9dd9d','#00bff3','#626262'];

        scope.moveToX = 0
        scope.moveToY = 0;
        scope.lineToX = 0;
        scope.lineToY = 0;

        scope.strokeColor = strokeColor[scope.keyValue] || 'black';

        scope.$watch('selectedAnswer', function(value){
          if(scope.selectedAnswer){
            scope.moveToX = scope.widthBetweenCol;
            scope.moveToY = midOfBox+diffBetweenBoxes*scope.keyValue;
            for(var i in scope.optionLeft){
              if(scope.optionLeft[i].choice_id == scope.selectedAnswer){
                scope.lineToY = midOfBox+diffBetweenBoxes*i;
                break;
              }
            }
          } else {
            scope.moveToX = 0
            scope.moveToY = 0;
            scope.lineToX = 0;
            scope.lineToY = 0;
          }
        });

      }
    }
  }]);
