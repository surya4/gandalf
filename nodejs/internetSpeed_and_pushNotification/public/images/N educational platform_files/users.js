noonEduServices
  .service('Users', ['$rootScope', 'Config', '$localStorage', 'APICall', '$q',
    function ($rootScope, Config, $localStorage, APICall, $q) {

      var users={};

      return {

        getById: function (userId) {
          var deferred = $q.defer();
          if(users[userId]){
            deferred.resolve(users[userId]);
          }  else {
            var url = Config.USER_SRV + "users/" + userId;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function(response){
              users[userId]=response.data[0];
              deferred.resolve(users[userId]);
            },function(response){
              deferred.reject(response);
            });
          }
          return deferred.promise;
        }

      };
    }]);

