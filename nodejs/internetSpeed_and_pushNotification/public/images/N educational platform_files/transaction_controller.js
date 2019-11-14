/**
 * Created by ammar on 16/09/16.
 */
noonEduController
  .controller('TransactionCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state','$uibModal','translateService','Package',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state,$uibModal,translateService,Package) {
      var vm = this;
      vm.page = 1;
      vm.limit = 20;
      vm.order = 'DESC';
      vm.orederId = '';
      vm.orderBy = 'updated_at';
      vm.tabOpened = 'pending';

      vm.getTransactionList = function () {
        var url = Config.PACKAGE_SRV + "transactions"
        + '?page=' + vm.page
        + '&limit=' + vm.limit
        + '&order=' + vm.order
        + '&orderBy=' + vm.orderBy
        + '&status=' + vm.tabOpened;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.transactions = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
        });
      };
      vm.getTransactionList();

      vm.openTeb = function (tabName) {
        vm.tabOpened = tabName;
        vm.getTransactionList();
      };

      vm.getPaymentMethodList = function () {
        if (vm.paymentMethods) return true;
        var option = {};
        Package.getPaymentMethods(option).then(function (data) {
          vm.paymentMethods = data;
        });
      };
      vm.getPaymentMethodList();

      vm.getBankList = function () {
        if (vm.banks) return true;
        Package.getBanks().then(function (data) {
          vm.banks = data;
        });
      };
      vm.getBankList();

      vm.getPackageList = function () {
        if (vm.packages) return true;
        Package.getPackageList().then(function (data) {
          vm.packages = data;
        });
      };
      vm.getPackageList();

      vm.getPaymentMethodName = function (id) {
        for(var i in vm.paymentMethods){
          if(vm.paymentMethods[i].id == id){
            return vm.paymentMethods[i].name;
          }
        }
        return 'N/A';
      };
      vm.getBankName = function (id) {
        for(var i in vm.banks){
          if(vm.banks[i].id == id){
            return vm.banks[i].name;
          }
        }
        return 'N/A';
      };
      vm.getPackageName = function (id) {
        for(var i in vm.packages){
          if(vm.packages[i].id == id){
            return translateService.getTranslation('pricing.'+vm.packages[i].slug+'Name');
          }
        }
        return 'N/A';
      };

      vm.openBankDetails = function (transaction) {
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'www/app/components/transaction/bank_details.html',
          controller: 'BankDetailsModalInstanceCtrl',
          controllerAs: 'vm',
          size: 'lg',
          resolve: {
            transaction: function () {
              return transaction;
            }
          }
        });

        modalInstance.result.then(function (data) {
          if(data.status){
            vm.updateTransaction(data.status,data.transationId);
          }
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      };

      vm.updateTransaction = function(status,transationId){
        var upgradeUser=(status=='completed')?true:false;
        var url = Config.PACKAGE_SRV + "transactions/" + transationId;
        APICall.getAPIData(url, {
          status:status,
          upgradeUser:upgradeUser
        }, Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.getTransactionList();
        });
      };

      vm.pageChanged = function() {
        vm.getTransactionList();
      };

    }]);