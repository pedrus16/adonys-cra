var module = angular.module('extranetReportModule');

module.controller('ReportsController', ['$scope', 'ReportService', function($scope, ReportService) {

	$scope.reports = ReportService;
	$scope.reports.pageSize = 50;
	$scope.reports.sortBy = 'id';
	$scope.reports.order = 'desc';
	$scope.searching = false;

	$scope.datePickerFormat = 'MMMM-yyyy';
	$scope.datePickerMin = {};
	$scope.datePickerMin.opened = false;
	$scope.datePickerMax = {};
	$scope.datePickerMax.opened = false;

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

	$scope.search = function(query) {
		$scope.searching = true;
		$scope.reports.search(query);
	};

	$scope.cancelSearch = function() {
		$scope.searching = false;
		$scope.filter.search = '';
		$scope.reports.search('');
	};

}]);