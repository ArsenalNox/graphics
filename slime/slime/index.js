var slimes = [];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d')
var dimension = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
};

var slime_speed = 1;
var slime_angle = 45;
var slime_sensetivity = 1;
var slime_trace_disappearance_coeff = 1;

class Slime { 
    constructor(posX, posY, color, speed, angle, trace_coeff, sensetivity, search_angle){
        this.posY = posY;
        this.posX = posX;

        this.color = color;

        this.speed = speed;
        this.angle = angle;
        this.trace_coeff = trace_coeff;
        this.sensetivity = sensetivity;
        this.search_angle = search_angle
    }   
    
    
};

function populate(slimeCount, positionFormulaType=null, slimeType=null){
    let positions = []
    switch (positionFormulaType){
        
        default: 
            for(let i=0; i < slimeCount; i++){  
                positions.push({
                    x: i,
                    y: i
                });
            }
            break;
    }
    
    switch (slimeType){
        
        default: 
            for(let i=0; i<slimeCount; i++){

                let newSlime = new Slime(positions[i].x, positions[i].y, '#000', 1, 3, 0.9, 1, 20);

                slimes.push(newSlime)
            }
            break;
    }

    return true;
}


function calculate(){
    for(let i=0; i<slimes.length;i++){
        let isForward = false;
        let isLeft    = false;
        let isRight   = false;
        let posA = {
            x: slimes[i].posX + slimes[i].speed * Math.cos(slimes[i].angle),
            y: slimes[i].posY + slimes[i].speed * Math.sin(slimes[i].angle)
        }
        
        let posB = {
            x: slimes[i].posX + slimes[i].speed * Math.cos(slimes[i].angle + slimes[i].search_angle),
            y: slimes[i].posY + slimes[i].speed * Math.sin(slimes[i].angle + slimes[i].search_angle)
        }

        let posC = {
            x: slimes[i].posX + slimes[i].speed * Math.cos(slimes[i].angle - slimes[i].search_angle),
            y: slimes[i].posY + slimes[i].speed * Math.sin(slimes[i].angle - slimes[i].search_angle)
        }
   

        let imageDataA = ctx.getImageData(posA.x, posA.y, 1, 1);
        let imageDataB = ctx.getImageData(posB.x, posB.y, 1, 1);
        let imageDataC = ctx.getImageData(posC.x, posC.y, 1, 1);
            
        
        if(imageDataB.data[0] > 10){
            slimes[i].posX = posB.x;
            slimes[i].posY = posB.y;
        }
        
        if(imageDataA.data[0] > 10){
            slimes[i].posX = posA.x;
            slimes[i].posY = posA.y;
        }
        
        if(imageDataC.data[0] > 10){
            slimes[i].posX = posC.x;
            slimes[i].posY = posC.y;
        }

        

        if(slimes[i].posX > dimension.width){
            slimes[i].posX = 0;
        }
        if(slimes[i].posX < 0){
            slimes[i].posX = dimension.width
        }

        if(slimes[i].posY > dimension.height-1){
            slimes[i].posY = 0
        }
        if(slimes[i].posY < 0){
            slimes[i].posY = dimension.height
        }

    }

    return true;
}

function draw(){
    ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
    ctx.fillRect(0,0,dimension.width, dimension.height)
    for(let i=0; i < slimes.length; i++){
        
        ctx.fillStyle = "rgba(255,0,0,1)";
        ctx.fillRect(slimes[i].posX, slimes[i].posY, 1, 1);
        ctx.stroke();
    }
}

function update(){
    calculate()
    draw()
    window.requestAnimationFrame(update)
}


populate(42);
draw();
calculate()
window.requestAnimationFrame(update);
