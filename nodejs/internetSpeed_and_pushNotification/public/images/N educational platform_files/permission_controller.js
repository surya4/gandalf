/**
 * Created by ammar on 16/09/16.
 */
noonEduController
  .controller('PermissionCtrl', ['$scope', '$stateParams', 'APICall', 'Config', '$rootScope', '$state',
    function ($scope, $stateParams, APICall, Config, $rootScope, $state) {
      var vm = this;
      vm.newPermission = {
        name: '',
        description: ''
      };
      vm.newRole = {
        id: '',
        name: '',
        level: ''
      };

      vm.getPermissionList = function (force) {
        if (vm.permissions && !force) return true;
        var url = Config.PERMISSION_SRV + "permissionsList";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.permissions = response.data;
        });
      };

      vm.getRoleList = function () {
        if (vm.roles) return true;
        var url = Config.PERMISSION_SRV + "rolesList";
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          vm.roles = response.data;
        });
      };
      vm.getPermissionList();
      vm.tabOpened = 'permissions';

      vm.openTeb = function (tabName) {
        vm.tabOpened = tabName;
        if (tabName == 'permissions') {
          //
        } else {
          vm.getRoleList();
        }
      };

      vm.allMethods = Config.API_METHOD_TYPE;
      vm.allServices = {
        user: '/users/v1/',
        translation: '/translations/v1/',
        questions: '/questions/v1/',
        folders: '/folders/v1/',
        files: '/files/v1/',
        notifications: '/notifications/v1/',
        curriculum: '/curriculum/v1/',
        tutoring:'/tutoring/v1/',
        flashcards: '/flashcards/v1/',
        questionLogger:'/questionLogger/v1/',
        permissions: '/permissions/v1/',
        packages:'/packages/v1/',
        schools:'/schools/v1/',
        elastics:'/elastics/v1/',
        tests: '/tests/v1/',
        billing: '/billing/v1/',
        competitions: '/competitions/v1/',
        mentor: '/mentor/v1/'
      };

      vm.selectMethod = {
        name: '',
        toggleMenu: false
      };
      vm.selectService = {
        name: '',
        toggleMenu: false
      };

      vm.editPermission = function (permission){
        var name=permission.name.split('.');
        for(var i in vm.allMethods){
          if(vm.allMethods[i].toLowerCase() == name[0]){
            vm.selectMethod.name=vm.allMethods[i]
          }
        }
        for(var i in vm.allServices){
          if(vm.allServices[i] == '/'+name[1]+'/'+name[2]+'/'){
            vm.selectService.name=vm.allServices[i]
          }
        }
        if(name[4]){
          name=name[3]+'/'+name[4];
        } else {
          name=name[3];
        }
        vm.newPermission = {
          id:permission.id,
          name: name,
          description: permission.description
        };
      }

      vm.deletePermission = function (permission) {
        var url = Config.PERMISSION_SRV + "permissions/"+permission.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          vm.getPermissionList(true);
        });
      }

      vm.savePermission = function () {
        if (vm.newPermission.name[0] == '/') vm.newPermission.name = vm.newPermission.name.substr(1);
        if (vm.newPermission.name[vm.newPermission.name.length - 1] == '/') vm.newPermission.name = vm.newPermission.name.substr(0, vm.newPermission.name.length - 1);
        if (!vm.newPermission.name || !vm.newPermission.description || !vm.selectService.name || !vm.selectMethod.name) {
          return false;
        }
        var permissionName = vm.selectMethod.name.toLowerCase() + vm.selectService.name.replace(/[&\/]/g, ".") + vm.newPermission.name.replace(/[&\/]/g, ".");

        var url = Config.PERMISSION_SRV + "permissions/";
        var apiMethod = Config.API_METHOD_TYPE.POST;
        if(vm.newPermission.id){
          url = Config.PERMISSION_SRV + "permissions/"+vm.newPermission.id;
          apiMethod = Config.API_METHOD_TYPE.PUT;
        }
        APICall.getAPIData(url, {
          name: permissionName,
          description: vm.newPermission.description
        }, apiMethod).then(function (response) {
          console.log(response,vm.newPermission);
          if(vm.newPermission.id){
            vm.getPermissionList(true);
          } else {
            vm.permissions.push({
              id: response.data[0].id,
              name: permissionName,
              description: vm.newPermission.description
            });
          }
          vm.newPermission = {
            name: '',
            description: ''
          };
          vm.selectMethod = {
            name: '',
            toggleMenu: false
          };
          vm.selectService = {
            name: '',
            toggleMenu: false
          };
        });
      }

      vm.saveRole = function () {
        if (!vm.newRole.name || !vm.newRole.level) {
          return false;
        }
        var url = Config.PERMISSION_SRV + "roles/";
        APICall.getAPIData(url, {
          name: vm.newRole.name,
          level: vm.newRole.level
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
          vm.roles.push({
            id: response.data[0].id,
            name: vm.newRole.name,
            level: vm.newRole.level
          });
          vm.newRole.name = '';
          vm.newRole.level = '';
        });
      }

      vm.getRolePermission = function (role) {
        for (var i in vm.roles) {
          vm.roles[i].editPermission = false;
        }
        role.editPermission = true;
        if (role.permissions) return true;
        var url = Config.PERMISSION_SRV + "permissionsForRoleList/" + role.id;
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.GET).then(function (response) {
          role.permissions = angular.copy(vm.permissions);
          for (var i in response.data) {
            for (var j in role.permissions) {
              if (role.permissions[j].id == response.data[i].permission_id) {
                role.permissions[j].role_permission_id = response.data[i].id;
                role.permissions[j].selected = true;
                role.permissions[j].prevSelected = true;
                role.permissions[j].allowed = (response.data[i].allowed) ? true : false
                role.permissions[j].prevAllowed = (response.data[i].allowed) ? true : false
              }
            }
          }
          role.services={};
          for (var j in role.permissions) {
            var perm=role.permissions[j].name.split('.');
            if(!role.services[perm[1]]){
              role.services[perm[1]]=[]
            }
            //if(!role.services[perm[1]][perm[0]]){
            //  role.services[perm[1]][perm[0]]=[];
            //}
            role.permissions[j].name=perm[0]+' '+perm[3];
            if(perm[4]){
              role.permissions[j].name=perm[0]+' '+perm[3]+'/'+perm[4];
            }
            role.services[perm[1]].push(role.permissions[j]);
          }
        });
      };

      vm.saveRolePermission = function (role) {
        role.messages = 'starting Now'
        var idsToRemove = [];
        var rolePermissionsToAdd = [];
        var rolePermissionsToUpdate = [];
        for (var j in role.permissions) {
          if (role.permissions[j].selected != role.permissions[j].prevSelected) {
            if (role.permissions[j].selected) {
              rolePermissionsToAdd.push({
                role_id: role.id,
                permission_id: role.permissions[j].id,
                allowed: (role.permissions[j].allowed) ? true : false
              });
            } else {
              idsToRemove.push(role.permissions[j].role_permission_id);
            }
          }
          if (role.permissions[j].prevSelected && role.permissions[j].selected && role.permissions[j].allowed != role.permissions[j].prevAllowed) {
            rolePermissionsToUpdate.push({
              role_permission_id: role.permissions[j].role_permission_id,
              allowed: (role.permissions[j].allowed) ? true : false
            });
          }
        }
        console.log(idsToRemove, rolePermissionsToAdd, rolePermissionsToUpdate);
        role.messages = 'Removing Permissions';
        removeRolePermssionEntry(idsToRemove, 0, function () {
          role.messages = 'Adding Permissions';
          addRolePermssionEntry(rolePermissionsToAdd, 0, function () {
            role.messages = 'Updating Permissions';
            updateRolePermssionEntry(rolePermissionsToUpdate, 0, function () {
              role.messages = 'Done';
              role.permissions = false;
              vm.getRolePermission(role);
              role.messages = '';
            });
          });
        });
      };

      var removeRolePermssionEntry = function (idsToRemove, index, cb) {
        if (idsToRemove.length <= 0) return cb();
        var url = Config.PERMISSION_SRV + "rolePermissions/" + idsToRemove[index];
        APICall.getAPIData(url, {}, Config.API_METHOD_TYPE.DELETE).then(function (response) {
          index++;
          if (index < idsToRemove.length) {
            removeRolePermssionEntry(idsToRemove, index, cb);
          } else {
            cb();
          }
        });
      }

      var addRolePermssionEntry = function (rolePermissionsToAdd, index, cb) {
        if (rolePermissionsToAdd.length <= 0) return cb();
        var url = Config.PERMISSION_SRV + "rolePermissions/";
        APICall.getAPIData(url, {
          role_id: rolePermissionsToAdd[index].role_id,
          permission_id: rolePermissionsToAdd[index].permission_id,
          allowed: (rolePermissionsToAdd[index].allowed) ? '1' : '0'
        }, Config.API_METHOD_TYPE.POST).then(function (response) {
          index++;
          if (index < rolePermissionsToAdd.length) {
            addRolePermssionEntry(rolePermissionsToAdd, index, cb);
          } else {
            cb();
          }
        });
      }

      var updateRolePermssionEntry = function (rolePermissionsToUpdate, index, cb) {
        if (rolePermissionsToUpdate.length <= 0) return cb();
        var url = Config.PERMISSION_SRV + "rolePermissions/" + rolePermissionsToUpdate[index].role_permission_id;
        APICall.getAPIData(url, {
          allowed: rolePermissionsToUpdate[index].allowed
        }, Config.API_METHOD_TYPE.PUT).then(function (response) {
          index++;
          if (index < rolePermissionsToUpdate.length) {
            updateRolePermssionEntry(rolePermissionsToUpdate, index, cb);
          } else {
            cb();
          }
        });
      }

    }]);