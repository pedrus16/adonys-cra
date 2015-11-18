var module = angular.module('extranetReportModule');

module.controller('ReportDetailController', [
	'$scope', '$stateParams', 'ReportService', 'resolvedReport',
	function($scope, $stateParams, ReportService, resolvedReport) {

	$scope.report = resolvedReport;

}]);