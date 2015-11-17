var module = angular.module('extranetMonthlyReportModule');

module.factory('MonthlyReportService', ['$rootScope', '$resource', '$state', '$q', 'API', 'ERRORS', '$log',
	function ($rootScope, $resource, $state, $q, API, ERRORS, $log) {

	var ReportResource = $resource(API.baseUrl + '/reports/:reportId');
	var page = 1;
	var Report = {};

	Report.items = [];
	Report.busy = false;
	Report.end = false;
	Report.pageSize = 10;
	Report.query = '';
	Report.sortBy = '';
	Report.order = '';
	Report.filter = {};

	Report.sort = function() {
		page = 1;
		this.end = false;
		this.nextPage(true);
	};

	Report.filter = function() {
		page = 1;
		this.end = false;
		this.nextPage(true);
	};

	Report.search = function(query) {
		page = 1;
		this.end = false;
		Report.query = query;
		this.nextPage(true);
	};

	Report.nextPage = function(reset) {
		if (this.busy || this.end) return;
		var self = this;
		var parameters = {};

		self.busy = true;
		parameters.page = page;
		parameters.limit = self.pageSize;
		if (self.query) {
			parameters.search = self.query;
		}
		if (self.sortBy) {
			parameters.sortBy = self.sortBy;
			parameters.order = self.order;
		}
		var reports = $resource(API.baseUrl + '/reports', parameters).query(function() {
			if (reset) self.items = []; // Empty the list
			for (var i = 0; i < reports.length; i++) {
				self.items.push(reports[i]);
			}
			page = page + 1;
			self.busy = false;
			if (reports.length < self.pageSize) {
				self.end = true;
			}
		});

	};
	
	Report.getReport = function(id) {
		var deferred = $q.defer();

		var report = ReportResource.get({reportId: id}, 
			function() {
				deferred.resolve(report);
			},
			function(error) {
				deferred.reject(ERRORS.reportNotFound);
			}
		);
		return deferred.promise;

	};

	Report.create = function(report) {
		var self = this;
		var newReport = ReportResource.save({}, report, function() {
			self.items.unshift(newReport);
		});

	};

	Report.update = function(report, callback) {
		var self = this;
		var ReportUpdateResource = $resource(API.baseUrl + '/reports/:reportId', null,
				{
					'update': { method:'PUT' }
				}
			);
		var editedReport = ReportUpdateResource.update({ reportId: report.id }, report, function() {
			for (var i = 0; i < self.items.length; i++) {
				if (self.items[i].id === editedReport.id) {
					self.items[i] = editedReport;
					break;
				}
			}
			if (callback) { callback(); }
		});
	};

	Report.delete = function(id) {
		var self = this;

		var deletedReport = ReportResource.delete({ reportId: id }, function() {
			// Updates the report list
			for (var i = 0; i < self.items.length; i++) {
				if (self.items[i].id === deletedReport.id) {
					self.items.splice(i, 1);
					break;
				}
			}
		});

	};
 
 	return Report;

}]);