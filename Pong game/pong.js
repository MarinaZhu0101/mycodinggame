$(document).ready(function(){

    const ballProperties = {
        x: 40, //left
        y: 0,
        width: 20,
        height: 20,
        directionX: 1,
        directionY: 1,
        speed: 4,
        animation: {},
    }

    const ball = $(".ball");
    ball.css({left: ballProperties.x + "px"});
    ball.css({top: ballProperties.y + "px"});

    //ball move
    ballProperties.ani = window.requestAnimationFrame(mover);
    
    function mover(){
        ballProperties.x += ballProperties.directionX * ballProperties.speed;
        ballProperties.y += ballProperties.directionY * ballProperties.speed;
        ball.css({left: ballProperties.x + "px"});
        ball.css({top: ballProperties.y + "px"});

        const bounceBox = $('.container');
        let collision = detectCollision(ball, bounceBox, player1, player2);

        if (collision.xCollision == true){
            ballProperties.directionX = -ballProperties.directionX;
        }
        if (collision.yCollision == true){
            ballProperties.directionY = -ballProperties.directionY;
        }
        checkWin(ball, bounceBox);

        ballProperties.ani = window.requestAnimationFrame(mover);
    }

    function detectCollision(ballElement, boxElement, player1Element, player2Element){

        //defining the boundaries of the box
        const boxTop = boxElement.offset().top;
        const boxHeight = boxElement.height();

        //defining the boundaries of the ball
        const ballLeft = ballElement.offset().left;
        const ballTop = ballElement.offset().top;
        const ballWidth = ballElement.width();
        const ballHeight = ballElement.height();

        //defining the boundaries of the player
        const player1Left = player1Element.offset().left;
        const player1Top = player1Element.offset().top;
        const player1Width = player1Element.width();
        const player1Height = player1Element.height();
        const player2Left = player2Element.offset().left;
        const player2Top = player2Element.offset().top;
        const player2Width = player2Element.width();
        const player2Height = player2Element.height();


        let collisionDetected = {
            xCollision: false,
            yCollision: false,
        };

        if (ballTop <= boxTop || ballTop + ballHeight >= boxTop+ boxHeight){
            collisionDetected.yCollision = true;
        }
        if (ballLeft <= player1Left + player1Width && ballTop + ballHeight >= player1Top && ballTop <= player1Top + player1Height){
            collisionDetected.xCollision = true;
        }
        if (ballLeft + ballWidth >= player2Left && ballTop + ballHeight >= player2Top && ballTop <= player2Top + player2Height){
            collisionDetected.xCollision = true;
        }

        return collisionDetected;
    }


    function checkWin(ballElement, boxElement){
        const ballLeft = ballElement.offset().left;
        const ballWidth = ballElement.width();
        const boxLeft = boxElement.offset().left;
        const boxWidth = boxElement.width();
        let player1Score = parseInt($('#player1-Score').text(), 10);
        let player2Score = parseInt($('#player2-Score').text(), 10);


        if (ballLeft == boxLeft){
            player2Score += 1;
            console.log(player2Score);
            $('#player2-Score').html(player2Score);
            ballProperties.x = 40;
            ballProperties.y = 0;
            ballProperties.directionX = 1;
            ballProperties.directionY = 1;
        }

        if (ballLeft + ballWidth == boxLeft + boxWidth){
            player1Score += 1;
            console.log(player1Score);
            $('#player1-Score').html(player1Score);
            ballProperties.x = 40;
            ballProperties.y = 0;
            ballProperties.directionX = 1;
            ballProperties.directionY = 1;
        }
    }

    const player1 = $('#player1');
    const player2 = $('#player2');
    const boundarytop = 0;
    const boundarybottom = 380;
     //key"Q""A" to control player1 move; arrowup and down to control player2 move; consider the frame
     //因为我设置了相对和绝对定位所以top值相对母容器是0？？

    $(document).on("keydown", function(event){
        let y = parseInt(player2.css('top'));
        let yy = parseInt(player1.css('top'));
        switch (event.which) {
            case 40:
                y += 20;
                if (y > boundarybottom){
                    y = boundarybottom;
                }
                break;
            case 38:
                y -= 20;
                if (y < boundarytop){
                    y = boundarytop;
                }
                break;
            case 65:
                yy += 20;
                if (yy > boundarybottom){
                    yy = boundarybottom;
                }
                break;
            case 81:
                yy -= 20;
                if (yy < boundarytop){
                    yy = boundarytop;
                }
                break;
        }
        player2.css({top: y + "px"}); 
        player1.css({top: yy + "px"});
    });

    $('.button').on("click", function(event){
        ballProperties.x = 40;
        ballProperties.y = 0;
        ballProperties.directionX = 1;
        ballProperties.directionY = 1;
        $('#player2-Score').html(0);
        $('#player1-Score').html(0);
    });


});