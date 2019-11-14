noonEduController.controller("McqReviewCtrl",
  ["APICall", "Config", "ngProgressFactory",'Questions',
    function (APICall, Config, ngProgressFactory,Questions) {
      var vm = this;

      vm.products = [];
      vm.progressbar = ngProgressFactory.createInstance();
      vm.openedProductHierarchy = [];
      vm.getProducts = function () {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + "products";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          for (var t in response.data) {
            vm.products.push({
              id: response.data[t].id,
              customId: "P_" + response.data[t].id,
              slug: response.data[t].slug,
              name: response.data[t].name,
              selected: false
            });
          }
          vm.openProduct(0, vm.products), vm.progressbar.complete()
        }, function (e) {
          vm.progressbar.complete()
        })
      };
      vm.getProducts();

      vm.openProduct = function (index, product) {
        vm.openedProductHierarchy='';
        vm.questionList='';
        vm.activeQuestion={};
        for(var i in vm.products){
          vm.products[i].selected = false;
        }
        vm.selectedProduct=product[index];
        product[index].selected = true;
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + "folderForProduct/" + product[index].id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.openedProductHierarchy = [];
          for (var i in response.data[0].hierarchy)
            vm.openedProductHierarchy.push(response.data[0].hierarchy[i]);
          vm.openedProductHierarchy[0].parent = "";
          addIntoHierarchy(response.data[0].folders);
          vm.progressbar.complete();
        }, function (response) {
          vm.progressbar.complete();
        })
      };

      var addIntoHierarchy = function (folders) {
        for (var t in vm.openedProductHierarchy) {
          vm.openedProductHierarchy[t].elements = [];
          for (var a in folders) {
            if (vm.openedProductHierarchy[t].id == folders[a].hierarchy_id) {
              if (!vm.openedProductHierarchy[t].folder_id) {
                folders[a].parent = folders[a].parent ? folders[a].parent : "";
                if (vm.openedProductHierarchy[parseInt(t) + 1]) {
                  vm.openedProductHierarchy[parseInt(t) + 1].parent = folders[a].id + "." + folders[a].parent
                } else {
                  vm.getQuestionList(folders[a].id);
                }
                vm.openedProductHierarchy[t].folder_id = folders[a].id
                vm.openedProductHierarchy[t].folder_name = folders[a].name
              }
              vm.openedProductHierarchy[t].elements.push({
                id: folders[a].id,
                customId: "T_" + folders[a].id,
                name: folders[a].name,
                parent: folders[a].parent,
                order: folders[a].order
              });
            }
          }
          vm.openedProductHierarchy[t].elements.sort(function (e, t) {
            return e.order < t.order ? -1 : e.order > t.order ? 1 : 0
          })
        }
      };

      vm.selectFolder = function(index,folder){
        vm.activeQuestion={};
        vm.openedProductHierarchy[index].folder_id=folder.id;
        vm.openedProductHierarchy[index].folder_name=folder.name;
        if(vm.openedProductHierarchy[parseInt(index)+1]){
          folder.parent = folder.parent ? folder.parent : "";
          vm.openedProductHierarchy[parseInt(index)+1].parent=folder.id+'.'+folder.parent;
        } else{
          vm.getQuestionList(folder.id);
        }
        for(var i=index+1;i<vm.openedProductHierarchy.length;i++){
          for(var j in vm.openedProductHierarchy[i].elements){
            if(vm.openedProductHierarchy[i].elements[j].parent==vm.openedProductHierarchy[i].parent){
              vm.openedProductHierarchy[i].folder_id=vm.openedProductHierarchy[i].elements[j].id;
              vm.openedProductHierarchy[i].folder_name=vm.openedProductHierarchy[i].elements[j].name;
              if(vm.openedProductHierarchy[parseInt(i)+1]){
                vm.openedProductHierarchy[parseInt(i)+1].parent=vm.openedProductHierarchy[i].elements[j].id+'.'+vm.openedProductHierarchy[i].elements[j].parent;
              } else{
                vm.getQuestionList(vm.openedProductHierarchy[i].elements[j].id);
              }
              break;
            }
          }
        }
      };

      vm.getQuestionList = function (id) {
        var url = Config.QUESTION_SRV + "questionIdList/" + id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.questionList = response.data;
          vm.activeQuestion=vm.questionList[0];
          vm.questionIndex=0;
          vm.getQuestion();
        });
      };

      vm.getQuestion = function () {
        if(!vm.activeQuestion){
          return false
        }
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + "questions/" + vm.activeQuestion.question_id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.activeQuestion = response.data[0];
          vm.getQuestionCategories();
          vm.checkboxOption=[];
          vm.timeString='00:00:00';
          vm.showResult=true;

          if(vm.activeQuestion.question_type_name == 'matching'){
            vm.choiceAnswer=[];
            for(var i in vm.activeQuestion.choices){
              vm.choiceAnswer.push(vm.activeQuestion.choices[i]);
            }
            vm.choiceAnswer = shuffle(vm.choiceAnswer);
          } else if(vm.activeQuestion.question_type_name == 'mcq'){
            for(var i in vm.activeQuestion.choices){
              if(vm.activeQuestion.choices[i].is_correct)
                vm.checkboxOption[vm.activeQuestion.choices[i].id]=true;
            }
          } else if(vm.activeQuestion.question_type_name == 'oneWord'){
            vm.writtenAnswer=vm.activeQuestion.choices[0].answer;
          } else if(vm.activeQuestion.question_type_name == 'fillInTheBlank'){
            var inputs=document.getElementById('questionPara').getElementsByTagName('input');
            for(var i=0; i<inputs.length; i++){
              inputs[i].value=vm.activeQuestion.choices[i].answer;
            }
          }
          vm.progressbar.complete();

        });
      };

      vm.getQuestionCategories = function () {
        var url = Config.QUESTION_SRV + "questionCategories/" + vm.activeQuestion.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.activeQuestion.categories = response.data;
        });
      };

      vm.getOptionsWithAnswer = function (question) {
        var url = Config.QUESTION_SRV + "questionByParent/" + question.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          question.choices=response.data;
        });
      };

      vm.nextQuestion=function(){
        if((vm.questionIndex+1)>=vm.questionList.length){

        } else {
          vm.questionIndex++;
          vm.activeQuestion=vm.questionList[vm.questionIndex];
          vm.getQuestion();
        }
      };

      vm.prevQuestion=function(){
        if((vm.questionIndex-1)<0){

        } else {
          vm.questionIndex--;
          vm.activeQuestion=vm.questionList[vm.questionIndex];
          vm.getQuestion();
        }
      };

      function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }

    }]);
  