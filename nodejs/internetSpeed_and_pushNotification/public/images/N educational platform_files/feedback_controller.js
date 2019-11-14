/**
 * Created by ammar on 16/09/16.
 */
noonEduController
  .controller('FeedbackCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state','$uibModal','translateService','Users',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state,$uibModal,translateService,Users) {
      var vm = this;
      vm.page = 1;
      vm.limit = 100;
      vm.order = 'DESC';
      vm.orederId = '';
      vm.orderBy = 'updated_at';
      vm.users={};

      vm.getFeedbackList = function () {
        var url = Config.PACKAGE_SRV + "userFeedback"
        + '?page=' + vm.page
        + '&limit=' + vm.limit
        + '&order=' + vm.order
        + '&orderBy=' + vm.orderBy;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.feedbacks = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
          for(var i in vm.feedbacks){
            console.log(vm.feedbacks[i]);
            Users.getById(vm.feedbacks[i].user_id)
              .then(function(user){
                vm.users[user.id]=user;
              });
          }
        });
      };
      vm.getFeedbackList();

      vm.pageChanged = function() {
        vm.getFeedbackList();
      };

    }]);