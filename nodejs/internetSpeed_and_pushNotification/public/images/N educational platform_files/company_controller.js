noonEduController
  .controller('CompanyCtrl', ['$rootScope', '$state', 'ngProgressFactory', 'APICall', 'Config',
    function ($rootScope, $state, ngProgressFactory, APICall, Config) {
      var vm = this;
      vm.newCompany = {};
      vm.progressbar = ngProgressFactory.createInstance();
      
      vm.getCompanyList = function () {
        if (vm.companies) return true;
        var url = Config.SCHOOL_SRV + "companies";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.companies = response.data;
        });
      };
      vm.getCompanyList();

      vm.saveCompany = function () {
        if (!vm.newCompany.name) {
          $rootScope.setMsg('error', 'param missing')
          return false;
        }
        var url = Config.SCHOOL_SRV + "companies";
        APICall.getAPIData(url, vm.newCompany, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.newCompany.id = response.data[0].id;
          vm.companies.push(vm.newCompany);
          vm.newCompany = '';
        });
      };

      vm.initUpdateCompany = function (company) {
        vm.updateCompanyObj = company;
      };

      vm.updateCompany = function () {
        if (!vm.updateCompanyObj.name) {
          $rootScope.setMsg('error', 'param missing')
          return false;
        }
        var url = Config.SCHOOL_SRV + "companies/" + vm.updateCompanyObj.id;
        APICall.getAPIData(url, vm.updateCompanyObj, Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.updateCompanyObj = '';
        });
      };

    }]);
