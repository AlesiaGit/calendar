class calendarPreview {
	constructor(settings) {
		var d = new Date();
		var leftRuler = settings.rulers === true ? "<" : "";
		var rightRuler = settings.rulers === true ? ">" : "";
		var month = parseInt(settings.month);
		var year = parseInt(settings.year);
		var calendar = this.buildCalendar(year, month, settings.id);

		var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		document.getElementById("calendar-preview").innerHTML = '<div class="calendar__header">\
		<div class="calendar__ruler" id="left-ruler">' + leftRuler + '</div>\
		<div class="calendar__title" id="current-month">' + monthName[month] + '</div>\
		<div class="calendar__ruler" id="right-ruler">' + rightRuler + '</div>\
		</div>\
		<div class="calendar" id="calendar">' + calendar + "</div>";

		this.fillCalendarWithNotes(settings.id);

		if (settings.addTasks === true) {
			document.getElementById("calendar").addEventListener("click", this.addNote.bind(this, settings.id));
		}

		if (settings.removeTasks === true) {
			document.getElementById("calendar").addEventListener("click", this.removeNote.bind(this, settings.id));
		}

		if (settings.rulers === true) {
			document.getElementById("left-ruler").addEventListener("click", this.prevMonth.bind(this, settings));
			document.getElementById("right-ruler").addEventListener("click", this.nextMonth.bind(this, settings));
		}
	}

	fillCalendarWithNotes(calendarId) {
		var cells = document.getElementsByClassName("calendar__table-cell");

		cells = Array.prototype.filter.call(cells, function (elem) {
			var data = JSON.parse(localStorage.getItem(elem.id));
			if (data !== null) {
				var key = Object.keys(data[0])[0];
				var note = data[0][key];
				if (document.getElementById(elem.id)) {
					document.getElementById(elem.id).innerHTML += '<div>\
					<div class="note__text" id="' + key + '">' + note + "</div>\
					<button>x</button>\
					</div>";
				}
			}
		});
	}

	addNote(calendarId, event) {
		var d = new Date();
		var table = document.getElementById("calendar");
		var target = event.target;
		var parent = target.parentNode;

		while (target !== table && target.innerHTML !== "" && target.className !== "calendar__table-cell calendar__table-cell-empty") {
			if (target.tagName === "BUTTON") {
				return;
			}

			if (target.tagName === "TD") {
				var note = prompt("Add text note here:");

				if (note) {
					var noteId = d.getTime();
					var cellId = target.id;

					target.innerHTML += '<div>\
					<div class="note__text" id="' + noteId + '">' + note + "</div>\
					<button>x</button>\
					</div>";

					this.saveNoteToStorage(note, noteId, cellId, calendarId);
					return;
				}
			}

			target = target.parentNode;
		}
	}

	removeNote(calendarId, event) {
		var table = document.getElementById("calendar");
		var target = event.target;
		var parent = target.parentNode;

		while (target !== table && target.innerHTML !== "") {
			if (target.tagName === "BUTTON") {
				var cellId = parent.parentNode.id;
				var noteId = parent.getElementsByClassName("note__text")[0].id;
				var arr = JSON.parse(localStorage.getItem(cellId)) || [];

				arr = arr.filter(function (elem) {
					return Object.keys(elem)[0] !== noteId;
				});

				if (arr.length === 0) {
					localStorage.removeItem(cellId);
					parent.parentNode.removeChild(parent);
					return;
				}

				localStorage.setItem(cellId, JSON.stringify(arr));
				parent.parentNode.removeChild(parent);

				return;
			}

			target = target.parentNode;
		}
	}

	saveNoteToStorage(noteText, noteId, cellId, calendarId) {
		var arr = JSON.parse(localStorage.getItem(cellId)) || [];

		var note = {};
		note[noteId] = noteText;
		arr.push(note);

		localStorage.setItem(cellId, JSON.stringify(arr));
	}

	fixDays(weekday) {
		if (weekday == 0) {
			weekday = 7;
		}
		return weekday;
	}

	buildCalendar(year, month, calendarId) {
		var d = new Date(year, month - 1, 1);
		var n = new Date(year, month, 0);

		var table = '<table class="calendar__table"><tr>';

		if (this.fixDays(d.getDay()) > 1) {
			for (var i = 1; i < this.fixDays(d.getDay()); i++) {
				table += '<td class="calendar__table-cell calendar__table-cell-empty">\
				<div class="date">' + " " + "</div>\
				</td>";
			}
		}

		for (var i = 1; i <= n.getDate(); i++) {
			table += '<td class="calendar__table-cell" id=' + calendarId + ":" + d.getTime() + '>\
			<div class="date">' + i + "</div>\
			</td>";

			if (this.fixDays(d.getDay()) == 7) {
				table += "</tr><tr>";
			}
			d.setDate(d.getDate() + 1);
		}

		if (this.fixDays(n.getDay()) < 7) {
			for (var i = this.fixDays(n.getDay()); i < 7; i++) {
				table += '<td class="calendar__table-cell calendar__table-cell-empty">\
				<div class="date">' + " " + "</div>\
				</td>";
			}
		}

		return table + "</tr></table>";
	}

	nextMonth(settings) {
		var month = parseInt(settings.month);
		month = (month + 1) % 12;
		settings.month = month;
		new calendarPreview(settings);
	}

	prevMonth(settings) {
		var month = parseInt(settings.month);
		if (--month < 0) {
			month = 11;
		} else {
			month = month;
		}
		settings.month = month;
		new calendarPreview(settings);
	}
}

