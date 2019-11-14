noonEduController
  .controller('LandingCtrl', ['$state', 'APICall', 'Config', '$http', '$localStorage',
    function ($state, APICall, Config, $http, $localStorage) {
      if ($localStorage.token) {
        $state.go('tab.dashboard');
      }
      //var url=Config.QUESTION_SRV+"choices";
      //var data=[{'answer':'answer'},{0:{'answer':'answer'}}];
      //var data=angular.toJson({'as':{'answer':'answer'}});
      //console.log(data);
      //APICall.getAPIData(url,data, Config.API_METHOD_TYPE.POST).then(function (response) {
      //      console.log(response);
      //    },
      //    function (response) {
      //      console.log(response);
      //    });
    }]);
