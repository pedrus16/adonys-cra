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
          Session.create(user);
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
    return !!Session.user.id;
  };

  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    var isAuthorized = false;
    for (var i = 0; i < authorizedRoles.length; ++i) {
      if (Session.user.roles.indexOf(authorizedRoles[i]) !== -1) {
        isAuthorized = true;
      }
    }
    return (authService.isAuthenticated() && isAuthorized);
  };

  return authService;
}]);

module.service('Session', ['$q', '$cookies', '$http', function ($q, $cookies, $http) {

  this.user = {};

  this.getUser = function() {
    var deferred = $q.defer();
    if (angular.isUndefined(this.user.id) || this.user.id === null)
    {
      var user = $cookies.getObject('user');
      if (typeof user === 'undefined' || user.id === null) //Check for error
      {
        deferred.reject(null);
        return deferred.promise;
      }
      this.user = user;
      $http.defaults.headers.common.Authorization = 'Bearer ' + this.user.token;
    }
    deferred.resolve(this.user);
    return deferred.promise;
  };

  this.create = function (user) {
    $cookies.putObject('user', user);
    this.user = user;
    $http.defaults.headers.common.Authorization = 'Bearer ' + user.token;
  };

  this.destroy = function () {
    $cookies.remove('user');
    this.user = {};
    $http.defaults.headers.common.Authorization = null;
  };

}]);

module.factory('AuthenticationResolver', ['$q', 'Session', '$state',
  function($q, Session, $state) {

  return {
    resolve: function() {
      var deferred = $q.defer();
      Session.getUser().then(
        function(user) {
          deferred.resolve(user);
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