class createCalendar {
	constructor(id) {
		var settings = JSON.parse(localStorage.getItem(id)) || [];

		var d = new Date();
		var leftRuler = settings.rulers === true ? "<" : "";
		var rightRuler = settings.rulers === true ? ">" : "";
		var month = parseInt(settings.month);
		var year = parseInt(settings.year);
		var calendar = this.buildCalendar(year, month, settings.id);

		var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		document.getElementById("root").innerHTML = '<div class="calendar__header">\
				<div class="calendar__ruler" id="left-ruler">' + leftRuler + '</div>\
				<div class="calendar__title" id="current-month">' + monthName[month] + '</div>\
				<div class="calendar__ruler" id="right-ruler">' + rightRuler + '</div>\
			</div>\
			<div class="calendar" id="calendar">' + calendar + "</div>";

		this.fillCalendarWithNotes(settings.id);

		if (settings.addTasks === true) {
			document.getElementById("calendar").addEventListener("click", this.addNote.bind(this, settings.id));
		}

		if (settings.removeTasks === true) {
			document.getElementById("calendar").addEventListener("click", this.removeNote.bind(this, settings.id));
		}

		if (settings.rulers === true) {
			document.getElementById("left-ruler").addEventListener("click", this.prevMonth.bind(this, settings.id));
			document.getElementById("right-ruler").addEventListener("click", this.nextMonth.bind(this, settings.id));
		}
	}

	fillCalendarWithNotes(calendarId) {
		var cells = document.getElementsByClassName("calendar__table-cell");

		cells = Array.prototype.filter.call(cells, function (elem) {
			var data = JSON.parse(localStorage.getItem(elem.id));
			if (data !== null) {
				var key = Object.keys(data[0])[0];
				var note = data[0][key];
				if (document.getElementById(elem.id)) {
					document.getElementById(elem.id).innerHTML += '<div>\
					<div class="note__text" id="' + key + '">' + note + "</div>\
					<button>x</button>\
					</div>";
				}
			}
		});
	}

	addNote(calendarId, event) {
		var d = new Date();
		var table = document.getElementById("calendar");
		var target = event.target;
		var parent = target.parentNode;

		while (target !== table && target.innerHTML !== "" && target.className !== "calendar__table-cell calendar__table-cell-empty") {
			if (target.tagName === "BUTTON") {
				return;
			}

			if (target.tagName === "TD") {
				var note = prompt("Add text note here:");

				if (note) {
					var noteId = d.getTime();
					var cellId = target.id;

					target.innerHTML += '<div>\
					<div class="note__text" id="' + noteId + '">' + note + "</div>\
					<button>x</button>\
					</div>";

					this.saveNoteToStorage(note, noteId, cellId, calendarId);
					return;
				}
			}

			target = target.parentNode;
		}
	}

