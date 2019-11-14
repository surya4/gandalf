noonEduController
  .controller('TranslationEditCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state) {
      var vm = this;
      vm.translationId = $stateParams.translationId;
      vm.getTranslation = function () {
        var url = Config.TRANSLATION_SRV + "translations/" + vm.translationId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.translation = response.data[0];
        });
      };
      vm.getTranslation();


      vm.submitForm = function () {
        if (!vm.translation.group || !vm.translation.text || !vm.translation.item) {
          return '';
        }
        var url = Config.TRANSLATION_SRV + "translations/" + vm.translationId;
        APICall.getAPIData(url, vm.translation, Config.API_METHOD_TYPE.PUT).then(function (response) {
          $state.go('tab.translationList');
        });
      };

    }]);