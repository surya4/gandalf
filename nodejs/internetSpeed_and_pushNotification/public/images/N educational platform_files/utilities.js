/**
 * Created by Anand Kumar S on 12-26-2015.
 */
noonEduServices
  .service('utilities', ['$interval', function ($interval) {
    return {
      // Find the item in array and get the value of the given property
      getValueByProperty: function (translationArray, propertyName) {
        var result = _.find(translationArray, function (obj) {
          return obj.item == propertyName;
        });
        return angular.isDefined(result) ? result.text : '';
      },

      /*
       Convert given time to seconds
       */
      time2sec: function (time) {
        if(!time){
          return 0;
        }
        var timeArray = time.split(":");
        if (timeArray.length == 2) {
          return parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
        }
        if (timeArray.length == 3) {
          return parseInt(timeArray[0]) * 60 * 60 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]);
        }
      },
      sec2time: function (sec, wantHour) {
        if (sec) {
          if (sec > 60) {
            var min = Math.floor(sec / 60);
            sec = sec % 60;
            if (!wantHour) {
              return min + ':' + sec;
            } else {
              if (min > 60) {
                var hour = Math.floor(min / 60);
                min = min % 60;
                return hour + ':' + min + ':' + sec;
              } else {
                return '00:' + min + ':' + sec;
              }
            }
          } else {
            if (!wantHour) {
              return '00:' + sec;
            } else {
              return '00:00:' + sec;
            }
          }
        } else {
          if (!wantHour) {
            return '00:00';
          } else {
            return '00:00:00';
          }
        }
      },
      /*
       remove hour string from time if its 0
       */
      reduceTimeString: function (time) {
        var timeArray = time.split(":");
        if (timeArray.length == 3) {
          if (timeArray[0] == '00')
            return timeArray[1] + ':' + timeArray[2];
          return timeArray[0] + ':' + timeArray[1];
        }
        if (timeArray.length == 2) {
          return time;
        }
      },

      dateToDateTimeString: function (currentdate) {
        var DD=currentdate.getDate();
        if(DD<10)DD='0'+DD;
        var MM=currentdate.getMonth()+1;
        if(MM<10)MM='0'+MM;
        var YYY=currentdate.getFullYear();
        var date=[YYY,MM,DD].join('-');
        var hh=currentdate.getHours();
        if(hh<10)hh='0'+hh;
        var mm=currentdate.getMinutes();
        if(mm<10)mm='0'+mm;
        var ss=currentdate.getSeconds();
        if(ss<10)ss='0'+ss;
        var time=[hh,mm,ss].join(':');
        return date+' '+time;
      },

      dateToDateString: function (currentdate) {
        var DD=currentdate.getDate();
        if(DD<10)DD='0'+DD;
        var MM=currentdate.getMonth()+1;
        if(MM<10)MM='0'+MM;
        var YYY=currentdate.getFullYear();
        return [YYY,MM,DD].join('-');
      }
    }
  }]);


