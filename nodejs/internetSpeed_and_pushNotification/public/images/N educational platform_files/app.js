var userToken = '';
var wirisObj = '';//dont minify this as this varible is used in lib

// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('noon', ['noonEduController',
  'noonEduServices',
  'noonDirectives',
  'noonFilters',
  'noonEduFactories',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'ngProgress',
  'ang-drag-drop',
  'swaggerUi',
  'rzModule'
  //'LZString'
])

  .run(['$rootScope', '$localStorage', function ($rootScope, $localStorage) {
    userToken = $localStorage.token;
    $rootScope.setMsg = function (type, msg) {
      $rootScope[type + 'Notification'] = msg;
      setTimeout(function () {
        $rootScope.$apply(function () {
          $rootScope[type + 'Notification'] = '';
        });
      }, 2000);
    };
  }])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('landing', {
        url: "/landing",
        templateUrl: "/www/app/components/landing/landing.html",
        controller: "LandingCtrl",
        controllerAs: "vm"
      })
      .state('login', {
        url: '/login?token',
        templateUrl: '/www/app/components/login/login.html',
        controller: "LoginCtrl",
        controllerAs: "vm"
      })
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: '/www/app/components/tab/tab.html',
        controller: "TabCtrl",
        controllerAs: "vm"
      })
      .state('tab.testList', {
        url: '/testList',
        templateUrl: '/www/app/components/test/list.html',
        controller: "TestListCtrl",
        controllerAs: "vm"
      })
      .state('tab.testType', {
        url: '/testType',
        templateUrl: '/www/app/components/test/testType.html',
        controller: "TestTypeCtrl",
        controllerAs: "vm"
      })
      .state('tab.testCreate', {
        url: '/testCreate',
        templateUrl: '/www/app/components/test/create.html',
        controller: "TestCreateCtrl",
        controllerAs: "vm"
      })
      .state('tab.testEdit', {
        url: '/testEdit/:testId',
        templateUrl: '/www/app/components/test/edit.html',
        controller: "TestEditCtrl",
        controllerAs: "vm"
      })
      .state('tab.profile', {
        url: '/profile',
        templateUrl: '/www/app/components/profile/profile.html',
        controller: "ProfileCtrl",
        controllerAs: "vm"
      })
      .state('tab.dashboard', {
        url: '/dashboard',
        templateUrl: '/www/app/components/dashboard/dashboard.html',
        controller: "DashboardCtrl",
        controllerAs: "vm"
      })
      .state('tab.userList', {
        url: '/userList',
        templateUrl: '/www/app/components/user/list.html',
        controller: "UserListCtrl",
        controllerAs: "vm"
      })
      .state('tab.packageFeedback', {
        url: '/packageFeedback',
        templateUrl: '/www/app/components/transaction/feedback.html',
        controller: "FeedbackCtrl",
        controllerAs: "vm"
      })
      .state('tab.request', {
        url: '/request',
        templateUrl: '/www/app/components/request/request.html',
        controller: "RequestCtrl",
        controllerAs: "vm"
      })
      .state('tab.userTransaction', {
        url: '/userTransaction',
        templateUrl: '/www/app/components/transaction/transaction.html',
        controller: "TransactionCtrl",
        controllerAs: "vm"
      })
      //.state('tab.userEdit', {
      //  url: '/userEdit/:userId?role',
      //  templateUrl: '/www/app/components/user/edit.html',
      //  controller: "UserEditCtrl",
      //  controllerAs: "vm"
      //})
      .state('tab.userView', {
        url: '/userView/:userId?role',
        templateUrl: '/www/app/components/user/view.html',
        controller: "UserViewCtrl",
        controllerAs: "vm"
      })
      .state('tab.userCreate', {
        url: '/userCreate',
        templateUrl: '/www/app/components/user/create.html',
        controller: "UserCreateCtrl",
        controllerAs: "vm"
      })
      .state('tab.translationList', {
        url: '/translationList',
        templateUrl: '/www/app/components/translation/list.html',
        controller: "TranslationListCtrl",
        controllerAs: "vm"
      })
      .state('tab.translationRemaining', {
        url: '/translationRemaining',
        templateUrl: '/www/app/components/translation/remaining.html',
        controller: "TranslationRemainingCtrl",
        controllerAs: "vm"
      })
      .state('tab.translationCreate', {
        url: '/translationCreate',
        templateUrl: '/www/app/components/translation/create.html',
        controller: "TranslationCreateCtrl",
        controllerAs: "vm"
      })
      .state('tab.translationEdit', {
        url: '/translationEdit/:translationId',
        templateUrl: '/www/app/components/translation/edit.html',
        controller: "TranslationEditCtrl",
        controllerAs: "vm"
      })
      .state('tab.mcqCreate', {
        url: '/mcqCreate',
        templateUrl: '/www/app/components/mcq/create.html',
        controller: "McqCreateCtrl",
        controllerAs: "vm"
      })
      .state('tab.mcqReview', {
        url: '/mcqReview',
        templateUrl: '/www/app/components/mcq/review.html',
        controller: "McqReviewCtrl",
        controllerAs: "vm"
      })
      .state('tab.mcqList', {
        url: '/mcqList',
        templateUrl: '/www/app/components/mcq/list.html',
        controller: "McqListCtrl",
        controllerAs: "vm"
      })
      .state('tab.mcqEdit', {
        url: '/mcqEdit/:mcqId',
        templateUrl: '/www/app/components/mcq/edit.html',
        controller: "McqEditCtrl",
        controllerAs: "vm"
      })
      .state('tab.questionType', {
        url: '/questionType',
        templateUrl: '/www/app/components/mcq/question_type.html',
        controller: "QuestionTypeCtrl",
        controllerAs: "vm"
      })
      .state('tab.passageList', {
        url: '/passageList',
        templateUrl: '/www/app/components/passage/list.html',
        controller: "passageListCtrl",
        controllerAs: "vm"
      })
      .state('tab.passageEdit', {
        url: '/passageEdit/:passageId',
        templateUrl: '/www/app/components/passage/edit.html',
        controller: "PassageEditCtrl",
        controllerAs: "vm"
      })
      .state('tab.folder', {
        url: '/folder',
        templateUrl: '/www/app/components/folder/folder.html',
        controller: "FolderCtrl",
        controllerAs: "vm"
      })
      .state('tab.product', {
        url: '/product',
        templateUrl: '/www/app/components/product/product.html',
        controller: "ProductCtrl",
        controllerAs: "vm"
      })
      .state('tab.books', {
        url: '/books',
        templateUrl: '/www/app/components/books/books.html',
        controller: "BooksCtrl",
        controllerAs: "vm"
      })
      .state('tab.openBook', {
        url: '/openBook/:bookId',
        templateUrl: '/www/app/components/books/openBook.html',
        controller: "OpenBookCtrl",
        controllerAs: "vm"
      })
      .state('tab.swagger', {
        url: '/swagger',
        templateUrl: '/www/app/components/swagger/swagger.html',
        controller: "SwaggerCtrl",
        controllerAs: "vm"
      })
      .state('tab.flashcardList', {
        url: '/flashcardList',
        templateUrl: '/www/app/components/flashcard/list.html',
        controller: "FlashcardListCtrl",
        controllerAs: "vm"
      })
      .state('tab.flashcardCreate', {
        url: '/flashcardCreate',
        templateUrl: '/www/app/components/flashcard/create.html',
        controller: "FlashcardCreateCtrl",
        controllerAs: "vm"
      })
      .state('tab.flashcardEdit', {
        url: '/flashcardEdit/:flashcardId',
        templateUrl: '/www/app/components/flashcard/edit.html',
        controller: "FlashcardEditCtrl",
        controllerAs: "vm"
      })
      .state('tab.schoolList', {
        url: '/schoolList',
        templateUrl: '/www/app/components/school/list.html',
        controller: "SchoolListCtrl",
        controllerAs: "vm"
      })
      .state('tab.schoolCreate', {
        url: '/schoolCreate',
        templateUrl: '/www/app/components/school/create.html',
        controller: "SchoolCreateCtrl",
        controllerAs: "vm"
      })
      .state('tab.schoolEdit', {
        url: '/schoolCreate/:schoolId',
        templateUrl: '/www/app/components/school/edit.html',
        controller: "SchoolEditCtrl",
        controllerAs: "vm"
      })
      .state('tab.schoolInsert', {
        url: '/schoolInsert/:schoolId',
        templateUrl: '/www/app/components/school/insert.html',
        controller: "SchoolInsertCtrl",
        controllerAs: "vm"
      })
      .state('tab.company', {
        url: '/company',
        templateUrl: '/www/app/components/school/company.html',
        controller: "CompanyCtrl",
        controllerAs: "vm"
      })
      .state('tab.voucherList', {
        url: '/voucherList',
        templateUrl: '/www/app/components/voucher/list.html',
        controller: "VoucherListCtrl",
        controllerAs: "vm"
      })
      .state('tab.voucherAddon', {
        url: '/voucherAddon/:voucherId',
        templateUrl: '/www/app/components/voucher/voucher_addon.html',
        controller: "VoucherAddonCtrl",
        controllerAs: "vm"
      })
      .state('tab.voucherCreate', {
        url: '/voucherCreate',
        templateUrl: '/www/app/components/voucher/create.html',
        controller: "VoucherCreateCtrl",
        controllerAs: "vm"
      })
      .state('tab.voucherEdit', {
        url: '/voucherEdit/:voucherId',
        templateUrl: '/www/app/components/voucher/edit.html',
        controller: "VoucherEditCtrl",
        controllerAs: "vm"
      })
      .state('tab.permission', {
        url: '/permission',
        templateUrl: '/www/app/components/permission/permission.html',
        controller: "PermissionCtrl",
        controllerAs: "vm"
      })
      .state('tab.packages', {
        url: '/packages',
        templateUrl: '/www/app/components/packages/packages.html',
        controller: "PackagesCtrl",
        controllerAs: "vm"
      })
      .state('tab.packagesAddon', {
        url: '/packagesAddon/:packageId',
        templateUrl: '/www/app/components/packages/packagesAddon.html',
        controller: "PackagesAddonCtrl",
        controllerAs: "vm"
      })
      .state('tab.paymentMethod', {
        url: '/paymentMethod',
        templateUrl: '/www/app/components/payment_method/payment_method.html',
        controller: "PaymentMethodCtrl",
        controllerAs: "vm"
      })
      .state('tab.bank', {
        url: '/bank',
        templateUrl: '/www/app/components/bank/bank.html',
        controller: "BankCtrl",
        controllerAs: "vm"
      })
      .state('tab.jobsList', {
        url: '/jobsList',
        templateUrl: '/www/app/components/jobs/list.html',
        controller: 'JobsListCtrl',
        controllerAs: "vm"
      });
    $urlRouterProvider.otherwise("/landing");
  }]);

var noonEduController = angular.module('noonEduController', []);
var noonEduServices = angular.module('noonEduServices', []);
var noonDirectives = angular.module('noonDirectives', []);
var noonFilters = angular.module('noonFilters', []);
var noonEduFactories = angular.module('noonEduFactories', []);
