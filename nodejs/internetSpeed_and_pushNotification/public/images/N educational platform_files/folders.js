noonEduServices
  .service('Folders', ['$rootScope', 'Config', '$localStorage', 'APICall', '$q',
    function ($rootScope, Config, $localStorage, APICall, $q) {

      var folders={};
      var getAllLevelChildren={};
      var folderChildren={};
      var products='';
      var productsOfCountry={};
      var pdf={};
      var pages={};
      var folderForProduct={};
      var mainFolders={};
      var books={};

      var enterLesson = function (chapter, allFolders) {
        chapter.nodes = [];
        for (var i in allFolders) {
          if (allFolders[i].parent == chapter.id + '.' + chapter.parent) {
            chapter.nodes.push(allFolders[i]);
            enterLesson(chapter.nodes[chapter.nodes.length-1], allFolders);
          }
        }
      };

      return {

        getProducts: function () {
          var deferred = $q.defer();
          if(products){
            deferred.resolve(products);
          } else {
            var url = Config.FOLDER_SRV + 'products';
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              products=response.data;
              deferred.resolve(products);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        folderForProduct: function (productId) {
          var deferred = $q.defer();
          productId=parseInt(productId);
          if(!productId || productId<=0){
            deferred.reject('no id given');
          } else if(folderForProduct[productId]){
            deferred.resolve(folderForProduct[productId]);
          } else {
            var url = Config.FOLDER_SRV + "folderForProduct/" + productId;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              folderForProduct[productId]=response.data[0];
              deferred.resolve(response.data[0]);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getById: function (folderId) {
          var deferred = $q.defer();
          folderId=parseInt(folderId);
          if(!folderId || folderId<=0){
            deferred.reject('no id given');
          } else if(folders[folderId]){
            deferred.resolve(folders[folderId]);
          } else {
            var url = Config.FOLDER_SRV + "folders/" + folderId;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              folders[folderId]=response.data[0];
              deferred.resolve(response.data[0]);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getAllLevelChildren: function (folderId) {
          var deferred = $q.defer();
          folderId=parseInt(folderId);
          if(!folderId || folderId<=0){
            deferred.reject('no id given');
          } else if(getAllLevelChildren[folderId]){
            deferred.resolve(getAllLevelChildren[folderId]);
          } else {
            var url = Config.FOLDER_SRV + "getAllLevelChildren/" + folderId;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function(response){
              var allFolders = response.data;
              var chapters=[];
              for (var i in allFolders) {
                if (allFolders[i].parent.indexOf(folderId+'.')==0) {
                  chapters.push(allFolders[i]);
                  enterLesson(chapters[chapters.length-1], allFolders);
                }
              }
              getAllLevelChildren[chapters]
              deferred.resolve(chapters);
            },function(response){
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getMainFolders: function (productId) {
          var deferred = $q.defer();
          if(mainFolders[productId]){
            deferred.resolve(mainFolders[productId]);
          } else {
            var url = Config.FOLDER_SRV + "getMainFolders/" + productId;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function(response){
              mainFolders[productId]=response.data;
              deferred.resolve(response.data);
            },function(response){
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getChildren: function (folderId) {
          var deferred = $q.defer();
          var url = Config.FOLDER_SRV + "getChildren/" + folderId;
          APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
            if(response.data){
              response.data.sort(function(a, b) {
                if (a.order < b.order) {
                  return -1;
                }
                if (a.order > b.order) {
                  return 1;
                }
                return 0;
              });
            }
            deferred.resolve(response.data);
          },function(response){
            deferred.reject(response);
          });
          return deferred.promise;
        },

        getProductsByCountry: function(){
          var deferred = $q.defer();
          if(productsOfCountry[Config.COUNTRY.ID]){
            deferred.resolve(productsOfCountry[Config.COUNTRY.ID]);
          }
          else{
            var url = Config.FOLDER_SRV + "productsOfCountry/"+Config.COUNTRY.ID;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
                productsOfCountry[Config.COUNTRY.ID] = response.data;
                deferred.resolve(response.data);
              },
              function(){
                deferred.reject({});
              });
          }
          return deferred.promise;
        },

        searchPdf: function (pageNum,folderId) {
          var deferred = $q.defer();
          folderId=parseInt(folderId);
          pageNum=parseInt(pageNum);
          if(!folderId || folderId<=0){
            deferred.reject('no id given');
          } else if(!pageNum || pageNum<=0){
            deferred.reject('no pageNum given');
          } else if(pdf[folderId] && pdf[folderId][pageNum]){
            deferred.resolve(pdf[folderId][pageNum]);
          } else {
            var url = Config.FOLDER_SRV + "searchPage/" + folderId + "?page_no=" + pageNum;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              if(!pdf[folderId]){
                pdf[folderId]={};
              }
              for(var i in response.data){
                pages[response.data[i].id]=response.data[i];
              }
              pdf[folderId][pageNum]=response.data;
              deferred.resolve(response.data);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getPage: function (id) {
          var deferred = $q.defer();
          id=parseInt(id);
          if(!id || id<=0){
            deferred.reject('no id given');
          } else {
            var url = Config.FOLDER_SRV + "pages/" + id;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              pages[id]=response.data[0];
              deferred.resolve(response.data[0]);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

        getBooksByFolderId: function (folderId) {
          var deferred = $q.defer();
          folderId=parseInt(folderId);
          if(!folderId || folderId<=0){
            deferred.reject('no id given');
          } else if(books[folderId]){
            deferred.resolve(books[folderId]);
          } else {
            var url = Config.FOLDER_SRV + "booksByFolderId/" + folderId;
            APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
              books[folderId]=response.data;
              deferred.resolve(response.data);
            }, function (response) {
              deferred.reject(response);
            });
          }
          return deferred.promise;
        },

      };
    }]);

