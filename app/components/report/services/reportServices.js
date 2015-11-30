var module = angular.module('extranetReportModule');

module.factory('ReportService', ['$rootScope', '$resource', '$state', '$q', 'API', 'ERRORS', '$log',
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

	/**
		@apiDefine ReportSuccess

		@apiSuccess {Number} id Report unique ID.
		@apiSuccess {Date} createdAt Report creation date.
		@apiSuccess {Object} state Report current state {"id", "label"}.
		@apiSuccess {Array="T", "CP", "RTT", "PC", "F", "M", "CS", "CE"} days Array of 31 days, each holding two values, one for the morning and one for the afternoon.
		@apiSuccess {Object} employee User object of the employee who wrote the report {"id", "name"}.
		@apiSuccess {Object} client User object of the client concerned by this report {"id", "name"}.
		@apiSuccess {String} notes The report additional notes.

		@apiSuccessExample Success-Response:
		HTTP/1.1 200 OK
		{
			id: "42",
			createdAt: 1420070400,
			state: {
				id: "3", 
				label: "A remplir"
			},
			days: [
				["T", "T"], 
				["T", "T"], 
				["T", "T"], 
				["CP", "CP"], 
				["CS", "T"],
				…
			],
			employee: {
				id: "1", 
				name: "John Doe"
			},
			client: {
				id: "2", 
				name: "Adonys (Alice Martin)"
			},
			notes: "J'ai fait du café."
		}
	*/

	/**
		@api {get} /reports Query Report
		@apiVersion 0.0.1
		@apiName QueryReport
		@apiGroup Report

		@apiParam {String} [search] Research keyword.
		@apiParam (Pagination) {String} [page] Page number.
		@apiParam (Pagination) {String} [limit] Maximum number of elements to return.
		@apiParam (Sorting) {String} [sortBy] Name of the property to sort by.
		@apiParam (Sorting) {String="asc", "desc"} [order] Sort order (ascending/descending).

		@apiParamExample {get} Search-Example:
		/reports?search=Adonys&page=1&limit=20&sortBy=id&order=asc

		@apiSuccess {Number} id Report unique ID.
		@apiSuccess {Date} createdAt Report creation date.
		@apiSuccess {Object} state Report current state {"id", "label"}.
		@apiSuccess {Array} days Array of 31 days, each holding two values, one for the morning and one for the afternoon.
		@apiSuccess {Object} employee User object of the employee who wrote the report {"id", "name"}.
		@apiSuccess {Object} client User object of the client concerned by this report {"id", "name"}.
		@apiSuccess {String} notes The report additional notes.

		@apiSuccessExample Success-Response:
		HTTP/1.1 200 OK
		[
			{
				id: "42",
				createdAt: 1420070400,
				state: {
					id: "3", 
					label: "A remplir"
				},
				days: [
					["T", "T"], 
					["T", "T"], 
					["T", "T"], 
					["CP", "CP"], 
					["CS", "T"],
					…
				],
				employee: {
					id: "1", 
					name: "John Doe"
				},
				client: {
					id: "2", 
					name: "Adonys (Alice Martin)"
				},
				notes: "J'ai fait du café."
			},
			...
		]

		@apiError TODO Errors not yet defined.
	*/	
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
	
	/**
		@api {get} /reports/:id Get Report
		@apiVersion 0.0.1
		@apiName GetReport
		@apiGroup Report

		@apiParam {Number} id Reports unique ID.

		@apiUse ReportSuccess

		@apiError NotFound The id of the Report was not found.

		@apiErrorExample Error-Response:
		HTTP/1.1 404 Not Found
		"Not Found"
	*/
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

	/**
		@api {post} /reports Create Report
		@apiVersion 0.0.1
		@apiName CreateReport
		@apiGroup Report

		@apiParam {Number} id Report unique ID.
		@apiParam {Array} days Array of 31 days, each holding two values, one for the morning and one for the afternoon.
		@apiParam {Object} employee User object of the employee who wrote the report {"id", "name"}.
		@apiParam {Object} client User object of the client concerned by this report {"id", "name"}.
		@apiParam {Date} [createdAt] Report creation date.
		@apiParam {Object} [state] Report current state {"id", "label"}.
		@apiParam {String} [notes] The report additional notes.

		@apiUse ReportSuccess

		@apiParam (Days) {String} T Jour Travaillé - Worked day.
		@apiParam (Days) {String} CP Congé Payé - Vacation.
		@apiParam (Days) {String} RTT Jour RTT - Vacation.
		@apiParam (Days) {String} PC Pont Client - Client Bridge.
		@apiParam (Days) {String} F Formation.
		@apiParam (Days) {String} M Maladie - Ill.
		@apiParam (Days) {String} CS Congé sans Solde - Unpaid vacation.
		@apiParam (Days) {String} CE Congé Exceptionnel - Exceptional holiday.

		@apiError TODO Errors not yet defined.
	*/	
	Report.create = function(report) {
		var self = this;
		var newReport = ReportResource.save({}, report, function() {
			self.items.unshift(newReport);
		});

	};

	/**
		@api {put} /reports Edit Report
		@apiVersion 0.0.1
		@apiName EditReport
		@apiGroup Report

		@apiParam {Number} id Report unique ID.
		@apiParam {Array} [days] Array of 31 days, each holding two values, one for the morning and one for the afternoon.
		@apiParam {Object} [employee] User object of the employee who wrote the report {"id", "name"}.
		@apiParam {Object} [client] User object of the client concerned by this report {"id", "name"}.
		@apiParam {Date} [createdAt] Report creation date.
		@apiParam {Object} [state] Report current state {"id", "label"}.
		@apiParam {String} [notes] The report additional notes.

		@apiUse ReportSuccess

		@apiError NotFound The id of the Report was not found.

		@apiErrorExample Error-Response:
		HTTP/1.1 404 Not Found
		"Not Found"
	*/
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
			(callback || angular.noop)();
		});
	};

	/**
		@api {delete} /reports/:id Delete Report
		@apiVersion 0.0.1
		@apiName DeleteReport
		@apiGroup Report

		@apiParam {Number} id Reports unique ID.

		@apiUse ReportSuccess

		@apiError NotFound The id of the Report was not found.

		@apiErrorExample Error-Response:
		HTTP/1.1 404 Not Found
		"Not Found"
	*/	
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