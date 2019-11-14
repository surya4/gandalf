noonEduController
  .controller('PackagesAddonCtrl', ['$rootScope','$state','ngProgressFactory','APICall','Config','$stateParams',
    function ($rootScope,$state,ngProgressFactory,APICall,Config,$stateParams) {
      var vm=this;
      vm.newAddon={};
      vm.progressbar = ngProgressFactory.createInstance();
      vm.packageId=$stateParams.packageId;

      vm.getProductList = function () {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'products';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.products=response.data;
            vm.products.push({
              id:0,
              name:'For All'
            });
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };
      vm.getProductList();

      vm.getProductName = function(product_id){
        for(var i in vm.products){
          if(vm.products[i].id==product_id){
            return vm.products[i].name
          }
        }
        return 'For All';
      };

      vm.getAddonList = function () {
        vm.progressbar.start();
        var url = Config.PACKAGE_SRV + 'addons';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.addons=response.data;
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };

      vm.getPackageAddonIncluded = function () {
        vm.progressbar.start();
        var url = Config.PACKAGE_SRV + 'packagesAddons/' + vm.packageId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.packagesAddons=response.data;
            vm.progressbar.complete();
            vm.getAddonList();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };

      vm.getPackageAddonIncluded();

      vm.saveAddon=function(){
        if(!vm.newAddon.resource_type || !vm.newAddon.expiry_type){
          console.log(vm.newAddon);
          $rootScope.setMsg('error','param missing')
          return false;
        }
        var addonObj={
          resource_type: vm.newAddon.resource_type,
          resource_id: vm.newAddon.resource_id || null,
          product_id: vm.newAddon.product_id,
          daily_limit: vm.newAddon.daily_limit,
          unlimited: vm.newAddon.unlimited,
          session_time: vm.newAddon.session_time,
          expiry: vm.newAddon.expiry,
          expiry_type: vm.newAddon.expiry_type,
          quantity: vm.newAddon.quantity
        }
        var url = Config.PACKAGE_SRV + "addons";
        APICall.getAPIData(url, addonObj, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.newAddon={
            resource_type: null,
            resource_id: null,
            product_id: null,
            daily_limit: null,
            unlimited: null,
            quantity: null
          };
          addonObj.id = response.data[0].id;
          vm.addons.push(addonObj);
        });
      };

      vm.checkIncluded = function (key, addon_id) {
       //check if exist and change addon.included
        for(var i in  vm.packagesAddons){
          if(vm.packagesAddons[i].id==addon_id){
            vm.addons[key].included=true;
            console.log(vm.addons);
            return true;
          }
        }
        vm.addons[key].included=false;
        return false;
      }

      vm.toggleIncluded = function (key, addon_id, included) {
        vm.progressbar.start();
        var url = Config.PACKAGE_SRV + 'togglePackagesAddons';
        var data={package_id:vm.packageId,addon_id:addon_id,included:included};
        APICall.getAPIData(url, data, Config.API_METHOD_TYPE.POST).then(function (response) {
            if(included){
              vm.packagesAddons.push(data);
              vm.addons[key].included=true;
            } else {
              for(var i in  vm.packagesAddons){
                if(vm.packagesAddons[i].id==addon_id){
                  delete vm.packagesAddons[i];
                  vm.addons[key].included=false;
                  break;
                }
              }
            }
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      }

      vm.initUpdateAddon = function(addon){
        vm.updateAddonObj=addon;
      };

      vm.updateAddon = function(updateAddon){
        if(!updateAddon.resource_type || !updateAddon.expiry_type){
          $rootScope.setMsg('error','param missing')
          return false;
        }
        var addonObj={
          resource_type: updateAddon.resource_type,
          resource_id: updateAddon.resource_id || null,
          product_id: updateAddon.product_id,
          daily_limit: updateAddon.daily_limit,
          unlimited: updateAddon.unlimited,
          session_time: updateAddon.session_time,
          expiry: updateAddon.expiry,
          expiry_type: updateAddon.expiry_type,
          quantity: updateAddon.quantity
        }
        var url = Config.PACKAGE_SRV + "addons/" + updateAddon.id;
        APICall.getAPIData(url, addonObj, Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.updateAddonObj=false;
        });
      };

      vm.deleteAddon = function(addon){
        var url = Config.PACKAGE_SRV + "addons/" + addon.id;
        APICall.getAPIData(url,{}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          vm.getAddonList();
        });
      };

    }]);
