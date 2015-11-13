var module = angular.module('extranetMonthlyReportModule', []);

module.config(['$stateProvider', 'USER_ROLES', function($stateProvider, USER_ROLES) {

	$stateProvider
	.state('main.monthly-report', {
		url: '/monthly-report',
		views: {
			'content': {
				templateUrl: 'app/components/monthlyReport/views/list.html',
				controller: 'MonthlyReportsController'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		}
	});

}]);