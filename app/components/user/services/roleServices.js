var module = angular.module('extranetUserModule');

module.factory('RoleService', ['$resource', '$q', 'API', '$log', function ($resource, $q, API, $log) {

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

		this.items = RoleResource.query(
			function(roles) {
				deferred.resolve(roles);
			},
			function() {
				deferred.reject([]);
			}
		);
		return deferred.promise;
	};

	return Role;

}]);