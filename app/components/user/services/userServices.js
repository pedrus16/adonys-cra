var module = angular.module('extranetUserModule');

module.factory('UserService', ['$rootScope', '$resource', '$state', '$q', 'API', 'ERRORS', '$log', 'Session',
	function ($rootScope, $resource, $state, $q, API, ERRORS, $log, Session) {

	console.log('token', Session.token);
	// var headers = {
	// 	Authorization: 'Bearer ' +  Session.token
	// };
	var UserResource = $resource(API.baseUrl + '/users/:userId', null),
	page = 1,
	User = {};

	User.items = [];
	User.busy = false;
	User.end = false;
	User.pageSize = 10;
	User.query = '';
	User.sortBy = '';
	User.order = '';
	User.filter = {};

	/**
		@apiDefine UserSuccess

		@apiSuccess {Number} id Users unique ID.
		@apiSuccess {String} firstname Firstname of the User.
		@apiSuccess {String} lastname  Lastname of the User.
		@apiSuccess {String} email Email of the User.
		@apiSuccess {String} company Company name the user is working at.
		@apiSuccess {String} role Role of the user (administrator, employee, client, responsable).

		@apiSuccessExample Success-Response:
		HTTP/1.1 200 OK
		{
			"id": "42",
			"firstname": "John",
			"lastname": "Doe",
			"email": "john.doe@email.com",
			"company": "Pizza Hut",
			"role": "client"
		}
	*/

	/**
		@api {get} /users Query User
		@apiVersion 0.0.1
		@apiName QueryUser
		@apiGroup User

		@apiParam {String} [search] Research keyword.
		@apiParam (Pagination) {String} [page] Page number.
		@apiParam (Pagination) {String} [limit] Maximum number of elements to return.
		@apiParam (Sorting) {String} [sortBy] Name of the property to sort by.
		@apiParam (Sorting) {String="asc", "desc"} [order] Sort order (ascending/descending).

		@apiParamExample {get} Search-Example:
		/users?search=John&page=1&limit=20&sortBy=firstname&order=asc

		@apiSuccess {Number} id Users unique ID.
		@apiSuccess {String} firstname Firstname of the User.
		@apiSuccess {String} lastname  Lastname of the User.
		@apiSuccess {String} email Email of the User.
		@apiSuccess {String} company Company name the user is working at.
		@apiSuccess {String} role Role of the user (administrator, employee, client, responsable).

		@apiSuccessExample Success-Response:
		HTTP/1.1 200 OK
		[
			{
				"id": "42",
				"firstname": "John",
				"lastname": "Doe",
				"email": "john.doe@email.com",
				"company": "Pizza Hut",
				"role": "client"
			},
			...
		]

		@apiError TODO Errors not yet defined.
	*/
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

	/**
		@api {get} /users/:id Get User
		@apiVersion 0.0.1
		@apiName GetUser
		@apiGroup User

		@apiParam {Number} id Users unique ID.

		@apiUse UserSuccess

		@apiError NotFound The id of the User was not found.

		@apiErrorExample Error-Response:
		HTTP/1.1 404 Not Found
		"Not Found"
	*/
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

	/**
		@api {post} /users Add User
		@apiVersion 0.0.1
		@apiName CreateUser
		@apiGroup User

		@apiParam {String} firstname Firstname of the User.
		@apiParam {String} lastname  Lastname of the User.
		@apiParam {String} email Email of the User.
		@apiParam {String="client","employee","responsable","administrator"} role Role of the user.
		@apiParam {String} [company] Company name the user is working at.

		@apiUse UserSuccess

		@apiError TODO Errors not yet defined
	*/
	User.create = function(user) {
		var self = this;
		var newUser = UserResource.save({}, user, function() {
			self.items.unshift(newUser);
		});

	};

	/**
		@api {put} /users/:id Edit User
		@apiVersion 0.0.1
		@apiName EditUser
		@apiGroup User

		@apiParam {String} [firstname] Firstname of the User.
		@apiParam {String} [lastname]  Lastname of the User.
		@apiParam {String} [email] Email of the User.
		@apiParam {String} [company] Company name the user is working at.
		@apiParam {String="client","employee","responsable","administrator"} [role] Role of the user.

		@apiUse UserSuccess

		@apiError NotFound The id of the User was not found.

		@apiErrorExample Error-Response:
		HTTP/1.1 404 Not Found
		"Not Found"
	*/
	User.update = function(user, callback) {
		var self = this;
		var UserUpdateResource = $resource(API.baseUrl + '/users/:userId', null,
				{
					'update': { method:'PUT' },
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

	/**
		@api {delete} /users/:id Delete User
		@apiVersion 0.0.1
		@apiName DeleteUser
		@apiGroup User

		@apiParam {Number} id Users unique ID.

		@apiUse UserSuccess

		@apiError NotFound The id of the User was not found.

		@apiErrorExample Error-Response:
		HTTP/1.1 404 Not Found
		"Not Found"
	*/
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
