noonEduController
  .controller('SchoolInsertCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state','ngProgressFactory',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state, ngProgressFactory) {
      var vm = this;
      vm.schoolId = $stateParams.schoolId;

      vm.progressbar = ngProgressFactory.createInstance();

      vm.getSchool = function () {
        var url = Config.SCHOOL_SRV + "schools/" + vm.schoolId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.school = response.data[0];
        });
      };
      vm.getSchool();

      vm.readURL = function (input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var names=input.files[0].name.split('.');
            vm.file = {
              data: e.target.result,
              name: input.files[0].name,
              ext: names[names.length-1],
              type: input.files[0].type,
              size: Math.ceil(input.files[0].size / 1000),
              file: input.files[0]
            };
            if(vm.file.type=='text/csv' || vm.file.ext =='csv'){

            } else {
              $rootScope.setMsg('error','Please upload a csv file')
            }
            $scope.$apply();
            return true;
          };
          reader.readAsBinaryString(input.files[0]);
        }
      };

      vm.submitForm = function () {
        if (!vm.file) {
          return '';
        }
        var users = [];
        var emails = [];
        var emailIndex = 0;
        var nameIndex = 1;
        var genderIndex = 2;
        var gradeIndex = 3;
        var classIndex = 4;
        var phoneIndex = 5;
        var cityIndex = 6;
        vm.school.gender = null;
        if (vm.school.section == 'boys') {
          vm.school.gender = 'male';
        } else if (vm.school.section == 'girls') {
          vm.school.gender = 'female';
        }
        var lines = vm.file.data.split(/\r\n|\n|\r/);
        for(var i in lines) {
          lines[i] = lines[i].split(',');
          if (validateEmail(lines[i][emailIndex]) && emails.indexOf(lines[i][emailIndex].toLowerCase().trim()) == -1) {
            var gender = vm.school.gender;
            var grade = null;
            var city = vm.school.city;
            if (lines[i][genderIndex]) {
              if (['male', 'm', 'ذكر'].indexOf(lines[i][genderIndex].toLowerCase())>-1) {
                gender = 'male';
              } else if (['female', 'f', 'أنثى'].indexOf(lines[i][genderIndex].toLowerCase())>-1) {
                gender = 'female';
              }
            }
            if (lines[i][gradeIndex]) {
              grade = lines[i][gradeIndex];
              if (grade < 4) {
                grade += 9;
              }
            }
            if (lines[i][cityIndex]) {
              city = lines[i][cityIndex];
            }
            var emailLowerTrimmed=lines[i][emailIndex].toLowerCase().trim();
            var user = {
              'email': emailLowerTrimmed,
              'password': emailLowerTrimmed.split('@')[0]+'@'+vm.schoolId,
              'name': (lines[i][nameIndex]) ? lines[i][nameIndex] : '',
              'school_id': vm.schoolId,
              'gender': gender,
              'grade': grade,
              'class': (lines[i][classIndex]) ? lines[i][classIndex] : 0,
              'phone': (lines[i][phoneIndex]) ? lines[i][phoneIndex] : '',
              'city': city,
              'role_id': 5
            };
            if(!user.phone) delete user.phone
            if(!user.gender) delete user.gender
            if(!user.grade) delete user.grade
            if(!user.name) delete user.name
            if(!user.class) delete user.class
            emails.push(emailLowerTrimmed);
            users.push(user);
          } else {
            for(var j in lines[i]) {
              if (['email','emails','mail','mails'].indexOf(lines[i][j].toLowerCase()) != -1) {
                emailIndex = j;
                console.log(emailIndex);
              } else if (['name', 'firstname'].indexOf(lines[i][j].toLowerCase()) != -1) {
                nameIndex = j;
              } else if (['gender', 'sex'].indexOf(lines[i][j].toLowerCase()) != -1) {
                genderIndex = j;
              } else if (['grade'].indexOf(lines[i][j].toLowerCase()) != -1) {
                gradeIndex = j;
              } else if (['class'].indexOf(lines[i][j].toLowerCase()) != -1) {
                classIndex = j;
              } else if (['mob', 'mobile', 'phone', 'mob no', 'phone no', 'mobile no'].indexOf(lines[i][j].toLowerCase()) != -1) {
                phoneIndex = j;
              } else if (['city'].indexOf(lines[i][j].toLowerCase()) != -1) {
                cityIndex = j;
              }
            }
          }
        }
        vm.uploadStarted=true;
        vm.users=users;
        if(vm.users[0]){
          vm.users[0].status='started';
          vm.createUser(0);
        }
      };

      vm.createUser = function (index) {
        if(!vm.users[index]){
          vm.uploadStarted=false;
          return false;
        }
        var url = Config.USER_SRV + "users/";
        APICall.getAPIData(url, vm.users[index], Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.users[index].status='created';
          console.log(response);
          vm.upgradeUserQudrat(index);
        },function(response){
          console.log(response);
          if(response.id){
            vm.users[index].status='exists';
            vm.users[index].id=response.id;
            vm.updateUser(index);
          } else {
            vm.users[index].status='errorCreating';
            index++;
            vm.createUser(index);
          }
        });
      };

      vm.updateUser = function (index) {
        if(!vm.users[index]){
          return false;
        }
        delete vm.users[index].password;
        var url = Config.USER_SRV + "users/" + vm.users[index].id;
        if(vm.school.id == user.school_id) delete user.school_id;
        if(vm.school.city == user.city) delete user.city;
        if(vm.school.gender == user.city) delete user.city;
        delete user.city;
        delete user.
        APICall.getAPIData(url, vm.users[index], Config.API_METHOD_TYPE.PUT).then(function (response) {
          vm.users[index].status='updated';
          console.log(response);
          vm.upgradeUserQudrat(index);
        },function(response){
          vm.users[index].status='errorUpdating';
          console.log(response);
          vm.upgradeUserQudrat(index);
        });
      };
      
      vm.upgradeUserQudrat = function (index) {
        if(!vm.users[index]){
          return false;
        }
        var url = Config.USER_SRV + "upgradeUser/qudrat";
        APICall.getAPIData(url, {email:vm.users[index].email,expiry:'2018-10-01 00:00:00'}, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.users[index].status='upgraded';
          console.log(response);
          vm.upgradeUserTahsili(index);
        },function(response){
          vm.users[index].status='errorUpgrading';
          console.log(response);
          vm.upgradeUserTahsili(index);
        });
      };
      
      vm.upgradeUserTahsili = function (index) {
        if(!vm.users[index]){
          return false;
        }
        var url = Config.USER_SRV + "upgradeUser/tahsili";
        APICall.getAPIData(url, {email:vm.users[index].email,expiry:'2018-10-01 00:00:00'}, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.users[index].status='upgraded';
          console.log(response);
          index++;
          vm.createUser(index);
        },function(response){
          vm.users[index].status='errorUpgrading';
          console.log(response);
          index++;
          vm.createUser(index);
        });
      };

      function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      };

      String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

    }]);