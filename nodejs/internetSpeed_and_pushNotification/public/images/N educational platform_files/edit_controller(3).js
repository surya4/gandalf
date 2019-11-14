noonEduController
  .controller('PassageEditCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state', '$localStorage',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state, $localStorage) {
      var vm = this;
      vm.authUser = $localStorage.user;
      vm.token = $localStorage.token;
      wirisObj = {
        url: Config.FILE_SRV + "remote",
        destination: 'images/uploads',
        upload_url : Config.FILE_SRV + "files",
        user_id: vm.authUser.id,
        token: vm.token
      };
      vm.passageId = $stateParams.passageId;
      vm.getPassage = function () {
        var url = Config.QUESTION_SRV + "passages/" + vm.passageId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.passage = response.data[0];
          vm.passageEditor = CKEDITOR.replace('passage');
        });
      };
      vm.getPassage();


      vm.submit = function () {
        vm.passage.content = vm.passageEditor.getData();
        if (!vm.passage.name || !vm.passage.content) {
          return '';
        }
        vm.passage.userId = vm.authUser.id;
        var url = Config.QUESTION_SRV + "passages/" + vm.passageId;
        APICall.getAPIData(url, vm.passage, Config.API_METHOD_TYPE.PUT).then(function (response) {
          console.log(response);
          $state.go('tab.passageList');
        });
      };

    }]);