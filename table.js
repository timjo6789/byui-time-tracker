function set_table(data) {
    $('#result-table').text('');
    let headers = ['Name', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Week', 'Time_left', 'Planned', 'Credits'];
    let total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Sunday - Credits

    let output = '<table class="w3-table color">';
    output += '<tr>';
    for (let each of headers) {
        output += '<th>' + each + '</th>';
    }
    output += '</tr>';

    let detail = get_detail();

    let year = detail[0];
    let semester = detail[1];

    set_default(data, year, semester);
    for (let class_key in data[year][semester]) {
        let duration = data[year][semester][class_key]['variables']['Duration-current'];
        if (duration) {
            output += '<tr><td class="week-current">' + class_key + '</td>';
        } else {
            output += '<tr><td>' + class_key + '</td>';
        }
        let days = get_list_of_week_days(data, year, semester, class_key);
        let day_of_week = date.getDay();
        for (let i = 0; i < days.length; i++) {
            // check for day of week to current date
            if (day_of_week == i && duration) {
                output += '<td class="' + make_id_friendly(class_key) + ' week-current">' + pretty_time(days[i] + session_counter) + '</td>';
                total[i] += session_counter;
            } else {
                output += '<td class="' + make_id_friendly(class_key) + '">' + pretty_time(days[i]) + '</td>';
            }
            total[i] += days[i];
        }

        let week = get_week_total_by_class(data, class_key);
        let planned = data[year][semester][class_key]['variables']['Planned'];
        let time_left = planned - week;
        let credit = data[year][semester][class_key]['variables']['Credits'];

        total[7] += week;
        total[8] += time_left;
        total[9] += planned;
        total[10] += credit;

        if (duration) {
            output += '<td class="' + make_id_friendly('week') + ' week-current">' + pretty_time(week + session_counter) + '</td>';
            output += '<td class="' + make_id_friendly('time_left') + ' week-current">' + pretty_time(time_left - session_counter) + '</td>';
            output += '<td class="' + make_id_friendly('planned') + ' week-current">' + pretty_time(planned) + '</td>';

        } else {
            output += '<td class="' + make_id_friendly('week') + ' week-c">' + pretty_time(week) + '</td>';
            output += '<td class="' + make_id_friendly('time_left') + '">' + pretty_time(time_left) + '</td>';
            output += '<td class="' + make_id_friendly('planned') + '">' + pretty_time(planned) + '</td>';

        }
        output += '<td class="' + make_id_friendly('credits') + '">' + pretty_time(credit) + '</td>';
        output += '</tr>';
    }
    total[7] += session_counter;
    total[8] -= session_counter;
    output += '<tr>';

    output += '<td>Total</td>'
    for (let i = 0; i < total.length; i++) {
        output += '<td>';
        if (i == total.length - 1) {
            output += total[i];
        } else {
            output += pretty_time(total[i]);
        }
        output += '</td>';
    }

    output += '</tr>';
    output += '</table>';
    $('#result-table').append(output);
}
