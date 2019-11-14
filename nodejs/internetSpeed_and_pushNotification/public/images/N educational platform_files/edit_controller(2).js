noonEduController
  .controller('McqEditCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state', '$localStorage', 'ngProgressFactory','$timeout',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state, $localStorage, ngProgressFactory,$timeout) {
      var vm = this;
      vm.progressbar = ngProgressFactory.createInstance();
      vm.authUser = $localStorage.user;
      vm.token = $localStorage.token;
      wirisObj = {
        url: Config.FILE_SRV + "remote",
        destination: 'images/uploads',
        upload_url : Config.FILE_SRV + "files",
        user_id: vm.authUser.id,
        token: vm.token
      };
      vm.locale='ar';
      vm.questionId = $stateParams.mcqId;
      vm.stage = 'preview';
      vm.getQuestion = function () {
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + "questions/" + vm.questionId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.question = response.data[0];
          vm.getQuestionCategories();
          vm.question.question_type_id = vm.question.question_type_id.toString()
          vm.choices = response.data[0].choices;
          vm.choices.sort(function compare(a, b) {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
          });
          vm.passage = response.data[0].passage;
          vm.getQuestionTypes();
          delete vm.question.choices;
          delete vm.question.passage;
          vm.progressbar.complete();
        }, function (data) {
          vm.progressbar.complete();
        });
      };

      vm.getQuestionCategories = function () {
        var url = Config.QUESTION_SRV + "questionCategories/" + vm.question.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.question.categories = response.data;
          vm.question.category_type='practice';
          for(var i in vm.question.categories){
            if(vm.question.categories[i].category_type == 'quick_review'){
              vm.question.category_type='quick_review';
            }
          }
        });
      };

      vm.getQuestion();

      vm.removeCategory = function(category){
        var url = Config.QUESTION_SRV + "questionCategories/" + category.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          vm.getQuestionCategories();
        });
      };

      vm.insertCategory = function(type){
        var url = Config.QUESTION_SRV + "questionCategories";
        APICall.getAPIData(url, {
          question_id:vm.question.id,
          category_type:type,
          category_id:null
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.getQuestionCategories();
        });
      };

      vm.getQuestionTypes = function () {
        var url = Config.QUESTION_SRV + "questionTypes";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.questionTypes = response.data;
          for(var i in vm.questionTypes){
            if(vm.question.question_type_id==vm.questionTypes[i].id){
              vm.questionType=vm.questionTypes[i];
              break;
            }
          }
          if(vm.questionType.name=='matching'){
            vm.getOptionsWithAnswer();
          } else if(vm.questionType.name=='fillInTheBlank'){
            var inputs=document.getElementById('questionPara').getElementsByTagName('input');
            for(var i=0; i<inputs.length; i++){
              if(vm.choices[i]){
                inputs[i].value=vm.choices[i].answer;
              }
            }
          }
        });
      };

      vm.getOptionsWithAnswer = function () {
        var url = Config.QUESTION_SRV + "questionByParent/" + vm.question.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.choices=response.data;
        });
      };

      /******* ******* Choice Start ******* *******/

      vm.showChoice = function () {
        vm.stage = 'choice';
        if(vm.questionType.name=='matching'){
          if (vm.choices[0] && !vm.choices[0].questionEditor)
            $timeout(function () {
              for (var i in vm.choices) {
                vm.choices[i].questionEditor = CKEDITOR.replace('choices_question_' + vm.choices[i].question_id,{language:vm.locale});
                vm.choices[i].answerEitor = CKEDITOR.replace('choices_answer_' + vm.choices[i].choice_id,{language:vm.locale});
              }
            }, 500);
        } else  if(vm.questionType.name=='fillInTheBlank' || vm.questionType.name=='oneWord'){

        } else {
          if (vm.choices[0] && !vm.choices[0].editor)
            $timeout(function () {
              for (var i in vm.choices) {
                vm.choices[i].is_correct = (vm.choices[i].is_correct) ? true : '';
                vm.choices[i].editor = CKEDITOR.replace('choices_' + vm.choices[i].id,{language:vm.locale});
              }
            }, 500);
        }
      };

      vm.deleteChoice = function (choiceIndex) {
        var r = confirm("Are You Sure?");
        if (r == true) {
          vm.progressbar.start();
          var url = Config.QUESTION_SRV + "choices/" + vm.choices[choiceIndex].id;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
              vm.choices.splice(choiceIndex, 1);
              vm.progressbar.complete();
            },
            function (data, message) {
              vm.choices[choiceIndex].error = message;
              vm.progressbar.complete();
            });
        }
      };

      vm.updateChoice = function (choiceIndex) {
        vm.progressbar.start();
        if(vm.choices[choiceIndex].editor)
        vm.choices[choiceIndex].answer = vm.choices[choiceIndex].editor.getData();
        var url = Config.QUESTION_SRV + "choices/" + vm.choices[choiceIndex].id;
        var postData = {
          question_id: vm.choices[choiceIndex].question_id,
          answer: vm.choices[choiceIndex].answer,
          is_correct: vm.choices[choiceIndex].is_correct
        };
        APICall.getAPIData(url, postData, Config.API_METHOD_TYPE.PUT).then(function (response) {
            vm.choices[choiceIndex].done = true;
            vm.progressbar.complete();
          },
          function (data, message) {
            vm.choices[choiceIndex].error = message;
            vm.progressbar.complete();
          });
      };

      vm.newChoices = false;

      vm.addMoreChoices = function () {
        vm.newChoices = {
          question_id: vm.question.id,
          answer: ''
        };
        if(vm.questionType.name=='mcq'){
          $timeout(function () {
            vm.newChoices.editor = CKEDITOR.replace('new_choices');
          }, 500);
        }
      };

      vm.insertChoice = function () {
        vm.progressbar.start();
        if(vm.newChoices.editor)
        vm.newChoices.answer = vm.newChoices.editor.getData();
        var url = Config.QUESTION_SRV + "choices";
        var postData = {
          question_id: vm.newChoices.question_id,
          answer: vm.newChoices.answer,
          is_correct: vm.newChoices.is_correct
        };
        APICall.getAPIData(url, postData, Config.API_METHOD_TYPE.POST).then(function (response) {
            postData.id = response.data[0].id;
            vm.choices.push(postData);
            vm.newChoices = false;
            $timeout(function () {
              vm.choices[vm.choices.length - 1].editor = CKEDITOR.replace('choices_' + vm.choices[vm.choices.length - 1].id);
              vm.progressbar.complete();
            }, 500);
          },
          function (data, message) {
            vm.newChoices.error = message;
            vm.progressbar.complete();
          });
      };

      vm.deleteOption = function (choiceIndex) {
        var r = confirm("Are You Sure?");
        if (r == true) {
          vm.progressbar.start();
          var url = Config.QUESTION_SRV + "questions/" + vm.choices[choiceIndex].question_id;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
              if(!vm.choices[choiceIndex].choice_id){
                vm.choices.splice(choiceIndex, 1);
                vm.progressbar.complete();
                return;
              }
              var url = Config.QUESTION_SRV + "choices/" + vm.choices[choiceIndex].choice_id;
              APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
                  vm.choices.splice(choiceIndex, 1);
                  vm.progressbar.complete();
                },
                function (data) {
                  vm.choices[choiceIndex].error = data.message;
                  vm.progressbar.complete();
                });
            },
            function (data) {
              vm.choices[choiceIndex].error = data.message;
              vm.progressbar.complete();
            });
        }
      };

      vm.updateOption = function (choiceIndex) {
        vm.progressbar.start();
        vm.choices[choiceIndex].answer = vm.choices[choiceIndex].answerEitor.getData();
        vm.choices[choiceIndex].question = vm.choices[choiceIndex].questionEditor.getData();

        var url = Config.QUESTION_SRV + "questions/" + vm.choices[choiceIndex].question_id;
        APICall.getAPIData(url, {question:vm.choices[choiceIndex].question}, Config.API_METHOD_TYPE.PUT).then(function (response) {
            var url = Config.QUESTION_SRV + "choices/" + vm.choices[choiceIndex].choice_id;
            var postData = {
              question_id: vm.choices[choiceIndex].question_id,
              answer: vm.choices[choiceIndex].answer
            };
            APICall.getAPIData(url, postData, Config.API_METHOD_TYPE.PUT).then(function (response) {
                vm.choices[choiceIndex].done = true;
                vm.progressbar.complete();
              },
              function (data) {
                vm.choices[choiceIndex].error = data.message;
                vm.progressbar.complete();
              });
          },
          function (data) {
            vm.choices[choiceIndex].error = data.message;
            vm.progressbar.complete();
          });
      };

      vm.addMoreOptions = function () {
        vm.newChoices = {
          parent_question_id: vm.question.id,
          question_id: 0,
          answer: '',
          question: ''
        };
        $timeout(function () {
          vm.newChoices.answerEitor = CKEDITOR.replace('new_choices_answer');
          vm.newChoices.questionEditor = CKEDITOR.replace('new_choices_question');
        }, 500)
      };

      vm.insertOptions = function () {
        vm.newChoices.answer = vm.newChoices.answerEitor.getData();
        vm.newChoices.question = vm.newChoices.questionEditor.getData();
        var questionData = {
          question: vm.newChoices.question,
          parent_question_id: vm.newChoices.parent_question_id,
          difficulty:vm.question.difficulty,
          question_type_id:vm.question.question_type_id,
          solution:vm.newChoices.answer
        };
        if(!vm.newChoices.answer){
          vm.newChoices.error = Config.ERROR_MESSAGE.ERROR;
          return false;
        }
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + "questions";
        APICall.getAPIData(url, questionData, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.newChoices.question_id = response.data[0].id;
          var url = Config.QUESTION_SRV + "choices";
          var postData = {
            question_id: vm.newChoices.question_id,
            answer: vm.newChoices.answer,
            is_correct: 1
          };
          APICall.getAPIData(url, postData, Config.API_METHOD_TYPE.POST).then(function (response) {
              postData.choice_id = response.data[0].id;
              postData.question = vm.newChoices.question;
              vm.choices.push(postData);
              vm.newChoices = false;
              $timeout(function () {
                vm.choices[vm.choices.length - 1].answerEitor = CKEDITOR.replace('choices_answer_' + vm.choices[vm.choices.length - 1].choice_id);
                vm.choices[vm.choices.length - 1].questionEditor = CKEDITOR.replace('choices_question_' + vm.choices[vm.choices.length - 1].question_id);
                vm.progressbar.complete();
              }, 500);
            },
            function (data, message) {
              vm.newChoices.error = message;
              vm.progressbar.complete();
            });
        },
          function (data, message) {
            vm.newChoices.error = message;
            vm.progressbar.complete();
          });
      };

      /******* ******* Choice End ******* *******/

      /******* ******* Question Start ******* *******/

      vm.showQuestion = function () {
        vm.stage = 'question';
        if (!vm.questionEditor) {
          vm.questionEditor = CKEDITOR.replace('question');
          vm.solutionEditor = CKEDITOR.replace('solution');
          vm.smartSolutionEditor = CKEDITOR.replace('smart_solution');
        }
      };

      vm.saveQuestion = function () {
        vm.progressbar.start();
        vm.question.question = vm.questionEditor.getData();
        vm.question.solution = vm.solutionEditor.getData();
        vm.question.smart_solution = vm.smartSolutionEditor.getData();
        if (!vm.question.passage_id) {
          vm.question.passage_id = null;
        }
        var url = Config.QUESTION_SRV + "questions/" + vm.question.id;
        APICall.getAPIData(url, vm.question, Config.API_METHOD_TYPE.PUT).then(function (response) {
            vm.progressbar.complete();
          },
          function (data, message) {
            vm.question.error = message;
            vm.progressbar.complete();
          });
        if(vm.question.category_type && vm.question.category_type!='practice'){
          for(var i in vm.question.categories){
            if(vm.question.categories == vm.question.category_type){
              return true;
            }
          }
          vm.insertCategory(vm.question.category_type);
        }
      };

      /******* ******* Question End ******* *******/

      /******* ******* Passage Start ******* *******/

      vm.showPassage = function () {
        vm.stage = 'passage';
        if (!vm.passageEditor) {
          vm.passageEditor = CKEDITOR.replace('passage');
        }
        vm.getPassages();
      };
      vm.getPassages = function () {
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + "passages";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.allPassages = response.data;
          vm.progressbar.complete();
        }, function () {
          vm.progressbar.complete();
        });
      };
      vm.changePassage = function () {
        vm.question.passage_id = vm.passage.id;
        vm.saveQuestionToPassage();
      };
      vm.submitPassage = function () {
        vm.passage.content = vm.passageEditor.getData();
        var url = Config.QUESTION_SRV + "passages";
        APICall.getAPIData(url, vm.passage, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.passage.id = response.data[0].id;
          vm.question.passage_id = vm.passage.id;
          vm.saveQuestionToPassage();
        });
      };
      vm.saveQuestionToPassage = function () {
        var url = Config.QUESTION_SRV + "questions/" + vm.question.id;
        APICall.getAPIData(url, vm.question, Config.API_METHOD_TYPE.PUT).then(function (response) {
        });
      };
      vm.removePassage = function () {
        vm.question.passage_id = '';
        vm.saveQuestionToPassage();
      };

      /******* ******* Passage End ******* *******/

      /******* ******* Topic Start ******* *******/

      vm.selectedProducts = [];
      vm.noOfProduct = [];
      vm.mainSkillId = [];
      vm.showTopic = function () {
        vm.stage = 'topic';
        if (vm.noOfProduct.length <= 0)
          vm.getFolder();
      };
      vm.getFolder = function () {
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + 'skillDetails/' + vm.questionId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.mainSkillId = response.data[0].mainSkill;
            var skills = response.data[0].skillDetails
            for (var i in skills) {
              vm.noOfProduct.push(i);
              var array = []
              array.push({
                id: skills[i].product.id,
                name: skills[i].product.name,
                selected: true
              });
              vm.selectedProducts[i] = [];
              vm.selectedProducts[i].push({id: 0, hierarchy: 'Products', items: array});
              for (var j in skills[i].hierarchy) {
                vm.selectedProducts[i].push({
                  id: skills[i].hierarchy[j].id,
                  hierarchy: skills[i].hierarchy[j].name,
                  items: []
                });
              }
              for (var j in vm.selectedProducts[i]) {
                for (var k in skills[i].parents) {
                  if (vm.selectedProducts[i][j].id == skills[i].parents[k].hierarchy_id) {
                    skills[i].parents[k].selected = true;
                    vm.selectedProducts[i][j].items.push(skills[i].parents[k]);
                  }
                }
              }
              if (vm.selectedProducts[i].length > 0) {
                vm.selectedProducts[i][vm.selectedProducts[i].length - 1].multiple = true;
              }
            }
            vm.progressbar.complete();
            var next = vm.noOfProduct.length;
            vm.noOfProduct.push(next);
            vm.getProducts(next);
          },
          function (response) {
            vm.progressbar.complete();
          });
      };

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
          function (response, xhr, status) {
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
            function (data, message) {
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
          function (response) {
            vm.progressbar.complete();
          });
      };
      vm.removeSkill = function (no, lvlKey, itemKey) {
        var url = Config.QUESTION_SRV + 'removeSkill/';
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
          function (response) {
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
      /******* ******* Topic End ******* *******/

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