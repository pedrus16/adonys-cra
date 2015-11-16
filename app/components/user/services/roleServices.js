var module = angular.module('extranetUserModule');

module.factory('RoleService', ['$resource', 'API', function ($resource, API) {

	var RoleResource = $resource(API.baseUrl + '/roles');
	var Role = {};
	
	Role.items = [];

	Role.getRoles = function() {
		this.items = RoleResource.query(function() {});
		return this.items; 
	};

	return Role;

}]);