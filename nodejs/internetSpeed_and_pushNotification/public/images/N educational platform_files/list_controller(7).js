noonEduController
  .controller('UserListCtrl', ['$scope', 'APICall', 'Config', '$rootScope','ngProgressFactory',
    function ($scope, APICall, Config, $rootScope,ngProgressFactory) {
      var vm = this;
      vm.page = 1;
      vm.limit = 20;
      vm.order = 'DESC';
      vm.email = '';
      vm.orderBy = 'updated_at';
      vm.progressbar = ngProgressFactory.createInstance();

      vm.getUsers = function () {
        if(vm.gettingUser){
          return false;
        }
        vm.gettingUser=true;
        vm.progressbar.start();
        var url = Config.USER_SRV + "users"
          + '?page=' + vm.page
          + '&limit=' + vm.limit
          + '&order=' + vm.order
          + '&orderBy=' + vm.orderBy
          + '&roleId=' + vm.roleId
          + '&email=' + vm.email;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.users = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
          vm.gettingUser=false;
          vm.progressbar.complete();
        },function (response) {
          vm.gettingUser=false;
          vm.progressbar.complete();
        });
      };

      vm.pageChanged = function() {
        vm.getUsers();
      };

      vm.openTab = function (role) {
        vm.roleId=role.id;
        vm.page = 1;
        vm.tabOpened=role.name;
        vm.getUsers();
      };

      vm.getRoleList = function () {
        if (vm.roles) return true;
        var url = Config.PERMISSION_SRV + "rolesList";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.roles=[];
          for(var i in response.data){
            if(response.data[i].id != 1)
            vm.roles.push(response.data[i]);
          }
        });
      };

      vm.getRoleList();
      vm.roleId=5;
      vm.tabOpened='student';

    }]);