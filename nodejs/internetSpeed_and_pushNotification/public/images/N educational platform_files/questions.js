noonEduServices
  .service('Questions', ['$rootScope', 'Config', '$localStorage', 'APICall', '$q',
    function ($rootScope, Config, $localStorage, APICall, $q) {

      var questions={};
      var questionByLessonId={};
      var questionByCategory={};

      return {

        getListByLessonId: function (lessonId) {
          var deferred = $q.defer();
          lessonId=parseInt(lessonId);
          if(!lessonId || lessonId<=0){
            deferred.reject('no id given');
          } else if(questionByLessonId[lessonId]){
            deferred.resolve(questionByLessonId[lessonId]);
          } else {
            var url = Config.QUESTION_SRV + "questionList/" + lessonId;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              questionByLessonId[lessonId]=response.data;
              deferred.resolve(response.data);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getById: function (questionId,force) {
          var deferred = $q.defer();
          questionId=parseInt(questionId);
          if(!questionId || questionId<=0){
            deferred.reject('no id given');
          } else if(questions[questionId]){
            deferred.resolve(questions[questionId]);
          } else {
            var url = Config.QUESTION_SRV + "questions/" + questionId;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              questions[questionId]=response.data[0];
              deferred.resolve(response.data[0]);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getByCategoryId: function (categoryId,categoryType) {
          var deferred = $q.defer();
          categoryId=parseInt(categoryId);
          if(!categoryId || categoryId<=0 || !categoryType){
            deferred.reject('no id given');
          } else if(questionByCategory[categoryType] && questionByCategory[categoryType][categoryId]){
            deferred.resolve(questionByCategory[categoryType][categoryId]);
          } else {
            var url = Config.QUESTION_SRV + "questionListForResource/" + categoryId + "?category_type=" + categoryType;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              if(!questionByCategory[categoryType]) questionByCategory[categoryType]={};
              questionByCategory[categoryType][categoryId]=response.data;
              deferred.resolve(response.data);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        }

      };
    }]);

