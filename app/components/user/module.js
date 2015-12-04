var module = angular.module('extranetUserModule', [
	'infinite-scroll'
]);

module.config(['$stateProvider', 'USER_ROLES', function($stateProvider, USER_ROLES) {

	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl: 'app/components/user/views/login.html',
		controller: 'LoginController'
	})
	.state('logout', {
		url: '/logout',
		controller: function(AuthenticationService, $state) {
			AuthenticationService.logout();
			$state.go('login');
		}
	})
	.state('main.users', {
		url:'/users',
		views: {
			'content': {
				controller: 'UsersController',
				templateUrl: 'app/components/user/views/list.html'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.ROLE_ADMIN, USER_ROLES.ROLE_RESPONSABLE]
		}
	})
	.state('main.user-detail', {
		url:'/users/{userId:int}',
		views: {
			'content': {
				templateUrl: 'app/components/user/views/user.detail.html',
				controller: 'UserDetailController'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.ROLE_ADMIN, USER_ROLES.ROLE_RESPONSABLE]
		},
		resolve: {
			resolvedUser: ['$stateParams', 'UserService', function($stateParams, UserService) {
				return UserService.getUser($stateParams.userId);
			}]
		}
	})
	.state('main.user-add', {
		url:'/users/add',
		views: {
			'content': {
				templateUrl: 'app/components/user/views/user.edit.html',
				controller: 'UserAddController'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.ROLE_ADMIN, USER_ROLES.ROLE_RESPONSABLE]
		}
	})
	.state('main.user-edit', {
		url:'/users/{userId:int}/edit',
		views: {
			'content': {
				templateUrl: 'app/components/user/views/user.edit.html',
				controller: 'UserEditController'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.ROLE_ADMIN, USER_ROLES.ROLE_RESPONSABLE]
		},
		resolve: {
			resolvedUser: ['$stateParams', 'UserService', function($stateParams, UserService) {
				return UserService.getUser($stateParams.userId);
			}]
		}
	})
	.state('main.user-delete', {
		url: '/users/delete/{userId:int}',
		views: {
			'content': {
				controller: 'UserDeleteController',
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.ROLE_ADMIN]
		},
		resolve: {
			resolvedUser: ['$stateParams', 'UserService', function($stateParams, UserService) {
				return UserService.getUser($stateParams.userId);
			}],
			resolveConfirm: ['$uibModal', function($uibModal) {

				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'app/shared/views/confirm.html',
					controller: function($scope, $uibModalInstance) {
						$scope.confirm = function() {
							$uibModalInstance.close();
						};

						$scope.close = function() {
							$uibModalInstance.dismiss();
						};
					},
					size: 'md'
				});

				return modalInstance.result;

			}]
		}
	});

}]);
