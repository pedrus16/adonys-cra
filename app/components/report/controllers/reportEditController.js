var module = angular.module('extranetReportModule');

module.controller('ReportEditController', ['$scope', '$state', 'ReportService', 'resolvedReport',
	function($scope, $state, ReportService, resolvedReport) {

	$scope.title = 'Modifier le compte rendu d\'activite';
	$scope.report = resolvedReport;
	$scope.datePickerFormat = 'MMMM-yyyy';
	
	$scope.submit = function(report) {
		ReportService.update(report, function() {
			$state.go('main.report-detail', { reportId: report.id }, { reload: true });
		});
	};

}]);