noonEduController
  .controller('SchoolListCtrl', ['$scope', 'APICall', 'Config', '$state',
    function ($scope, APICall, Config, $state) {
      var vm = this;
      vm.page = 1;
      vm.limit = 20;
      vm.name = '';
      vm.order = 'DESC';
      vm.orderBy = 'updated_at';
      vm.getSchools = function () {
        var url = Config.SCHOOL_SRV + "schools"
          + '?page=' + vm.page
          + '&limit=' + vm.limit
          + '&name=' + vm.name
          + '&order=' + vm.order
          + '&orderBy=' + vm.orderBy;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.schools = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
        });
      };
      vm.getSchools();

      vm.pageChanged = function() {
        vm.getSchools();
      };

      vm.deleteSchool = function (key) {
        var r = confirm("Are You Sure?");
        if (r == true) {
          var url = Config.SCHOOL_SRV + "schools/" + vm.schools[key].id;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
            vm.schools.splice(key, 1)
          });
        }
      }
    }]);