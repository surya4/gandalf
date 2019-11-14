noonEduController
  .controller('TestTypeCtrl', ['$scope', 'APICall', 'Config', '$state',
    function ($scope, APICall, Config, $state) {
      var vm = this;

      vm.getTestTypes = function(){
      	 var url = Config.TEST_SRV + "testType";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.testTypes = response.data;
        });
      };
      vm.getTestTypes();
    	

    	vm.updateTestType = function (testTypes) {
        var url = Config.TEST_SRV + 'testType/' + testTypes.id;
        APICall.getAPIData(url, {name:testTypes.name}, Config.API_METHOD_TYPE.PUT).then(function (response) {
          testTypes.editable=false;
        });
      };

      vm.saveTestType = function (newTestType) {
        var url = Config.TEST_SRV + 'testType';
        APICall.getAPIData(url, {name:newTestType}, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.getTestTypes();
        });
      }

    }]);