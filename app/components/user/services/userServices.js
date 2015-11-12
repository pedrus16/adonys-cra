var module = angular.module('extranetUserModule');

module.constant('API', {
	baseUrl: 'http://5641ef34062a801100ca82b4.mockapi.io/api'
});

module.factory('UserService', ['$resource', 'API', function ($resource, API) {

	var UserResource = $resource(API.baseUrl + '/users/:userId');
	var page = 1;
	var User = {};

	User.items = [];
	User.busy = false;
	User.end = false;
	User.pageSize = 10;
	User.query = '';

	User.search = function(query) {
		User.query = query;
		console.log('SEARCH', User.query);
		page = 1;
		this.end = false;
		User.items = [];
		this.nextPage();
	}

	User.nextPage = function() {
		var self = this;
		var parameters = {};

		if (self.busy || self.end) {
			return;
		}
		self.busy = true;

		parameters.page = page;
		parameters.limit = self.pageSize;
		if (self.query) {
			parameters.search = self.query;
		}
		var UsersResource = $resource(API.baseUrl + '/users', parameters);
		var users = UsersResource.query(function() {
			for (var i = 0; i < users.length; i++) {
				self.items.push(users[i]);
			}
			page = page + 1;
			self.busy = false;
			if (users.length < self.pageSize) {
				self.end = true;
			}
		});

	};
	
	User.getUser = function(id) {

		var user = UserResource.get({userId: id}, function() {});
		return user;

	};

	return User;

}]);