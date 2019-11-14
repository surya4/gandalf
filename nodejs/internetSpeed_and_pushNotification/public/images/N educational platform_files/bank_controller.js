noonEduController
  .controller('BankCtrl', ['$rootScope','$state','ngProgressFactory','APICall','Config',
    function ($rootScope,$state,ngProgressFactory,APICall,Config) {
var vm=this;
      vm.newBank={};
      vm.progressbar = ngProgressFactory.createInstance();


      vm.getBankList = function () {
        if (vm.banks) return true;
        var url = Config.PACKAGE_SRV + "banks";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.banks = response.data;
        });
      };
      vm.getBankList();

      vm.saveBank=function(){
        if(!vm.newBank.name || !vm.newBank.slug || !vm.newBank.IBAN || !vm.newBank.account_no ||
          !vm.newBank.account_holder_name){
          $rootScope.setMsg('error','param missing')
          return false;
        }
        var url = Config.PACKAGE_SRV + "banks";
        APICall.getAPIData(url, vm.newBank, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.newBank.id = response.data[0].id;
          vm.banks.push(vm.newBank);
          vm.newBank='';
        });
      };

      vm.initUpdateBank = function(bank){
        vm.updateBankObj=bank;
      };

      vm.updateBank = function(){
        if(!vm.updateBankObj.name || !vm.updateBankObj.slug || !vm.updateBankObj.IBAN || !vm.updateBankObj.account_no ||
          !vm.updateBankObj.account_holder_name){
          $rootScope.setMsg('error','param missing')
          return false;
        }
        var url = Config.PACKAGE_SRV + "banks/" + vm.updateBankObj.id;
        APICall.getAPIData(url, vm.updateBankObj, Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.updateBankObj='';
        });
      };

    }]);
