var module = angular.module('adonysCalendarModule', []);

module.controller('adonysCalendarController', ['$scope', function(scope) {

	var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	this.step = { months: 1 };
	this.activeDate = new Date();
	this.startingDay = 1;
	function getDaysInMonth(year, month) {
		return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
	}

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

	var year = this.activeDate.getFullYear(),
		month = this.activeDate.getMonth(),
		firstDayOfMonth = new Date(this.activeDate);

	firstDayOfMonth.setFullYear(year, month, 1);

	var difference = this.startingDay - firstDayOfMonth.getDay(),
		numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
		firstDate = new Date(firstDayOfMonth);

	console.log(this.startingDay, firstDayOfMonth.getDay(), difference, firstDayOfMonth);

	if (numDisplayedFromPreviousMonth > 0) {
		firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
	}

	// 42 is the number of days on a six-month calendar
	var days = this.getDates(firstDate, 42);
	for (var i = 0; i < 42; i ++) {
		days[i] = { 
			date: days[i],
			secondary: days[i].getMonth() !== month,
			uid: scope.uniqueId + '-' + i
		};
	}

	scope.rows = this.split(days, 7);


}])
.directive('adonysCalendar', function() {
	return {
		restrict: 'E',
		scope: {
			monthYear: '@'
		},
		templateUrl: 'app/shared/calendarDirective/templates/calendar.html',
		controller: 'adonysCalendarController',
		link: function(scope, element, attrs, ctrls) {
			var calendarController = ctrls[0];

			// datepickerCtrl.init(ngModelCtrl);
		}
	};
});