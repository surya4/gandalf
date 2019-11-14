/**
 * Created by ammar on 18/09/16.
 */
noonDirectives.
  directive('fileDropzone', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      scope: {
        file: '=',
        dropping: '=',
        fileDroppedInZone: '&fileDroppedInZone'
      },
      link: function (scope, element, attrs) {
        var checkSize,
          isTypeValid,
          processDragOverOrEnter,
          validMimeTypes;

        processDragOverOrEnter = function (event) {
          scope.$apply(function () {
            scope.dropping = true;
          });
          if (event != null) {
            event.preventDefault();
          }
          event.dataTransfer.effectAllowed = 'copy';
          return false;
        };

        validMimeTypes = attrs.fileDropzone;

        checkSize = function (size) {
          var _ref;
          if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
            return true;
          } else {
            alert("File must be smaller than " + attrs.maxFileSize + " MB");
            return false;
          }
        };

        isTypeValid = function (type) {
          if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
            return true;
          } else {
            alert("Invalid file type.  File must be one of following types " + validMimeTypes);
            return false;
          }
        };

        element.bind('dragover', processDragOverOrEnter);
        element.bind('dragenter', processDragOverOrEnter);
        element.bind('dragend', function () {
          scope.$apply(function () {
            scope.dropping = false;
          });
        });
        element.bind('dragexit', function () {
          scope.$apply(function () {
            scope.dropping = false;
          });
        });
        element.bind('dragleave', function () {
          scope.$apply(function () {
            scope.dropping = false;
          });
        });

        return element.bind('drop', function (event) {
          scope.$apply(function () {
            scope.dropping = false;
          });
          var file, reader;
          if (event != null) {
            event.preventDefault();
          }
          reader = new FileReader();
          reader.onload = function (evt) {
            if (checkSize(file.size) && isTypeValid(file.type)) {
              return scope.$apply(function () {
                scope.file.push({
                  data: evt.target.result,
                  name: file.name,
                  type: file.type,
                  size: Math.ceil(file.size / 1000),
                  file: file
                });
                scope.fileDroppedInZone();
                return true;
              });
            }
          };
          file = event.dataTransfer.files[0];
          reader.readAsDataURL(file);
        });
      }
    };
  }])


  .directive("fileread", [function () {
    return {
      scope: {
        fileread: "="
      },
      link: function (scope, element, attributes) {
        element.bind("change", function (changeEvent) {
          var reader = new FileReader();
          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              scope.fileread = loadEvent.target.result;
            });
          }
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
  }]);