var module = angular.module('extranetUserModule');

module.factory('RoleService', ['$resource', '$q', 'API', '$log', function ($resource, $q, API, $log) {

	var RoleResource = $resource(API.baseUrl + '/roles');
	var Role = {};
	
	Role.items = [];

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