const rulesBtn = document.getElementById('rules-btn')
const closeBtn = document.getElementById('close-btn')
const rules= document.getElementById('rules')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let score=0
const brickCol = 9
const brickRow = 5

//create ball props
const ball = {
    x:canvas.width/2,
    y:canvas.height/2,
    size:10,
    speed:4,
    dx:4,
    dy:-4
}

function drawBall(){
    ctx.beginPath()
    ctx.arc(ball.x,ball.y,ball.size,0,Math.PI*2,true)
    ctx.fillStyle = '#0095dd'
    ctx.fill()
    ctx.closePath()
}
//creat paddle props
const paddle = {
    x:canvas.width/2-40,
    y:canvas.height-20,
    w:80,
    h:10,
    speed:8,
    dx:0
}

//create brick props
const brickInfo={
    w:70,
    h:20,
    padding:10,
    offsetX:45,
    offsetY:60,
    visible:true
}

//create bricks

const bricks =[]
for(let i=0 ; i<brickCol ; i++){
    bricks[i]=[]
    for(let j=0 ; j<brickRow ; j++){
        const x = i*(brickInfo.w + brickInfo.padding) + brickInfo.offsetX
        const y = j*(brickInfo.h + brickInfo.padding) + brickInfo.offsetY
        bricks[i][j] = {x,y, ...brickInfo}
    }
}
//draw bricks on canvas
function drawBricks(){
    bricks.forEach(column => {
        column.forEach(brick=>{
            ctx.beginPath()
            ctx.rect(brick.x,brick.y,brick.w,brick.h)
            ctx.fillStyle = brick.visible ? '#0095dd':'transparent'
            ctx.fill()
            ctx.closePath()
        })
    })
}

//draw padde pn canvas
function drawPaddle(){
    ctx.beginPath()
    ctx.rect(paddle.x,paddle.y,paddle.w,paddle.h)
    ctx.fillStyle = '#0095dd'
    ctx.fill()
    ctx.closePath()
}

//draw score on canvas

function drawScore(){
    ctx.font = '20px Arial'
    ctx.fillText(`Score:${score}`,canvas.width-100,30)
}

//Event handlers

rulesBtn.addEventListener('click', () => {
    rules.classList.add('show')
})
closeBtn.addEventListener('click', () => {
    rules.classList.remove('show')
})
//move paddle on canvas
function movePaddle(){
    paddle.x += paddle.dx
    
    //wall detection
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w
    }
    if(paddle.x <0){
        paddle.x=0
    }
}

//draw Everything
function draw(){
    //clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height)

    drawBall()
    drawPaddle()
    drawScore()
    drawBricks()
}

//move the ball
function moveBall(){
    ball.x += ball.dx
    ball.y += ball.dy
    //wall collision detection (x)
    if(ball.x +ball.size > canvas.width || ball.x-ball.size<0){
        ball.dx *= -1
    }
    if(ball.y +ball.size > canvas.height || ball.y-ball.size<0){
        ball.dy *= -1
    }
    if(ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y){
        ball.dy = -ball.speed
    }
    //brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if(brick.visible){
                if(ball.x-ball.size>brick.x && ball.x + ball.size < brick.x + brick.w && ball.y + ball.size > brick.y && ball.y - ball.size < brick.y + brick.h){
                    ball.dy *=-1
                    brick.visible = false
                    increaseScore()
                }
            }
        });
    })
    if(ball.y + ball.size > canvas.height){
        showAllBricks()
        score=0
    }

}
//update canvas drawing and animation
function update(){

    moveBall()
    movePaddle()
    draw()
    requestAnimationFrame(update)

}
function increaseScore(){
    score++
    if(score% (brickRow*brickCol) === 0){
        showAllBricks()
    }
}
function showAllBricks(){
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible=true
        })
    })
}

update()

function keyDown(e){
    if (e.key === 'Right' || e.key==='ArrowRight'){
        paddle.dx = paddle.speed
    }
    else if (e.key === 'Left' || e.key==='ArrowLeft'){
        paddle.dx = -paddle.speed
    }
    
}
function keyUp(e){
    if (e.key === 'Right' || e.key==='ArrowRight'){
        paddle.dx = 0
    }
    else if (e.key === 'Left' || e.key==='ArrowLeft'){
        paddle.dx = 0
    }
}


//keyboard event handlers
document.addEventListener('keydown',keyDown)
document.addEventListener('keyup',keyUp)