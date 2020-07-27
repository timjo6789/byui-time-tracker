function set_class_duration(data) {
    let output = '<div class="grid-session">';

    // let week_total = get_week_total(data);

    let details = get_detail();

    let year = details[0];
    let semester = details[1];
    let a_class = details[2];
    let month = details[3];
    let day = details[4];

    set_default(data, year, semester);

    for (let class_key in data[year][semester]) {
        set_default(data, year, semester, class_key, month, day);
        let duration = data[year][semester][class_key]['variables']['Duration-current'];
        let current = duration ? ' current' : '';

        let class_id = 'item-' + make_id_friendly(class_key);
        let day_session = data[year][semester][class_key][month][day];

        output += '<div class="item-session header ' + class_id + current + '"> ' + class_key + '</div>';
        output += '<div class="item-session ' + class_id + current + '">-</div>';
        output += '<div class="item-session counter ' + class_id + current + '">' + pretty_time(day_session) + '</div>';

    }

    output += '<div class="item-session session-style item-session-time">Session time</div>';
    output += '<div class="item-session session-style">-</div>';
    output += '<div class="item-session session-style session">' + pretty_time(get_day_session()) + '</div>';

    output += '</div>';
    $(".generate-grid-session").append(output);
}
