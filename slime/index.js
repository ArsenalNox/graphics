var slimes = [];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d')
var dimension = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
};

var slime_speed = 1;
var slime_angle = 45;
var slime_sensetivity = 24;
var slime_trace_disappearance_coeff = 1;

var debug = true;

var nextStepAllowed = true;

var alpha = 0.01;

class Slime { 
    constructor(posX, posY, color, speed, angle, trace_coeff, sensetivity, search_angle, pos_calc_type){
        this.posY = posY;
        this.posX = posX;

        this.color = color;

        this.speed = speed;
        this.angle = angle * (Math.PI/180);
        this.trace_coeff = trace_coeff;
        this.sensetivity = sensetivity;
        this.search_angle = search_angle * (Math.PI/180)
        this.pos_calc_type = pos_calc_type
        console.log(this.angle, this.search_angle)
    }   
    
    
};

function populate(slimeCount, positionFormulaType=null, slimeType=null, posCalcType='round'){
    let positions = []
    switch (positionFormulaType){
        case 'forward':
             for(let i=0; i < slimeCount; i++){  
                positions.push({
                    x: dimension.height/2+10,
                    y: dimension.width/2+i
                });
            }
            break;
        default: 
            for(let i=0; i < slimeCount; i++){  
                positions.push({
                    x: dimension.height/2,
                    y: dimension.height/2+i
                });
            }
            break;
    }
    
    switch (slimeType){

        case 'green':
            for(let i=0; i<slimeCount; i++){

                let newSlime = new Slime(positions[i].x, positions[i].y, {r: 0, g: 255, b: 0}, 1, 90, 1, 1, 30, posCalcType);

                slimes.push(newSlime)
            }
            break;

        default: 
            for(let i=0; i<slimeCount; i++){

                let newSlime = new Slime(positions[i].x, positions[i].y, {r: 255, g: 0, b: 0}, 1, 20, 1, 1, 50, posCalcType);

                slimes.push(newSlime)
            }
            break;
    }

    return true;
}
    

function calculate(){
    for(let i=0; i<slimes.length;i++){
        
        let posibleDirections = [];
        

        switch (slimes[i].pos_calc_type){
            case 'precise':
                    case 'round':
            default:
                var posA = {
                    x: Math.round(slimes[i].posX + slimes[i].speed * Math.cos(slimes[i].angle)),
                    y: Math.round(slimes[i].posY + slimes[i].speed * Math.sin(slimes[i].angle)),
                    angle: slimes[i].angle
                }
                
                var posB = {
                    x: Math.round(slimes[i].posX + slimes[i].speed * Math.cos(slimes[i].angle + slimes[i].search_angle)),
                    y: Math.round(slimes[i].posY + slimes[i].speed * Math.sin(slimes[i].angle + slimes[i].search_angle)),
                    angle: slimes[i].angle + slimes[i].search_angle
                }

                var posC = {
                    x: Math.round(slimes[i].posX + slimes[i].speed * Math.cos(slimes[i].angle - slimes[i].search_angle)),
                    y: Math.round(slimes[i].posY + slimes[i].speed * Math.sin(slimes[i].angle - slimes[i].search_angle)),
                    angle: slimes[i].angle - slimes[i].search_angle
                }
                break
        }
        
   

        let imageDataA = ctx.getImageData(posA.x, posA.y, 1, 1);
        let imageDataB = ctx.getImageData(posB.x, posB.y, 1, 1);
        let imageDataC = ctx.getImageData(posC.x, posC.y, 1, 1);
        
        if(debug){
            ctx.fillStyle = "rgba(0,0,0,0.4)";
            ctx.fillRect(posA.x, posA.y, 1, 1);
            ctx.fillRect(posB.x, posB.y, 1, 1);
            ctx.fillRect(posC.x, posC.y, 1, 1);
            ctx.stroke();
        }

        if(imageDataB.data[1] > slime_sensetivity){
            posibleDirections.push({
                x: posB.x,
                y: posB.y,
                a: posB.angle
            })
        }
        
        if(imageDataA.data[1] > slime_sensetivity){
            posibleDirections.push({
                x: posA.x,
                y: posA.y,
                a: posA.angle
            })

        }
        
        if(imageDataC.data[1] > slime_sensetivity){
            posibleDirections.push({
                x: posC.x,
                y: posC.y,
                a: posC.angle
            })

        }
        
        if(posibleDirections.length == 0){
            slimes[i].posX = posA.x;
            slimes[i].posY = posA.y;
        } else {
            let pointer = randomNumber(0, posibleDirections.length-1)

            slimes[i].posX  = posibleDirections[pointer].x;
            slimes[i].posY  = posibleDirections[pointer].y;
            slimes[i].angle = posibleDirections[pointer].a;
        }


        if(slimes[i].posX > dimension.width-1){
            slimes[i].posX = 1;
        }

        if(slimes[i].posX < 1){
            slimes[i].posX = dimension.width-1
        }

        if(slimes[i].posY > dimension.height-1){
            slimes[i].posY = 1
        }

        if(slimes[i].posY < 1){
            slimes[i].posY = dimension.height-1
        }

    }

    return true;
}

function randomNumber(a, b){
    return Math.round( Math.random() * (b-a) + a)
}

function draw(){
    ctx.fillStyle = "rgba(255, 255, 255, "+alpha+")";
    ctx.fillRect(0,0,dimension.width, dimension.height)
    for(let i=0; i < slimes.length; i++){
        
        ctx.fillStyle = "rgba("+slimes[i].color.r+","+slimes[i].color.g+","+slimes[i].color.b+",1)";
        ctx.fillRect(slimes[i].posX, slimes[i].posY, 1, 1);
        ctx.stroke();
    }
}

function update(){
    calculate()
    draw()
    if(nextStepAllowed){
        window.requestAnimationFrame(update)
    }
}


document.addEventListener('keydown', (e)=>{
    if(e.keyCode == 32){
        if(nextStepAllowed){
            nextStepAllowed=false;
        } else {
            window.requestAnimationFrame(update);
            nextStepAllowed=true;
        }
    }
})


populate(500, 'forward',      'green', 'precise');


draw();
calculate()
window.requestAnimationFrame(update);
