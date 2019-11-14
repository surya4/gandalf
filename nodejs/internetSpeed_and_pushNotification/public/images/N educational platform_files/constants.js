if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      console.log('Cannot convert undefined or null to object');
    }
    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

if (window && window.__env) {
  Object.assign(__env, window.__env);
} else {
  console.log('ERROR::::: Cant find env.js');
}
__env.LOADING_TEMPLATE = '';
__env.API_METHOD_TYPE = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};
__env.ERROR_MESSAGE = {
  NETWORK_NOT_AVAILABLE: 'لا يتوفر اتصال بالانترنت . الرجاء التأكد من اتصالك بالشبكة',
  ERROR: ' خطأ بالخادم',
  503: 'هناك تطويرات يتم اضافتها الآن لمنصة نون التعليمية. ثق بنا : انها تستاهل منك الانتظار',
  404: 'غير موجود',
  403: 'ليس لديك الامتيازات الكافية لإجراء هذه العملية',
  500: ' خطأ بالخادم'
};
__env.ROLE_ID = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  DATA_ENTRY: 3,
  ADMIN_READ:8
};

angular.module('noon')
  .constant('Config', __env)
