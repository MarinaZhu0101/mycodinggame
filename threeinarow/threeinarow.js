$(document).ready(function() {
    let table = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    let player = 0;
    const playerSymbols = ['X', 'O'];
    const cellDim = 150;
    let selectedRow = 0;
    let selectedCol = 0;



    function checkForWin(){
        for (let row = 0; row<3; row++){
            if (table[row][0] === table[row][1] && table[row][1] === table[row][2] && table[row][0] !== ''){
                return true;
            }
        }
        for (let col = 0; col<3; col++){
            if(table[0][col] === table[1][col] && table[1][col] === table[2][col] && table[0][col] !== ''){
                return true;
            }
        }

        if ((table[0][0] === table[1][1] && table[1][1] === table[2][2] && table[0][0] !== '') ||

            (table[0][2] === table[1][1] && table[1][1] === table[2][0] && table[0][2] !== '')) {

            return true;
        }
        return false;
    }

    function takeTurn() {
        if (isFree(selectedRow, selectedCol)) {
            table[selectedRow][selectedCol] = playerSymbols[player];
            const desiredTd = $('#table tr:eq(' + selectedRow + ') td:eq(' + selectedCol + ')');
            desiredTd.html(playerSymbols[player]);
            //更改table中的数字，通过html写入
            if (checkForWin()) {
                $('#victory')[0].play();
                setTimeout(function(){
                    alert(`Player ${playerSymbols[player]} wins!`);
                    reset();
                }, 300)
            } else {
                if (isFull()){
                    setTimeout(function(){
                        alert('No one wins!');
                        reset();
                    }, 200)
                } else {
                    player = 1 - player;
                    $('#currentPlayer').text('Current Player: ' + playerSymbols[player]);
                }
            }
        }
    }

    function isFree(row, col) {
        if (table[row][col] == '') {
            return true;
        }
        return false;
    }

    function isFull(row, col){
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (table[row][col] == ''){
                    return false;
                }
            }
        }
        return true;
    }

    $('#table').on('click', function(event){
        let x = event.pageX - $(this).offset().left;
        let y = event.pageY - $(this).offset().top;
        console.log('Mouse Position - X: ' + x + ', Y: ' + y);
        selectedRow = Math.floor(y/150);
        selectedCol = Math.floor(x/150);
        console.log('Selected Cell - row: ' + selectedRow + ', col: ' + selectedCol);
        takeTurn();
    })
    //判断鼠标的点击位置
    $('#table').on('click', function(){
        let sound = $('#sound')[0];
        sound.playbackRate += 0.4;
        sound.play(); 
    })

    $('#button').on('click', function(){
        reset();
        //重置表格
    })

    function reset(){
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                table[i][j] = '';
                $('#table tr:eq(' + i + ') td:eq(' + j + ')').html('');
            }
        }
        player = 0;
        $('#currentPlayer').text('Current Player: ' + playerSymbols[player]);
    }

});