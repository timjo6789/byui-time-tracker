var date = new Date();
var data;

$(document).ready(function () {
    data = load();

    set_months(date);
    set_days(date);
    set_years(date);

    set_information();
});

function set_information(){
    let season = ['Spring', 'Summer', 'Fall', 'Winter'];
    let current_season = data['variables']['current-semester'];

    let year = month_day_year(date)[2];
    data['variables']['current-year'] = year;
    set_default(data, year, current_season);
    let class_keys = Object.keys(data[year][current_season]);

    // detail section
    $('.generate-detail-picker').text('');
    detail_picker(season, 'semester', current_season, 'on_semester_change');
    detail_picker(class_keys, 'class', get_name_by_current_session(), 'on_class_change');

    // duration section
    $('.generate-grid-session').text('');
    set_class_duration(data);

    // result section
    $('#result-table').text('');
    set_table(data);

}


function class_editor() {
    let classes = $('#toggle').attr('class').toString().split(' ');
    let toggle = classes[classes.length - 1];
    if (toggle == 'stop') {
        if (confirm("Are you sure that you want to leave without saving?")) {
            location.href = $('<a href="class_editor.html"></a>')[0].href;
        }
    } else {
        location.href = $('<a href="class_editor.html"></a>')[0].href;
    }
}




function make_id_friendly(variable) {
    return variable.replace(/\s+/g, '-').toLowerCase();
}


function get_name_by_current_session() {
    let time = month_day_year(date);
    let month = time[0],
        day = time[1],
        year = time[2];
    
    current_semester = get_detail()[1];
    set_default(data, year, current_semester)

    for (each in data[year][current_semester]) {
        set_default(data, year, current_semester, each);
        if (data[year][current_semester][each]['variables']['Duration-current']) {
            return each
        }
    }
    return Object.keys(data[year][current_semester])[0];
}


function sum(list) {
    let total = 0;
    for (each of list) {
        total += each;
    }
    return total;
}

/*
 Export data to csv file

var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
var csvContent = "data:text/csv;charset=utf-8,";
data.forEach(function(infoArray, index){

   dataString = infoArray.join(",");
   csvContent += index < data.length ? dataString+ "\n" : dataString;

});

// var encodedUri = encodeURI(csvContent);
// window.open(encodedUri);

var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "my_data.csv");
document.body.appendChild(link); // Required for FF
*/
