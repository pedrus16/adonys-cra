var module = angular.module('adonysCalendarModule', []);

var styles = {
'T': 'day-T',
'CP': 'day-CP',
'RTT': 'day-RTT',
'PC': 'day-PC',
'F': 'day-F',
'M': 'day-M',
'CS': 'day-CS',
'CE': 'day-CE'
};

module.controller('adonysCalendarController', ['$scope', 'dateFilter', function(scope, dateFilter) {

	var self = this,
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
	scope.activeDate = new Date(scope.activeDate);
	this.startingDay = 1;

	this.refreshView = function() {
		if (!angular.isDate(scope.activeDate)) {
			return;
		}
		var year = scope.activeDate.getFullYear(),
			month = scope.activeDate.getMonth(),
			firstDayOfMonth = new Date(scope.activeDate);

		firstDayOfMonth.setFullYear(year, month, 1);

		var difference = this.startingDay - firstDayOfMonth.getDay(),
			numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
			firstDate = new Date(firstDayOfMonth);

		if (numDisplayedFromPreviousMonth > 0) {
			firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
		}

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
			activeDate: '=',
			readonly: '='
		},
		require: ['adonysCalendar', 'ngModel'],
		templateUrl: 'app/shared/calendarDirective/templates/calendar.html',
		controller: 'adonysCalendarController',
		link: function(scope, element, attrs, ctrls) {
			var calendarController = ctrls[0],
				ngModelController = ctrls[1];

			calendarController.init(ngModelController);

			scope.$watch('activeDate', function(value) {
	      calendarController.refreshView();
	    });

		}
	};
})
.directive('adonysCalendarEditor', function() {
	return {
		restrict: 'E',
		scope: {
			activeMonth: '@',
			activeYear: '@',
			activeDate: '=',
			readonly: '='
		},
		require: ['adonysCalendarEditor', 'ngModel'],
		templateUrl: 'app/shared/calendarDirective/templates/calendar.edit.html',
		controller: 'adonysCalendarController',
		link: function(scope, element, attrs, ctrls) {
			var calendarController = ctrls[0],
				ngModelController = ctrls[1];

			if (scope.readonly) {
				scope.template = 'app/shared/calendarDirective/templates/calendar.html';
			}
			else {
				scope.template = 'app/shared/calendarDirective/templates/calendar.edit.html'
			}

			calendarController.init(ngModelController);

			scope.$watch('activeDate', function(value) {
	      calendarController.refreshView();
	    });

		}
	};
});

module.directive('adonysLegend', function() {
	return {
		restrict: 'E',
		scope: {
		},
		require: ['adonysLegend'],
		templateUrl: 'app/shared/calendarDirective/templates/legend.html',
	};
});
