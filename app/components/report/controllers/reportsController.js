var module = angular.module('extranetReportModule');

module.controller('ReportsController', ['$scope', '$filter', 'ReportService', function($scope, $filter, ReportService) {

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
	$scope.statusLabels = {
		1: 'Validé',
		2: 'A remplir',
		3: 'A valider'
	};

	$scope.filter = function() {
		$scope.reports.filters.periodFrom = $filter('date')($scope.dateMin, 'yyyy-MM-dd'); //$filter('date')($scope.dateMin, 'shortDate');
		$scope.reports.filters.periodTo =  $filter('date')($scope.dateMax, 'yyyy-MM-dd'); //$filter('date')($scope.dateMax, 'shortDate');
		$scope.reports.filter();
	}

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
