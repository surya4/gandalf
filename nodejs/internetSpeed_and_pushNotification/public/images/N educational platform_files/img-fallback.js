noonDirectives
  .directive('actualSrc', function () {
    return {
      link: function postLink (scope, element, attrs) {
        attrs.$observe('actualSrc', function (newVal) {
          if (newVal !== undefined) {
            element.attr('src', attrs.src);
            var img = new Image();
            img.src = attrs.actualSrc;
            angular.element(img).bind('load', function () {
              element.attr('src', attrs.actualSrc);
            });
          }
        });
      }
    }
  })
  .directive('defaultSrc', function () {
    return {
      link: function (scope, element, attrs) {
        attrs.$observe('profilePic', function (newVal) {
          if (newVal !== undefined) {
            var role=attrs.defaultSrc;
            var gender=attrs.gender;
            var profilePic=attrs.profilePic;
          }
          if(role=='teacher'){
            if(gender=='female'){
              element.attr('src', '/www/img/f-teacher.gif');
            } else {
              element.attr('src', '/www/img/m-teacher.gif');
            }
          } else {
            element.attr('src', '/www/img/random-student.gif');
            if(gender=='female'){
              element.attr('src', '/www/img/f-student.gif');
            } else if(gender=='male'){
              element.attr('src', '/www/img/m-student.gif');
            }
          }
          if(profilePic){
            var img = new Image();
            img.src = attrs.profilePic;
            angular.element(img).bind('load', function () {
              element.attr('src', attrs.profilePic);
            });
          }
        });

      }
    }
  });
