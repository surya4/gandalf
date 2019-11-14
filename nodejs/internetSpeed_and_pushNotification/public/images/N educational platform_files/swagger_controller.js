/**
 * Created by ammar on 09/09/16.
 */
noonEduController
  .controller('SwaggerCtrl', ['$scope', 'APICall', 'Config', '$localStorage', '$state', '$rootScope',
    function ($scope, APICall, Config, $localStorage, $state, $rootScope) {


      var vm = this;

      vm.urls = {
        user: Config.USER_SRV,
        translation: Config.TRANSLATION_SRV,
        questions: Config.QUESTION_SRV,
        folders: Config.FOLDER_SRV,
        files: Config.FILE_SRV,
        notifications: Config.NOTIFICATIONS_SRV,
        tutoring: Config.TUTORING_SRV,
        flashcard: Config.FLASHCARD_SRV,
        permission: Config.PERMISSION_SRV,
        package: Config.PACKAGE_SRV,
        school: Config.SCHOOL_SRV,
        elsatic: Config.ELASTIC_SRV,
        test: Config.TEST_SRV,
        billing: Config.BILLING_SRV,
        competition: Config.COMPETITION_SRV,
        mentor: Config.MENTOR_SRV
      };

      vm.openSwagger = function (swaggerUrl) {
        vm.permissions = [];
        APICall.getAPIData(swaggerUrl+'swagger.json', {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            response.host=swaggerUrl.split('/')[0].split(':')[0]+'://'+swaggerUrl.split('/')[2];
            //console.log(response);
            //response.schemes[0]=swaggerUrl.split('/')[0];
            for (var i in response.paths) {
              var url = i;
              for (var j in response.paths[i]) {
                var method = j;
                url = url.replace(/[&\/]/g, ".");
                url = url.replace(/[&\{\}]/g, "");
                vm.permissions.push({
                  name: method + url,
                  description: response.paths[i][j].description
                });
              }
            }
            vm.swaggerJson = response;
          },
          function (response) {
            console.log(response);
          });
      }

      // error management
      vm.myErrorHandler = function (data, status) {
        console.log(data, status);
      };

      vm.checkAndAddPermissions = function () {
        addPermission(0, function () {

        });
      };

      var addPermission = function (permssionIndex, cb) {
        if (vm.permissions.length <= 0) return cb();
        var url = Config.PERMISSION_SRV + "permissions/";
        APICall.getAPIData(url, {
          name: vm.permissions[permssionIndex].name,
          description: vm.permissions[permssionIndex].description
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
          if (response.success)
            vm.permissions[permssionIndex].message = 'added';
          else
            vm.permissions[permssionIndex].message = 'exists';
          permssionIndex++;
          if (permssionIndex < vm.permissions.length) {
            addPermission(permssionIndex, cb);
          } else {
            cb();
          }
        });
      }

    }]);

