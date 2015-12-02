var module = angular.module('extranetUserModule');

module.constant('USER_ROLES', {
  ROLE_ALL: '*',
  ROLE_ADMIN: 'admin',
  ROLE_RESPONSABLE: 'responsable',
  ROLE_CLIENT: 'client',
  ROLE_EMPLOYEE: 'collaborateur'
});

module.factory('RoleService', ['$resource', '$q', 'API', '$log', 'USER_ROLES', function ($resource, $q, API, $log, USER_ROLES) {

	var RoleResource = $resource(API.baseUrl + '/roles');
	var Role = {};

	Role.items = [];

	/**
		@api {get} /roles Get Roles
		@apiVersion 0.0.1
		@apiName GetUser
		@apiGroup Role

		@apiSuccess {String} id Human readable ID of the role.
		@apiSuccess {String} label Role label (can be translated).

		@apiSuccessExample Success-Response:
		HTTP/1.1 200 OK
		[
			{
				"id": "administrator",
				"label": "Administrateur"
			},
			{
				"id": "responsable",
				"label": "Responsable"
			},
			...
		}

		@apiError TODO Errors not yet defined
	*/
	Role.getRoles = function() {
		var deferred = $q.defer();

		this.items = [
			{
				name: 'ROLE_ADMIN',
				label: USER_ROLES.ROLE_ADMIN
			},
			{
				name: 'ROLE_RESPONSABLE',
				label: USER_ROLES.ROLE_RESPONSABLE
			},
			{
				name: 'ROLE_CLIENT',
				label: USER_ROLES.ROLE_CLIENT
			},
			{
				name: 'ROLE_EMPLOYEE',
				label: USER_ROLES.ROLE_EMPLOYEE
			}
		];
		deferred.resolve(this.items);
		return deferred.promise;
	};

	return Role;

}]);
