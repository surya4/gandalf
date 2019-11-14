noonEduController
  .controller('FlashcardEditCtrl', ['$stateParams', '$localStorage', 'Config', '$scope', 'APICall', 'ngProgressFactory','File',
    function ($stateParams, $localStorage, Config, $scope, APICall, ngProgressFactory,FileService) {
      var vm = this;
      vm.authUser = $localStorage.user;
      vm.flashcard = {
        id: $stateParams.flashcardId
      };
      vm.progressbar = ngProgressFactory.createInstance();
      vm.getFlashCard = function () {
        url = Config.FLASHCARD_SRV + 'flashcard/' + vm.flashcard.id;
        APICall.getAPIData(url, vm.flashcard, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.flashcard = response.data[0];
            vm.progressbar.complete();
            vm.getProducts();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      }
      vm.getFlashCard();
      vm.selectedProducts = [];
      vm.getProducts = function () {
        var url = Config.FOLDER_SRV + 'products';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          var array = []
          for (var i in response.data) {
            array.push({
              id: response.data[i].id,
              name: response.data[i].name
            });
          }
          vm.selectedProducts = [];
          vm.selectedProducts.push({id: 0, hierarchy: 'Products', items: array});

          if(vm.flashcard.product_id){
            for (var i in vm.selectedProducts[0].items) {
              if (vm.selectedProducts[0].items[i].id == parseInt(vm.flashcard.product_id)) {
                vm.selectedProducts[0].items[i].selected = true;
                break;
              }
            }
            vm.getFolderForProduct();
          }
        });
      };

      vm.getFolderForProduct = function () {
        var url = Config.FOLDER_SRV + 'folderForProduct/' + vm.flashcard.product_id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.selectedProducts[0].folders = response.data[0].folders;
          vm.selectedProducts[0].hierarchies = response.data[0].hierarchy;
          for (var i in response.data[0].hierarchy) {
            vm.selectedProducts.push({
              id: response.data[0].hierarchy[i].id,
              hierarchy: response.data[0].hierarchy[i].name,
              items: []
            })
          }
          //removing last leave and adding them in skills
          vm.selectedProducts[vm.selectedProducts.length - 1].multiple = true;
          vm.selectedProductLeafHierarchy = vm.selectedProducts[vm.selectedProducts.length - 1];
          vm.selectedProducts.length = vm.selectedProducts.length - 1;

          for (var i in response.data[0].folders) {
            if (response.data[0].folders[i].hierarchy_id == vm.selectedProducts[1].id) {
              vm.selectedProducts[1].items.push(response.data[0].folders[i]);
            }
          }
          var folderIds = vm.flashcard.folder_ids.split('.').reverse();
          folderIds.shift()
          for (var i = 1; i < vm.selectedProducts.length; i++) {
            for (var j in vm.selectedProducts[0].folders) {
              if (vm.selectedProducts[0].folders[j].id == parseInt(folderIds[i - 1])) {
                vm.selectedItemChanged(i, 99, vm.selectedProducts[0].folders[j].id, vm.selectedProducts[0].folders[j].parent);
              }
            }
          }
          vm.getImages();
        });
      };

      vm.getImages = function () {
        url = Config.FLASHCARD_SRV + 'flashcardImages/' + vm.flashcard.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            response.data.sort(function(a, b) {
              if (a.leaf_folder_id < b.leaf_folder_id) {
                return -1;
              } else if (a.leaf_folder_id > b.leaf_folder_id) {
                return 1;
              }
              if (a.leaf_folder_id = b.leaf_folder_id) {
                if (a.order < b.order) {
                  return -1;
                } else if (a.order > b.order) {
                  return 1;
                }
              }
              return 0;
            });
            vm.images = response.data;
            for (var i in vm.images) {
              for (var j in vm.selectedProductsSkills) {
                if (vm.images[i].leaf_folder_id == vm.selectedProductsSkills[j].id) {
                  vm.images[i].skill = vm.selectedProductsSkills[j];
                }
              }
            }
            vm.progressbar.complete();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      };

      vm.selectedItemChanged = function (lvlKey, hierarchyId, itemId, parent) {
        if(hierarchyId == 0 && !vm.flashcard.product_id) {
          var temp = vm.selectedProducts[0]
          vm.selectedProducts = [];
          vm.selectedProducts.push(temp);
          var url = Config.FOLDER_SRV + 'folderForProduct/' + itemId;
          vm.flashcard.product_id = itemId;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              vm.selectedProducts[0].folders = response.data[0].folders;
              vm.selectedProducts[0].hierarchies = response.data[0].hierarchy;
              for (var i in response.data[0].hierarchy) {
                vm.selectedProducts.push({
                  id: response.data[0].hierarchy[i].id,
                  hierarchy: response.data[0].hierarchy[i].name,
                  items: []
                })
              }
              //removing last leave and adding them in skills
              vm.selectedProducts[vm.selectedProducts.length - 1].multiple = true;
              vm.selectedProductLeafHierarchy = vm.selectedProducts[vm.selectedProducts.length - 1];
              vm.selectedProducts.length = vm.selectedProducts.length - 1;

              for (var i in response.data[0].folders) {
                if (response.data[0].folders[i].hierarchy_id == vm.selectedProducts[lvlKey + 1].id) {
                  vm.selectedProducts[lvlKey + 1].items.push(response.data[0].folders[i]);
                }
              }
              vm.selectedProducts[lvlKey].toggleMenu = false;
            },
            function (data) {
              vm.selectedProducts[lvlKey].toggleMenu = false;
            });
        } else if (hierarchyId == 0 && vm.flashcard.product_id) {
          alert('cant change product');
        } else {
          itemId = parseInt(itemId);
          parent = (parent) ? parent : '';
          for (var i in vm.selectedProducts[lvlKey].items) {
            if (vm.selectedProducts[lvlKey].items[i].id == itemId) {
              vm.selectedProducts[lvlKey].items[i].selected = true;
            } else {
              vm.selectedProducts[lvlKey].items[i].selected = false;
            }
          }
          vm.selectedProducts[lvlKey].toggleMenu = false;
          var folders = vm.selectedProducts[0].folders;
          if (!vm.selectedProducts[lvlKey + 1]) {
            vm.selectedProductsSkills = [];
            for (var i in folders) {
              if (folders[i].parent == itemId + '.' + parent) {
                vm.selectedProductsSkills.push(folders[i]);
              }
            }
            if (vm.selectedProductsSkills.length <= 0) {
              alert('has no skills')
            }
            vm.progressbar.start();
            if (vm.flashcard.folder_ids != itemId + '.' + parent) {
              vm.flashcard.folder_ids = itemId + '.' + parent
              var url = Config.FLASHCARD_SRV + 'flashcard/' + vm.flashcard.id;
              APICall.getAPIData(url, vm.flashcard, Config.API_METHOD_TYPE.PUT).then(function (response) {
                  vm.progressbar.complete();
                },
                function (response, xhr, status) {
                  vm.progressbar.complete();
                });
            }
            return false;
          }
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
        }
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

      vm.updateFlashcard = function () {
        vm.progressbar.start();
        url = Config.FLASHCARD_SRV + 'flashcard/' + vm.flashcard.id;
        APICall.getAPIData(url, vm.flashcard, Config.API_METHOD_TYPE.PUT).then(function (response) {
            if (!vm.flashcard.id) {
              vm.flashcard.id = response.data[0].id;
            }
            vm.progressbar.complete();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      }

      vm.images = [];
      vm.imageAdded = function () {
        var lastIndex = vm.images.length - 1;
        vm.images[lastIndex].skill = {};
        vm.images[lastIndex].order = vm.images.length;
        vm.images[lastIndex].flashcard_id = vm.flashcard.id;
        vm.uploadImage(lastIndex)
      };

      vm.uploadImage = function (index) {
        vm.progressbar.start();
        FileService.uploadImage(vm.images[index],'flashcards','').then(function (data) {
          console.log(data);
          vm.images[index].image_uri = data.image_uri;
          vm.images[index].image_thumbnail_uri = data.image_thumbnail_uri;
          //saving in db
          var url = Config.FLASHCARD_SRV + "flashcardImages";
          var data={image_uri: vm.images[index].image_uri,
            image_thumbnail_uri:vm.images[index].image_thumbnail_uri,
            order:vm.images[index].order,
            flashcard_id:vm.images[index].flashcard_id,
            leaf_folder_id:vm.images[index].leaf_folder_id,
            name:vm.images[index].name
          };
          APICall.getAPIData(url, data , Config.API_METHOD_TYPE.POST).then(function (response) {
              vm.images[index].id = response.data[0].id;
              vm.progressbar.complete();
            },
            function (response) {
              vm.progressbar.complete();
            });
        }).catch(function () {
          vm.images.splice(index, 1);
          vm.progressbar.complete();
        });
      };

      vm.click = function () {
        document.getElementById('photo').click();
        $scope.clicked = true;
      };
      vm.readURL = function (input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $scope.$apply(function () {
              vm.images.push({
                data: e.target.result,
                name: input.files[0].name,
                type: input.files[0].type,
                size: Math.ceil(input.files[0].size / 1000),
                file: input.files[0]
              });
              vm.imageAdded();
              return true;
            });
          };
          reader.readAsDataURL(input.files[0]);
        }
      };
      vm.selectSkill = function (image, skill) {
        vm.progressbar.start();
        image.toggleMenu = false;
        image.skill = skill;
        image.leaf_folder_id = skill.id;
        vm.updateImage(image);
      };
      vm.moveRight = function (image) {
        if (image.order > 1) {
          for (var i in vm.images) {
            if (vm.images[i].order == image.order - 1) {
              vm.images[i].order = image.order;
              image.order = image.order - 1;
              vm.updateImage(image);
              vm.updateImage(vm.images[i]);
            }
          }
          vm.images.sort(function compare(a, b) {
            if (a.order < b.order) return -1;
            if (a.order > b.order) return 1;
            return 0;
          });
        }
      };
      vm.updateImage = function (image) {
        var url = Config.FLASHCARD_SRV + "flashcardImages/" + image.id;
        var data={image_uri: image.image_uri,
          image_thumbnail_uri:image.image_thumbnail_uri,
          order:image.order,
          flashcard_id:image.flashcard_id,
          leaf_folder_id:image.leaf_folder_id,
          name:image.name
        };
        APICall.getAPIData(url, data, Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.images.sort(function compare(a, b) {
            if (a.order < b.order) return -1;
            if (a.order > b.order) return 1;
            return 0;
          });
        });
      }
      vm.moveLeft = function (image) {
        if (image.order < vm.images.length) {
          for (var i in vm.images) {
            if (vm.images[i].order == image.order + 1) {
              vm.images[i].order = image.order;
              image.order = image.order + 1;
              vm.updateImage(image);
              vm.updateImage(vm.images[i]);
            }
          }
          vm.images.sort(function compare(a, b) {
            if (a.order < b.order) return -1;
            if (a.order > b.order) return 1;
            return 0;
          });
        }
      };
      vm.addingQuestions = function (image) {
        vm.questionExists = [];
        vm.showQuestionBox = true;
        vm.addQuestionImage = image;
        var url = Config.FLASHCARD_SRV + "flashcardImagesQuestion/" + image.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.questionExists = response.data;
          vm.questionExistsIndex = 0;
          vm.getQuestions();
        });
      };
      vm.nextQuestion = function () {
        vm.questionExistsIndex++;
        if (vm.questionExistsIndex >= vm.questionExists.length) {
          vm.questionExistsIndex = 0;
        }
      }
      vm.prevQuestion = function () {
        vm.questionExistsIndex--;
        if (vm.questionExistsIndex < 0) {
          vm.questionExistsIndex = vm.questionExists.length - 1;
        }
      }

      vm.page = 1;
      vm.limit = 20;
      vm.order = 'DESC';
      vm.orderBy = 'updated_at';
      vm.allQuestion = [];
      vm.finished = false;

      vm.getQuestions = function () {
        var url = Config.QUESTION_SRV + "questionList/" + vm.addQuestionImage.leaf_folder_id;
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

      vm.reachedBottom = function () {
        if (!vm.finished) {
          vm.page++;
          vm.getQuestions();
        }
      }

      vm.addQuestion = function (question) {
        var url = Config.FLASHCARD_SRV + "flashcardImagesQuestion";
        APICall.getAPIData(url, {
          flashcard_image_id: vm.addQuestionImage.id,
          question_id: question.id
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
          question.selected = true;
          vm.questionExists.push(question);
          vm.questionExistsIndex = vm.questionExists.length - 1
        });
      };

      vm.removeQuestion = function () {
        var url = Config.FLASHCARD_SRV + "flashcardImagesQuestion/";
        APICall.getAPIData(url, {
          flashcard_image_id: vm.addQuestionImage.id,
          question_id: vm.questionExists[vm.questionExistsIndex].id
        }, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          for (var j in vm.allQuestion) {
            if (vm.allQuestion[j].id == vm.questionExists[vm.questionExistsIndex].id) {
              vm.allQuestion[j].selected = false;
              break;
            }
          }
          vm.questionExists.splice(vm.questionExistsIndex, 1);
          vm.questionExistsIndex = 0;
        });
      };
      vm.closeQuestionBox = function () {
        vm.questionExists = [];
        vm.showQuestionBox = false;
        vm.addQuestionImage = '';
      }

      var inputId=0;
      vm.reUploadPic = function (image) {
        inputId++;
        var input=document.createElement('input');
        input.type="file";
        input.name='flashcard_pic';
        input.id='flashcard_pic_'+inputId;
        input.style.display='hidden';
        document.body.appendChild(input);
        var element=document.getElementById('flashcard_pic_'+inputId);
        element.click();
        element.onchange=function(){
          vm.reUploadPicReadURL(this,image);
        }
      }
      vm.reUploadPicReadURL = function (input,flashcardImage) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $scope.$apply(function () {
              var image={
                data: e.target.result,
                name: input.files[0].name,
                type: input.files[0].type,
                size: Math.ceil(input.files[0].size / 1000),
                file: input.files[0]
              };
              FileService.uploadImage(image,'flashcards','re_').then(function (data) {
                flashcardImage.image_uri = data.image_uri;
                flashcardImage.image_thumbnail_uri = data.image_thumbnail_uri;
                vm.updateImage(flashcardImage);
              });
              return true;
            });
          };
          reader.readAsDataURL(input.files[0]);
        }
      };

    }]);
