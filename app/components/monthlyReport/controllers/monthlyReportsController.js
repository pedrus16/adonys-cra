var module = angular.module('extranetMonthlyReportModule');

module.controller('MonthlyReportsController', ['$scope', 'MonthlyReportService', function($scope, MonthlyReportService) {

	$scope.reports = MonthlyReportService.getReports();

}]);