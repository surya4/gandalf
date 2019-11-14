noonEduServices
  .service('File', ['Config', '$localStorage', 'APICall', '$rootScope', '$q',
    function (Config, $localStorage, APICall, $rootScope, $q) {

      return {
        //Upload image
        uploadImage: function (input, destination, file_name) {
          var deferred = $q.defer();
          var user = $localStorage.user;
          var imageFile = input;
          if (user !== "") {
            var userId = user.id;
            var userEmail = user.email;
            var fd = new FormData();
            fd.append("destination", destination);
            fd.append("user_id", userId);
            var originalName = imageFile.file.name.split('.');
            var ext = originalName[originalName.length - 1];
            originalName = originalName[0];
            fd.append("file_name", originalName + '_' + file_name + '.' + ext);
            fd.append("fileUpl", imageFile.file, imageFile.file.name);
            var url = Config.FILE_SRV + "files/";
            //uploading in s3
            APICall.getAPIData(url, fd, Config.API_METHOD_TYPE.POST, 'false').then(function (response) {
                deferred.resolve({
                  image_uri: response.data[0],
                  image_thumbnail_uri: response.meta.thumbnail_url
                });
              },
              function () {
                imageFile = '';
                deferred.reject({});
              });
          }
          return deferred.promise;
        }
        // ,

        // getJobLists: function () {
        //   var deferred = $q.defer();
        //   // flashcardImageId=parseInt(flashcardImageId);
        //   // if(!flashcardImageId || flashcardImageId<=0){
        //   //   deferred.reject('no id given');
        //   // } else if(flashcardImages[flashcardImageId]){
        //   //   deferred.resolve(flashcardImages[flashcardImageId]);
        //   // } else {
        //     var url = Config.FILE_SRV + "jobsList";
        //     APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function(response){
        //       // flashcardImages[flashcardImageId]=response.data[0];
        //       console.log("asdkasjbhdjad",response);
        //       deferred.resolve(response.data[0]);
        //     },function(response){
        //       console.log("asdkasjbedqfdqwdhdjad",response);
        //       deferred.reject(response);
        //     });
        //   // }
        //   return deferred.promise;
        // },

      } //Return ends
    }]);