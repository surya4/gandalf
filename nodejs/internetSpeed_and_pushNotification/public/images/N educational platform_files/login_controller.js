noonEduController
  .controller('LoginCtrl', ['$stateParams','$scope', 'APICall', 'Config', '$localStorage', '$state',
    function ($stateParams,$scope, APICall, Config, $localStorage, $state) {
      var vm = this;

      if ($localStorage.token) {
        $state.go('tab.dashboard');
      }

      vm.getProfile = function () {
        var url = Config.USER_SRV + "profile";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          if (response.data[0].roles) {
            var userRoleIds = response.data[0].roles;
            if (userRoleIds.indexOf(Config.ROLE_ID.ADMIN) > -1
              || userRoleIds.indexOf(Config.ROLE_ID.SUPER_ADMIN) > -1
              || userRoleIds.indexOf(Config.ROLE_ID.DATA_ENTRY) > -1) {
              vm.user = response.data[0];
              $localStorage.user = vm.user;
              $state.go('tab.dashboard');
              return true;
            }
          }
          vm.errorMsg = 'No Permission';
        });
      };

      vm.USER_SRV=Config.USER_SRV;

      vm.login = function (user) {
        console.log(user);
        if (!user || !user.email) {
          vm.errorMsg = 'No Email';
          return;
        }
        if (!user.password) {
          vm.errorMsg = 'No Password';
          return;
        }
        vm.errorMsg = '';
        var url = Config.USER_SRV + "authenticate";
        APICall.getAPIData(url, user, Config.API_METHOD_TYPE.POST).then(function (response) {
          if (response.data[0].roles) {
            var userRoleIds = response.data[0].roles;
            if (userRoleIds.indexOf(Config.ROLE_ID.ADMIN) > -1
              || userRoleIds.indexOf(Config.ROLE_ID.SUPER_ADMIN) > -1
              || userRoleIds.indexOf(Config.ROLE_ID.DATA_ENTRY) > -1
              || userRoleIds.indexOf(Config.ROLE_ID.ADMIN_READ) > -1) {
              vm.user = response.data[0];
              delete vm.user.token;
              $localStorage.user = vm.user;
              $localStorage.token = response.data[0].jwtToken;
              userToken = response.data[0].jwtToken;
              $state.go('tab.dashboard');
              return true;
            }
          }
          vm.errorMsg = 'No Permission';
        });
      }

      vm.passwordReset=Config.NOON_SRV+"#/header/passwordReset";
      vm.signup=Config.NOON_SRV+"#/header/signup";

      vm.token = $stateParams.token;

      if(vm.token){
        userToken=vm.token;
        $localStorage.token=vm.token;
        vm.getProfile();
      } else if ($localStorage.token) {
        vm.getProfile();
      }

    }]);

