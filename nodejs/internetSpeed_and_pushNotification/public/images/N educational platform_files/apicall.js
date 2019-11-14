noonEduServices
  .service('APICall', ['$http', '$q', 'Config', '$state', '$localStorage', '$rootScope',
    function ($http, $q, Config, $state, $localStorage, $rootScope) {
      return {

        getAPIData: function (endpointUrl, data, method, contentType) {
          if (method === Config.API_METHOD_TYPE.GET) {
            if (data) {
              var serialize = function (options) {
                var stringUrl = [];
                for (var option in options)
                  if (options.hasOwnProperty(option)) {
                    stringUrl.push(encodeURIComponent(option) + "=" + encodeURIComponent(options[option]));
                  }
                if(stringUrl.length)
                  return endpointUrl+'?'+stringUrl.join("&");
                else
                  return endpointUrl;
              }
              endpointUrl = serialize(data);
            }
          }
          var contentType = (contentType == 'false') ? undefined : (contentType || 'application/json');
          var token = $localStorage.token;
          if (token) token = 'Bearer ' + token;
          var locale = $localStorage.locale || "ar";
          var deferred = $q.defer();
          $http({
            method: method,
            data: data,
            url: endpointUrl,
            timeout: 40000,
            headers: {
              'Content-Type': contentType,
              'Authorization': token,
              'Locale': locale
            }
          })
            .success(function (data, status, headers, config) {
              if (headers() && headers()['x-token-refresh']) {
                $localStorage.token = headers()['x-token-refresh'];
              }
              if (data && data.message) {
                $rootScope.setMsg('success', data.message);
              }
              deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
              //403 no permission
              //402 no permission (to be removed from services)
              //401 no token
              if (status == 401) {
                $localStorage.user = '';
                $localStorage.token = '';
                $state.go('login');
              }
              if (data && data.message) {
                var errorMsg = data.message;
              } else {
                var errorMsg = Config.ERROR_MESSAGE.ERROR;
              }
              if (errorMsg) $rootScope.setMsg('error', errorMsg);
              deferred.reject(data);
            });
          return deferred.promise;
        }
      }
    }]);

