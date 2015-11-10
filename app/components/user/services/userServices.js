var module = angular.module('extranetUserModule');

module.factory('UserService', ['$resource', function ($resource) {

	var User = $resource('http://5641ef34062a801100ca82b4.mockapi.io/api/users');

	return {
		getUsers: function() {
			var users = User.query(function() {

			});
			return users;
		},
		getUser: function(id) {
			var user = User.get({userId: id}, function() {

			});
			return user;
		}
	};

}]);