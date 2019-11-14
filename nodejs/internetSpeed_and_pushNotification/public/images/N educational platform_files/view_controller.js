noonEduController
  .controller('UserViewCtrl', ['$scope', '$stateParams','$uibModal', 'APICall', 'Config', '$rootScope', '$state', '$localStorage', 'ngProgressFactory','Package','utilities','Tutoring','Questions','Folders','Flashcards',
    function ($scope, $stateParams, $uibModal,APICall, Config, $rootScope, $state, $localStorage, ngProgressFactory,Package,utilities,Tutoring,Questions,Folders,Flashcards) {
      var vm = this;
      vm.userId = $stateParams.userId;
      vm.role = $stateParams.role;
      vm.authUser = $localStorage.user;
      vm.progressbar = ngProgressFactory.createInstance();
      vm.paymentHistory=[];
      vm.creditHistory=[];
      vm.filters = {
        startDate:'',
        endDate:'',
        teacher_id:'',
        user_id:vm.userId,
        missed:'',
        rating:'',
        product_id:'',
        state:'',
        credits:'',
        page:1,
        limit:20
      };


      vm.openTab = function (tabname) {
        vm.tabOpened=tabname;
        if(tabname=='payment'){
          getPaymentHistory();
          vm.getPaymentMethodList();
          vm.getBankList();
          vm.getPackageList();
        } else if(tabname=='sessions'){
          getSessionHistory();
          vm.getProducts();
        } else if(tabname=='profile'){
          vm.getUser();
          vm.getRoleList();
        }
      };

      vm.getUser = function () {
        vm.progressbar.start();
        var url = Config.USER_SRV + "users/" + vm.userId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.progressbar.complete();
          vm.user = response.data[0];
          vm.user.verified_email=(parseInt(vm.user.verified_email))?true:false;
          vm.user.verified_phone=(parseInt(vm.user.verified_phone))?true:false;
          vm.user.oldRoles=[];
          for(var i in vm.user.roles){
            vm.user.oldRoles.push(vm.user.roles[i]);
          }
        });
      };

      vm.selectRole = function (roleId) {
        var index=vm.user.roles.indexOf(roleId);
        if(index==-1){
          vm.user.roles.push(roleId);
        } else {
          vm.user.roles.splice(index,1);
        }
      };

      vm.readURL = function (input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $scope.$apply(function () {
              vm.tempImg = e.target.result;
            });
          };
          reader.readAsDataURL(input.files[0]);
          vm.picFile = input.files[0];
        }
      };

      vm.click = function () {
        document.getElementById('photo').click();
        $scope.clicked = true;
      };

      vm.removePic = function () {
        vm.user.profile_pic = '';
        vm.tempImg = '';
      };

      vm.saveImage = function () {
        vm.progressbar.start();
        var ext = vm.picFile.name.split('.');
        ext = ext[ext.length - 1];
        var fd = new FormData();
        fd.append("destination", 'images/user_profile_pic');
        fd.append("user_id", vm.authUser.id);
        fd.append("fileUpl", vm.picFile, vm.user.email + '.' + ext);
        var url = Config.FILE_SRV + "files/";
        APICall.getAPIData(url, fd, Config.API_METHOD_TYPE.POST, 'false').then(function (response) {
          vm.user.profile_pic = response.data[0];
          vm.progressbar.complete();
          vm.submitForm();
        });
      };

      vm.submitForm = function () {
        vm.progressbar.start();
        var userObj = {};
        for (var i in vm.user) {
          if (vm.user[i] === null || vm.user[i] === undefined) {

          } else {
            userObj[i]=vm.user[i]
          }
        };
        userObj.rolesToRemove=[];
        for (var j in userObj.oldRoles) {
          if (userObj.oldRoles[j] != 1 && userObj.roles.indexOf(userObj.oldRoles[j]) == -1) {
            userObj.rolesToRemove.push(userObj.oldRoles[j]);
          }
        }
        userObj.rolesToAdd=[];
        for (var j in userObj.roles) {
          if (userObj.oldRoles.indexOf(userObj.roles[j]) == -1) {
            userObj.rolesToAdd.push(userObj.roles[j]);
          }
        }
        delete userObj.roles;
        delete userObj.oldRoles;
        var url = Config.USER_SRV + "users/" + vm.userId;
        if(userObj.verified_email){
          userObj.verified_email=1;
        }
        if(userObj.verified_phone){
          userObj.verified_phone=1;
        }
        APICall.getAPIData(url, userObj, Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.progressbar.complete();
          $state.go('tab.userList');
        });
      };

      vm.getRoleList = function () {
        if (vm.roles) return true;
        var url = Config.PERMISSION_SRV + "rolesList";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.roles=[];
          for(var i in response.data){
            if(response.data[i].id != 1)
              vm.roles.push(response.data[i]);
          }
        });
      };

      function getPaymentHistory(){
        vm.fetchingPaymentHistory=true;
        var url = Config.PACKAGE_SRV + "paymentHistory/"+vm.userId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.paymentHistory=response.data;
          var url = Config.PACKAGE_SRV + "creditHistory/"+vm.userId;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            vm.creditHistory=response.data;
            vm.fetchingPaymentHistory=false;
          });
        });
      }

      vm.tutoringSessions=[];
      function getSessionHistory(){
        var startDate = '';
        var endDate = '';
        if(!vm.filters.startDate){
          vm.filters.startDate=new Date()
        }
        startDate = new Date(vm.filters.startDate)
        if(!vm.filters.endDate){
          vm.filters.endDate = vm.filters.startDate
        }
        if (vm.filters.startDate && vm.filters.endDate) {
          startDate = new Date(vm.filters.startDate);
          endDate = new Date(vm.filters.endDate);
          if (startDate.getTime() <= endDate.getTime()) {
            // Assigning the dates to new object to fix issue of ng-model date object
            // and access createdAt on server
            startDate = utilities.dateToDateString(startDate);
            endDate = utilities.dateToDateString(endDate);
          } else {
            $rootScope.setMsg('error', "Start Date should be less than End Date !!");
          }
        }
        vm.fetchingTutoringSessions=true;
        vm.filters.start_date=startDate+' 00:00:00';
        vm.filters.end_date=endDate+' 23:59:59';
        Tutoring.studentClassHistory(vm.filters).then(function (data) {
          var prevLength=vm.tutoringSessions.length;
          for(var i in data){
            vm.tutoringSessions.push(data[i]);
          }
          getResource(prevLength);
          if(data.length < vm.filters.limit){
            vm.noMore=true;
          } else {
            vm.noMore=false;
          }
          vm.fetchingTutoringSessions=false;
          vm.progressbar.complete();
        },function(err){
          vm.fetchingTutoringSessions=false;
        });
      }

      vm.applyFilters = function(){
        vm.tutoringSessions=[];
        vm.filters.page=1;
        getSessionHistory();
      };

      var getResource = function (index) {
        if(!vm.tutoringSessions[index]) return true;
        Folders.getById(vm.tutoringSessions[index].folder_id).then(function (folderObj) {
          vm.tutoringSessions[index].folder=folderObj;
          if (vm.tutoringSessions[index].resource_type == 'question') {
            return  Questions.getById(vm.tutoringSessions[index].resource_id);
          } else if (vm.tutoringSessions[index].resource_type == 'flashcardImage') {
            return  Flashcards.getImageById(vm.tutoringSessions[index].resource_id)
          } else if (vm.tutoringSessions[index].resource_type == 'customResource') {
            return  Tutoring.getCustomResource(vm.tutoringSessions[index].resource_id)
          } else if (vm.tutoringSessions[index].resource_type == 'pdf') {
            return  Folders.getPage(vm.tutoringSessions[index].resource_id)
          }
        }).then(function (resource) {
          vm.tutoringSessions[index].resource=resource;
          getResource(index+1);
        });
      };

      vm.addFreeCredits = function(freeCredits){
        var url = Config.PACKAGE_SRV + "addFreeCredits";
        if(!freeCredits){
          return false;
        }
        freeCredits.user_id=vm.userId;
        APICall.getAPIData(url, freeCredits, Config.API_METHOD_TYPE.POST).then(function (response) {
          $rootScope.setMsg('success','free credits added');
          vm.freeCredits={
            quantity:0,
            duration:0
          }
        });
      }

      vm.getPaymentMethodList = function () {
        if (vm.paymentMethods) return true;
        var option = {};
        Package.getPaymentMethods(option).then(function (data) {
          vm.paymentMethods = data;
        });
      };

      vm.getBankList = function () {
        if (vm.banks) return true;
        Package.getBanks().then(function (data) {
          vm.banks = data;
        });
      };

      vm.getPackageList = function () {
        if (vm.packages) return true;
        Package.getPackageList().then(function (data) {
          vm.packages = data;
        });
      };

      vm.getPaymentMethodName = function (id) {
        for (var i in vm.paymentMethods) {
          if (vm.paymentMethods[i].id == id) {
            return vm.paymentMethods[i].name;
          }
        }
        return 'N/A';
      };

      vm.getBankName = function (id) {
        for (var i in vm.banks) {
          if (vm.banks[i].id == id) {
            return vm.banks[i].name;
          }
        }
        return 'N/A';
      };

      vm.getPackageName = function (id) {
        for (var i in vm.packages) {
          if (vm.packages[i].id == id) {
            return vm.packages[i].slug;
          }
        }
        return 'N/A';
      };

      vm.openBankDetails = function (transaction) {
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'www/app/components/transaction/bank_details.html',
          controller: 'BankDetailsModalInstanceCtrl',
          controllerAs: 'vm',
          size: 'lg',
          resolve: {
            transaction: function () {
              return transaction;
            }
          }
        });

        modalInstance.result.then(function (data) {
          if(data.status){
            vm.updateTransaction(data.status,data.transationId);
          }
        }, function () {

        });
      };

      vm.updateTransaction = function(status,transationId){
        var upgradeUser= (status=='completed')?true:false;
        var url = Config.PACKAGE_SRV + "transactions/" + transationId;
        APICall.getAPIData(url, {
          status:status,
          upgradeUser:upgradeUser
        }, Config.API_METHOD_TYPE.PUT).then(function (response) {
          $rootScope.setMsg('success','updated')
        });
      };

      vm.getProducts = function () {
        Folders.getProducts().then(function (products) {
          vm.products=[];
          for (var i in products) {
            if(['maths_sa','english_sa','physics_sa','physics'].indexOf(products[i].slug)>-1){
              vm.products.push(products[i]);
            }
          }
        });
      };

      vm.openTab('profile');

    }]);