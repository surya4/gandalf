noonFilters
  .filter('noonTranslate', ['translateService', function (translateService) {
    var noonTranslate = function (text) {
      var trans = translateService.getTranslation(text);
      if(text==trans){
        return '• ✏ •';
      }
      return trans;
    };
    noonTranslate.$stateful = true;
    return noonTranslate;
  }])

  .filter('orderObjectBy', function () {
    return function (items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function (item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if (reverse) filtered.reverse();
      return filtered;
    };
  })

  .filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
      return $sce.trustAsHtml(text);
    };
  }])

  .filter('getOnlyDate', [function () {
    return function (fullDate) {
      if(!fullDate){
        return '';
      }
      var date = fullDate.split('T')[0];
      if(fullDate.split('T')[1]){
        var time = fullDate.split('T')[1].split('.')[0];
      } else {
        var time = '00:00:00'
      }
      var newDate=new Date(date+' '+time)
      newDate.setTime(newDate.getTime() + (3*60*60*1000));
      var monthNames = [ "Jan", "Feb", "Mar",  "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
      var day = newDate.getDate();
      var monthIndex = newDate.getMonth();
      var year = newDate.getFullYear();
      return day + ' ' + monthNames[monthIndex] + ' ' + year;
    };
  }])

  .filter('getDateTime', [function () {
    return function (fullDate) {
      if(!fullDate){
        return '';
      }
      var date = fullDate.split('T')[0];
      if(fullDate.split('T')[1]){
        var time = fullDate.split('T')[1].split('.')[0];
      } else {
        var time = '00:00:00'
      }
      var newDate=new Date(date+' '+time)
      newDate.setTime(newDate.getTime() + (3*60*60*1000));
      return newDate.toLocaleString();
    };
  }])

  .filter('formatTimeToGMT3', [function () {
    return function (fullTime) {
      //converts 14:00:00 to 17:00
      if (!fullTime) return null;
      var time=fullTime.split(':');
      time[0]=(parseInt(time[0])+3)%24;
      return time[0]+':'+time[1];
    };
  }])

  .filter('escape_url', function () {
    return function (url) {
      var urlSegments = url.split('/');
      urlSegments[urlSegments.length - 1] = window.encodeURIComponent(urlSegments[urlSegments.length - 1]);
      var encodedUrl = urlSegments[0];
      for (var i = 1; i < urlSegments.length; i++) {
        encodedUrl = encodedUrl + '/' + urlSegments[i]
      }
      return encodedUrl;
    };
  });
