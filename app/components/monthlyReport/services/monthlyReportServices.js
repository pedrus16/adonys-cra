var module = angular.module('extranetMonthlyReportModule');

module.factory('MonthlyReportService', ['$resource', function ($resource) {

	var UserReports = $resource('http://5641ef34062a801100ca82b4.mockapi.io/api/users/:userId/reports');

	return {
		getReports: function() {
			var reports = UserReports.query({ userId: 1 }, function() {

			});
			return reports;
		},
		getUserReports: function(id) {
			var reports = UserReports.get({ userId: id }, function() {

			});
			return reports;
		}
	};

}]);