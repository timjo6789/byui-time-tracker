function to_time_string(number, empty = false) {
    if (empty && number == 0) {
        return '';
    } else if (empty) {
        return '' + number;
    }
    return (number >= 10 || number <= -10) ? '' + number : '0' + number;
}

function month_day_year(date) {
    return [date.getMonth() + 1, date.getDate(), date.getFullYear()];

}

function pretty_time(seconds, empty = true) {
    let negative = false;
    if (seconds < 0) {
        negative = true;
        seconds = Math.abs(seconds);
    }
    let minute = Math.floor(seconds / 60);
    let hour = Math.floor(minute / 60);

    let second = seconds % 60;
    minute = minute % 60;

    if (empty) {
        is_hour = (empty && hour == 0) ? '' : '' + hour;
        is_minute = to_time_string(minute, empty);
        is_second = to_time_string(second, empty);

        if (negative) {
            if (is_hour != '') {
                return '-' + to_time_string(hour, true) + ':' + to_time_string(Math.abs(minute)) + ':' + to_time_string(Math.abs(second));
            } else if (is_minute != '') {
                return '-' + to_time_string(minute, true) + ':' + to_time_string(Math.abs(second));
            } else if (is_second != '') {
                return '-' + to_time_string(second, true);
            } else {
                return '0';
            }
        } else {
            if (is_hour != '') {
                return to_time_string(hour, true) + ':' + to_time_string(Math.abs(minute)) + ':' + to_time_string(Math.abs(second));
            } else if (is_minute != '') {
                return to_time_string(minute, true) + ':' + to_time_string(Math.abs(second));
            } else if (is_second != '') {
                return to_time_string(second, true);
            } else {
                return '0';
            }
        }
    }
    if (negative) {
        return '-' + to_time_string(hour) + ':' + to_time_string(minute) + ':' + to_time_string(second);
    }
    return to_time_string(hour) + ':' + to_time_string(minute) + ':' + to_time_string(second);

}

function convert_to_seconds(time_string) {
    let splitted = time_string.split(':');
    let second = 0;
    if (splitted.length == 3) {
        
        second = parseInt(splitted[0]) * 3600 + parseInt(splitted[1]) * 60 + parseInt(splitted[2]);
    } else if (splitted.length == 2) {
        second = parseInt(splitted[0]) * 3600 + parseInt(splitted[1]) * 60;
    } else if (splitted.length == 1) {
        second = parseInt(splitted) * 3600;
    }
    return second;
}

function get_list_of_week_days(data, year, semester, class_key) {
    set_default(data, year, semester);
    let temp_date = get_date();

    // Set it to beginning of week.
    temp_date.setDate(temp_date.getDate() - temp_date.getDay());
    let a_list = [];

    for (let i = 0; i < 7; i++) {
        let month = temp_date.getMonth() + 1; // my json is one-based instead of zero-based for months.
        let date = temp_date.getDate();
        let year = temp_date.getFullYear();

        // Ensure keys are there so that it don't crash.
        set_default(data, year, semester, class_key, month, date);
        a_list.push(data[year][semester][class_key][month][date]);
        temp_date.setDate(1 + temp_date.getDate()); // Next day of week date
    }
    return a_list;
}

function get_week_total(data) {
    let detail = get_detail();
    let year = detail[0];
    let semester = detail[1];
    let total = 0;
    for (let class_name of Object.keys(data[year][semester])) {
        total += get_week_total_by_class(data, class_name);
    }
    return total;
}

function get_week_total_by_class(data, class_name) {
    let detail = get_detail();

    let semester = detail[1];

    let temp_date = get_date();

    // Set it to beginning of week.
    temp_date.setDate(temp_date.getDate() - temp_date.getDay());

    let week_total = 0;

    for (let i = 0; i < 7; i++) {
        let month = temp_date.getMonth() + 1; // my json is one-based instead of zero-based for months.
        let date = temp_date.getDate();
        let year = temp_date.getFullYear();

        // Ensure keys are there so that it don't crash.
        set_default(data, year, semester, class_name, month, date);

        week_total += data[year][semester][class_name][month][date];
        temp_date.setDate(1 + temp_date.getDate()); // Next day of week date
    }
    return week_total;
}


function get_date() {
    let month = $('#month_div select :checked').val();
    let day = $('#day_div select :checked').val();
    let year = $('#year_div select :checked').val();
    let temp_date = new Date();

    temp_date.setFullYear(year);
    temp_date.setMonth(month);
    temp_date.setDate(day);

    return temp_date;
}

function number_to_day_of_week(number) {
    switch (number) {
        case (0):
            return 'Sunday';
        case (1):
            return 'Monday';
        case (2):
            return 'Tuesday';
        case (3):
            return 'Wednesday';
        case (4):
            return 'Thursday';
        case (5):
            return 'Friday';
        case (6):
            return 'Saturday';
    }
}

function month_to_string(int_month) {
    switch (int_month) {
        case (1):
            return 'Janurary';
        case (2):
            return 'February';
        case (3):
            return 'March';
        case (4):
            return 'April';
        case (5):
            return 'May';
        case (6):
            return 'June';
        case (7):
            return 'July';
        case (8):
            return 'August';
        case (9):
            return 'September';
        case (10):
            return 'October';
        case (11):
            return 'November';
        case (12):
            return 'December';
    }
}

function set_months(date) {
    $("#month").empty();
    let info = set_select(0, 11, date.getMonth(), offset_month_to_string);
    $("#month").append(info);

}

function set_days(date) {
    $("#day").empty();
    var days = get_days_in_month(date);
    let info = set_select(1, days, date.getDate());
    $("#day").append(info);
}

function set_years(date) {
    $("#year").empty();
    let start_year = 2015;
    let info = set_select(start_year, start_year + 100, date.getFullYear());
    $("#year").append(info);

}

function month() {
    let month_val = $("#month").children("option:selected").val();
    date.setMonth(month_val);
}

function day() {
    let day_val = $("#day").children("option:selected").val();
    date.setDate(day_val);
}

function year() {
    let year_val = $("#year").children("option:selected").val();
    date.setFullYear(year_val);
}



function offset_month_to_string(int_month) {
    return month_to_string(int_month + 1);
}

function get_days_in_month(date) {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
}

function set_select(starting, limit, selected, method) {
    method = method || function (i) {
        return i
    };
    let info = "";
    for (let i = starting; i <= limit; i++) {

        if (i == selected) {
            info += "<option value='" + i + "' selected>" + method(i) + "</option>\n";
        } else {
            info += "<option value='" + i + "'>" + method(i) + "</option>\n";
        }
    }
    return info;
}
