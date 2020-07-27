var body_background = false, div_background = false, div_lock = false;
var color_1 = "white", color_2 = "white", color_3 = "white";

function get_random_color() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function set_random_color() {
    if (!body_background) {
        color_1 = get_random_color();
    }
    if (!div_background) {
        color_2 = get_random_color();
    }
    if (!div_lock) {
        color_3 = get_random_color();
    }

    console.log(color_1 + '\n' + color_2 + '\n' + color_3);

    $('body').css('background-color', color_1);
    $('.section').css('background-color', color_2);
    $('.section').css('color', color_3);
    $('.color').css('color', color_3);
}


function toggle_body_background_lock() {
    body_background = !body_background;
}
function toggle_div_background_lock() {
    div_background = !div_background;
}
function toggle_div_lock() {
    div_lock = !div_lock;
}