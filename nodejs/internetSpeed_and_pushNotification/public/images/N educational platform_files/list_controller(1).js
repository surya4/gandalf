noonEduController
.controller('JobsListCtrl', ['$scope', 'APICall',  'Config', '$state','ngProgressFactory',
  function ($scope, APICall, Config, $state, ngProgressFactory) {
    var vm = this;
    vm.page = 1;
    vm.limit = 20;
    vm.order = 'DESC';
    vm.name = '';
    vm.orderBy = 'updated_at';
    vm.progressbar = ngProgressFactory.createInstance();

    vm.getJobs = function () {
      var url = Config.FILE_SRV + 'jobsList'
        + '?page=' + vm.page
        + '&limit=' + vm.limit
        + '&order=' + vm.order
        + '&orderBy=' + vm.orderBy;

    APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then((response) => {
        vm.jobs = response.data;
        if(response.meta)
          vm.totalItems = response.meta.total;
      })
    };
    vm.getJobs();

    vm.pageChanged = function() {
      vm.getJobs();
    };

  }]);