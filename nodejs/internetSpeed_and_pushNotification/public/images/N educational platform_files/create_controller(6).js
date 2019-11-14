noonEduController
  .controller('VoucherCreateCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state','ngProgressFactory','Folders',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state,ngProgressFactory,Folders) {
      var vm = this;
      vm.progressbar = ngProgressFactory.createInstance();
      vm.voucher = {};
      vm.voucherType='gift';
      vm.submitForm = function () {
        if (!vm.voucher.name || !vm.voucher.code) {
          return '';
        }
        if(vm.voucherType=='gift'){
          vm.voucher.discount=null;
          vm.voucher.discount_type=null;
        }
        var url = Config.PACKAGE_SRV + "vouchers/";
        APICall.getAPIData(url, vm.voucher, Config.API_METHOD_TYPE.POST).then(function (response) {
          $state.go('tab.voucherList');
        });
      };

      var randomString='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      vm.generateRandomCode = function () {
        var index=0;
        var string='';
        for(var i=0;i<5;i++){
          var index=Math.floor(Math.random() * randomString.length);
          string=string+randomString[index];
        }
        vm.voucher.code=string;
      };

      vm.generateRandomCode();

      vm.getPackageList = function () {
        var url = Config.PACKAGE_SRV + "packages";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.packages = [{id:null,name:'All packages',slug:'allPackages'}];
          for(var i in response.data){
            vm.packages.push(response.data[i])
          }
        });
      };
      vm.getPackageList();

    }]);