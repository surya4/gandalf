noonEduServices
  .service('Flashcards', ['$rootScope', 'Config', '$localStorage', 'APICall', '$q',
    function ($rootScope, Config, $localStorage, APICall, $q) {

      var flashcardImages={};
      var flashcardImagesOfFolder={};
      var flashcardImagesOfQuesiton={};


      return {

        getImageById: function (flashcardImageId) {
          var deferred = $q.defer();
          flashcardImageId=parseInt(flashcardImageId);
          if(!flashcardImageId || flashcardImageId<=0){
            deferred.reject('no id given');
          } else if(flashcardImages[flashcardImageId]){
            deferred.resolve(flashcardImages[flashcardImageId]);
          } else {
            var url = Config.FLASHCARD_SRV + "flashcardImage/" + flashcardImageId;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function(response){
              flashcardImages[flashcardImageId]=response.data[0];
              deferred.resolve(response.data[0]);
            },function(response){
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getImagesByLeafId: function (folderId) {
          var deferred = $q.defer();
          var url = Config.FLASHCARD_SRV + "flashcardImagesByLeafId/" + folderId;
          if(!folderId || folderId<=0){
            deferred.reject('no id given');
          } else if(flashcardImagesOfFolder[folderId]){
            deferred.resolve(flashcardImagesOfFolder[folderId]);
          } else {
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              response.data.sort(function(a, b) {
                if (a.leaf_folder_id < b.leaf_folder_id) {
                  return -1;
                } else if (a.leaf_folder_id > b.leaf_folder_id) {
                  return 1;
                }
                if (a.leaf_folder_id = b.leaf_folder_id) {
                  if (a.order < b.order) {
                    return -1;
                  } else if (a.order > b.order) {
                    return 1;
                  }
                }
                return 0;
              });
              flashcardImagesOfFolder[folderId]=response.data;
              deferred.resolve(response.data);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getByQuestionId: function (questionId) {
          var deferred = $q.defer();
          var url = Config.FLASHCARD_SRV + "flashcardImagesByQuestionId/" + questionId;
          if(!questionId || questionId<=0){
            deferred.reject('no id given');
          } else if(flashcardImagesOfQuesiton[questionId]){
            deferred.resolve(flashcardImagesOfQuesiton[questionId]);
          } else {
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              flashcardImagesOfQuesiton[questionId]=response.data;
              deferred.resolve(response.data);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        }

      };
    }]);

