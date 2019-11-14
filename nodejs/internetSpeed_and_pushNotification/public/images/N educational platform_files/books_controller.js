noonEduController.controller("BooksCtrl",
  ["APICall", "Config", "ngProgressFactory",'File','$scope','$state','Folders',
    function (APICall, Config, ngProgressFactory,FileService,$scope,$state,Folders) {
      var vm = this;

      vm.products = [];
      vm.progressbar = ngProgressFactory.createInstance();
      vm.openedProductHierarchy = [];
      vm.getProducts = function () {
        vm.progressbar.start();
        Folders.getProducts().then(function (data) {
          for (var t in data) {
            vm.products.push({
              id: data[t].id,
              customId: "P_" + data[t].id,
              slug: data[t].slug,
              name: data[t].name,
              selected: false
            });
          }
          vm.openProduct(0, vm.products);
          vm.progressbar.complete();
        }, function (e) {
          vm.progressbar.complete();
        })
      };
      vm.getProducts();

      vm.openProduct = function (index, product) {
        vm.activeQuestion={};
        for(var i in vm.products){
          vm.products[i].selected = false;
        }
        vm.selectedProduct=product[index];
        product[index].selected = true;
        Folders.getMainFolders(product[index].id).then(function (mainFolders) {
          vm.grades=mainFolders;
          //for(var i in vm.grades){
          //  vm.getBooks(vm.grades[i]);
          //}
        })
      };

      vm.showSemesters = function(grade){
        Folders.getChildren(grade.id).then(function (children) {
          grade.nodes=children;
          for(var i in grade.nodes){
            vm.getBooks(grade.nodes[i]);
          }
        })
      }

      vm.getBooks = function (folder) {
        Folders.getBooksByFolderId(folder.id).then(function (data) {
          folder.books = data;
        });
      };

      var inputId=0;
      vm.book={};
      vm.openPicModal = function (folder,book) {
        vm.book=book;
        if(!folder || !folder.id || !book || !book.name || !book.offset){
          return false;
        }
        vm.image='';
        inputId++;
        var input=document.createElement('input');
        input.type="file";
        input.name='book';
        input.id='folder_book_'+inputId;
        input.style.display='hidden';
        document.body.appendChild(input);
        var element=document.getElementById('folder_book_'+inputId);
        element.click();
        element.onchange=function(){
          vm.readURL(this,folder,book);
        }
      };

      $scope.pdfArr='';
      $scope.pdfUrl='';
      $scope.pageNum=1;
      vm.status='';
      vm.file='';
      vm.cruptedPages=[];

      vm.readURL = function (input,folder,book) {
        vm.selectedFolder=folder;
        if (input.files && input.files[0]) {
          //vm.progressbar.start();
          var reader = new FileReader();
          reader.onload = function (e) {
            vm.file = {
              data: e.target.result,
              name: input.files[0].name,
              type: input.files[0].type,
              size: Math.ceil(input.files[0].size / 1000),
              file: input.files[0]
            };
            var url = Config.FOLDER_SRV + 'books';
            APICall.getAPIData(url, {
              folder_id: folder.id,
              book_name: book.name,
              offset: book.offset
            }, Config.API_METHOD_TYPE.POST).then(function(bookResp){
              book.id=bookResp.data[0].id;
              vm.book=book;
              $scope.pdfArr=new Uint8Array(e.target.result);
              $scope.pageNum=1;
            })
            return true;
          };
          reader.readAsArrayBuffer(input.files[0]);
          vm.status='Redering New Page';
        }
      };

      $scope.onPageRender = function(){
        $scope.$apply(function(){
          var canvas = document.getElementById('pdf');
          var dataURL = canvas.toDataURL('image/png', 0.5);
          var blob=dataURItoBlob(dataURL);
          var f = new File([blob], $scope.pageNum+".png", {type: "image/png"});
          vm.image= {
            name: f.name,
            type: f.type,
            size: Math.ceil(f.size / 1000),
            file: f
          };
          vm.status='Rendered, Now Image Uploading';
          vm.uploadImage(vm.image,vm.selectedFolder,$scope.pageNum,vm.book);
        });
      };

      $scope.onPageError = function(){
        $scope.$apply(function(){
          if(vm.book.id){
            console.log('lets move to book now',vm.book.id);
            $state.go('tab.openBook',{bookId:vm.book.id})
          }
        });
      };
      //Upload Images
      vm.uploadImage = function (image,folder,pageNum,book) {
        FileService.uploadImage(image,'books/'+book.name+'_'+folder.id,'book_page_'+pageNum).then(function (data) {
          vm.status='Uploaded, Now Saving Page';
          var url = Config.FOLDER_SRV + 'pages';
          return APICall.getAPIData(url, {
            book_id: book.id,
            page_number: pageNum,
            image_uri: data.image_uri,
            image_thumbnail_uri: data.image_thumbnail_uri
          }, Config.API_METHOD_TYPE.POST);
        }).then(function (response) {
          vm.image='';
          vm.status='Page Saved, Moving to next';
          $scope.pageNum++;
        }).catch(function (error) {
          vm.image='';
          vm.cruptedPages.push($scope.pageNum);
          vm.status='Page Not Saved, Moving to next';
          $scope.pageNum++;
        });
      };


      function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
        else
          byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
      }
    }]);
  