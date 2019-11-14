noonEduController
  .controller('FlashcardCreateCtrl', ['$localStorage', 'Config', '$scope', 'APICall', 'ngProgressFactory',
    function ($localStorage, Config, $scope, APICall, ngProgressFactory) {
      var vm = this;
      vm.authUser = $localStorage.user;
      vm.flashcard = {};
      vm.progressbar = ngProgressFactory.createInstance();

      vm.selectedProducts = [];
      vm.createFlashcard = function () {
        vm.progressbar.start();
        var url = Config.FLASHCARD_SRV + 'flashcard';
        var method = Config.API_METHOD_TYPE.POST;
        if (vm.flashcard.id) {
          method = Config.API_METHOD_TYPE.PUT;
          url = Config.FLASHCARD_SRV + 'flashcard/' + vm.flashcard.id;
        }
        APICall.getAPIData(url, vm.flashcard, method).then(function (response) {
            if (!vm.flashcard.id) {
              vm.flashcard.id = response.data[0].id;
              vm.getProducts();
            }
            vm.progressbar.complete();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      }
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
          },
          function (response) {

          });
      };
      vm.selectedItemChanged = function (lvlKey, hierarchyId, itemId, parent) {
        itemId = parseInt(itemId);
        parent = (parent) ? parent : '';
        for (var i in vm.selectedProducts[lvlKey].items) {
          if (vm.selectedProducts[lvlKey].items[i].id == itemId) {
            vm.selectedProducts[lvlKey].items[i].selected = true;
          } else {
            vm.selectedProducts[lvlKey].items[i].selected = false;
          }
        }
        if (hierarchyId == 0) {
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
        } else {
          vm.selectedProducts[lvlKey].toggleMenu = false;
          var folders = vm.selectedProducts[0].folders;
          console.log(vm.selectedProducts,lvlKey);
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
            vm.flashcard.folder_ids = itemId + '.' + parent
            var url = Config.FLASHCARD_SRV + 'flashcard/' + vm.flashcard.id;
            APICall.getAPIData(url, vm.flashcard, Config.API_METHOD_TYPE.PUT).then(function (response) {
                vm.progressbar.complete();
              },
              function (response, xhr, status) {
                vm.progressbar.complete();
              });
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
        var fd = new FormData();
        fd.append("destination", 'images/uploads/flashcard');
        fd.append("user_id", vm.authUser.id);
        fd.append("fileUpl", vm.images[index].file, vm.images[index].file.name);
        var url = Config.FILE_SRV + "files/";
        //uploading in s3
        APICall.getAPIData(url, fd, Config.API_METHOD_TYPE.POST, 'false').then(function (response) {
            vm.images[index].image_uri = response.data[0];
            vm.images[index].image_thumbnail_uri = response.meta.thumbnail_url;
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
          },
          function (response) {
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
              console.log(vm.images);
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
    }]);
