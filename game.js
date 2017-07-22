var car_address = [ "images/cars/car1.png", "images/cars/car2.png", "images/cars/car4.png", "images/cars/car5.png", "images/cars/car6.png", "images/cars/car7.png" ]; //Addresses for other cars.
var interval_main_id, interval_car_id, interval_animation_id, interval_timer_id, level_up_id;
var running_cars = [];
var running_cars_yposition = [], running_cars_xposition = [];
var start_animation_flag = false, is_game_paused = false, is_game_started = false, is_alive = true;
var user_car_position = 400, user_car_top = 560, level_up_position = 200;
var game_duration, game_level = 1, elapsed_seconds, elapsed_minutes;
var level_label, timer_label, boom_image, msg;

/*Toggles the state of a button. i.e. This function disables the button if it is previously enabled and vice versa.*/
function disable_button(button_id, is_enabled) {
    var intended_button = document.getElementById(button_id);
    if(is_enabled == true) {
        intended_button.setAttribute('disabled', 'disabled');
        return;
    }
    intended_button.removeAttribute('disabled');
} 

/*Changes the value of a button to a new value.*/
function change_button_value(button_id, new_value) {
    var intended_button = document.getElementById(button_id);
    intended_button.innerHTML = new_value; 
}

/*Generates a random number between specified length(road width).*/
function generate_position(min, max) {
    "use strict";
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

/*Generates a new car.*/
function generate_car() {
    "use strict";
    var car_index = (Math.random() * 10) % 6;
    running_cars.push(document.createElement("img"));
    running_cars[running_cars.length - 1].setAttribute('src', car_address[Math.floor(car_index)]);
    running_cars[running_cars.length - 1].style.height = 100 + 'px';
    running_cars[running_cars.length - 1].style.width = 60 + 'px';
    running_cars[running_cars.length - 1].style.position = "absolute";
    if(generate_position(1, 10) % 3 != 0) {
        running_cars_xposition[running_cars.length - 1] = generate_position(370, 795);
        running_cars[running_cars.length - 1].style.left = running_cars_xposition[running_cars.length - 1] + 'px';
    }
    else {
        running_cars_xposition[running_cars.length - 1] = user_car_position;
        running_cars[running_cars.length - 1].style.left = running_cars_xposition[running_cars.length - 1] + 'px';
    }
    running_cars[running_cars.length - 1].style.top = 0;
    running_cars_yposition[running_cars.length - 1] = 0;
    document.body.appendChild(running_cars[running_cars.length - 1]);
    start_animation_flag = true;
}

/*Starts animation of other cars.*/
function start_animation() {
    "use strict";
    if(start_animation_flag == true) {
        interval_animation_id = setInterval(animate_cars, 10);
    }
}

/*Displays boom image.*/
function boom() {
    boom_image = document.createElement("img");
    boom_image.setAttribute('src', "images/boom.png");
    boom_image.style.height = 100 + 'px';
    boom_image.style.width = 100 + 'px';
    boom_image.style.position = "absolute";
    boom_image.style.top = user_car_top + 'px';
    boom_image.style.left = (user_car_position - 20) + 'px';
    document.body.appendChild(boom_image);
}

/*Detects collision between cars.*/
function detect_collision(car_index) {
    if(((running_cars_yposition[car_index] >= user_car_top - 90) && running_cars_yposition[car_index] < 600) && ((((running_cars_xposition[car_index] - 50) < user_car_position) && ((running_cars_xposition[car_index] + 50) > user_car_position)))) {
        return true;
    }
    return false;
}

/*Handles operation when game is over.*/
function game_over() {
    "use strict";
    is_game_started = false;
    is_alive = false;
    start_animation_flag = false;
    pause_game();
    msg = document.createElement("img");
    msg.setAttribute('src', "images/gameover.png")
    msg.style.position = "absolute";
    msg.style.left = 475 + 'px';
    msg.style.top = 200 + 'px';
    document.body.appendChild(msg);
    var id = setTimeout(init_game, 3000);
    
}

/*Gives motion to other cars.*/
function animate_cars() {
    "use strict";
    var i;
    for(i = 0; i < running_cars_yposition.length; i++) {
        running_cars_yposition[i] += (game_level + 1);
        running_cars[i].style.top = running_cars_yposition[i] + 'px';
        if(running_cars_yposition[i] == 600) {
            running_cars_yposition = running_cars_yposition.slice(1, running_cars_yposition.length);
            running_cars_xposition = running_cars_xposition.slice(1, running_cars_xposition.length);
            running_cars[i].parentNode.removeChild(running_cars[i]);
            running_cars = running_cars.slice(1, running_cars.length);
        }
        if(detect_collision(i)) {
            boom();
            game_over();
        }
    }
}

/*Moves user's car left or right according the arrow pressed.*/
function move_car(e) {
    "use strict";
    if(is_game_paused) {
        return;
    }
    var keynum;
    var car = document.getElementById("user_car");
    if(window.event) {
        //This is for IE
        keynum = e.keyCode;
    }
    else if(e.which) {
        //For Firefox/Netscape/Opera
        keynum = e.which;
    }
    if(keynum == 37) {
        if(user_car_position > 370)
            user_car_position -= 10;
        car.style.left = user_car_position + 'px';
    }
    else if(keynum == 39) {
        if(user_car_position < 795)
            user_car_position += 10;
        car.style.left = user_car_position + 'px';
    }
}

/*Pauses the game.*/
function pause_game() {
    "use strict";
    disable_button("pause_button", true);
    disable_button("start_button", false);
    change_button_value("start_button", "Resume");
    clearInterval(interval_car_id);
    clearTimeout(interval_main_id);
    clearInterval(interval_animation_id);
    clearInterval(interval_timer_id);
    is_game_paused = true;
    is_game_started = false;
}

/*Stops the game.*/
function stop_game() {
    "use strict";
    disable_button("stop_button", true);
    pause_game();
    var result = confirm("Do you want to stop this game?");
    if(result) {
        change_button_value("start_button", "Start");
        start_animation_flag = false;
        init_game();
    }
}


function animate_label() {
    var level_up = document.getElementById("level_up");
    level_up_position -= 4;
    if(level_up_position == 0) {
        level_up.parentNode.removeChild(level_up);
        level_up_position = 200;
        clearInterval(level_up_id);
    }
    else {
        level_up.style.top = level_up_position + 'px';
    }
}

/*Generates timer for the game.*/
function generate_timer() {
    var level_up;
    elapsed_seconds++;
    if(Math.floor(elapsed_seconds) == 60) {
        elapsed_minutes++;
        game_level++;
        elapsed_seconds = 0;
        level_up = document.createElement("label");
        level_up.setAttribute('id', "level_up");
        level_up.innerHTML = "Level Up"
        level_up.style.position = "absolute";
        level_up.style.left = 535 + 'px';
        level_up.style.top = level_up_position + 'px';
        level_up.style.fontSize = 36 + 'px';
        level_up.style.color = "pink";
        document.body.appendChild(level_up)
        level_up_id = setInterval(animate_label, 50);
    }
    level_label = document.createElement("label");
    level_label.style.backgroundColor = "skyblue";
    level_label.style.fontSize = 24 + 'px';
    level_label.style.width = 150 + 'px';
    level_label.style.textAlign = "center";
    level_label.style.position = "absolute";
    level_label.style.left = 1100 + 'px';
    level_label.style.color = "black";
    level_label.innerHTML = "Level: " + Math.floor(game_level);
    level_label.style.border = "2px solid darkblue";
    document.body.appendChild(level_label);
    timer_label = document.createElement("label");
    timer_label.style.backgroundColor = "skyblue";
    timer_label.style.fontSize = 24 + 'px';
    timer_label.style.width = 150 + 'px';
    timer_label.style.textAlign = "center";
    timer_label.style.position = "absolute";
    timer_label.style.left = 1100 + 'px';
    timer_label.style.top = 50 + 'px';
    timer_label.style.color = "black";
    if(elapsed_seconds >= 10) {
        timer_label.innerHTML = "Time: " + Math.floor(elapsed_minutes) + ":" + Math.floor(elapsed_seconds);
    }
    else {
        timer_label.innerHTML = "Time: " + Math.floor(elapsed_minutes) + ":0" + Math.floor(elapsed_seconds);
    }
    timer_label.style.border = "2px solid darkblue";
    document.body.appendChild(timer_label);
}

/*Start the game when 'Start' button is clicked.*/
function start_game() {
    "use strict";
    is_game_started = true;
    disable_button("pause_button", false);
    disable_button("stop_button", false);
    if(!is_game_paused) {
        user_car_position = 400;
        generate_car();
    }
    else if(!start_animation_flag) {
        start_animation_flag = true;
    }
    is_game_paused = false;
    interval_timer_id = setInterval(generate_timer, 1000);
    interval_car_id = setInterval(generate_car, 1000);
    interval_main_id = setTimeout(start_animation, 10);
    change_button_value("start_button", "Start");
}

/*Initialises the game.*/
function init_game() {
    "use strict";
    var i;
    for(i = 0; i < running_cars.length; i++) {
        running_cars[i].parentNode.removeChild(running_cars[i]);
    }
    game_level = 1;
    game_duration = 0;
    elapsed_minutes = elapsed_seconds = 0;
    running_cars = [];
    running_cars_xposition = [];
    running_cars_yposition = [];
    change_button_value("start_button", "Start");
    if(!is_alive) {
        boom_image.parentNode.removeChild(boom_image);
        msg.parentNode.removeChild(msg);
        if(level_up_position != 200) {
            clearInterval(level_up_id);
        }
        is_alive = true;
    }
}