function detail_picker(list, id, selected, a_function) {
    let output = '<div id="' + id + '" onchange="' + a_function + '()" class="card grid-radio">';
    for (let i = 0; i < list.length; i++) {
        let title = list[i];
        let id_friendly = id + '-' + list[i].replace(/\s+/g, '-').toLowerCase();
        output += '<input type="radio" class="item" id="' + id_friendly + '" name="' + id + '" value="' + title + '" ' + (title == selected ? 'checked >' : '>');
        output += '<label for="' + id_friendly + '">' + title + '</label>';
    }
    output += '</div>';
    $('.generate-detail-picker').append(output);
}

function get_detail(data) {
    let semester = $('#semester :checked').val();
    let month = parseInt($('#month_div select :checked').val()) + 1;
    let day = parseInt($('#day_div select :checked').val());
    let year = parseInt($('#year_div select :checked').val());
    let a_class = $('#class input:checked').val();
    return [year, semester, a_class, month, day];
}

function on_class_change() {
    let a_class = $('#class input:checked').val();
    $('.grid-session .current').removeClass('current');
    $('.grid-session .item-' + make_id_friendly(a_class)).addClass('current');
    let details = get_detail();

    let year = details[0];
    let semester = details[1];

    for (let class_key in data[year][semester]) {
        if (!(class_key == a_class)){
        data[year][semester][class_key]['variables']['Duration-current'] = false;
        }
    }
    data[year][semester][a_class]['variables']['Duration-current'] = true;
    session_display();
    set_table(data);
}

function on_semester_change() {
    // TODO: change semester.
    let details = get_detail();
    
    let year = details[0];
    let semester = details[1];
    update_variable('current-semester', semester);
    set_default(data, year, semester);
    set_information();
}
