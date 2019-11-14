noonEduController
  .controller('SchoolCreateCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state','ngProgressFactory',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state,ngProgressFactory) {
      var vm = this;
      vm.progressbar = ngProgressFactory.createInstance();
      vm.school = {};
      vm.submitForm = function () {
        if (!vm.school.name || !vm.school.city) {
          return '';
        }
        var url = Config.SCHOOL_SRV + "schools/";
        APICall.getAPIData(url, vm.school, Config.API_METHOD_TYPE.POST).then(function (response) {
          console.log(response);
          $state.go('tab.schoolList');
        });
      };



      vm.getCountries = function () {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'countries';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.countries = response.data;
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };
      vm.getCountries();

      vm.getCompanies = function () {
        vm.progressbar.start();
        var url = Config.SCHOOL_SRV + 'companies';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.companies = response.data;
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };
      vm.getCompanies();
    }]);