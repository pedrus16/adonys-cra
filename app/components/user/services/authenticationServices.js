var module = angular.module('extranetUserModule');

module.constant('AUTHENTICATION_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

module.factory('AuthenticationService', ['$http', 'Session', '$q', 'API', function ($http, Session, $q, API) {
  var authService = {};

  /**
    @api {post} /login Login
    @apiVersion 0.0.1
    @apiName Login
    @apiGroup Authentication

    @apiParam {Object} credentials User credentials {username, password}.
    @apiParam (Credentials) {String} username User's email/username.
    @apiParam (Credentials) {String} password User's password.

    @apiSuccess {Number} TODO Define return value.

  */
  authService.login = function(credentials) {
    var deferred = $q.defer();

    if (!credentials.hasOwnProperty('username') || !credentials.hasOwnProperty('password')) {
      deferred.reject();
    }
    else {
      $http({
        method: 'POST',
        url: API.baseUrl + '/login_check',
        data: credentials
      }).then(
        function(response) {
          var user = response.data;
          Session.create(user.id, user.token, user.id, user.roles);
          deferred.resolve(user);
        },
        function(response) {
          deferred.reject();
        }
      );
    }

    return deferred.promise;
  };

  /**
    @api {post} /logout Logout
    @apiVersion 0.0.1
    @apiName Logout
    @apiGroup Authentication

    @apiParam {String} session User session.

    @apiSuccess {Boolean} success Return true if the session has been destroyed, false otherwise.

  */
  authService.logout = function() {
    // TODO API call
    Session.destroy();
  };

  authService.isAuthenticated = function () {
    return !!Session.userId;
  };

  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    console.log(authorizedRoles, Session.userRole);
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
      var data = {id: null, token: 'token123456', userId: 1, role: 'admin' }; //TODO Webservice call
      if (data.id === null) //Check for error
      {
        deferred.reject(null);
        return deferred.promise;
      }
      this.create(data.id, data.token, data.userId, data.role);
    }
    deferred.resolve({
      id: this.id,
      token: this.token,
      userId: this.userId,
      userRole: this.userRole
    });
    return deferred.promise;
  };
  this.create = function (sessionId, token, userId, userRole) {
    this.id = sessionId;
    this.token = token;
    this.userId = userId;
    this.userRole = 'admin';
  };
  this.destroy = function () {
    this.id = null;
    this.token = null;
    this.userId = null;
    this.userRole = null;
  };
}]);

module.factory('AuthenticationResolver', ['$q', 'Session', '$state',
  function($q, Session, $state) {

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
