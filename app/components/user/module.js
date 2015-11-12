var module = angular.module('extranetUserModule', [
	'infinite-scroll'
]);

module.config(['$stateProvider', 'USER_ROLES', function($stateProvider, USER_ROLES) {

	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl: 'app/components/user/views/login.html',
		controller: 'LoginController',
		data: {
			authorizedRoles: [USER_ROLES.all]
		}
	})
	.state('logout', {
		url: '/logout',
		controller: 'LogoutController',
		data: {
			authorizedRoles: [USER_ROLES.all]
		}
	})
	.state('users', {
		url:'/users',
		templateUrl: 'app/components/user/views/list.html',
		controller: 'UsersController',
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		},
		resolve: {
            isAuthenticated: function (AuthenticationResolver) {
                return AuthenticationResolver.resolve();
            }
        }
	})
	.state('users-detail', {
		url:'/users/:userId',
		templateUrl: 'app/components/user/views/user.detail.html',
		controller: 'UserDetailController',
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		},
		resolve: {
            isAuthenticated: function (AuthenticationResolver) {
                return AuthenticationResolver.resolve();
            }
        }
	});

}]);