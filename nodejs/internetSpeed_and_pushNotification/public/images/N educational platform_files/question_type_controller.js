noonEduController
  .controller('QuestionTypeCtrl', ['$scope', 'APICall', 'Config', '$state',
    function ($scope, APICall, Config, $state) {
      var vm = this;

      vm.getQuestionTypes = function(){
      	 var url = Config.QUESTION_SRV + "questionTypes";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.questionTypes = response.data;
        });
      };
      vm.getQuestionTypes();
    	

    	vm.updateQuestionType = function (questionTypes) {
        var url = Config.QUESTION_SRV + 'questionTypes/' + questionTypes.id;
        APICall.getAPIData(url, {name:questionTypes.name}, Config.API_METHOD_TYPE.PUT).then(function (response) {
          questionTypes.editable=false;
        });
      };

      vm.saveQuestionType = function (newQuestionType) {
        console.log(newQuestionType);
        var url = Config.QUESTION_SRV + 'questionTypes';
        APICall.getAPIData(url, {name:newQuestionType}, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.getQuestionTypes();
        });
      }

    }]);