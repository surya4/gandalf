noonEduController
  .controller('TranslationCreateCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state) {
      var vm = this;
      vm.translation = {
        group: '',
        text: '',
        locale: 'ar',
        item: ''
      };
      vm.submitForm = function () {
        if (!vm.translation.group || !vm.translation.text || !vm.translation.locale || !vm.translation.item) {
          return '';
        }
        var url = Config.TRANSLATION_SRV + "translations/";
        APICall.getAPIData(url, vm.translation, Config.API_METHOD_TYPE.POST).then(function (response) {
          $state.go('tab.translationList');
          //vm.translation.text='';
          //vm.translation.item='';
        });
      };
    }]);