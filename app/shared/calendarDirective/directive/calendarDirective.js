var module = angular.module('adonysCalendarModule', []);

module.controller('adonysCalendarController', ['$scope', 'dateFilter', function(scope, dateFilter) {

	var self = this,
		styles = {
		'T': 'day-success',
		'CP': 'day-warning',
		'RTT': 'day-warning',
		'PC': 'day-warning',
		'F': 'day-info',
		'M': 'day-warning',
		'CS': 'day-warning',
		'CE': 'day-warning'
	},
		ngModelController = { $setViewValue: angular.noop }; // nullModelCtrl;

	this.init = function(_ngModelController) {
		ngModelController = _ngModelController;
		ngModelController.$render = function() {
			self.refreshView();
		};
	};

	scope.getStyleClass = function(type) {
		if (styles.hasOwnProperty(type)) {
			return styles[type];
		}
		return '';
	};

	this.getDates = function(startDate, n) {
		var dates = new Array(n), current = new Date(startDate), i = 0, date;
		while (i < n) {
			date = new Date(current);
			dates[i++] = date;
			current.setDate(current.getDate() + 1);
		}
		return dates;
	};

	this.split = function(arr, size) {
		var arrays = [];
		while (arr.length > 0) {
			arrays.push(arr.splice(0, size));
		}
		return arrays;
	};

	var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	this.step = { months: 1 };
	this.activeDate = new Date(
		scope.activeYear ? scope.activeYear : new Date().getFullYear(),
		scope.activeMonth ? scope.activeMonth - 1 : new Date().getMonth()
	);
	this.startingDay = 1;

	this.refreshView = function() {
		var year = this.activeDate.getFullYear(),
			month = this.activeDate.getMonth(),
			firstDayOfMonth = new Date(this.activeDate);

		scope.month = dateFilter(this.activeDate, 'MMMM');
		scope.year = year;

		firstDayOfMonth.setFullYear(year, month, 1);

		var difference = this.startingDay - firstDayOfMonth.getDay(),
			numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
			firstDate = new Date(firstDayOfMonth);

		if (numDisplayedFromPreviousMonth > 0) {
			firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
		}

		console.log(ngModelController.$modelValue);

		// 42 is the number of days on a six-month calendar
		var days = this.getDates(firstDate, 42);
		for (var i = 0; i < 42; i ++) {
			var type = ['', ''];
			var dateIndex = days[i].getDate() - 1;
			if (days[i].getMonth() === month) {
				type = ngModelController.$modelValue.indexOf(dateIndex) ? ngModelController.$modelValue[dateIndex] : ['', ''];
			}
			days[i] = { 
				date: days[i],
				secondary: days[i].getMonth() !== month,
				type: [type[0], type[1]]
			};
		}

		scope.rows = this.split(days, 7);
	};

}])
.directive('adonysCalendar', function() {
	return {
		restrict: 'E',
		scope: {
			activeMonth: '@',
			activeYear: '@',
			daysState: '='
		},
		require: ['adonysCalendar', 'ngModel'],
		templateUrl: 'app/shared/calendarDirective/templates/calendar.html',
		controller: 'adonysCalendarController',
		link: function(scope, element, attrs, ctrls) {
			var calendarController = ctrls[0],
				ngModelController = ctrls[1];

			calendarController.init(ngModelController);
		}
	};
});