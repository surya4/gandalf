noonEduController
  .controller('TranslationListCtrl', ['$scope', 'APICall', 'Config', '$state','$uibModal',
    function ($scope, APICall, Config, $state,$uibModal) {
      var vm = this;
      vm.page = 1;
      vm.limit = 20;
      vm.locale = 'ar';
      vm.order = 'DESC';
      vm.group = '';
      vm.item = '';
      vm.text = '';
      vm.orderBy = 'updated_at';

      vm.getLocale = function () {
        var url = Config.TRANSLATION_SRV + "locales";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.languages = response.data;
          vm.getTranslations();
        });
      };

      vm.getTranslations = function () {
        var url = Config.TRANSLATION_SRV + "list"
          + '?page=' + vm.page
          + '&locale=' + vm.locale
          + '&limit=' + vm.limit
          + '&order=' + vm.order
          + '&orderBy=' + vm.orderBy
          + '&group=' + vm.group
          + '&item=' + vm.item
          + '&text=' + vm.text;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.translations = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
        });
      };
      vm.getLocale();

      vm.changeLocale = function (locale) {
        vm.locale = locale;
        vm.getTranslations();
      };

      vm.deleteTranslation = function (key) {
        var url = Config.TRANSLATION_SRV + "translations/" + vm.translations[key].id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          console.log(response);
          vm.translations.splice(key, 1)
        });
      };

      vm.addMoreLocale = function () {
        vm.localeCreate = true;
        vm.newLang = {};
      };

      vm.saveNewLocale = function () {
        var url = Config.TRANSLATION_SRV + "addLocale";
        APICall.getAPIData(url, vm.newLang, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.newLang.id = response.data[0].id;
          vm.languages.push(vm.newLang);
        });
      };

      vm.openModal=function(user){
        modalDetails('list-keys','lg','ListKeysModalCtrl','translation/list_keys_modal.html',{})
          .result.then(function (data) {

          });
      };

      var modalDetails = function(name,size,controller,template,resolve){
        resolve = resolve || {}
        return $uibModal.open({
          animation: true,
          ariaLabelledBy: name+'-modal-title',
          ariaDescribedBy: name+'-modal-body',
          templateUrl: 'www/app/components/'+template,
          controller: controller,
          controllerAs: 'vm',
          size: size,
          resolve: resolve
        })
      };

      vm.pageChanged = function() {
        vm.getTranslations();
      };

    }]);