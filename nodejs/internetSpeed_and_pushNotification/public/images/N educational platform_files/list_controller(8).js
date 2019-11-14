noonEduController
  .controller('VoucherListCtrl', ['$scope', 'APICall', 'Config', '$state',
    function ($scope, APICall, Config, $state) {
      var vm = this;
      vm.page = 1;
      vm.limit = 20;
      vm.name = '';
      vm.code = '';
      vm.order = 'DESC';
      vm.orderBy = 'vouchers.updated_at';
      vm.getVouchers = function () {
        var url = Config.PACKAGE_SRV + "vouchers"
          + '?page=' + vm.page
          + '&limit=' + vm.limit
          + '&name=' + vm.name
          + '&code=' + vm.code
          + '&order=' + vm.order
          + '&orderBy=' + vm.orderBy;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.vouchers = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
        });
      };
      vm.getVouchers();

      vm.pageChanged = function() {
        vm.getVouchers();
      };

      vm.deleteVoucher = function (key) {
        var url = Config.PACKAGE_SRV + "vouchers/" + vm.vouchers[key].id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          vm.vouchers.splice(key, 1)
        });
      }
    }]);