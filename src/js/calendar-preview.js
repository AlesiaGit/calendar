class calendarPreview {
	constructor(settings) {
		var d = new Date();
		var leftRuler = settings.rulers === true ? "<" : "";
		var rightRuler = settings.rulers === true ? ">" : "";
		var month = parseInt(settings.month);
		var year = parseInt(settings.year);
		var calendar = this.buildCalendar(year, month, settings.id);

		var monthName = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];

		document.getElementById("calendar-preview").innerHTML =
			'<div class="calendar__header">\
		<div class="calendar__ruler" id="left-ruler">' +
			leftRuler +
			'</div>\
		<div class="calendar__title" id="current-month">' +
			monthName[month] +
			'</div>\
		<div class="calendar__ruler" id="right-ruler">' +
			rightRuler +
			'</div>\
		</div>\
		<div class="calendar" id="calendar">' +
			calendar +
			"</div>";

		this.fillCalendarWithNotes(settings.id);

		if (settings.addTasks === true) {
			document
				.getElementById("calendar")
				.addEventListener(
					"click",
					this.addNote.bind(this, settings.id)
				);
		}

		if (settings.removeTasks === true) {
			document
				.getElementById("calendar")
				.addEventListener(
					"click",
					this.removeNote.bind(this, settings.id)
				);
		}

		if (settings.rulers === true) {
			document
				.getElementById("left-ruler")
				.addEventListener("click", this.prevMonth.bind(this, settings));
			document
				.getElementById("right-ruler")
				.addEventListener("click", this.nextMonth.bind(this, settings));
		}
	}

	fillCalendarWithNotes(calendarId) {
		var cells = document.getElementsByClassName("calendar__table-cell");

		cells = Array.prototype.filter.call(cells, function(elem) {
			var data = JSON.parse(localStorage.getItem(elem.id));
			if (data !== null) {
				var key = Object.keys(data[0])[0];
				var note = data[0][key];
				if (document.getElementById(elem.id)) {
					document.getElementById(elem.id).innerHTML +=
						'<div>\
					<div class="note__text" id="' +
						key +
						'">' +
						note +
						"</div>\
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

		while (
			target !== table &&
			target.innerHTML !== "" &&
			target.className !==
				"calendar__table-cell calendar__table-cell-empty"
		) {
			if (target.tagName === "BUTTON") {
				return;
			}

			if (target.tagName === "TD") {
				var note = prompt("Add text note here:");

				if (note) {
					var noteId = d.getTime();
					var cellId = target.id;

					target.innerHTML +=
						'<div>\
					<div class="note__text" id="' +
						noteId +
						'">' +
						note +
						"</div>\
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

				arr = arr.filter(function(elem) {
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
				table +=
					'<td class="calendar__table-cell calendar__table-cell-empty">\
				<div class="date">' +
					" " +
					"</div>\
				</td>";
			}
		}

		for (var i = 1; i <= n.getDate(); i++) {
			table +=
				'<td class="calendar__table-cell" id=' +
				calendarId +
				":" +
				d.getTime() +
				'>\
			<div class="date">' +
				i +
				"</div>\
			</td>";

			if (this.fixDays(d.getDay()) == 7) {
				table += "</tr><tr>";
			}
			d.setDate(d.getDate() + 1);
		}

		if (this.fixDays(n.getDay()) < 7) {
			for (var i = this.fixDays(n.getDay()); i < 7; i++) {
				table +=
					'<td class="calendar__table-cell calendar__table-cell-empty">\
				<div class="date">' +
					" " +
					"</div>\
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
