noonEduController
  .controller('PackagesCtrl', ['$rootScope','$state','ngProgressFactory','APICall','Config',
    function ($rootScope,$state,ngProgressFactory,APICall,Config) {
      var vm=this;
      vm.newPackage={
        hidden:0,
        role_id:null,
        product_id:null,
        name:null,
        description:null,
        slug:null,
        price:null,
        expiry_type:null,
        expiry:null,
        discount_type:null,
        discount:null
      };
      vm.progressbar = ngProgressFactory.createInstance();

      vm.getProductList = function () {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'products';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.products=response.data;
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };
      vm.getProductList();

      vm.getRoleList = function () {
        if (vm.roles) return true;
        var url = Config.PERMISSION_SRV + "rolesList";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.roles = response.data;
        });
      };
      vm.getRoleList();
      vm.packages=[];
      vm.getPackageList = function () {
        if (vm.packages.length>0) return true;
        var url = Config.PACKAGE_SRV + "packages";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.packages = response.data;
        });
      };
      vm.getPackageList();

      vm.savePackage=function(){
        var halala=vm.newPackage.halala
        if(!halala){
          halala='00';
        } else if(halala<10){
          halala='0'+halala;
        }
        vm.newPackage.price=vm.newPackage.riyal+halala;
        if(!vm.newPackage.role_id || !vm.newPackage.product_id || !vm.newPackage.name || !vm.newPackage.description ||
          !vm.newPackage.slug || !vm.newPackage.price || !vm.newPackage.expiry_type){
          console.log(vm.newPackage);
          $rootScope.setMsg('error','param missing')
          return false;
        }
        var packageObj={
          role_id:vm.newPackage.role_id,
          product_id:vm.newPackage.product_id,
          name:vm.newPackage.name,
          description:vm.newPackage.description,
          price:vm.newPackage.price,
          hidden:vm.newPackage.hidden,
          slug:vm.newPackage.slug,
          expiry_type:vm.newPackage.expiry_type,
          expiry:vm.newPackage.expiry,
          discount_type:vm.newPackage.discount_type,
          discount:vm.newPackage.discount
        }
        var url = Config.PACKAGE_SRV + "packages";
        APICall.getAPIData(url, packageObj, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.newPackage={
            hidden:0,
            role_id:null,
            product_id:null,
            name:null,
            description:null,
            slug:null,
            price:null,
            expiry_type:null,
            expiry:null,
            discount_type:null,
            discount:null
          };
          packageObj.id = response.data[0].id;
          vm.packages.push(packageObj);
        });
      };

      vm.getRoleName = function(role_id){
        for(var i in vm.roles){
          if(vm.roles[i].id==role_id){
            return vm.roles[i].name
          }
        }
        return false;
      };

      vm.getProductName = function(product_id){
        for(var i in vm.products){
          if(vm.products[i].id==product_id){
            return vm.products[i].name
          }
        }
        return false;
      };

      vm.initUpdatePackage = function(package){
        vm.updatePackageObj=package;
        vm.updatePackageObj.riyal=vm.updatePackageObj.price/100;
        vm.updatePackageObj.halala=vm.updatePackageObj.price%100;
        if(!vm.updatePackageObj.halala){
          vm.updatePackageObj.halala=00;
        }
      };

      vm.updatePackage = function(){
        var halala=vm.updatePackageObj.halala
        if(!halala){
          halala='00';
        } else if(halala<10){
          halala='0'+halala;
        }
        vm.updatePackageObj.price=vm.updatePackageObj.riyal+halala;
        if(!vm.updatePackageObj.role_id || !vm.updatePackageObj.product_id || !vm.updatePackageObj.name || !vm.updatePackageObj.description ||
          !vm.updatePackageObj.slug || !vm.updatePackageObj.price || !vm.updatePackageObj.expiry_type){
          $rootScope.setMsg('error','param missing')
          return false;
        }
        var packageObj={
          role_id:vm.updatePackageObj.role_id,
          product_id:vm.updatePackageObj.product_id,
          name:vm.updatePackageObj.name,
          description:vm.updatePackageObj.description,
          price:vm.updatePackageObj.price,
          hidden:vm.updatePackageObj.hidden,
          slug:vm.updatePackageObj.slug,
          expiry_type:vm.updatePackageObj.expiry_type,
          expiry:vm.updatePackageObj.expiry,
          discount_type:vm.updatePackageObj.discount_type,
          discount:vm.updatePackageObj.discount
        }
        var url = Config.PACKAGE_SRV + "packages/" + vm.updatePackageObj.id;
        APICall.getAPIData(url, packageObj, Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.updatePackageObj='';
        });
      };

    }]);
