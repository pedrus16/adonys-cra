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
	User.sortBy = '';
	User.order = '';
	User.filter = {};

	User.sort = function() {
		page = 1;
		this.end = false;
		User.items = [];
		this.nextPage();
	};

	User.filter = function() {
		page = 1;
		this.end = false;
		User.items = [];
		this.nextPage();
	};

	User.search = function(query) {
		if (!query) return;
		page = 1;
		this.end = false;
		User.items = [];
		User.query = query;
		this.nextPage();
	};

	User.nextPage = function() {
		if (this.busy || this.end) return;
		var self = this;
		var parameters = {};

		self.busy = true;
		parameters.page = page;
		parameters.limit = self.pageSize;
		if (self.query) {
			parameters.search = self.query;
		}
		if (self.sortBy) {
			parameters.sortBy = self.sortBy;
			parameters.order = self.order;
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