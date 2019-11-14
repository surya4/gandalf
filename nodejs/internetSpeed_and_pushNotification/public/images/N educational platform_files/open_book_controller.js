noonEduController.controller("OpenBookCtrl",
  ["APICall", "Config", "ngProgressFactory",'File','$stateParams',
    function (APICall, Config, ngProgressFactory,FileService,$stateParams) {

      var vm = this;
      vm.bookId=$stateParams.bookId;

      vm.getBook = function () {
        var url = Config.FOLDER_SRV + "books/" + vm.bookId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.book = response.data[0];
        });
      };

      vm.getPagesByBookId = function () {
        var url = Config.FOLDER_SRV + "pagesByBookId/" + vm.bookId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.pages = response.data;
        });
      };

      vm.getBook();
      vm.getPagesByBookId();
    }]);
  