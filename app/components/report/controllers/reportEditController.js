var module = angular.module('extranetReportModule');

module.controller('ReportEditController', ['$scope', '$state', '$q', 'ReportService', 'resolvedReport', 'UserService',
	function($scope, $state, $q, ReportService, resolvedReport, UserService) {

	$scope.title = 'Modifier le compte rendu d\'activite';
	$scope.report = resolvedReport;
	$scope.datePickerFormat = 'MMMM-yyyy';
	$scope.userService = UserService;
	$scope.getUserTypeAhead = function(query) {
		return UserService.typeAhead(query);
	};

	$scope.formatLabel = function(user) {
		if (user) {
			return user.firstname + ' ' + user.lastname;
		}
		return '';
	}

	$scope.submit = function(report) {
		ReportService.update(report, function() {
			$state.go('main.report-detail', { reportId: report.id }, { reload: true });
		});
	};

}]);
