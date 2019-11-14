noonEduController
  .controller('RequestCtrl', ['$scope', 'APICall', 'Config', '$rootScope','ngProgressFactory','$uibModal','$state',
    function ($scope, APICall, Config, $rootScope,ngProgressFactory,$uibModal,$state) {
      var vm = this;

      vm.getAllOnlineTeacher = function(){
        var url=Config.TUTORING_SRV+"allOnlineTeacher";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.teachers=response.data;
        });
      }
      vm.requests={};
      vm.getAllRequests = function(status){
        var url=Config.TUTORING_SRV+"getAllRequests?status="+status;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.requests[status]=response.data;
        });
      }

      vm.delRequest = function(id){
        var url=Config.TUTORING_SRV+"delRequest/"+id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {

        });
      }

      vm.getsubjects = function () {
        var url = Config.TUTORING_SRV + "subjects"
          + '?page=' + vm.page
          + '&limit=' + vm.limit
          + '&order=' + vm.order
          + '&orderBy=' + vm.orderBy
          + '&name=' + vm.name;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.subjects = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
        });
      };

      vm.delAllAvailableRequest = function(){
        var url=Config.TUTORING_SRV+"delAllAvailableRequest";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {

        });
      }

      vm.getSubjectName = function(id){
        for(var i in vm.subjects){
          if(vm.subjects[i].id==id){
            return vm.subjects[i].name;
          }
        }
      }

      vm.getAllOnlineTeacher();
      vm.getAllRequests('available');
      vm.getsubjects();

    }]);