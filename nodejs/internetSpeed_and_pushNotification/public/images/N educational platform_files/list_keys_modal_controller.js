noonEduController
  .controller('ListKeysModalCtrl', ['$uibModalInstance', '$uibModal','APICall','Config',
    function ($uibModalInstance, $uibModal,APICall,Config) {
      var vm = this;


      vm.getRedisKeys = function () {
        var url = Config.TRANSLATION_SRV + "allTranslationKeys";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.keys={};
          for(var i in response.data){
            var obj={};
            obj.key=response.data[i];
            var splitted=response.data[i].split(':');
            obj.localedId=splitted[1] || 'NA';
            obj.group=splitted[2] || 'NA';
            obj.text=splitted[3] || 'NA';
            if(!vm.keys[obj.localedId]){
              vm.keys[obj.localedId]={};
            }
            if(!vm.keys[obj.localedId][obj.group]){
              vm.keys[obj.localedId][obj.group]=[];
            }
            vm.keys[obj.localedId][obj.group].push({
              text:obj.text.split('.'),
              key:obj.key
            });
          }
        });
      };
      vm.getRedisKeys();

      vm.deleteTranslationKey = function(key){
        var url = Config.TRANSLATION_SRV + "translationKeys/";
        APICall.getAPIData(url, {key:key}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          vm.getRedisKeys();
        });
      }

      vm.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
      };

    }]);
