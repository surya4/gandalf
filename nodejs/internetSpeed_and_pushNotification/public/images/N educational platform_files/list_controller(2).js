noonEduController
  .controller('McqListCtrl', ['Users','$scope', 'APICall', 'Config', '$rootScope', 'ngProgressFactory','$timeout',
    function (Users,$scope, APICall, Config, $rootScope, ngProgressFactory,$timeout) {
      var vm = this;
      vm.page = 1;
      vm.limit = 20;
      vm.order = 'DESC';
      vm.question = '';
      vm.pageNo='';
      vm.bookReference='';
      vm.selectedUserId=''
      vm.orderBy = 'updated_at';
      vm.progressbar = ngProgressFactory.createInstance();
      vm.users=[];

      vm.getQuestions = function () {
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + "questions"
          + '?page=' + vm.page
          + '&limit=' + vm.limit
          + '&order=' + vm.order
          + '&orderBy=' + vm.orderBy
          + '&question=' + vm.question
          + '&page_no=' + vm.pageNo
          + '&book_reference=' + vm.bookReference
          + '&user_id=' + vm.selectedUserId;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.progressbar.complete();
          vm.questions = response.data;
          if(response.meta)
            vm.totalItems = response.meta.total;
          for(var i in vm.questions){
            Users.getById(vm.questions[i].user_id)
              .then(function(user){
                vm.users[user.id]=user;
              });
          }
        }, function () {
          vm.progressbar.complete();
        });
      };

      vm.getQuestions();

      vm.deleteQuestion = function (key) {
        var r = confirm("Are You Sure?");
        if (r == true) {
          vm.progressbar.start();
          var url = Config.QUESTION_SRV + "questions/" + vm.questions[key].id;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
            vm.progressbar.complete();
            vm.questions.splice(key, 1)
          }, function (response) {
            vm.progressbar.complete();
          });
        }
      };

      vm.togglePublish = function (key, id, publish) {
        vm.progressbar.start();
        var url = Config.QUESTION_SRV + "togglePublish/" + id;
        APICall.getAPIData(url, {publish: (publish) ? 1 : 0}, Config.API_METHOD_TYPE.PUT).then(function (response) {
            vm.questions[key].publish = publish;
            vm.progressbar.complete();
          },
          function (data, message) {

            vm.progressbar.complete();
          });
      };

      vm.convertPublish = function (key, publish) {
        vm.questions[key].publish = (publish == '1') ? true : false;
      };

      vm.pageChanged = function() {
        vm.getQuestions();
      };

      vm.searchUser = function (userSearchString) {
        if (vm.searchTimer) {
          $timeout.cancel(vm.searchTimer);
        }
        vm.apiError = false;
        vm.searchingUser = true;
        vm.stringError = false;
        vm.noUser = false;
        vm.userSearchResult = false;
        vm.searchTimer = $timeout(function () {
          vm.searchTimerComplete(userSearchString);
        }, 700);
      };

      //Search for user presence
      vm.searchTimerComplete = function (str) {
        if (str.length >= 2) {
          vm.searchingUser = true;
          var url = Config.USER_SRV + "users?page=1&limit=20&roleId=3&order=DESC&orderBy=updated_at&email=" + str;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              vm.searchingUser = false;
              if (!response.data.length) {
                vm.noUser = true;
              } else {
                vm.userSearchResult = response.data;
              }
            },
            function () {
              vm.apiError = true;
              vm.searchingUser = false;
            });
        } else {
          vm.searchingUser = false;
          vm.apiError = false;
          vm.stringError = true;
        }
      };

      vm.getMoreUser = function(){
        if(!vm.searchingUser && !vm.apiError && !vm.noUser){
          vm.searchingUser = true;
          vm.page++;
          var url = Config.USER_SRV + "users?page="+vm.page+"&roleId=3&limit=20&order=DESC&orderBy=updated_at&email=" + vm.userSearchString;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              vm.searchingUser = false;
              for(var i in response.data){
                vm.userSearchResult.push(response.data[i])
              }
              if (!response.data.length) {
                vm.noUser = true;
              }
            },
            function () {
              vm.apiError = true;
              vm.searchingUser = false;
            });
        } else {
          vm.searchingUser = false;
          vm.apiError = false;
        }
      };

      vm.selectUser = function (user) {
        vm.selectedUserId = user.id;
        vm.userSearchResult=false;
        vm.userSearchString = user.email;
        vm.getQuestions();
      };

    }]);