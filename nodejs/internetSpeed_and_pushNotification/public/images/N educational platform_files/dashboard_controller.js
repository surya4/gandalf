noonEduController
  .controller('DashboardCtrl', ['$state','Questions','Config','APICall','$timeout','Tutoring',
    function ($state,Questions,Config,APICall,$timeout,Tutoring) {
    var vm =this;

      vm.getProducts = function () {
        var url = Config.FOLDER_SRV + 'products';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.products=response.data;
          });
      };
      vm.getProducts();
    }]);