	removeNote(calendarId, event) {
		var table = document.getElementById("calendar");
		var target = event.target;
		var parent = target.parentNode;

		while (target !== table && target.innerHTML !== "") {
			if (target.tagName === "BUTTON") {
				var cellId = parent.parentNode.id;
				var noteId = parent.getElementsByClassName("note__text")[0].id;
				var arr = JSON.parse(localStorage.getItem(cellId)) || [];

				arr = arr.filter(function (elem) {
					return Object.keys(elem)[0] !== noteId;
				});

				if (arr.length === 0) {
					localStorage.removeItem(cellId);
					parent.parentNode.removeChild(parent);
					return;
				}

				localStorage.setItem(cellId, JSON.stringify(arr));
				parent.parentNode.removeChild(parent);

				return;
			}

			target = target.parentNode;
		}
	}

	saveNoteToStorage(noteText, noteId, cellId, calendarId) {
		var arr = JSON.parse(localStorage.getItem(cellId)) || [];

		var note = {};
		note[noteId] = noteText;
		arr.push(note);

		localStorage.setItem(cellId, JSON.stringify(arr));
	}

	fixDays(weekday) {
		if (weekday == 0) {
			weekday = 7;
		}
		return weekday;
	}

	buildCalendar(year, month, calendarId) {
		var d = new Date(year, month - 1, 1);
		var n = new Date(year, month, 0);

		var table = '<table class="calendar__table"><tr>';

		if (this.fixDays(d.getDay()) > 1) {
			for (var i = 1; i < this.fixDays(d.getDay()); i++) {
				table += '<td class="calendar__table-cell calendar__table-cell-empty">\
				<div class="date">' + " " + "</div>\
				</td>";
			}
		}

		for (var i = 1; i <= n.getDate(); i++) {
			table += '<td class="calendar__table-cell" id=' + calendarId + ":" + d.getTime() + '>\
			<div class="date">' + i + "</div>\
			</td>";

			if (this.fixDays(d.getDay()) == 7) {
				table += "</tr><tr>";
			}
			d.setDate(d.getDate() + 1);
		}

		if (this.fixDays(n.getDay()) < 7) {
			for (var i = this.fixDays(n.getDay()); i < 7; i++) {
				table += '<td class="calendar__table-cell calendar__table-cell-empty">\
				<div class="date">' + " " + "</div>\
				</td>";
			}
		}

		return table + "</tr></table>";
	}

	nextMonth(id) {
		var settings = JSON.parse(localStorage.getItem(id)) || [];

		var month = parseInt(settings.month);
		month = (month + 1) % 12;
		settings.month = month;

		localStorage.setItem(id, JSON.stringify(settings));

		new createCalendar(id);
	}

	prevMonth(id) {
		var settings = JSON.parse(localStorage.getItem(id)) || [];

		var month = parseInt(settings.month);
		if (--month < 0) {
			month = 11;
		} else {
			month = month;
		}
		settings.month = month;

		localStorage.setItem(id, JSON.stringify(settings));

		new createCalendar(id);
	}
}

function EventBus() {
	this.listeners = {};
};

EventBus.prototype = {

	on: function (event, callback) {
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(callback);
	},

	off: function (event, callback) {
		if (this.listeners[event]) {
			var callbackIndex = this.listeners[event].indexOf(callback);
			if (callbackIndex >= 0) {
				this.listeners[event].splice(callbackIndex, 1);
			}
		}
	},

	trigger: function (event, data) {
		(this.listeners[event] || []).forEach(function (callback) {
			return callback(data);
		});

		(this.listeners['once' + event] || []).forEach(function (callback) {
			return callback(data);
		});

		this.listeners['once' + event] = [];
	},

	once: function (event, callback) {
		this.listeners['once' + event] = this.listeners['once' + event] || [];
		this.listeners['once' + event].push(callback);
	}
};

var Router = function (options) {
	this.routes = options.routes || [];
	this.eventBus = options.eventBus;
	this.init();
};

