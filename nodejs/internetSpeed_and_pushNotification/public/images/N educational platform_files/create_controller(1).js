noonEduController
  .controller('McqCreateCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state', '$localStorage', 'ngProgressFactory','$timeout',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state, $localStorage, ngProgressFactory,$timeout) {
      var vm = this;
      vm.progressbar = ngProgressFactory.createInstance();
      vm.authUser = $localStorage.user;
      vm.token = $localStorage.token;
      vm.locale='ar';
      wirisObj = {
        url: Config.FILE_SRV + "remote",
        upload_url : Config.FILE_SRV + "files",
        destination: 'images/uploads',
        user_id: vm.authUser.id,
        token: vm.token
      };
      vm.step = 1;
      vm.question = {toggleCategoryMenu: false,category_type:'practice'};

      /******* ******* Passage Start ******* *******/
      vm.passage = {};
      vm.getPassages = function () {
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + "passages";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.allPassages = response.data;
          vm.progressbar.complete();
        }, function (response) {
          vm.progressbar.complete();
        });
      };
      vm.getPassages();
      vm.choosePassageTitle = 'Choose One'
      vm.selectPassage = function (passageId) {
        for (var i in vm.allPassages) {
          if (vm.allPassages[i].id == passageId) {
            vm.allPassages[i].selected = true;
            vm.choosePassageTitle = vm.allPassages[i].name;
          } else {
            vm.allPassages[i].selected = false;
          }
        }
        vm.passage.id = passageId;
      };
      vm.passageEditor = CKEDITOR.replace('passage',{language:vm.locale});

      vm.savePassage = function () {
        if (vm.passage && (vm.passage.id || vm.passage.name)) {
          if (vm.passage.id) {
            vm.question.passage_id = vm.passage.id;
            vm.skipPassage();
          } else {
            vm.progressbar.start();
            vm.passage.content = vm.passageEditor.getData();
            var url = Config.QUESTION_SRV + "passages";
            APICall.getAPIData(url, vm.passage, Config.API_METHOD_TYPE.POST).then(function (response) {
                console.log(response);
                vm.question.passage_id = response.data[0].id;
                vm.skipPassage();
                vm.progressbar.complete();
              },
              function (data) {
                vm.progressbar.complete();
              });
          }
        } else {
          alert('either skip or enter name and passage');
        }
      }
      vm.skipPassage = function () {
        vm.step++;
        vm.questionEditor = CKEDITOR.replace('question',{language:vm.locale});
        vm.solutionEditor = CKEDITOR.replace('solution',{language:vm.locale});
        vm.smartSolutionEditor = CKEDITOR.replace('smart_solution',{language:vm.locale});
      };
      /******* ******* Passage End ******* *******/

      /******* ******* Question Start ******* *******/


      vm.getQuestionTypes = function () {
        var url = Config.QUESTION_SRV + "questionTypes";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.questionTypes = response.data;
          },
          function (response) {
          });
      };

      vm.getQuestionTypes();

      vm.saveQuestion = function () {
        vm.progressbar.start();
        vm.question.question = vm.questionEditor.getData();
        vm.question.solution = vm.solutionEditor.getData();
        vm.question.smart_solution = vm.smartSolutionEditor.getData();
        var url = Config.QUESTION_SRV + "questions";
        APICall.getAPIData(url, vm.question, Config.API_METHOD_TYPE.POST).then(function (response) {
            vm.questionId = response.data[0].id;
            vm.step++;
            for(var i in vm.questionTypes){
              if(vm.question.question_type_id==vm.questionTypes[i].id){
                vm.questionType=vm.questionTypes[i];
                break;
              }
            }
            if(vm.questionType.name=='mcq'){
              vm.addMoreChoices(false);
              vm.addMoreChoices(false);
            } else if(vm.questionType.name=='matching'){
              vm.addMoreQuestionWithChoice(true);
            } else if(vm.questionType.name=='fillInTheBlank'){
              vm.addMorePlainChoices(true);
            } else if(vm.questionType.name=='oneWord'){
              vm.addMorePlainChoices(true);
            } else if(vm.questionType.name=='vocal'){
              vm.getProducts(0);
              vm.step++;
            }

            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };

      /******* ******* Question End ******* *******/

      /******* ******* Choice Start ******* *******/

      vm.choices = []
      vm.noOfChoices = [];
      vm.addMoreChoices = function (isCorrect) {
        vm.noOfChoices.push(vm.noOfChoices.length + 1);
        $timeout(function () {
          vm.choices.push({
            question_id: vm.questionId,
            editor: CKEDITOR.replace('choices_' + (vm.choices.length + 1),{language:vm.locale}),
            answer: '',
            is_correct:isCorrect
          });
        }, 500)
      };

      vm.addMorePlainChoices = function (isCorrect) {
        vm.noOfChoices.push(vm.noOfChoices.length + 1);
        vm.choices.push({
          question_id: vm.questionId,
          answer: '',
          is_correct:isCorrect
        });
      };

      var choiceIndex = 0;
      vm.saveChoices = function () {
        vm.progressbar.start();
        if (choiceIndex >= vm.choices.length) {
          choiceIndex = 0;
          var completed = true;
          for (var i in vm.choices) {
            if (!vm.choices[i].done) completed = false;
          }
          if (completed) {
            vm.getProducts(0);
            vm.step++;
          }
          vm.progressbar.complete();
          return;
        }
        if (vm.choices[choiceIndex].done) {
          choiceIndex++;
          vm.saveChoices();
          return;
        }
        if(vm.choices[choiceIndex].editor)
        vm.choices[choiceIndex].answer = vm.choices[choiceIndex].editor.getData();
        var url = Config.QUESTION_SRV + "choices";
        var data = {
          answer: vm.choices[choiceIndex].answer,
          is_correct: vm.choices[choiceIndex].is_correct,
          question_id: vm.choices[choiceIndex].question_id
        }
        APICall.getAPIData(url, data, Config.API_METHOD_TYPE.POST).then(function (response) {
            vm.choices[choiceIndex].done = true;
            vm.choices[choiceIndex].error = '';
            choiceIndex++;
            vm.saveChoices();
          },
          function (data, message) {
            vm.choices[choiceIndex].error = message || Config.ERROR_MESSAGE.ERROR;
            choiceIndex++;
            vm.saveChoices();
          });
      };

      vm.addMoreQuestionWithChoice = function (isCorrect) {
        vm.noOfChoices.push(vm.noOfChoices.length + 1);
        $timeout(function () {
          vm.choices.push({
            parent_question_id: vm.questionId,
            question_id: 0,
            questionEditor: CKEDITOR.replace('choices_question_' + (vm.choices.length + 1),{language:vm.locale}),
            answerEitor: CKEDITOR.replace('choices_answer_' + (vm.choices.length + 1),{language:vm.locale}),
            answer: '',
            question: '',
            is_correct:isCorrect
          });
        }, 500)
      };

      vm.saveQuestionWithChoices = function(){
        vm.progressbar.start();
        if (choiceIndex >= vm.choices.length) {
          choiceIndex = 0;
          var completed = true;
          for (var i in vm.choices) {
            if (!vm.choices[i].done) completed = false;
          }
          if (completed) {
            vm.getProducts(0);
            vm.step++;
          }
          vm.progressbar.complete();
          return;
        }
        if (vm.choices[choiceIndex].done) {
          choiceIndex++;
          vm.saveQuestionWithChoices();
          return;
        }
        vm.choices[choiceIndex].answer = vm.choices[choiceIndex].answerEitor.getData();
        vm.choices[choiceIndex].question = vm.choices[choiceIndex].questionEditor.getData();
        if(!vm.choices[choiceIndex].answer){
          vm.choices[choiceIndex].error = Config.ERROR_MESSAGE.ERROR;
          choiceIndex++;
          vm.saveQuestionWithChoices();
          return false;
        }
        var questionData = {
          question: vm.choices[choiceIndex].question,
          parent_question_id: vm.choices[choiceIndex].parent_question_id,
          difficulty:vm.question.difficulty,
          question_type_id:vm.question.question_type_id,
          solution:vm.choices[choiceIndex].answer
        };
        var url = Config.QUESTION_SRV + "questions";
        APICall.getAPIData(url, questionData, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.choices[choiceIndex].question_id = response.data[0].id;
          var url = Config.QUESTION_SRV + "choices";
          var data = {
            answer: vm.choices[choiceIndex].answer,
            is_correct: 1,
            question_id: vm.choices[choiceIndex].question_id
          };
          APICall.getAPIData(url, data, Config.API_METHOD_TYPE.POST).then(function (response) {
              vm.choices[choiceIndex].done = true;
              vm.choices[choiceIndex].error = '';
              choiceIndex++;
              vm.saveQuestionWithChoices();
            },
            function (data, message) {
              vm.choices[choiceIndex].error = message || Config.ERROR_MESSAGE.ERROR;
              choiceIndex++;
              vm.saveQuestionWithChoices();
            });
        },
        function (data, message) {
          vm.choices[choiceIndex].error = message || Config.ERROR_MESSAGE.ERROR;
          choiceIndex++;
          vm.saveQuestionWithChoices();
        });
      };
      /******* ******* Choice End ******* *******/

      /******* ******* Topics Start ******* *******/

      vm.selectedProducts = [];
      vm.mainSkillId = [];
      vm.noOfProduct = [0];
      vm.getProducts = function (no) {
        var url = Config.FOLDER_SRV + 'products';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            var array = []
            for (var i in response.data) {
              array.push({
                id: response.data[i].id,
                name: response.data[i].name
              });
            }
            vm.selectedProducts[no] = [];
            vm.selectedProducts[no].push({id: 0, hierarchy: 'Products', items: array});
          },
          function (response) {

          });
      };
      vm.selectedItemChanged = function (no, lvlKey, hierarchyId, itemId, parent, multiple) {
        itemId = parseInt(itemId);
        parent = (parent) ? parent : '';
        for (var i in vm.selectedProducts[no][lvlKey].items) {
          if (multiple) {
            if (vm.selectedProducts[no][lvlKey].items[i].id == itemId) {
              if (!vm.selectedProducts[no][lvlKey].items[i].selected)
                vm.selectedProducts[no][lvlKey].items[i].selected = true;
              else
                vm.selectedProducts[no][lvlKey].items[i].selected = false;
            }
          } else {
            if (vm.selectedProducts[no][lvlKey].items[i].id == itemId) {
              vm.selectedProducts[no][lvlKey].items[i].selected = true;
            } else {
              vm.selectedProducts[no][lvlKey].items[i].selected = false;
            }
          }
        }
        if (hierarchyId == 0) {
          var temp = vm.selectedProducts[no][0]
          vm.selectedProducts[no] = [];
          vm.selectedProducts[no].push(temp);
          var url = Config.FOLDER_SRV + 'folderForProduct/' + itemId;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              vm.selectedProducts[no][0].folders = response.data[0].folders;
              vm.selectedProducts[no][0].hierarchies = response.data[0].hierarchy;
              for (var i in response.data[0].hierarchy) {
                vm.selectedProducts[no].push({
                  id: response.data[0].hierarchy[i].id,
                  hierarchy: response.data[0].hierarchy[i].name,
                  items: []
                })
              }
              vm.selectedProducts[no][vm.selectedProducts[no].length - 1].multiple = true;

              for (var i in response.data[0].folders) {
                if (response.data[0].folders[i].hierarchy_id == vm.selectedProducts[no][lvlKey + 1].id) {
                  vm.selectedProducts[no][lvlKey + 1].items.push(response.data[0].folders[i]);
                }
              }
              vm.selectedProducts[no][lvlKey].toggleMenu = false;
            },
            function (data) {
              vm.selectedProducts[no][lvlKey].toggleMenu = false;
            });
        } else {
          vm.selectedProducts[no][lvlKey].toggleMenu = false;
          if (!vm.selectedProducts[no][lvlKey + 1])
            return false;
          var folders = vm.selectedProducts[no][0].folders;
          for (var i in vm.selectedProducts[no]) {
            if (i > lvlKey) {
              vm.selectedProducts[no][i].items = [];
            }
          }
          for (var i in folders) {
            if (folders[i].parent == itemId + '.' + parent) {
              vm.selectedProducts[no][lvlKey + 1].items.push(folders[i]);
            }
          }
        }
      };

      vm.selectMainSkill = function (isSkill, skillId, product) {
        if (!isSkill) return false;
        if (vm.mainSkillId.indexOf(skillId) > -1) {
          return false;
        }
        var currentProductId = 0;
        for (var i in product[0].items) {
          if (product[0].items[i].selected) {
            currentProductId = product[0].items[i].id;
            console.log(product[0].items[i]);
            break;
          }
        }
        for (var i = 0; i < vm.selectedProducts.length - 1; i++) {
          var firstItems = vm.selectedProducts[i][0].items;
          for (var j in firstItems) {
            if (firstItems[j].selected) {
              if (firstItems[j].id == currentProductId) {
                var lastItems = vm.selectedProducts[i][vm.selectedProducts[i].length - 1].items;
                for (var k in lastItems) {
                  if (vm.mainSkillId.indexOf(lastItems[k].id) > -1) {
                    var oldSkill = lastItems[k].id;
                    break;
                  }
                }
              }
            }
          }
        }
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + 'changeMainSkill/';
        APICall.getAPIData(url, {
          old_folder_id: oldSkill,
          folder_id: skillId,
          question_id: vm.questionId
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
            vm.mainSkillId.push(skillId);
            if (oldSkill) {
              vm.mainSkillId.splice(vm.mainSkillId.indexOf(oldSkill), 1);
            }
            vm.progressbar.complete();
          },
          function (data) {
            vm.progressbar.complete();
          });
      };
      vm.removeSkill = function (no, lvlKey, itemKey) {
        var url = Config.CURRICULUMQUESTION_SRV_SRV + 'removeSkill/';
        APICall.getAPIData(url, {
          folder_id: vm.selectedProducts[no][lvlKey].items[itemKey].id,
          question_id: vm.questionId
        }, Config.API_METHOD_TYPE.DELETE).then(function (response) {
            vm.selectedProducts[no][lvlKey].items[itemKey].selected = false;
            var skills = vm.selectedProducts[no][lvlKey].items;
            vm.progressbar.complete();
            for (var i in skills) {
              if (skills[i].selected) {
                return true;
              }
            }
            vm.selectedProducts.splice(no, 1);
            vm.noOfProduct.splice(vm.noOfProduct.length - 1, 1);
          },
          function (data) {
            vm.progressbar.complete();
          });
      }
      vm.saveSkill = function (no) {
        if (!vm.selectedProducts[no] || vm.selectedProducts[no].length <= 1) return false;
        var skills = vm.selectedProducts[no][vm.selectedProducts[no].length - 1].items;
        var arrayToSave = [];
        for (var i in skills) {
          if (skills[i].selected) {
            if (!vm.mainSkillId.length) vm.mainSkillId.push(skills[i].id);
            arrayToSave.push({
              folder_id: skills[i].id,
              question_id: vm.questionId,
              is_main: (vm.mainSkillId.indexOf(skills[i].id) > -1) ? 1 : 0
            });
          }
        }
        if (arrayToSave.length <= 0) return false;
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + 'curriculum/';
        APICall.getAPIData(url, arrayToSave, Config.API_METHOD_TYPE.POST).then(function (response) {
            var next = vm.noOfProduct.length;
            vm.noOfProduct.push(next);
            vm.getProducts(next);
            vm.progressbar.complete();
          },
          function (data) {
            vm.progressbar.complete();
          });
      };
      vm.getSelectedItem = function (item) {
        var string = '';
        for (var i in item) {
          if (item[i].selected) {
            if (string) {
              string = string + ', ' + item[i].name;
            } else {
              string = item[i].name
            }
          }
        }
        return (string) ? string : 'Choose Something'
      };

      /******* ******* Topics End ******* *******/

      vm.changeLocaleOfCkeditor = function(){
        if(vm.locale=='ar'){
          vm.locale='en';
        } else {
          vm.locale='ar'
        }
        if(vm.passageEditor){
          vm.passageEditor.destroy();
          vm.passageEditor = CKEDITOR.replace('passage',{language:vm.locale});
        }
        if(vm.questionEditor){
          vm.questionEditor.destroy();
          vm.questionEditor = CKEDITOR.replace('question',{language:vm.locale});
        }
        if(vm.solutionEditor){
          vm.solutionEditor.destroy();
          vm.solutionEditor = CKEDITOR.replace('solution',{language:vm.locale});
        }
        if(vm.smartSolutionEditor){
          vm.smartSolutionEditor.destroy();
          vm.smartSolutionEditor = CKEDITOR.replace('smart_solution',{language:vm.locale});
        }
        for(var i in vm.choices) {
          if(vm.choices.editor){
            vm.choices.editor.destroy();
            vm.choices.editor = CKEDITOR.replace('choices_'+ (parseInt(i) + 1), {language: vm.locale});
          }
          if(vm.choices.questionEditor){
            vm.choices.questionEditor.destroy();
            vm.choices.questionEditor = CKEDITOR.replace('choices_question_'+ (parseInt(i) + 1), {language: vm.locale});
          }
          if(vm.choices.answerEitor){
            vm.choices.answerEitor.destroy();
            vm.choices.answerEitor = CKEDITOR.replace('choices_answer_'+ (parseInt(i) + 1), {language: vm.locale});
          }
        }
      }
    }]);