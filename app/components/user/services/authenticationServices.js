var module = angular.module('extranetUserModule');

module.constant('AUTHENTICATION_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

module.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  responsable: 'responsable',
  client: 'client',
  collaborateur: 'collaborateur'
});

module.factory('AuthenticationService', ['$http', 'Session', '$q', function ($http, Session, $q) {
  var authService = {};

  authService.login = function(username, password) {
    // return $http
    // .post('/login', credentials)
    // .then(function (res) {
    //   Session.create(res.data.id, res.data.user.id,
    //     res.data.user.role);
    //   return res.data.userIdser;
    // });
    Session.create(42, 1, 'admin'); // TODO Fetch from webservice

    var deferred = $q.defer();
    var user = {
      sessionId: 42, 
      userId: 1, 
      role: 'admin'
    };

    deferred.resolve(user);

    return deferred.promise;
  };

  authService.logout = function() {
    Session.destroy();
  };

  authService.isAuthenticated = function () {
    return !!Session.userId;
  };

  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };

  return authService;
}]);

module.service('Session', ['$q', function ($q) {
  this.getUser = function() {
    var deferred = $q.defer();
    if (angular.isUndefined(this.id) || this.id === null)
    {
      var data = {id: 42, userId: 1, role: 'admin' }; //TODO Webservice call
      if (data.id === null) //Check for error
      {
        deferred.reject(null);
        return deferred.promise;
      }
      this.create(data.id, data.userId, data.role);
    }
    deferred.resolve({
      id: this.id,
      userId: this.userId,
      userRole: this.userRole
    });
    return deferred.promise;
  };
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
}]);

module.factory('AuthenticationResolver', ['$q', 'Session', 
  function($q, Session) {

  return {
    resolve: function() {
      var deferred = $q.defer();
      Session.getUser().then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject();
          $state.go('login');
        }
      );
      return deferred.promise;
    }
  };

}]);