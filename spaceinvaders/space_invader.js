$(document).ready(function(){

    space = $('.bigcontainer');
    container = $('.container');
    playerScore = parseInt($('#playerScore').text(), 10);
    defender = new Defender(700, 700, 60, 100, 8, space);
    missile = new Missile(717, 720, 25, 50, 8, space);
    aliens = createAliens(5, 8);
    playerLives = createLives(3);
    alienBoss = new Alienboss(200, 145, 80, 30, 6, space, container);
    alienMissile = new Alien_Missile(300, 200, 25, 50, 5, space, defender, container, $('<img src="pic/bullet3.png" alt="" id="missileAlien">'));
    alienBossMissile = new Alien_Missile(200, 100, 35, 60, 6, space, defender, container, $('<img src="pic/bullet3.png" alt="" id="missileAlienBoss">'));
    biu = $('#biu')[0];
    burn = $('#burn')[0];
    isGameOver = false;


    $(".startButton").click(function() {
        $(".start").hide();
        container.show();

        requestAnimationFrame(gameLoop);
    
    });

    $(document).on("keydown", function(event){
        switch (event.which) {
            case 37:
                defender.isMovingLeft = true;
                break;
            case 39:
                defender.isMovingRight = true;
                break;
            case 32:
                missile.isShooting = true;
                biu.playbackRate = 1.5;
                biu.play(); 
                break;
        }                  
    });


    $(document).on("keyup", function (event) {
        switch (event.which) {
            case 37:
                defender.isMovingLeft = false;
                break;
            case 39:
                defender.isMovingRight = false;
                break;
        }
    });

   //game over score submit
    $("#submitScoreButton").on("click", function (event) {
        event.preventDefault();

        const playerName = $("#playerName").val();
        if (playerName) {
            scores.push({ name: playerName, score: playerScore });
            scores.sort((a, b) => b.score - a.score);
            scores = scores.slice(0, 5);
            saveScores();
            $(".over").hide();
            $(".scorelist").show();
            displayTopScores();
        }else{
            alert("Please enter your name before submitting the score.");
        }
    });

    $("#restart").on("click", function () {
        $(".scorelist").hide();
        $(".over").hide();
        container.show();
        resetGame();

        requestAnimationFrame(gameLoop);
    });


    function gameLoop() {
        if (isGameOver) {
            return; 
        }

        defender.move();
        alienBoss.move();
        missile.shoot(defender.x, defender.y);
        alienMissile.alienShoot();
        alienBossMissile.alienBossShoot();
        //let alien move
        for (let i = 0; i < aliens.length; i++) {
            const alien = aliens[i];
            if (alien.isAlive && alien.isMoving) {
                alien.move();
            }
        }
    
        if (aliens && aliens.length > 0) {
            aliensMove(aliens);
        }
        checkCollisionMissileAndAlien();
        checkCollisionMissileAndAlienboss();
        defenderLose(playerLives, alienMissile, alienBossMissile, burn);

        requestAnimationFrame(gameLoop);
    }    

});



class Defender{
    constructor(x, y, width, height, speed, space){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dx = 1
        this.isMovingLeft = false;
		this.isMovingRight = false;
        this.space = space;
        this.isAlive = true;
        this.boundaryleft = parseInt(space.css('left'));
        this.boundaryright = this.boundaryleft + parseInt(space.width());
    }

    move(){
        if (this.x > this.boundaryleft && this.isMovingLeft) {
            this.x -= this.speed * this.dx;
        }
        if ((this.x + this.width) < this.boundaryright && this.isMovingRight ){
            this.x += this.speed * this.dx;
        }
        $('#defender').css('left', this.x + 'px');
        $('#defender').css('top', this.y + 'px');
    }
}


class Missile{
    constructor(x, y, width, height, speed, space){
        this.x = x;
        this.y = y;
        this.width = width;
        this.speed = speed;
        this.height = height;
        this.dy = 1;
        this.isShooting = false;
        this.space = space;
        this.boundarytop = parseInt(space.css('top'));
        this.boundarybottom = this.boundarytop + space.height();
    }
    shoot(defenderX, defenderY){
        if (!this.isShooting) {
            // Set missile's starting position based on defender's current position
            $('#missile').show();
            this.x = defenderX + (defender.width - this.width) / 2;
            this.y = defenderY;
        }

        if(this.isShooting){
            this.y -= this.speed * this.dy;
        }
            if (this.y < this.boundarytop) {
                $('#missile').hide();
                this.isShooting = false;
            }
        $('#missile').css('top', this.y + 'px');
        $('#missile').css('left', this.x + 'px');
    }

    checkCollision(alien){
        if( this.x < alien.x + alien.width && 
            this.x + this.width > alien.x && 
            this.y < alien.y + alien.height &&
            this.y + this.height > alien.y 
            ){    
                return true;
        }
    }
}

function checkCollisionMissileAndAlien(){
    for (let i = 0; i < aliens.length; i++) {
        const alien = aliens[i];
             // Check for collision between missile and alien
        if (missile.isShooting && missile.checkCollision(alien) && alien.isAlive) {
            $('#missile').hide();
            missile.isShooting = false;
            alien.isAlive = false;
            alien.element.remove();
            playerScore += 10;
            $('#playerScore').text(playerScore);
        }       
    }
}

