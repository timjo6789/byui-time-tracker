var session_counter = 0;
var per_session = 0;
function session_stop_watch() {
    session_counter += 1;
    per_session += 1;
    session_display();
    set_table(data);
}

function session_display() {
    update_session();
    set_table(data);
    let class_name = $('#class input:checked').val();

    let current = month_day_year(date);
    let month = current[0], day = current[1], year = current[2];
    current_semester = get_detail()[1];
    let time = data[year][current_semester][class_name][month][day];

    $('.current.counter').text(pretty_time(time + session_counter));
    $('.session').text(pretty_time(get_day_session() + session_counter));
}

function update_session(){
    let current = month_day_year(date);
    let month = current[0], day = current[1], year = current[2];
    
    $('.item-session.header').each(function(i, each) {
        let class_name = $(each).text().trim();
        current_semester = get_detail()[1];
        set_default(data, year, current_semester, class_name, month, day);
        let time = data[year][current_semester][class_name][month][day];
        
        $('.item-session.counter.item-' + make_id_friendly(class_name)).text(pretty_time(time));
    });
}

var session_interval = setInterval(function () { }, 1000);
clearInterval(session_interval);

function set(identifier, to_remove, to_add, message){
    for (var each of to_remove){
        $(identifier).removeClass(each);
    }
    for (var each of to_add){
        $(identifier).addClass(each);
    }
    $(identifier).text(message);
}

function toggle() {
    let classes = $('#toggle').attr('class').toString().split(' ');
    let toggle = classes[classes.length - 1];
    if (toggle == 'start') {
        set('#toggle', ['start', 'w3-blue'], ['w3-red', 'stop'], 'Stop');
        session_interval = setInterval(session_stop_watch, 1000);
    } else if (toggle == 'stop') {
        set('#toggle', ['stop', 'w3-red'], ['w3-blue', 'start'], 'Start');
        clearInterval(session_interval);
    }
    session_display();
}

function reset() {
    session_counter = 0;
    per_session = 0;
    set('#toggle', ['stop', 'w3-red'], ['w3-blue', 'start'], 'Start');
    clearInterval(session_interval);
    session_display();
}

function call_save() {
    
    let detail = get_detail();
    let year = detail[0],
        semester = detail[1],
        class_name = detail[2],
        month = detail[3],
        day = detail[4];
    
    current_semester = get_detail()[1];
    set_default(data, year, current_semester, class_name, month, day);
    data[year][current_semester][class_name][month][day] += per_session;
    per_session = 0;
    session_counter = 0;
    save(data);
}


function get_day_session() {
    let detail = get_detail();

    let year = detail[0];
    let semester = detail[1];
    let a_class = detail[2];
    let month = detail[3];
    let day = detail[4];

    let session = 0;

    set_default(data, year, semester);
    for (let class_key in data[year][semester]) {
        set_default(data, year, semester, class_key, month, day);
        session += parseInt(data[year][semester][class_key][month][day]);
    }
    return session;
}