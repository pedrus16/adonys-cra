var module = angular.module('extranetReportModule', []);

module.config(['$stateProvider', 'USER_ROLES', function($stateProvider, USER_ROLES) {

	$stateProvider
	.state('main.reports', {
		url: '/reports',
		views: {
			'content': {
				controller: 'ReportsController',
				templateUrl: 'app/components/report/views/list.html'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		}
	})
	.state('main.report-detail', {
		url:'/reports/{reportId:int}',
		views: {
			'content': {
				templateUrl: 'app/components/report/views/report.detail.html',
				controller: 'ReportDetailController'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		},
		resolve: {
			resolvedReport: ['$stateParams', 'ReportService', function($stateParams, ReportService) {
				return ReportService.getReport($stateParams.reportId);
			}]
		}
	})
	.state('main.report-add', {
		url:'/reports/add',
		views: {
			'content': {
				templateUrl: 'app/components/report/views/report.edit.html',
				controller: 'ReportAddController'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		}
	})
	.state('main.report-edit', {
		url:'/reports/{reportId:int}/edit',
		views: {
			'content': {
				templateUrl: 'app/components/report/views/report.edit.html',
				controller: 'ReportEditController'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		},
		resolve: {
			resolvedReport: ['$stateParams', 'ReportService', function($stateParams, ReportService) {
				return ReportService.getReport($stateParams.reportId);
			}]
		}
	})
	.state('main.report-delete', {
		url: '/reports/delete/{reportId:int}',
		views: {
			'content': {
				controller: 'ReportDeleteController',
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin]
		},
		resolve: {
			resolvedReport: ['$stateParams', 'ReportService', function($stateParams, ReportService) {
				return ReportService.getReport($stateParams.reportId);
			}],
			resolveConfirm: ['$uibModal', function($uibModal) {

				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'app/components/report/views/confirm.delete.html',
					controller: function($scope, $uibModalInstance) {
						$scope.confirm = function() {
							$uibModalInstance.close();
						};

						$scope.close = function() {
							$uibModalInstance.dismiss();	
						};
					},
					size: 'md'
				});

				return modalInstance.result;

			}]
		}
	});

}]);