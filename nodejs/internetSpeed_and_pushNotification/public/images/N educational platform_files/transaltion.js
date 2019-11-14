noonEduServices
  .factory('translateService', ['$timeout', 'Config', '$localStorage', 'APICall',
    function ($timeout, Config, $localStorage, APICall) {
      var translationArray = {};
      var translationToBeDone = {};
      var timeout;

      if ($localStorage.translationArray && (Date.now() - $localStorage.translationDate) / 1000 < 3600) {
        translationArray = $localStorage.translationArray;
      } else {
        $localStorage.translationArray = {};
        $localStorage.translationDate = Date.now();
      }

      function MergeTranslation(obj1, obj2) {
        for (var p in obj2) {
          try {
            if (obj2[p].constructor == Object) {
              obj1[p] = MergeTranslation(obj1[p], obj2[p]);
            } else {
              obj1[p] = obj2[p];
            }
          } catch (e) {
            obj1[p] = obj2[p];
          }
        }
        return obj1;
      }

      var apiFailed = false;
      var newTranslationRequired = function () {
        if (apiFailed) return false;
        if (timeout) $timeout.cancel(timeout);
        timeout = $timeout(function () {
          var url = Config.TRANSLATION_SRV + "translate/";
          translationToBeDone.locale = 'ar';
          APICall.getAPIData(url, translationToBeDone, Config.API_METHOD_TYPE.POST).then(function (response) {
              translationToBeDone = {};
              translationArray = MergeTranslation(translationArray, response.data[0]);
              $localStorage.translationArray = translationArray;
            },
            function (data) {
              apiFailed = true;
              $timeout(function () {
                apiFailed = false
              }, 2000);
            });
        }, 500);
      };

      return {
        getTranslation: function (text) {
          if (text.indexOf(",") >= 0) {
            return '#ERR1#'
          }
          if (text) {
            text = text.split('.');
            if (text.length != 2) {
              return '#ERR2#'
            }
            var group = text[0];
            var item = text[1];
            if (!item) {
              group = 'messages';
              item = group;
            }
            if (translationArray && translationArray[group] && translationArray[group][item]) {
              return translationArray[group][item];
            } else {
              if (translationToBeDone[group]) {
                if (translationToBeDone[group].indexOf(item) > -1)
                  return group + '.' + item;
              } else {
                translationToBeDone[group] = [];
              }
              translationToBeDone[group].push(item);
              newTranslationRequired();
            }
            return group + '.' + item;
          }
          return '';
        }
      }
    }]);

