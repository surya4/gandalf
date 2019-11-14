noonEduController
  .controller('BankDetailsModalInstanceCtrl', ['transaction', '$uibModalInstance', '$uibModal','Config','APICall',
    function (transaction, $uibModalInstance, $uibModal,Config,APICall) {
      var vm = this;
      vm.transaction = transaction;

      vm.getBankDetails = function () {
        var url = Config.PACKAGE_SRV + "bankTransactions/" + vm.transaction.user_bank_transaction_id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.bankTransactions = response.data[0];
          console.log(vm.bankTransactions);
        });
      };
      if(vm.transaction.user_bank_transaction_id){
        vm.getBankDetails();
      }

      vm.getUserDetails = function () {
        var url = Config.USER_SRV + "users/" + vm.transaction.user_id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.user = response.data[0];
          console.log(vm.user);
        });
      };
      vm.getUserDetails();

      vm.approve = function () {
        $uibModalInstance.close({
          transationId:vm.transaction.id,
          status:'completed'
        });
      };

      vm.decline = function () {
        $uibModalInstance.close({
          transationId:vm.transaction.id,
          status:'failed'
        });
      };

      vm.cancel = function () {
        $uibModalInstance.dismiss({});
      };

    }]);
