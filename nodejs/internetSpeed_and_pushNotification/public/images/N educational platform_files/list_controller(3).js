noonEduController
  .controller('passageListCtrl', ['$scope', 'APICall', 'Config', '$rootScope', '$state',
    function ($scope, APICall, Config, $rootScope, $state) {
      var vm = this;
      vm.page = 1;
      vm.limit = 20;
      vm.order = 'DESC';
      vm.name = '';
      vm.passage = '';
      vm.orderBy = 'updated_at';

      vm.getPassages = function () {
        var url = Config.QUESTION_SRV + "passages"
          + '?page=' + vm.page
          + '&limit=' + vm.limit
          + '&order=' + vm.order
          + '&orderBy=' + vm.orderBy
          + '&name=' + vm.name
          + '&passage=' + vm.passage;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.passages = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
        });
      };

      vm.getPassages();

      vm.deletePassage = function (key) {
        var r = confirm("Are You Sure?");
        if (r == true) {
          var url = Config.QUESTION_SRV + "passages/" + vm.passages[key].id;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
            vm.passages.splice(key, 1)
          });
        }
      };

      vm.pageChanged = function() {
        vm.getPassages();
      };

    }]);