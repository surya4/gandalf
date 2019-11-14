noonEduController
  .controller('TestEditCtrl', ['$stateParams', '$localStorage', 'Config', '$scope', 'APICall','ngProgressFactory','$state','utilities',
    function ($stateParams, $localStorage, Config, $scope, APICall,ngProgressFactory,$state,utilities) {
      var vm = this;
      vm.authUser = $localStorage.user;
      vm.superAdmin=(vm.authUser.roles.indexOf(1)>-1)?true:false;
      vm.progressbar = ngProgressFactory.createInstance();
      vm.testId=$stateParams.testId;
      vm.getTest = function () {
        var url = Config.TEST_SRV + "tests/"+vm.testId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.test = response.data[0];
          vm.test.test_type_id=vm.test.test_type_id+''
          if(vm.test.product_id){
            vm.getAllFolders();
          }
        });
      };
      vm.getTest();
      vm.getTestTypes = function(){
        var url = Config.TEST_SRV + "testType";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.testTypes = response.data;
        });
      };
      vm.getTestTypes();

      vm.updateTest = function(){
        var url = Config.TEST_SRV + "tests/"+ vm.test.id;
        APICall.getAPIData(url, vm.test, Config.API_METHOD_TYPE.PUT).then(function (response) {
          $state.go('tab.testList');
        });
      };

      vm.getTestSections = function(){
        var url = Config.TEST_SRV + "sectionByTest/"+vm.testId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          for(var i in response.data){
            response.data[i].time_limit=utilities.time2sec(response.data[i].time_limit)/60;
          }
          vm.sections = response.data;
          console.log(vm.sections);
        });
      };
      vm.getTestSections();

      vm.getAllFolders = function(){
        vm.selectedProducts = [];
        vm.selectedProducts[0]={};
        var lvlKey=0;
        var url = Config.FOLDER_SRV + 'folderForProduct/' + vm.test.product_id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.openedProductHierarchy = [];
          var hierarchyLevel=0;
          var parent='';

          vm.selectedProducts[0].folders = response.data[0].folders;
          vm.selectedProducts[0].hierarchies = response.data[0].hierarchy;
          if(vm.test.folder_ids){
            for(var i in response.data[0].folders){
              if(response.data[0].folders[i].id==vm.test.folder_ids.split('.')[0]){
                for (var j in response.data[0].hierarchy){
                  if(response.data[0].hierarchy[j].id == response.data[0].folders[i].hierarchy_id){
                    hierarchyLevel=response.data[0].hierarchy[j].level;
                    parent=vm.test.folder_ids;
                  }
                }
                break;
              }
            }
          }
          for (var i in response.data[0].hierarchy){
            if(response.data[0].hierarchy[i].level>hierarchyLevel){
              vm.openedProductHierarchy.push(response.data[0].hierarchy[i]);

              vm.selectedProducts.push({
                id: response.data[0].hierarchy[i].id,
                hierarchy: response.data[0].hierarchy[i].name,
                items: []
              })
            }
          }

          vm.openedProductHierarchy[0].parent = parent;
          addIntoHierarchy(response.data[0].folders);


          for (var i in response.data[0].folders) {
            if (response.data[0].folders[i].hierarchy_id == vm.selectedProducts[lvlKey + 1].id) {
              vm.selectedProducts[lvlKey + 1].items.push(response.data[0].folders[i]);
            }
          }

        });
      };

      vm.selectedItemChanged = function (resourceType,lvlKey, hierarchyId, itemId, parent) {
        itemId = parseInt(itemId);
        parent = (parent) ? parent : '';

        if(resourceType=='question'){
          vm.questionAlgoFolderId=itemId;
        } else if(resourceType=='flashcard'){
          vm.flashcardAlgoFolderId=itemId;
        }

        for (var i in vm.selectedProducts[lvlKey].items) {
          if (vm.selectedProducts[lvlKey].items[i].id == itemId) {
            vm.selectedProducts[lvlKey].items[i].selected = true;
          } else {
            vm.selectedProducts[lvlKey].items[i].selected = false;
          }
        }
        vm.selectedProducts[lvlKey].toggleMenu = false;
        var folders = vm.selectedProducts[0].folders;
        vm.test.folder_ids = itemId + '.' + parent
        for (var i in vm.selectedProducts) {
          if (i > lvlKey) {
            vm.selectedProducts[i].items = [];
          }
        }
        for (var i in folders) {
          if (folders[i].parent == itemId + '.' + parent) {
            vm.selectedProducts[lvlKey + 1].items.push(folders[i]);
          }
        }
      };

      vm.getSelectedItem = function (lvlKey,item) {
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
        if(lvlKey>1)
          return (string) ? string : 'Choose Or Skip';
        else if(lvlKey==1)
          return (string) ? string : 'Choose Folder'
        else if(lvlKey==0)
          return (string) ? string : 'Choose Product'
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
                  vm.lessonId=folders[a].id;
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
          vm.lessonId=folder.id;
          if(vm.resourceType=='question'){
            vm.allQuestion=[];
            vm.questionPage=1;
            vm.limit=30;
            vm.getQuestions();
          } else if(vm.resourceType=='flashcard') {
            vm.allFlashcards=[];
            vm.page=1;
            vm.limit=30;
            vm.getFlashcards();
          }
        }
        for(var i=index+1;i<vm.openedProductHierarchy.length;i++){
          for(var j in vm.openedProductHierarchy[i].elements){
            if(vm.openedProductHierarchy[i].elements[j].parent==vm.openedProductHierarchy[i].parent){
              vm.openedProductHierarchy[i].folder_id=vm.openedProductHierarchy[i].elements[j].id;
              vm.openedProductHierarchy[i].folder_name=vm.openedProductHierarchy[i].elements[j].name;
              if(vm.openedProductHierarchy[parseInt(i)+1]){
                vm.openedProductHierarchy[parseInt(i)+1].parent=vm.openedProductHierarchy[i].elements[j].id+'.'+vm.openedProductHierarchy[i].elements[j].parent;
              } else{
                vm.lessonId=vm.openedProductHierarchy[i].elements[j].id;
                if(vm.resourceType=='question'){
                  vm.allQuestion=[];
                  vm.questionPage=1;
                  vm.limit=30;
                  vm.getQuestions();
                } else if(vm.resourceType=='flashcard') {
                  vm.allFlashcards=[];
                  vm.page=1;
                  vm.limit=30;
                  vm.getFlashcards();
                }
              }
              break;
            }
          }
        }
      };

      vm.saveSection = function(name){
        var url = Config.TEST_SRV + "testSection";
        APICall.getAPIData(url, {
          name:name,
          order:vm.sections.length+1,
          test_id:vm.testId
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.sections.push({
            id:response.data[0].id,
            name:name,
            order:vm.sections.length+1,
            test_id:vm.testId
          });
          vm.newSectionName='';
        });
      };

      vm.updateSection = function(section){
        var url = Config.TEST_SRV + "testSection/"+section.id;
        APICall.getAPIData(url,  {name:section.name,order:section.order,time_limit:section.time_limit}, Config.API_METHOD_TYPE.PUT).then(function (response) {
          section.editable=false;
        });
      };

      vm.resourceId='';
      vm.resourceType='';
      vm.sectionId='';
      vm.algo='';

			vm.viewSectionResources = function(resourceType,section){
        vm.sectionId=section.id;
        vm.resourceType=resourceType;
        vm.resourceId='';
        vm.algo='';
        vm.questionAlgo='';
        vm.flashcardAlgo='';

				vm.questionExists = [];
        vm.flashcardExists = [];
        if(vm.resourceType=='question')
          vm.showQuestionBox = true;
        else if(vm.resourceType=='flashcard')
          vm.showFlashcardBox = true;
        var url = Config.TEST_SRV + "sectionAlgo/" + section.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.algos = response.data;
          for(var i in vm.algos){
            if(vm.algos[i].resource_type=='question'){
              vm.questionAlgo=vm.algos[i].algo;
            } else if(vm.algos[i].resource_type=='flashcard'){
              vm.flashcardAlgo=vm.algos[i].algo;
            }
          }
        });

        var url2 = Config.TEST_SRV + "sectionResource/" + section.id;
        APICall.getAPIData(url2, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.questionExists = response.data[0].questions;
          vm.flashcardExists = response.data[0].flashcards;
          vm.questionExistsIndex = 0;
          vm.flashcardExistsIndex = 0;
          if(vm.resourceType=='question'){
            vm.allQuestion=[];
            vm.questionPage=1;
            vm.limit=30;
            vm.getQuestions();
          } else if(vm.resourceType=='flashcard') {
            vm.allFlashcards=[];
            vm.page=1;
            vm.limit=30;
            vm.getFlashcards();
          }
        });
        for (var i in vm.selectedProducts) {
          for (var j in vm.selectedProducts[i].items) {
            vm.selectedProducts[i].items[j].selected = false;
          }
        }
			};

      vm.getQuestions = function () {
        if(vm.lessonId){
          var url = Config.QUESTION_SRV + "questionList/" + vm.lessonId;
        } else {
          var url = Config.QUESTION_SRV + "questions"
            + '?page=' + vm.questionPage
            + '&limit=' + vm.limit;
        }
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          if (response.data.length <= 0) {
            vm.finished = true;
          }
          for (var i in response.data) {
            vm.allQuestion.push(response.data[i]);
          }
          for (var i in vm.questionExists) {
            for (var j in vm.allQuestion) {
              if (vm.questionExists[i].id == vm.allQuestion[j].id) {
                vm.allQuestion[j].selected = true;
              }
            }
          }
        });
      };
      vm.getMoreQuestion = function (){
        vm.questionPage++;
        vm.getQuestions();
      }

      vm.getFlashcards = function () {
        vm.allFlashcards=[];
        if(vm.lessonId){
          var url = Config.FLASHCARD_SRV + "flashcardImagesByLeafId/" + vm.lessonId;
        } else {
          var url = Config.FLASHCARD_SRV + "flashcardList"
            + '?page=' + vm.page
            + '&limit=' + vm.limit;
        }
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          if (response.data.length <= 0) {
            vm.finished = true;
          }
          for (var i in response.data) {
            vm.allFlashcards.push(response.data[i]);
          }
          for (var i in vm.flashcardExists) {
            for (var j in vm.allFlashcards) {
              if (vm.flashcardExists[i].id == vm.allFlashcards[j].id) {
                vm.allFlashcards[j].selected = true;
              }
            }
          }
        });
      };
      vm.getMoreFlashcard = function (){
        vm.page++;
        vm.getFlashcards();
      }
      vm.addAlgo = function(resourceType,algo){
        var url = Config.TEST_SRV + "sectionAlgo";
        APICall.getAPIData(url, {
          test_section_id:vm.sectionId,
          algo:algo,
          resource_type:resourceType
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.algo='';
          if(resourceType=='question'){
            vm.questionAlgo=algo;
          } else if(resourceType=='flashcard'){
            vm.flashcardAlgo=algo;
          }
        });
      };

			vm.nextQuestion = function () {
        vm.questionExistsIndex++;
        if (vm.questionExistsIndex >= vm.questionExists.length) {
          vm.questionExistsIndex = 0;
        }
      };

      vm.prevQuestion = function () {
        vm.questionExistsIndex--;
        if (vm.questionExistsIndex < 0) {
          vm.questionExistsIndex = vm.questionExists.length - 1;
        }
      };

      vm.addResource = function (resourceType,resource) {
        var url = Config.TEST_SRV + "sectionResource";
        APICall.getAPIData(url, {
          test_section_id:vm.sectionId,
          resource_id:resource.id,
          folder_id:vm.lessonId,
          order:vm.questionExists.length+vm.flashcardExists.length+1,
          resource_type:resourceType
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
          resource.selected = true;
          if(resourceType=='question'){
            vm.questionExists.push(resource);
            vm.questionExistsIndex = vm.questionExists.length - 1;
          } else {
            vm.flashcardExists.push(resource);
            vm.flashcardExistsIndex = vm.questionExists.length - 1;
          }
        });
      };

      vm.removeResource = function (resourceType,resource) {
        var url = Config.TEST_SRV + "sectionResource";
        APICall.getAPIData(url, {
          test_section_id:vm.sectionId,
          resource_id:resource.id,
          resource_type:resourceType
        }, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          if(resourceType=='question'){
            for (var j in vm.allQuestion) {
              if (vm.allQuestion[j].id == resource.id) {
                vm.allQuestion[j].selected = false;
                break;
              }
            }
            vm.questionExists.splice(vm.questionExistsIndex, 1);
            vm.questionExistsIndex = 0;
          } else  if(resourceType=='flashcard'){
            for (var j in vm.allFlashcards) {
              if (vm.allFlashcards[j].id == resource.id) {
                vm.allFlashcards[j].selected = false;
                break;
              }
            }
            vm.flashcardExists.splice(vm.flashcardExistsIndex, 1);
            vm.flashcardExistsIndex = 0;
          }
        });
      };

      vm.toggleResource = function (resourceType,resource) {
        if(resource.selected){
          vm.removeResource(resourceType,resource);
        } else {
          vm.addResource(resourceType,resource);
        }
      };

      vm.closeResourceBox = function () {
        vm.questionExists = [];
        vm.showQuestionBox = false;
        vm.flashcardExists = [];
        vm.showFlashcardBox = false;
        vm.resourceId='';
        vm.resourceType='';
        vm.sectionId='';
        vm.algo='';
      };

    }]);
