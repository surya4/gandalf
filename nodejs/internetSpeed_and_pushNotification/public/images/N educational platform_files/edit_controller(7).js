noonEduController
  .controller('VoucherEditCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state','ngProgressFactory',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state, ngProgressFactory) {
      var vm = this;
      vm.voucherId = $stateParams.voucherId;

      vm.progressbar = ngProgressFactory.createInstance();

      vm.voucherType='gift';

      vm.getVoucher = function () {
        var url = Config.PACKAGE_SRV + "vouchers/" + vm.voucherId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          if(response.data[0].expiry){
            var expiry=response.data[0].expiry.split('T')[0];
            expiry=expiry.split('-');
            response.data[0].expiry=new Date(expiry[0], expiry[1]-1, expiry[2]);
          }
          if(response.data[0].valid_from){
            var valid_from=response.data[0].valid_from.split('T')[0];
            valid_from=valid_from.split('-');
            response.data[0].valid_from=new Date(valid_from[0], valid_from[1]-1, valid_from[2]);
          }
          if(response.data[0].discount){
            vm.voucherType='discount';
          }
          vm.voucher = response.data[0];
        });
      };
      vm.getVoucher();


      vm.submitForm = function () {
        var url = Config.PACKAGE_SRV + "vouchers/" + vm.voucherId;
        if(vm.voucherType=='gift'){
          vm.voucher.discount=null;
          vm.voucher.discount_type=null;
        }
        APICall.getAPIData(url, vm.voucher, Config.API_METHOD_TYPE.PUT).then(function (response) {
          $state.go('tab.voucherList');
        });
      };

      vm.getPackageList = function () {
        var url = Config.PACKAGE_SRV + "packages";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.packages = [{id:null,name:'All packages'}];
          for(var i in response.data){
            vm.packages.push(response.data[i])
          }
        });
      };
      vm.getPackageList();

    }]);