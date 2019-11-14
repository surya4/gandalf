/**
 * Created by ammar on 16/09/16.
 */
noonEduController
  .controller('TranslationRemainingCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state) {
      var vm = this;
      vm.translationRemaining = $rootScope.translationRemaining;
      $scope.$watch('$root.translationRemaining', function () {
        vm.translationRemaining = $rootScope.translationRemaining;
      });

      vm.saveTranslation = function (translation) {
        if (!translation.group || !translation.text || !translation.locale || !translation.item) {
          return '';
        }
        var url = Config.TRANSLATION_SRV + "translations/";
        APICall.getAPIData(url, translation, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.getRemainingTranslation();
        });
      };

      vm.deleteTranslationRequired = function (translation) {
        var url = Config.TRANSLATION_SRV + "remainingTranslation/" + translation.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          vm.getRemainingTranslation();
        });
      };


      vm.getRemainingTranslation = function (translation) {
        var url = Config.TRANSLATION_SRV + "remainingTranslation";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          $rootScope.translationRemaining = response.data;
        });
      }

    }]);