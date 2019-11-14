noonEduServices
  .service('Tutoring', ['$rootScope', 'Config', '$localStorage', 'APICall', '$q','translateService',
    function ($rootScope, Config, $localStorage, APICall, $q,translateService) {

      translateService.getTranslation('tutoring.badTeacher');
      translateService.getTranslation('tutoring.badService');
      translateService.getTranslation('tutoring.otherReason');
      translateService.getTranslation('tutoring.studentDeniedMic');

      var calcTime = function(session){
        if(!session.teacher_arrival_time && session.start_time){
          session.teacher_arrival_time=session.start_time;
        }
        if(!session.teacher_arrival_time || !session.end_time){
          return session.credits*5;
        }
        var startDate = session.teacher_arrival_time.split('T')[0];
        var startTime = session.teacher_arrival_time.split('T')[1].split('.')[0];
        var endDate = session.end_time.split('T')[0];
        var endTime = session.end_time.split('T')[1].split('.')[0];
        var difference = new Date(endDate+' '+endTime) - new Date(startDate+' '+startTime);
        return Math.ceil( difference/60000 );
      };

      return {

        getCustomResource: function (id) {
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "customResource/" + id;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            deferred.resolve(response.data[0]);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        uploadCustomResource: function (data) {
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "customResource";
          APICall.getAPIData(url, data, Config.API_METHOD_TYPE.POST).then(function (response) {
            deferred.resolve(response.data[0].id);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        getCount: function (allFoldersIds) {
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "classCount?folderIds="+allFoldersIds.join('.');
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            deferred.resolve(response.data[0].total);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        getClass: function (tutoringSessionId) {
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "getClass/" + tutoringSessionId;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            deferred.resolve(response.data[0]);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        joinClass: function (tutoringSessionId) {
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "joinClass";
          APICall.getAPIData(url, {
            tutoring_session_id: tutoringSessionId,
          }, Config.API_METHOD_TYPE.POST).then(function (response) {
            deferred.resolve(response.data[0]);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        callTimeApi: function (tutoringSessionId,action) {
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "time";
          APICall.getAPIData(url, {
            tutoring_session_id: tutoringSessionId,
            action: action
          }, Config.API_METHOD_TYPE.POST).then(function (response) {
            deferred.resolve(response.data);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        logs: function (tutoringSessionId,text,err,data) {
          console.log('Log::',tutoringSessionId,text,err,data);
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "logs";
          APICall.getAPIData(url, {
            tutoring_session_id: tutoringSessionId,
            user_id: $localStorage.user.id,
            isTeacher: 0,
            text: { text:text,err:err,data:data }
          }, Config.API_METHOD_TYPE.POST).then(function (response) {
            deferred.resolve(response.data);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        addAdditionalResource: function (resourceId,resourceType,tutoringSessionId) {
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "additionalResource";
          APICall.getAPIData(url, {
            resourceId: resourceId,
            resourceType: resourceType,
            tutoringSessionId: tutoringSessionId,
            initiator: 'teacher'
          }, Config.API_METHOD_TYPE.POST).then(function (response) {
            deferred.resolve(response.data);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        teacherClassHistory:  function(filter){
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "classHistoryByDate";
          APICall.getAPIData(url, filter, Config.API_METHOD_TYPE.GET).then(function (response) {
            var tutoringSessions = response.data;
            for (var i in tutoringSessions) {
              if (tutoringSessions[i].reason) {
                if (tutoringSessions[i].reason == 'badTeacher') {
                  tutoringSessions[i].reason = translateService.getTranslation('tutoring.badTeacher');
                } else if (tutoringSessions[i].reason == 'badService') {
                  tutoringSessions[i].reason = translateService.getTranslation('tutoring.badService');
                } else if (tutoringSessions[i].reason == 'otherReason') {
                  tutoringSessions[i].reason = translateService.getTranslation('tutoring.otherReason');
                } else if (tutoringSessions[i].reason == 'studentDeniedMic') {
                  tutoringSessions[i].reason = translateService.getTranslation('tutoring.studentDeniedMic');
                }
              }
              tutoringSessions[i].durationMinutes = calcTime(tutoringSessions[i]);
            }
            deferred.resolve(tutoringSessions);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        studentClassHistory:  function(filter){
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "classHistoryOfStudent/" + filter.user_id;
          APICall.getAPIData(url, filter, Config.API_METHOD_TYPE.GET).then(function (response) {
            var tutoringSessions = response.data;
            for (var i in tutoringSessions) {
              if(tutoringSessions[i].reason && !Array.isArray(tutoringSessions[i].reason)){
                tutoringSessions[i].reason= tutoringSessions[i].reason.split('.')
              }
              if(tutoringSessions[i].device && !Array.isArray(tutoringSessions[i].device)){
                tutoringSessions[i].device=tutoringSessions[i].device.split(':')
              }
              if (tutoringSessions[i].reason) {
                if (tutoringSessions[i].reason == 'badTeacher') {
                  tutoringSessions[i].reason = translateService.getTranslation('tutoring.badTeacher');
                } else if (tutoringSessions[i].reason == 'badService') {
                  tutoringSessions[i].reason = translateService.getTranslation('tutoring.badService');
                } else if (tutoringSessions[i].reason == 'otherReason') {
                  tutoringSessions[i].reason = translateService.getTranslation('tutoring.otherReason');
                } else if (tutoringSessions[i].reason == 'studentDeniedMic') {
                  tutoringSessions[i].reason = translateService.getTranslation('tutoring.studentDeniedMic');
                }
              }
              tutoringSessions[i].durationMinutes = calcTime(tutoringSessions[i]);
            }
            deferred.resolve(tutoringSessions);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        teacherLogger: function(userId,date){
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "teacherLogger/" + userId +'?date='+date;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            deferred.resolve(response.data);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

        createDemoClass: function (userId,productId,folderId,resourceType,resourceId) {
          var deferred = $q.defer();
          var url = Config.TUTORING_SRV + "demoClass";
          APICall.getAPIData(url, {
            resource_type:resourceType,
            resource_id:resourceId,
            user_id:userId,
            folder_id:folderId,
            product_id:productId
          }, Config.API_METHOD_TYPE.POST).then(function (response) {
            deferred.resolve(response.data[0]);
          }, function (response) {
            deferred.reject(response);
          });
          return deferred.promise;
        },

      };
    }]);

