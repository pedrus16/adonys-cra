var module = angular.module('extranetUserModule');

module.factory('UserService', ['$rootScope', '$resource', '$state', '$q', 'API', 'ERRORS', '$log',
	function ($rootScope, $resource, $state, $q, API, ERRORS, $log) {

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
		this.nextPage(true);
	};

	User.filter = function() {
		page = 1;
		this.end = false;
		this.nextPage(true);
	};

	User.search = function(query) {
		page = 1;
		this.end = false;
		User.query = query;
		this.nextPage(true);
	};

	User.nextPage = function(reset) {
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
		var users = $resource(API.baseUrl + '/users', parameters).query(function() {
			if (reset) self.items = []; // Empty the list
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
		var deferred = $q.defer();

		var user = UserResource.get({userId: id}, 
			function() {
				deferred.resolve(user);
			},
			function(error) {
				deferred.reject(ERRORS.userNotFound);
			}
		);
		return deferred.promise;

	};

	User.create = function(user) {
		var self = this;
		var newUser = UserResource.save({}, user, function() {
			self.items.unshift(newUser);
		});

	};

	User.update = function(user, callback) {
		var self = this;
		var UserUpdateResource = $resource(API.baseUrl + '/users/:userId', null,
				{
					'update': { method:'PUT' }
				}
			);
		var editedUser = UserUpdateResource.update({ userId: user.id }, user, function() {
			for (var i = 0; i < self.items.length; i++) {
				if (self.items[i].id === editedUser.id) {
					self.items[i] = editedUser;
					break;
				}
			}
			(callback || angular.noop)();
		});
	};

	User.delete = function(id) {
		var self = this;

		var deletedUser = UserResource.delete({ userId: id }, function() {
			// Updates the user list
			for (var i = 0; i < self.items.length; i++) {
				if (self.items[i].id === deletedUser.id) {
					self.items.splice(i, 1);
					break;
				}
			}
		});

	};
 
 	return User;

}]);