class Alien_Missile extends Missile{
    constructor(x, y, width, height, speed, space, defender, container, element){
        super(x, y, width, height, speed, space);
        this.defender = defender;
        this.container = container;
        this.element = element;
        this.container = container;
        this.container.append(this.element);
        this.element.css('top', this.y + 'px');
        this.element.css('left', this.x + 'px');
        this.shootTimer = 0;
        this.shootInterval = 2000;
    }

    alienShoot(){
        if (!this.isShooting){
            const shootingAlien = getRandomAlien();
            if (shootingAlien) {
                this.element.show();
                this.x = shootingAlien.x + (shootingAlien.width - this.width) / 2;
                this.y = shootingAlien.y;
                this.isShooting = true;
                this.isReadyToShoot = false;
            }

        }

        if (this.isShooting) {
            this.y += this.speed * this.dy;
            this.element.css('top', this.y + 'px');
            this.element.css('left', this.x + 'px');

            if (this.y + this.height > this.boundarybottom) {
                this.element.hide();
                this.isShooting = false;
                this.isReadyToShoot = true; 
            }
        }
    }

    randomShoot() {
        this.shootTimer += 1000 / 60;
        if (this.shootTimer >= this.shootInterval) {
            this.alienBossShoot();
            this.shootTimer = 0;
        }
    }

    alienBossShoot(){
        if (!this.isShooting && alienBoss.isAlive) {
            this.element.show();
            this.x = alienBoss.x + (alienBoss.width - this.width) / 2;
            this.y = alienBoss.y;
            this.isShooting = true;
        }
        if(this.isShooting){
            this.y += this.speed * this.dy;
            this.element.css('top', this.y + 'px');
            this.element.css('left', this.x + 'px');
            if (this.y + this.height > this.boundarybottom) {
                this.element.hide();
                this.isShooting = false;
            }
        }
    }

    checkCollisionDefender(){
        if( this.x < defender.x + defender.width && 
        this.x + this.width > defender.x && 
        this.y < defender.y + defender.height &&
        this.y + this.height > defender.y &&
        this.isShooting === true
        ){  
            this.element.hide(); 
        //    this.isShooting = false;
            return true;
        }
        return false;
    }
}

class Alien{
    constructor(x, y, width, height, speed, space, container){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
        this.speed = speed;
        this.dx = 1;
        this.space = space;
        this.boundaryleft = parseInt(space.css('left'));
        this.boundaryright = this.boundaryleft + parseInt(space.width());
        this.isAlive = true;
        this.isMoving = false;
        this.element = $('<img src="pic/alien1.png" alt="" class="alien">');
        this.container = container;
        this.container.append(this.element);
        this.element.css('top', this.y + 'px');
        this.element.css('left', this.x + 'px');
    }
    move(){
        this.isMoving = true;
        this.x += this.speed * this.dx;
        this.element.css('top', this.y + 'px');
        this.element.css('left', this.x + 'px');
    }

    speedIncrease(){
        this.speed *= 1.1;
    }
    
}

//create 40 aliens
function createAliens(rows, cols){
    group = [];
    for (let row = 0; row < rows; row++){
        for(let col = 0; col < cols; col++){
            x = col * (60 + 40) + 10; // 60 is the width of an alien, 30 is the gap
            y = row * (20 + 30) + 190;
            alien = new Alien(x, y, 60, 20, 2.2, space, container);
            alien.isMoving = true;
            group.push(alien);
        }
    }
    return group;
}

// check the mostleft and mostright alien
function getRightmostAlien() {
    let rightmost = null;

    for (let i = 0; i < aliens.length; i++) {
        const alien = aliens[i];
        if (alien.isAlive && (!rightmost || alien.x > rightmost.x)) { 
            rightmost = alien;
        }
    }
    return rightmost;
}
function getLeftmostAlien() {
    let leftmost = null;

    for (let i = 0; i < aliens.length; i++) {
        const alien = aliens[i];
        if (alien.isAlive && (!leftmost || alien.x < leftmost.x)) {
            leftmost = alien;
        }
    }
    return leftmost;
}

function getBottommostAlien() {
    let bottommost = null;

    for (let i = 0; i < aliens.length; i++) {
        const alien = aliens[i];
        if (alien.isAlive && (!bottommost || alien.y > bottommost.y)) {
            bottommost = alien;
        }
    }
    return bottommost;
}

//aliens move
function aliensMove(){
    const rightmostAlien = getRightmostAlien();
    const leftmostAlien = getLeftmostAlien();

    // Change aliens direction. Check if the rightmost alien has reached the right boundary
    if (rightmostAlien.x + rightmostAlien.width >= rightmostAlien.boundaryright) {
        // Move all aliens down and change direction
        for (const alien of aliens) {
            alien.y += alien.height;
            alien.dx = -alien.dx;
            alien.speedIncrease();
        }
    } else if (leftmostAlien.x <= leftmostAlien.boundaryleft) {
        // Move all aliens down and change direction
        for (const alien of aliens) {
            alien.y += alien.height;
            alien.dx = -alien.dx;
            alien.speedIncrease();
        }
    }
}

