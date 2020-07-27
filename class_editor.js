var editor_counter = 1;
var editor_difficulty_counter = 1;
var data = "";
var year = '';
var current_semester = '';

var difficulty_multiplier = {
    'easy': 2,
    'medium': 3,
    'hard': 4
}

$(document).ready(function () {
    data = load();

    year = parseInt(data['variables']['current-year'])
    current_semester = data['variables']['current-semester']
    console.log(year);
    console.log(current_semester);

    $.each(data[year][current_semester], function (class_key, class_value) {
        console.log(class_key);
        console.log(class_value);
        let variables = class_value['variables'];
        let difficulty = variables['Difficulty-set'];
        let credits = variables['Credits'];
        let planned = variables['Planned'];
        $('.second-last-row').before(load_add(class_key, difficulty, credits, planned));
    });
    set_override_listener();
    set_difficulty_listener();
});
/*
    Helpful checker functions
*/

function check_planned(difficulty, credits, planned) {
    if (planned == 0) {
        return 'not set';
    }
    let default_planned = credits * difficulty_multiplier[difficulty] * 3600;
    return (default_planned == planned ? 'defaulted' : 'override');
}

/*
    Helpful string group constructors
*/

function define_planned(difficulty, credits, planned) {
    let result = check_planned(difficulty, credits, planned);

    let override = '';
    let calculated = '';

    let default_planned = credits * difficulty_multiplier[difficulty] * 3600;

    if (planned <= 0 || default_planned == planned) {
        calculated = `${pretty_time(default_planned)}`;
    } else {
        override = `${pretty_time(planned)}`;
    }

    return [calculated, override];
}

function difficulty_input(keyword, checked) {
    checked = (typeof (checked) == 'undefined' ? '' : ' checked');
    let output = '<div>\n';
    output += `<input type="radio" name="${difficulty_main()}" id="${difficulty_number(keyword)}" value="${keyword}"${checked}>\n`;
    output += `<label for="${difficulty_number(keyword)}">${capitalize(keyword)}</label>\n`;
    output += '</div>\n';
    return output;
}
/*
    Helpful string constructors
*/

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

function difficulty_main() {
    return `difficulty-main-${editor_counter}`;
}

function difficulty_number(keyword) {
    return `difficulty-${keyword}-${editor_difficulty_counter}`;
}

/*
    Others
*/

function load_add(class_name, difficulty, credits, planned) {
    let results = define_planned(difficulty, credits, planned);
    let calculated = results[0];
    let override = `value="${results[1]}"`;

    let output = `<div class="each-row" id="${difficulty_main()}">\n`
    output += `<input placeholder="Class Name" value="${class_name}">\n`;

    let min = 1;
    let max = 99;
    credits = (credits > max ? max : credits);
    credits = (credits < min ? min : credits);

    output += `<input type="number" min="${min}" max="${max}" value="${credits}">\n`;

    for (let each of ['easy', 'medium', 'hard']) {
        output += difficulty_input(each, (difficulty == each ? '' : undefined));
    }

    output += `<span class="calculated">${calculated}</span>\n`;
    output += `<input class="override" ${override}>\n`;
    output += '<button class="w3-button w3-red" onclick="remove(this)">Clear Row</button>\n';
    output += '</div>\n';

    editor_counter++;
    editor_difficulty_counter++;
    return output;
}

function set_difficulty_listener() {
    $('input[type=radio]').change(function () {
        let element = $(this).parent();

        let difficulty = this.value;
        let credits = element.siblings('input:eq(1)').val();

        let calculated = element.siblings('.calculated').text();
        if (calculated.length != 0) {
            let defaulted = parseInt(credits) * difficulty_multiplier[difficulty] * 3600;
            element.siblings('.calculated').text(pretty_time(defaulted));
        }
        update_total();
    });
}

function set_override_listener() {
    $('.override').each(function () {
        var elem = $(this);

        // Save current value of element
        elem.data('oldVal', elem.val());

        // Look for changes in the value
        elem.bind("propertychange change click keyup input paste", function (event) {
            // If value has changed...
            if (elem.data('oldVal') != elem.val()) {
                // Updated stored value
                elem.data('oldVal', elem.val());

                // Do action
                if (elem.val().trim() == '') {
                    let class_name = elem.siblings('input:eq(0)').val();
                    let difficulty = elem.siblings('div').children('input:checked').val();
                    let credits = elem.siblings('input:eq(1)').val();
                    let defaulted = parseInt(credits) * difficulty_multiplier[difficulty] * 3600;
                    elem.siblings('.calculated').text(pretty_time(defaulted));
                    update_total();
                } else {
                    elem.siblings('.calculated').text('');
                    update_total();
                }
            }
        });
    });
}

