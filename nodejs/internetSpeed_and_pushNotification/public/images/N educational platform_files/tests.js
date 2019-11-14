noonEduServices
  .service('Tests', ['$rootScope', 'Config', '$localStorage', 'APICall', '$q',
    function ($rootScope, Config, $localStorage, APICall, $q) {

      return {

        userTestLog: function(userId){
          var deferred = $q.defer();
          var url = Config.TEST_SRV + "userTestLog/" + userId;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            deferred.resolve(response.data);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        }

      };
    }]);