Router.prototype = {
	init: function () {
		window.addEventListener('hashchange', () => this.handleUrl(window.location.hash));
		this.handleUrl(window.location.hash);
	},
	findPreviousActiveRoute: function () {
		return this.currentRoute;
	},
	findNewActiveRoute: function (url) {
		let route = this.routes.find(routeItem => {
			if (typeof routeItem.match === 'string') {
				return url === routeItem.match;
			} else if (typeof routeItem.match === 'function') {
				return routeItem.match(url);
			} else if (routeItem.match instanceof RegExp) {
				return url.match(routeItem.match);
			}
		});

		return route;
	},
	getRouteParams(route, url) {
		var params = url.match(route.match) || [];
		params.shift();
		return params;
	},
	handleUrl: function (url) {
		url = url.slice(1);
		let previousRoute = this.findPreviousActiveRoute();
		let newRoute = this.findNewActiveRoute(url);

		let routeParams = this.getRouteParams(newRoute, url);

		Promise.resolve().then(() => previousRoute && previousRoute.onLeave && previousRoute.onLeave(...this.currentRouteParams)).then(() => newRoute && newRoute.onBeforeEnter && newRoute.onBeforeEnter(...routeParams)).then(() => newRoute && newRoute.onEnter && newRoute.onEnter(...routeParams)).then(() => {
			this.currentRoute = newRoute;
			this.currentRouteParams = routeParams;
		});
	}
};

class settingsPreview {
	constructor(settings) {
		document.getElementById("settings-preview").innerHTML = "<pre><code></br>\
		&lt;script&gt;<br/>\
			new calendarPreview ({<br/>\
				id:" + settings.id + ",<br/>\
				month:" + settings.month + ",<br/>\
				year:" + settings.year + ",<br/>\
				addTasks:" + settings.addTasks + ",<br/>\
				removeTasks:" + settings.removeTasks + ",<br/>\
				rulers:" + settings.rulers + ",<br/>\
			});<br/>\
		&lt;/script&gt;</code></pre>";
	}
}

class showSettings {
	constructor() {
		document.getElementById("root").innerHTML = "";

		this.settings = document.createElement("DIV");
		this.settings.className = "settings";
		this.settings.innerHTML = '<div class="links__wrapper">\
				<a id="settings" class="calendar__btn" href="/">Settings</a>\
				<span class="divider">|</span>\
				<a id="calendar" class="calendar__btn" href="">Calendar</a>\
			</div>\
			<div class="settings__form form" id="settings-form">\
				<p class="settings__title">Configure calendar</p>\
				<label class="form-item"><input class="settings__checkbox" type="checkbox" id="rulers" name="rulers">allow to change month</label>\
				<label class="form-item"><input class="settings__checkbox" type="checkbox" id="add-tasks" name="add-tasks">allow to add tasks</label>\
				<label class="form-item"><input class="settings__checkbox" type="checkbox" id="remove-tasks" name="remove-tasks">allow to remove tasks</label>\
				<label class="form-item"><select id="month" class="settings__select" name="month"></select>select month</label>\
				<label class="form-item"><select id="year" class="settings__select" name="year"></select>select year</label>\
			</div>\
			<div class="preview__wrapper">\
				<div class="preview__settings" id="settings-preview"></div>\
				<div class="preview__calendar" id="calendar-preview"></div>\
			</div>';

		document.getElementById("root").appendChild(this.settings);

		this.fillMonthInput();
		this.fillYearInput();

		var d = new Date();

		document.getElementsByClassName("month-option")[d.getMonth()].selected = true;
		document.getElementsByClassName("year-option")[d.getFullYear() - 2010].selected = true;

		document.getElementById("settings-form").addEventListener("change", this.initCalendar.bind(this));
	}

	fillMonthInput() {
		var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		for (var i = 0; i < 12; i++) {
			document.getElementById("month").innerHTML += '<option class="month-option" value="' + i + '">' + monthName[i] + "</option>";
		}
	}

	fillYearInput() {
		for (var i = 0; i < 10; i++) {
			document.getElementById("year").innerHTML += '<option class="year-option" value="' + (2010 + i) + '">' + (2010 + i) + "</option>";
		}
	}

	initCalendar() {
		var d = new Date();

		var settings = {
			id: "c" + Math.floor(Math.random() * 3),
			month: document.getElementById("month").value || d.getMonth(),
			year: document.getElementById("year").value || d.getFullYear(),
			addTasks: document.getElementById("add-tasks").checked,
			removeTasks: document.getElementById("remove-tasks").checked,
			rulers: document.getElementById("rulers").checked
		};

		var id = settings.id;

		localStorage.setItem(id, JSON.stringify(settings));

		document.getElementById("calendar").href = "#calendar-" + id;

		new calendarPreview(settings);
		new settingsPreview(settings);
	}
}