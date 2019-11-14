noonEduController
  .controller('PaymentMethodCtrl', ['$rootScope','$state','ngProgressFactory','APICall','Config',
    function ($rootScope,$state,ngProgressFactory,APICall,Config) {
var vm=this;
      vm.newPaymentMethod={hidden:0};
      vm.progressbar = ngProgressFactory.createInstance();


      vm.getPaymentMethodList = function () {
        if (vm.paymentMethods) return true;
        var url = Config.PACKAGE_SRV + "paymentMethods";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.paymentMethods = response.data;
          for(var i in vm.paymentMethods){
            vm.paymentMethods[i].hidden=(vm.paymentMethods[i].hidden)?true:false;
          }
        });
      };
      vm.getPaymentMethodList();

      vm.savePaymentMethod=function(){
        if(!vm.newPaymentMethod.name){
          $rootScope.setMsg('error','param missing')
          return false;
        }
        var url = Config.PACKAGE_SRV + "paymentMethods";
        APICall.getAPIData(url, vm.newPaymentMethod, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.newPaymentMethod.id = response.data[0].id;
          vm.paymentMethods.push(vm.newPaymentMethod);
          vm.newPaymentMethod='';
        });
      };

      vm.initUpdatePaymentMethod = function(paymentMethod){
        vm.updatePaymentMethodObj=paymentMethod;
      };

      vm.updatePaymentMethod = function(){
        if(!vm.updatePaymentMethodObj.name){
          $rootScope.setMsg('error','param missing')
          return false;
        }
        var url = Config.PACKAGE_SRV + "paymentMethods/" + vm.updatePaymentMethodObj.id;
        APICall.getAPIData(url, vm.updatePaymentMethodObj, Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.updatePaymentMethodObj='';
        });
      };

    }]);