function update_total() {
    let total = 0;
    let nan_triggered = false;
    $('.each-row').slice(1).each(function () {
        let elem = $(this);
        let class_name = elem.children('input:eq(0)').val();
        let difficulty = elem.children('div').children('input:checked').val();
        let credits = elem.children('input:eq(1)').val();
        let defaulted = parseInt(credits) * difficulty_multiplier[difficulty] * 3600;
        let calculated = elem.children('.calculated').text();
        let override = elem.children('.override').val();

        calculated = (calculated == '' ? '0' : calculated);
        calculated = Number.isNaN(convert_to_seconds(calculated)) ? 0 : convert_to_seconds(calculated);

        override = (override == '' ? '0' : override);
        nan_triggered = Number.isNaN(convert_to_seconds(override));
        if (nan_triggered) {
            console.log('triggered');
            return false;
        }
        override = Number.isNaN(convert_to_seconds(override)) ? 0 : convert_to_seconds(override);
        total += calculated + override;
    });
    console.log(nan_triggered);
    if (!nan_triggered) {
        $('#total').text(pretty_time(total));
    }
}

function add() {
    let output = `<div class="each-row" id="${difficulty_main()}">\n`
    output += '<input placeholder="Class Name">\n';
    output += '<input type="number" min="1" max="99" value="1">\n';

    output += difficulty_input('easy', '');
    output += difficulty_input('medium');
    output += difficulty_input('hard');

    output += '<span class="calculated">2:00:00</span>\n';
    output += '<input class="override">\n';
    output += '<button class="w3-button w3-red" onclick="remove(this)">Clear Row</button>\n';
    output += '</div>\n';

    editor_counter++;
    editor_difficulty_counter++;
    return output;
}

function add_row() {
    $('.second-last-row').before(add());
    set_override_listener();
    set_difficulty_listener();
    update_total();
}


function remove(element) {
    let class_name = $(element).siblings('input:eq(0)').val();
    if (confirm(`Are you sure that you want to remove ${class_name}?`)) {
        $(element).parent('.each-row').remove();
    }
}

function save_and_exit() {
    if (confirm("Are you sure you want to save and exit?")) {
        let existing_keys = [];
        let data_keys = [];
        try{
            data_keys = Object.keys(data[year][current_semester]);
        } catch (error) {
            if (error.name = 'TypeError'){
                data_keys = [];
            } else {
                throw error;
            }
        }
        $('.each-row').slice(1).each(function () {
            let element = $(this);
            let class_name = element.children('input:eq(0)').val();
            let credits = element.children('input:eq(1)').val();;
            let difficulty = element.children('div').children('input:checked').val();

            let calculated = element.children('.calculated').text();
            let override = element.children('.override').val();
            let total = (calculated == '' ? override : calculated);
            if (!data_keys.includes(class_name)){
                set_default(data, year, current_semester, class_name);
            }
            data[year][current_semester][class_name]['variables']['Credits'] = credits;
            data[year][current_semester][class_name]['variables']['Difficulty-set'] = difficulty;
            data[year][current_semester][class_name]['variables']['Planned'] = convert_to_seconds(total);
            existing_keys.push(class_name);
        });
        
        var difference = Object.keys(data[year][current_semester]).filter(x => !existing_keys.includes(x));
        console.log(difference);
        
        for (let delete_each of difference){
            delete data[year][current_semester][delete_each];
        }
        save(data);
        return_to_index();
    }
}

function return_to_index() {
    location.href = $('<a href="index.html"></a>')[0].href;
}

function refresh() {
    location.href = $('<a href="class_editor.html"></a>')[0].href;
}

function reset() {
    if (confirm("Are you sure that you want to reset? (progress may be lost)")) {
        refresh();
    }
}

function cancel() {
    if (confirm("Are you sure that you want to leave without saving?")) {
        return_to_index();
    }
}

function Return() {

}
