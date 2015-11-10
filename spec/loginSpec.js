describe("User Login Form", function() {

	beforeEach(module('extranetApp'));

	var $controller,
		$rootScope,
		AUTHENTICATION_EVENTS,
		AuthenticationService,
		Session;

	beforeEach(inject(function(
		_$controller_, 
		_$rootScope_,
		_AUTHENTICATION_EVENTS_,
		_AuthenticationService_,
		_Session_){
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		AUTHENTICATION_EVENTS = _AUTHENTICATION_EVENTS_
		AuthenticationService = _AuthenticationService_
		Session = _Session_;
	}));


	it('should create the following session {id: 42, userId: 1, role: \'admin\'}', function () {
		var $scope = {};
		var controller = $controller('LoginController', { 
			$scope: 				$scope,
			$rootScope: 			$rootScope, 
			AUTHENTICATION_EVENTS: 	AUTHENTICATION_EVENTS, 
			AuthenticationService: 	AuthenticationService, 
			Session: 				Session
		});
		$scope.login({
			username: 'pierre.nole@gmail.com',
			password: '123456'
		});
		expect(Session.id).toBe(42);
		expect(Session.userId).toBe(1);
		expect(Session.userRole).toBe('admin');
	});

	it('should destroy the session', function () {
		var $scope = {};
		var controller = $controller('LoginController', { 
			$scope: 				$scope,
			$rootScope: 			$rootScope, 
			AUTHENTICATION_EVENTS: 	AUTHENTICATION_EVENTS, 
			AuthenticationService: 	AuthenticationService, 
			Session: 				Session
		});
		Session.destroy();
		expect(Session.id).toBeNull();
		expect(Session.userId).toBeNull();
		expect(Session.userRole).toBeNull();
	});

});