//get a random alien
function getRandomAlien(){

    while (aliens.length > 0) {
        const randomIndex = Math.floor(Math.random() * aliens.length);
        
        if (aliens[randomIndex].isAlive) {
            return aliens[randomIndex];
        }
    }
    return null;
}


//creat alien boss
class Alienboss{
    constructor(x, y, width, height, speed, space, container){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
        this.speed = speed;
        this.dx = 1;
        this.space = space;
        this.boundaryleft = parseInt(space.css('left'));
        this.boundaryright = this.boundaryleft + parseInt(space.width());
        this.isAlive = true;
        this.isMoving = false;
        this.element = $('<img src="pic/alien3.png" alt="" id="alien3">');
        this.container = container;
        this.container.append(this.element);
        this.element.css('top', this.y + 'px');
        this.element.css('left', this.x + 'px');

    }

    move(){
        this.isMoving = true;

        if (this.x + this.width > this.boundaryright || this.x < this.boundaryleft) {
            this.dx *= -1; 
        }
        // Move horizontally based on the direction
        this.x += this.speed * this.dx;

        this.element.css('top', this.y + 'px');
        this.element.css('left', this.x + 'px');
    } 

}

function checkCollisionMissileAndAlienboss(){
    if (missile.isShooting && missile.checkCollision(alienBoss)) {
        $('#missile').hide();
        missile.isShooting = false;
        alienBoss.isAlive = false;
        alienBoss.element.remove();
        playerScore += 50;
        $('#playerScore').text(playerScore);
    }
}


// creat lives
class Lives{
    constructor(x, y, lives){
        this.x = x;
        this.y = y;
        this.lives = lives;
        this.element = $('<img src="pic/defender.png" alt="" class="live">');
        this.lives.append(this.element);
        this.element.css('top', this.y + 'px');
        this.element.css('left', this.x + 'px');
    }
}

function createLives(nums){
    const group = [];
    for (let num = 0; num < nums; num++){
        const x = num * (40 + 15) + 130; 
        const live = new Lives(x, 0, $('.lives'));
        group.push(live);       
    }
    return group;
}

//Check defenderlose
function defenderLose(playerLives, alienMissile, alienBossMissile, burn){
    const bottommostAlien = getBottommostAlien();
    if(bottommostAlien && bottommostAlien.y !== undefined && playerLives.length > 0){
        if ((bottommostAlien.y + bottommostAlien.height >= defender.y) || alienMissile.checkCollisionDefender() || alienBossMissile.checkCollisionDefender()){
            burn.playbackRate = 1.5;
            burn.play();
            $("#defender").attr("src", "pic/fire.png");
            //decrementlife
            let removedLife = playerLives.pop();
            removedLife.element.remove();

            // Reset aliens
            for (const alien of aliens) {
                alien.isMoving = false;
                alien.element.remove();
            }
            aliens.splice(0, aliens.length);
            aliens = createAliens(5, 8);

            //reset defender position
            setTimeout(function(){
            $("#defender").attr("src", "pic/defender.png");
            defender.x = 700;
            defender.y = 700;
            $('#defender').css('left', defender.x + 'px');
            $('#defender').css('top', defender.y + 'px');
            },100);      
            
            alienMissile.isShooting = false;
            alienBossMissile.isShooting = false;
            return
        }

        return
    }else{
        gameOver();
    }
}


//reset game
function resetGame() {
    playerScore = 0;
    $('#playerScore').html(playerScore);
    playerLives = createLives(3);

    // Reset aliens
    for (const alien of aliens) {
        alien.isMoving = false;
        alien.element.remove();
    }
    aliens.splice(0, aliens.length);
    aliens = createAliens(5, 8);

    //reset alienboss position
    alienBoss.isAlive = true;
    container.append(alienBoss.element);
    alienBoss.x = 200;
    alienBoss.y = 145;
    alienBoss.speed = 6;
    $('#alien3').css('left', alienBoss.x + 'px');
    $('#alien3').css('top', alienBoss.y + 'px');
    //reset defender position
    defender.x = 700;
    defender.y = 700;
    $('#defender').css('left', defender.x + 'px');
    $('#defender').css('top', defender.y + 'px');

    isGameOver = false;
}

function gameOver(){
    isGameOver = true;
    for (const alien of aliens) {
        alien.isMoving = false;
        alien.element.remove();
    }
    aliens.splice(0, aliens.length);
    container.hide();
    $(".over").show();
}


loadScores();
// load scores from localStorage
function loadScores() {
    const storedScores = localStorage.getItem('scores');
    if (storedScores) {
        scores = JSON.parse(storedScores);
    }
}

//save scores to localStorage
function saveScores() {
    localStorage.setItem('scores', JSON.stringify(scores));
}

//display the top scores
function displayTopScores() {
    const topScoresList = $("#topScores");
    topScoresList.empty();

    for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        const listItem = `<li>${score.name}: ${score.score}</li>`;
        topScoresList.append(listItem);
    }
}
