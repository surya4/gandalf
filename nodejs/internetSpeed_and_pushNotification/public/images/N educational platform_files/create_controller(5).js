noonEduController
  .controller('UserCreateCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state) {
      var vm = this;
      vm.user = {
        email: '',
        password: '',
        role_id: ''
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

      vm.submitForm = function () {
        if (!vm.user.email || !vm.user.password || !vm.user.role_id) {
          $rootScope.setMsg('error', 'param Missing');
          return;
        }
        var url = Config.USER_SRV + "users/";
        APICall.getAPIData(url, vm.user, Config.API_METHOD_TYPE.POST).then(function (response) {
          $state.go('tab.userList');
        });
      };
    }]);