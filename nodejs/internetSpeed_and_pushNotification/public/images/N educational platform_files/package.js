noonEduServices
  .service('Package', ['$q', '$state', '$localStorage', 'APICall', 'Config',
    function ($q, $state, $localStorage, APICall, Config) {

      var packageList = {};
      var paymentMethods = {};
      var banks = {};

      return {

        getPackageList: function () {
          var deferred = $q.defer();
          if (Object.keys(packageList).length !== 0) {
            deferred.resolve(packageList);
          }
          else {
            var url = Config.PACKAGE_SRV + "packages";
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              packageList = response.data;
              deferred.resolve(response.data);
            }, function () {
              deferred.reject({});
            });
          }
          return deferred.promise;
        },

        getPaymentMethods: function () {
          var deferred = $q.defer();
          if (Object.keys(paymentMethods).length !== 0) {
            deferred.resolve(paymentMethods);
          } else {
            var url = Config.PACKAGE_SRV + "paymentMethods";
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              paymentMethods=response.data;
              deferred.resolve(response.data);
            }, function () {
              deferred.reject({});
            });
          }
          return deferred.promise;
        },

        getBanks: function () {
          var deferred = $q.defer();
          if (Object.keys(banks).length !== 0) {
            deferred.resolve(banks);
          }
          else {
            var url = Config.PACKAGE_SRV + "banks";
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              banks = response.data;
              deferred.resolve(response.data);
            }, function () {
              deferred.reject({});
            });
          }
          return deferred.promise;
        },

        getBankDetails: function (transaction) {
          var deferred = $q.defer();
          var url = Config.PACKAGE_SRV + "myBankTransactions/" + transaction.user_bank_transaction_id;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            deferred.resolve(response.data[0]);
          }, function () {
            deferred.reject({});
          });
          return deferred.promise;
        }
      } //Return ends
    }]);