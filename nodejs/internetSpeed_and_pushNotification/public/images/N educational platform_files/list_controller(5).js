noonEduController
  .controller('TestListCtrl', ['$scope', 'APICall', 'Config', '$state','ngProgressFactory',
    function ($scope, APICall, Config, $state,ngProgressFactory) {
      var vm = this;
      vm.page = 1;
      vm.limit = 20;
      vm.order = 'DESC';
      vm.name = '';
      vm.orderBy = 'updated_at';
      vm.progressbar = ngProgressFactory.createInstance();

      vm.getTests = function () {
        var url = Config.TEST_SRV + "tests"
          + '?page=' + vm.page
          + '&limit=' + vm.limit
          + '&order=' + vm.order
          + '&orderBy=' + vm.orderBy
          + '&name=' + vm.name
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          for(var i in response.data){
            response.data[i].hidden=(parseInt(response.data[i].hidden))?true:false
          }
          vm.tests = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
        });
      };
      vm.getTests();

      vm.togglePublish = function (key, id, hidden) {
        vm.progressbar.start();
        var url = Config.TEST_SRV + 'tests/' + id;
        APICall.getAPIData(url, {
          hidden:hidden
        } , Config.API_METHOD_TYPE.PUT).then(function (response) {
            vm.tests[key].hidden = hidden;
            vm.progressbar.complete();
          },
          function (data, message) {
            vm.progressbar.complete();
          });
      };

      vm.pageChanged = function() {
        vm.getTests();
      };
     

    }]);