var module = angular.module('extranetReportModule');

module.controller('ReportDeleteController', ['$stateParams', '$state', 'ReportService', 
	function($stateParams, $state, ReportService) {

	ReportService.delete($stateParams.reportId);
	$state.go('main.reports', {});

}]);