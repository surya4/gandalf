noonEduController
  .controller('ProfileCtrl', ['$uibModal','$scope','$state', '$localStorage', 'APICall', 'Config','$timeout','ngProgressFactory',
    function ($uibModal,$scope,$state, $localStorage, APICall, Config,$timeout,ngProgressFactory) {
      var vm = this;
      vm.progressbar = ngProgressFactory.createInstance();

      vm.user = $localStorage.user;
      vm.token = $localStorage.token;

      vm.getProfile = function () {
        var url = Config.USER_SRV + "profile";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          response.data[0].school=vm.user.school;
          vm.user = response.data[0];
          vm.user.verified_phone=parseInt(vm.user.verified_phone);
          $localStorage.user = vm.user;
          console.log(vm.user);
        });
      };

      vm.getProfile();

      vm.saveProfile = function(user){
        vm.progressbar.start();
        var url = Config.USER_SRV + "profile";
        APICall.getAPIData(url, {
          name:user.name,
          profile_pic:user.profile_pic,
          phone:user.phone,
          gender:user.gender,
          about_me:user.about_me,
          dob:user.dob,
          city:user.city,
          street:user.street
        }, Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.progressbar.complete();
        },function (response) {
          vm.progressbar.complete();
        });
      }

      vm.uploadImage = function () {
        vm.progressbar.start();
        var fd = new FormData();
        fd.append("destination", 'images/uploads/user_profile_pic');
        fd.append("user_id", vm.user.id);
        var originalName=vm.image.file.name.split('.');
        var ext = originalName[originalName.length-1];
        originalName=originalName[0];
        fd.append("file_name", originalName+'_'+vm.user.email+'.'+ext);
        fd.append("fileUpl", vm.image.file, vm.image.file.name);
        var url = Config.FILE_SRV + "files/";
        //uploading in s3
        APICall.getAPIData(url, fd, Config.API_METHOD_TYPE.POST, 'false').then(function (response) {
            vm.image.image_uri = response.data[0];
            vm.image.image_thumbnail_uri = response.meta.thumbnail_url;
            //saving in db
            vm.user.profile_pic=vm.image.image_uri;
            vm.saveProfile({
              profile_pic:vm.image.image_uri
            });
          },
          function (response) {
            vm.image='';
            vm.progressbar.complete();
          });
      };

      vm.readURL = function (input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            vm.image={
              data: e.target.result,
              name: input.files[0].name,
              type: input.files[0].type,
              size: Math.ceil(input.files[0].size / 1000),
              file: input.files[0]
            };
            $scope.$apply();
            vm.uploadImage();
            return true;
          };
          reader.readAsDataURL(input.files[0]);
        }
      };

    }]);
