var module = angular.module('extranetUserModule');

module.factory('RoleService', ['$resource', 'API', function ($resource, API) {

	var RoleResource = $resource(API.baseUrl + '/roles');
	var Role = {};

	Role.getRoles = function() {
		var roles = RoleResource.query(function() {});
		return roles; 
	};

	return Role;

}]);