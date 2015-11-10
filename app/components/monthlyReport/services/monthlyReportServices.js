var module = angular.module('extranetMonthlyReportModule');

module.factory('MonthlyReportService', ['$resource', function ($resource) {

	var Report = $resource('http://5641ef34062a801100ca82b4.mockapi.io/api/reports');

	return {
		getReports: function() {
			var reports = Report.query(function() {

			});
			return reports;
		}
	};

}]);