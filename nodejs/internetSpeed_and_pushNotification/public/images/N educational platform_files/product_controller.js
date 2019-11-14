noonEduController
  .controller('ProductCtrl', ['APICall', 'Config', '$scope', 'ngProgressFactory','File',
    function (APICall, Config, $scope, ngProgressFactory,File) {
      var vm = this;
      vm.products = [];
      vm.countries = [];
      vm.progressbar = ngProgressFactory.createInstance();

      vm.getCountries = function () {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'countries';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.countries = response.data;
            vm.progressbar.complete();
            vm.getProducts();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };
      vm.getCountries();

      vm.getProducts = function () {
        vm.progressbar.start();
        var url = Config.FOLDER_SRV + 'products';
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.products = response.data;
            for (var i in vm.products) {
              for (var j in vm.countries) {
                if (vm.products[i].country_id == vm.countries[j].id) {
                  vm.products[i].country = vm.countries[j];
                  break;
                }
              }
            }
            vm.progressbar.complete();
          },
          function (response) {
            vm.progressbar.complete();
          });
      };

      vm.addProduct = function () {
        vm.progressbar.start();
        if(vm.product.id){
          var url = Config.FOLDER_SRV + 'products/'+vm.product.id;
          var method=Config.API_METHOD_TYPE.PUT;
        } else {
          var url = Config.FOLDER_SRV + 'products';
          var method=Config.API_METHOD_TYPE.POST;
        }
        APICall.getAPIData(url, vm.product, method).then(function (response) {
          if(vm.product.id){
            for(var i in  vm.products){
              if (vm.products[i].id == vm.product.id) {
                vm.products[i]=vm.product;
              }
            }
          } else {
            vm.product.id = response.data[0].id
            for (var j in vm.countries) {
              if (vm.product.country_id == vm.countries[j].id) {
                vm.product.country = vm.countries[j];
                break;
              }
            }
            vm.products.push(vm.product);
          }
            vm.uploadImage(vm.product);
            vm.product = {};
            vm.searchString='';
            vm.progressbar.complete();
          },
          function (response, xhr, status) {
            vm.progressbar.complete();
          });
      };

      vm.editProduct = function (product) {
        vm.product=product;
        vm.product.hidden=(product.hidden)?true:false;
        vm.searchString=vm.product.country.name;
      };

      vm.readURL = function (input,outline) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            if(outline){
              vm.image2 = {
                data: e.target.result,
                name: input.files[0].name,
                type: input.files[0].type,
                size: Math.ceil(input.files[0].size / 1000),
                file: input.files[0]
              };
            } else {
              vm.image = {
                data: e.target.result,
                name: input.files[0].name,
                type: input.files[0].type,
                size: Math.ceil(input.files[0].size / 1000),
                file: input.files[0]
              };
            }
            $scope.$apply();
            return true;
          };
          reader.readAsDataURL(input.files[0]);
        }
      };

      vm.uploadImage = function (product) {
        if(vm.image && product){
          File.uploadImage(vm.image,'images/uploads/product_pic','product_pic_'+product.id).then(function (data) {
            var url = Config.FOLDER_SRV + 'products/'+product.id;
            product.image_uri=data.image_uri;
            vm.image='';
            return APICall.getAPIData(url, product, Config.API_METHOD_TYPE.PUT)
          });
        }
        if(vm.image2 && product){
          File.uploadImage(vm.image2,'images/uploads/product_pic','product_pic_'+product.id).then(function (data) {
            var url = Config.FOLDER_SRV + 'products/'+product.id;
            product.image_thumbnail_uri=data.image_uri;
            vm.image2='';
            return APICall.getAPIData(url, product, Config.API_METHOD_TYPE.PUT)
          });
        }
      };

    }]);
