var module = angular.module('extranetUserModule');

module.constant('API', {
	baseUrl: 'http://5641ef34062a801100ca82b4.mockapi.io/api'
});

module.factory('UserService', ['$resource', 'API', function ($resource, API) {

	var Users = $resource(API.baseUrl + '/users');
	var User = $resource(API.baseUrl + '/users/:userId');

	return {
		getUsers: function() {
			var users = Users.query(function() {

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