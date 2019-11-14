noonEduServices
  .service('MentorService', ['Config', 'APICall', '$q', '$localStorage',
    function (Config, APICall, $q, $localStorage) {

      var users = {};

      return {

        getGoals: function () {
          var deferred = $q.defer();
          var url = Config.MENTOR_SRV + "goalsList/";
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            deferred.resolve(response);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },
        saveGoal: function (data) {
          data.admin_id = $localStorage.user.id;
          var deferred = $q.defer();
          var url = Config.MENTOR_SRV + "saveGoal/";
          APICall.getAPIData(url, data, Config.API_METHOD_TYPE.POST).then(function (response) {
            deferred.resolve(response);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },
        getMentorList: function() {
          var deferred = $q.defer();
          var url = Config.USER_SRV + "mentorList/";
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            deferred.resolve(response);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },
        approveMentor: function (data) {
          var deferred = $q.defer();
          console.log(data);
          var url = Config.USER_SRV + "approveMentor/";
          APICall.getAPIData(url, data, Config.API_METHOD_TYPE.POST).then(function (response) {
            deferred.resolve(response);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        }

      };
    }]);