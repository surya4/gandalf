noonEduController
  .controller('TestCreateCtrl', ['$localStorage', 'Config', '$scope', 'APICall', 'ngProgressFactory','$state',
    function ($localStorage, Config, $scope, APICall, ngProgressFactory,$state) {
      var vm = this;
      vm.test={};
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
          var temp = vm.selectedProducts[0];
          vm.selectedProducts = [];
          vm.selectedProducts.push(temp);
          var url = Config.FOLDER_SRV + 'folderForProduct/' + itemId;
          vm.test.product_id = itemId;
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
      vm.getProducts();

      vm.getTestTypes = function(){
        var url = Config.TEST_SRV + "testType";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.testTypes = response.data;
        });
      };
      vm.getTestTypes();

      vm.createTest = function(){
        var url = Config.TEST_SRV + "tests";
        APICall.getAPIData(url, vm.test, Config.API_METHOD_TYPE.POST).then(function (response) {
          $state.go('tab.testEdit',{testId:response.data[0].id});
        });
      };

    }]);
