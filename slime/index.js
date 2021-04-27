var slimes = [];

var canvas = document.getElementById('canvasRoot');
var dimensoin = {
    x: canvas.clientWidth,
    y: canvas.clientHeight
};

var slime_speed = 1;
var slime_angle = 45;
var slime_sensetivity = 1;
var slime_trace_disappearance_coeff = 1;

class Slime { 
    constructor(posX, posY, color, speed, search_angle, angle, trace_coeff, sensetivity){
        this.posY = posY;
        this.posX = posX;

        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.search_angle = search_angle;
        this.trace_coeff = trace_coeff;
        this.sensetivity = sensetivity;
    }   
    
    
};
