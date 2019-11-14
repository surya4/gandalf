noonEduController
  .controller('FolderCtrl', ['APICall', 'Config', '$rootScope', 'ngProgressFactory','File','$scope',
    function (APICall, Config, $rootScope, ngProgressFactory,File,$scope) {
      var vm = this;
      vm.folder = [];
      vm.progressbar = ngProgressFactory.createInstance();

      vm.getProducts = function () {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'products';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            for (var i in response.data) {
              vm.folder.push({
                id: response.data[i].id,
                customId: 'P_' + response.data[i].id,
                name: response.data[i].name,
                hidden: response.data[i].hidden,
                slug: response.data[i].slug,
                hierarchy: '',
                image_uri: response.data[i].image_uri,
                image_thumbnail_uri: response.data[i].image_thumbnail_uri,
                nodes: []
              });
            }
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };
      vm.getProducts();
      vm.openedProduct = '';
      vm.openedProductHierarchy = '';
      vm.openProduct = function (level, key, array) {
        removeActiveClass(array);
        array[key].selected = true;
        vm.subLvls.length = level;
        vm.subLvls.push(array[key]);
        array[key].nodes = [];
        vm.openedProduct = array[key];
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'folderForProduct/' + array[key].id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.openedProductHierarchy = response.data[0].hierarchy;
            convertFolderArrayToObject(response.data[0].folders, array[key], '', 0);
            vm.progressbar.complete();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      };
      var convertFolderArrayToObject = function (folders, obj, parent, level) {
        obj.hierarchy = vm.openedProductHierarchy[level];
        if (folders.length <= 0) {
          return true;
        }
        var idsToRemove = [];
        for (var i in folders) {
          var foldersParent = (folders[i].parent) ? folders[i].parent : '';
          if (foldersParent == parent) {
            obj.nodes.push({
              id: folders[i].id,
              customId: 'T_' + folders[i].id,
              name: folders[i].name,
              hidden: folders[i].hidden,
              slug: folders[i].slug,
              parent: folders[i].parent,
              order: folders[i].order,
              image_uri: folders[i].image_uri,
              image_thumbnail_uri: folders[i].image_thumbnail_uri,
              hierarchy: {},
              nodes: []
            });
            idsToRemove.push(folders[i].id);
          }
        }
        for (var i in idsToRemove) {
          for (var i in folders) {
            if (folders[i].id == idsToRemove[i]) {
              folders.splice(i, 1);
              break;
            }
          }
        }
        obj.nodes.sort(function compare(a, b) {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
        for (var i in obj.nodes) {
          newParent = obj.nodes[i].id + '.' + ((obj.nodes[i].parent) ? (obj.nodes[i].parent) : '');
          convertFolderArrayToObject(folders, obj.nodes[i], newParent, level + 1);
        }
      };

      vm.addProduct = function (productName) {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'products';
        APICall.getAPIData(url, {name: productName}, Config.API_METHOD_TYPE.POST).then(function (response) {
            vm.folder.push({
              id: response.data[0].id,
              customId: 'P_' + response.data[0].id,
              name: productName,
              hierarchy: '',
              nodes: []
            });
            vm.addingProduct = false;
            vm.progressbar.complete();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      };
      vm.addFolder = function (lvlKey, folderName) {
        var url = Config.FOLDER_SRV + 'folders';
        var data = {
          name: folderName,
          hierarchy_id: vm.subLvls[lvlKey].hierarchy.id,
          parent: null,
          order: (vm.subLvls[lvlKey].nodes.length + 1)
        };
        if (vm.subLvls[lvlKey].customId !== vm.openedProduct.customId) {
          data.parent = vm.subLvls[lvlKey].id + '.' + ((vm.subLvls[lvlKey].parent) ? vm.subLvls[lvlKey].parent : '');
        }
        vm.progressbar.start();
        APICall.getAPIData(url, data, Config.API_METHOD_TYPE.POST).then(function (response) {
            var hierarchy = vm.openedProductHierarchy[lvlKey + 1];
            if (vm.subLvls[lvlKey].nodes.length > 0) {
              for (var i in vm.subLvls[lvlKey].nodes) {
                if (vm.subLvls[lvlKey].nodes[i].hierarchy) {
                  hierarchy = vm.subLvls[lvlKey].nodes[i].hierarchy;
                  break;
                }
              }
            }
            vm.subLvls[lvlKey].nodes.push({
              id: response.data[0].id,
              customId: 'T_' + response.data[0].id,
              name: data.name,
              parent: data.parent,
              hidden: data.hidden,
              slug: data.slug,
              order: data.order,
              hierarchy: hierarchy,
              nodes: []
            });
            vm.folderName = "";
            vm.subLvls[lvlKey].addingFolder = false;
            vm.progressbar.complete();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      };
      vm.addHierarchy = function (lvlKey, nextHierarchyName) {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'hierarchy';
        APICall.getAPIData(url, {
          name: nextHierarchyName,
          product_id: vm.openedProduct.id
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
            vm.openedProductHierarchy.push({
              id: response.data[0].id,
              name: nextHierarchyName,
              product_id: vm.openedProduct.id,
              order: vm.openedProductHierarchy.length + 1
            });
            addHierarchyToAllFolder(vm.folder, 0);
            vm.nextHierarchyName = '';
            vm.progressbar.complete();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      };
      var addHierarchyToAllFolder = function (folder, level) {
        for (var i in folder) {
          folder[i].hierarchy = vm.openedProductHierarchy[level];
          addHierarchyToAllFolder(folder[i].nodes, (level + 1));
        }
      }
      vm.onDrop = function ($event, $data, lvlNum) {
        if ($data[1].nodes[$data[0]].rename) {
          alert('please rename first, or press esc to cancel');
          return false;
        }
        if (checkIfChild($data[1].nodes[$data[0]], vm.subLvls[lvlNum]))
          return false;
        for (var i in vm.subLvls[lvlNum].nodes) {
          if (vm.subLvls[lvlNum].nodes[i].customId == $data[1].nodes[$data[0]].customId) {
            return false;
          }
        }
        var arrayToUpdate = [];
        findAndRemove(vm.folder, $data[1].nodes[$data[0]].customId, arrayToUpdate);
        findAndEnter(vm.folder, vm.subLvls[lvlNum].customId, $data[1].nodes[$data[0]], 1, arrayToUpdate);
        vm.subLvls.length = lvlNum + 1;

        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'folders';
        APICall.getAPIData(url, arrayToUpdate, Config.API_METHOD_TYPE.PUT).then(function (response) {
            vm.progressbar.complete();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      };

      var checkIfChild = function (source, target) {
        if (source.customId == target.customId)
          return true;
        for (var i in source.nodes) {
          return checkIfChild(source.nodes[i], target);
        }
      };
      var findAndEnter = function (mainFolder, customId, folder, level, arrayToUpdate) {
        if (mainFolder.length <= 0)
          return false;
        for (var i in mainFolder) {
          if (mainFolder[i].customId == customId) {
            folder.hierarchy = vm.openedProductHierarchy[level];
            mainFolder[i].nodes.push(folder);
            if (level == 1)
              var parent = '';
            else {
              var parent = mainFolder[i].id + '.' + ((mainFolder[i].parent) ? mainFolder[i].parent : '');
            }
            folder.parent = parent;
            arrayToUpdate.push({
              id: folder.id,
              hierarchy_id: vm.openedProductHierarchy[level - 1].id,
              order: mainFolder[i].nodes.length,
              parent: parent
            });
            correctHierarchyAndParent(folder, level + 1, arrayToUpdate, parent);
            return true;
          } else {
            findAndEnter(mainFolder[i].nodes, customId, folder, level + 1, arrayToUpdate);
          }
        }
      };
      var correctHierarchyAndParent = function (folder, level, arrayToUpdate, parent) {
        for (var i in folder.nodes) {
          if (folder.nodes[i].id) {
            var newParent = folder.id + '.' + ((parent) ? parent : '');
            folder.nodes[i].hierarchy = vm.openedProductHierarchy[level];
            folder.nodes[i].parent = parent;
            arrayToUpdate.push({
              id: folder.nodes[i].id,
              hierarchy_id: vm.openedProductHierarchy[level - 1].id,
              parent: newParent
            });
            correctHierarchyAndParent(folder.nodes[i], level + 1, arrayToUpdate, newParent);
          }
        }
      };

      vm.rightClick = function (type, data, level, $event) {
        vm.rightClickStyle = {
          'position': 'fixed',
          'left': $event.clientX + 'px',
          'top': $event.clientY + 'px'
        };
        vm.rightClickType = type;
        vm.rightClickedObjLvl = level;
        vm.rightClickedObj = data;
      };

      var inputId=1;

      angular.element(document.body).on('click', function (e) {
        if (vm.rightClickedObj) {
          var element = angular.element(e.target);
          if (element.length <= 0
            || ('folder_' + element[0].id != vm.rightClickedObj.id
            && element[0].id != 'folder_rename'
            && element[0].id != 'folder_delete'
            && element[0].id != 'folder_upload_img_'+inputId)) {
            $rootScope.$apply(function () {
              vm.rightClickType = '';
              vm.rightClickedObjLvl = '';
              vm.rightClickedObj = '';
            });
          }
        }
      });

      var findAndRemove = function (mainFolder, customId, arrayToUpdate) {
        if (mainFolder.length <= 0)
          return false;
        var found = false;
        for (var i in mainFolder) {
          if (mainFolder[i].customId == customId) {
            mainFolder.splice(i, 1);
            found = true;
            break;
          } else {
            findAndRemove(mainFolder[i].nodes, customId, arrayToUpdate);
          }
        }
        if (found) {
          var order = 1;
          for (var i in mainFolder) {
            if (mainFolder[i].order != order) {
              mainFolder[i].order = order;
              arrayToUpdate.push({
                id: mainFolder[i].id,
                order: mainFolder[i].order
              });
            }
            order++;
          }
          folderSort(mainFolder)
          return true;
        }
      };
      var folderSort = function (folders) {
        folders.sort(function compare(a, b) {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
      }
      vm.subLvls = [];
      vm.openSubLevel = function (level, key, array) {
        removeActiveClass(array);
        array[key].selected = true;
        vm.subLvls.length = level;
        vm.subLvls.push(array[key]);
      };
      var removeActiveClass = function (array) {
        if (array.length <= 0)
          return true;
        for (var i in array) {
          array[i].selected = false;
          removeActiveClass(array[i].nodes);
        }
      };
      vm.moveFolderUp = function (lvlKey, key, anme) {
        var currOrder = parseInt(vm.subLvls[lvlKey].nodes[key].order);
        if (currOrder > 1 && !vm.movingUp) {
          vm.movingUp = true;
          vm.progressbar.start();
          var arrayToUpdate = [];
          for (var i in vm.subLvls[lvlKey].nodes) {
            if (vm.subLvls[lvlKey].nodes[i].order == currOrder - 1) {
              arrayToUpdate = [{
                id: vm.subLvls[lvlKey].nodes[i].id,
                order: currOrder
              }, {
                id: vm.subLvls[lvlKey].nodes[key].id,
                order: currOrder - 1
              }];
              var url = Config.FOLDER_SRV + 'folders';
              APICall.getAPIData(url, arrayToUpdate, Config.API_METHOD_TYPE.PUT).then(function (response) {
                  vm.subLvls[lvlKey].nodes[i].order = currOrder;
                  vm.subLvls[lvlKey].nodes[key].order = currOrder - 1;
                  folderSort(vm.subLvls[lvlKey].nodes);
                  vm.progressbar.complete();
                  vm.movingUp = false;
                },
                function (response) {
                  vm.progressbar.complete();
                  vm.movingUp = false;
                });
              break;
            }
          }
        }
      }
      vm.moveFolderDown = function (lvlKey, key) {
        var currOrder = parseInt(vm.subLvls[lvlKey].nodes[key].order);
        if (currOrder < vm.subLvls[lvlKey].nodes.length && !vm.movingUp) {
          vm.movingUp = true;
          vm.progressbar.start();
          var arrayToUpdate = [];
          for (var i in vm.subLvls[lvlKey].nodes) {
            if (vm.subLvls[lvlKey].nodes[i].order == currOrder + 1) {
              arrayToUpdate = [{
                id: vm.subLvls[lvlKey].nodes[i].id,
                order: currOrder
              }, {
                id: vm.subLvls[lvlKey].nodes[key].id,
                order: currOrder + 1
              }];
              var url = Config.FOLDER_SRV + 'folders';
              APICall.getAPIData(url, arrayToUpdate, Config.API_METHOD_TYPE.PUT).then(function (response) {
                  vm.subLvls[lvlKey].nodes[i].order = currOrder;
                  vm.subLvls[lvlKey].nodes[key].order = currOrder + 1;
                  folderSort(vm.subLvls[lvlKey].nodes);
                  vm.progressbar.complete();
                  vm.movingUp = false;
                },
                function (response) {
                  vm.progressbar.complete();
                  vm.movingUp = false;
                });
              break;
            }
          }
        }
      }
      vm.renameFolder = function () {
        vm.rightClickedObj.rename = true;
        if (vm.rightClickType == 'folder') {
          vm.renameObj = vm.rightClickedObj;
        } else if (vm.rightClickType == 'hierarchy') {
          vm.renameHierarchy = vm.rightClickedObj;
        }
        vm.rightClickedObj = '';
      };

      vm.changeSlug = function () {
        vm.rightClickedObj.changeSlug = true;
        vm.changeSlugObj = vm.rightClickedObj;
        vm.rightClickedObj = '';
      };
      vm.unChangeSlug= function (folder) {
        vm.changeSlugObj.changeSlug = false;
        vm.changeSlugObj = '';
      };
      vm.slugChanged = function (folder) {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'folders';
        APICall.getAPIData(url, [{
          id: folder.id,
          slug: folder.slug
        }], Config.API_METHOD_TYPE.PUT).then(function (response) {
            vm.changeSlugObj.changeSlug = false;
            vm.changeSlugObj = '';
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };

      vm.renamed = function (folder) {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'folders';
        APICall.getAPIData(url, [{
          id: folder.id,
          name: folder.name
        }], Config.API_METHOD_TYPE.PUT).then(function (response) {
            vm.renameObj.rename = false;
            vm.renameObj = '';
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };

      vm.toggleHide = function () {
        var url = Config.FOLDER_SRV + 'folders';
        vm.rightClickedObj.hidden=!vm.rightClickedObj.hidden;
        APICall.getAPIData(url, [{
          id: vm.rightClickedObj.id,
          hidden: vm.rightClickedObj.hidden
        }], Config.API_METHOD_TYPE.PUT).then(function (response) {
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
        vm.rightClickedObj=''
      };

      vm.openPicModal = function () {
        vm.image='';
        inputId++;
        var input=document.createElement('input');
        input.type="file";
        input.name='photo';
        input.id='folder_upload_img_'+inputId;
        input.style.display='hidden';
        document.body.appendChild(input);
        var element=document.getElementById('folder_upload_img_'+inputId);
        element.click();
        element.onchange=function(){
          vm.readURL(this);
        }
      };

      vm.readURL = function (input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            vm.image = {
              data: e.target.result,
              name: input.files[0].name,
              type: input.files[0].type,
              size: Math.ceil(input.files[0].size / 1000),
              file: input.files[0]
            };
            vm.uploadImage(vm.rightClickedObj);
            return true;
          };
          reader.readAsDataURL(input.files[0]);
        }
      };

      //Upload Images
      vm.uploadImage = function (folder) {
        vm.progressbar.start();
        File.uploadImage(vm.image,'images/uploads/folder_pic','folder_pic_'+folder.id).then(function (data) {
          folder.image_uri=data.image_uri;
          folder.image_thumbnail_uri=data.image_thumbnail_uri;
          var url = Config.FOLDER_SRV + 'folders';
          return APICall.getAPIData(url, [{
            id: folder.id,
            image_uri: data.image_uri,
            image_thumbnail_uri: data.image_thumbnail_uri
          }], Config.API_METHOD_TYPE.PUT);
        }).then(function (response) {
          vm.progressbar.complete();
          vm.rightClickedObj=''
        }).catch(function (error) {
          vm.progressbar.complete();
          vm.rightClickedObj=''
        });
      };

      vm.removePic = function () {
        var url = Config.FOLDER_SRV + 'folders';
        return APICall.getAPIData(url, [{
          id: vm.rightClickedObj.id,
          image_uri: null,
          image_thumbnail_uri: null
        }], Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.rightClickedObj.image_uri='';
          vm.rightClickedObj.image_thumbnail_uri='';
          vm.rightClickedObj=''
        });
      };

      vm.unrenamed = function (folder) {
        vm.renameObj.rename = false;
        vm.renameObj = '';
      };
      vm.unrenamedHierarchy = function (level) {
        vm.renameHierarchy.rename = false;
        vm.renameHierarchy = '';
      }
      vm.renamedHierarchy = function (level) {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'hierarchy/' + vm.subLvls[level].hierarchy.id;
        APICall.getAPIData(url, {name: vm.subLvls[level].hierarchy.name}, Config.API_METHOD_TYPE.PUT).then(function (response) {
            vm.renameHierarchy.rename = false;
            vm.renameHierarchy = '';
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      }

      vm.deleteFolder = function () {
        var r = confirm("Are You Sure?");
        if (r == true) {
          vm.deleteObj = vm.rightClickedObj;
          vm.rightClickedObj = '';
          vm.progressbar.start();
          var url = Config.FOLDER_SRV + 'folders/' + vm.deleteObj.id;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
              arrayToUpdate = [];
              findAndRemove(vm.folder, vm.deleteObj.customId, arrayToUpdate);
              vm.subLvls.length = vm.rightClickedObjLvl;
              var url = Config.FOLDER_SRV + 'folders';
              APICall.getAPIData(url, arrayToUpdate, Config.API_METHOD_TYPE.PUT).then(function (response) {
                  vm.progressbar.complete();
                },
                function (response) {
                  vm.progressbar.complete();
                });
            },
            function (response, xhr, status) {
              vm.progressbar.complete();
            });
        }
      };
      vm.deleteHierarchy = function () {
        var r = confirm("Are You Sure? Every folder inside it will be deleted?");
        if (r == true) {
          vm.deleteObj = vm.rightClickedObj;
          vm.rightClickedObj = '';
          vm.progressbar.start();
          var url = Config.FOLDER_SRV + 'hierarchy/' + vm.deleteObj.id;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
              arrayToUpdate = [];
              findAndRemoveHierarchy(vm.folder, vm.deleteObj);
              for (var i in vm.openedProductHierarchy) {
                if (vm.openedProductHierarchy[i].id == vm.deleteObj.id) {
                  vm.openedProductHierarchy.length = parseInt(i);
                  break;
                }
              }
              vm.subLvls.length = vm.rightClickedObjLvl;
              vm.progressbar.complete();
            },
            function (response, xhr, status) {
              vm.progressbar.complete();
            });
        }
      };
      var findAndRemoveHierarchy = function (folder, hierarchy) {
        if (!folder) return false;
        for (var i in folder) {
          if (folder[i].hierarchy && folder[i].hierarchy.id == hierarchy.id) {
            folder[i].hierarchy = null;
            folder[i].nodes.length = 0;
          } else {
            findAndRemoveHierarchy(folder[i].nodes, hierarchy);
          }
        }
      }
    }]);
