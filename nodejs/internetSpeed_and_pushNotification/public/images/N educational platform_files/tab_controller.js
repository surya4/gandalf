noonEduController
  .controller('TabCtrl', ['$state', '$localStorage', 'APICall', 'Config', '$rootScope','$sce',
    function ($state, $localStorage, APICall, Config, $rootScope,$sce) {
      var vm = this;
      vm.toggleSidebar = false;
      vm.activeTab = '';

      vm.user = $localStorage.user;
      vm.token = $localStorage.token;

      vm.qudrat = $sce.trustAsResourceUrl(Config.QUDRAT_SRV + 'user/loginViaJwt');
      vm.tahsili = $sce.trustAsResourceUrl(Config.TAHSILI_SRV + 'user/loginViaJwt');
      vm.mailUrl=Config.NOTIFICATIONS_SRV;

      vm.openTab = function (name) {
          vm.activeTab = name;
      };

      vm.logout = function () {
        var url = Config.USER_SRV + "logout";
        APICall.getAPIData(url, {token: vm.token}, Config.API_METHOD_TYPE.POST).then(function (response) {
          $localStorage.user = '';
          $localStorage.token = '';
          $state.go('landing');
        });
      }

      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          if (toState.name != fromState.name) {
            vm.toggleSidebar = false;
          }
        });

      vm.getRemainingTranslation = function () {
        var url = Config.TRANSLATION_SRV + "remainingTranslation";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          $rootScope.translationRemaining = response.data;
        });
      }

      vm.getRemainingTranslation();

    }]);
