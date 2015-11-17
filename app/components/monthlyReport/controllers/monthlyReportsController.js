var module = angular.module('extranetMonthlyReportModule');

module.controller('MonthlyReportsController', ['$scope', 'MonthlyReportService', function($scope, MonthlyReportService) {

	$scope.reports = MonthlyReportService;
	$scope.reports.pageSize = 50;
	$scope.reports.sortBy = 'id';
	$scope.reports.order = 'desc';

	$scope.toggleSort = function(column) {
		if ($scope.reports.sortBy === column) {
			$scope.reports.order = $scope.reports.order === 'asc' ? 'desc' : 'asc';
		}
		else {
			$scope.reports.sortBy = column;
			$scope.reports.order = 'asc';
		}
		$scope.reports.sort();
	};

}]);