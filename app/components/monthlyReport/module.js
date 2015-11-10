'use strict';

var module = angular.module('extranetMonthlyReportModule', []);

module.config(['$stateProvider', 'USER_ROLES', function($stateProvider, USER_ROLES) {

	$stateProvider
	.state('monthly-report', {
		url: '/monthly-report',
		templateUrl: 'app/components/monthlyReport/views/list.html',
		controller: 'MonthlyReportController',
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		},
		resolve: {
            isAuthenticated: function (AuthenticationResolver) {
                return AuthenticationResolver.resolve();
            }
        }
	});

}]);