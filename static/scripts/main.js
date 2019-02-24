(function() {
    
    let gameState = {};
    initializeGameState()
    gameState.computerMode = "easy";

    function initializeGameState(){
        gameState.currentUser = "X";
        gameState.userOne = "X";
        gameState.userTwo = "O";
        gameState.boardMatrix = [["","",""],
                                 ["","",""],
                                 ["","",""]]
        gameState.totalMovesMade = 0;
        gameState.hasWinner = false;
    }

    let boxes = document.querySelectorAll(".box");
    
    // Add 'selectElement' as the click event handler for the 9 boxes
    for(let i=0;i < boxes.length;i++){
        boxes[i].addEventListener('click',function() {runTurn(this)},false)
    };

    function runTurn(ev){
        
        if(!ev.className.includes("selected") && !gameState.hasWinner){
            // Update boardMatix
            let currentBoardPosition = getBoardPosition(ev);
            gameState.boardMatrix[currentBoardPosition[0]][currentBoardPosition[1]] = gameState.currentUser

            // Add selected class to selected box
            ev.className += " selected";
            ev.innerHTML += gameState.currentUser;

            // Update the current user
            gameState.currentUser = getNextUser()
            gameState.totalMovesMade = gameState.totalMovesMade + 1;

            // Check for a winner
            let winner = checkForWinner()
            if(winner){
                window.alert(winner + " wins!");
                gameState.hasWinner = true;
                return
            }

            // Check if all boxes have been played
            if(gameState.totalMovesMade === 9){
                window.alert("Tie!")
                return;
            }
            // Play the computer
            if(gameState.currentUser === gameState.userTwo){
                computerSelect(gameState.computerMode);
            }
        }
        else{
            console.log("Already selected")
        }
    }


    function computerSelect(mode){

        function getRandomInt(max){
            return Math.floor(Math.random() * Math.floor(max));
        }

        let avail_positions = []
        for(let r=0;r<3;r++){
            for(let i=0;i<3;i++){
                if(gameState.boardMatrix[r][i] === ""){
                    avail_positions.push([r,i]);
                }
            }
        }

        
        let pos = [];
        if(mode==="easy"){
            pos = avail_positions[getRandomInt(avail_positions.length-1)];
            runComputerTurn(pos)
        } else {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(xhr.readyState === XMLHttpRequest.DONE){
                    if(xhr.status === 200) {
                        pos = xhr.response.best_move
                        runComputerTurn(pos)
                    }
                }
            }
            xhr.responseType = 'json'
            xhr.open("POST", "/hardmove");
            xhr.setRequestHeader('Content-Type','application/json');
            xhr.send(JSON.stringify(gameState));
        }
        function runComputerTurn(pos){
            let mapping = {
                0:"one",
                1:"two",
                2:"three"
            }

            let colClass = ".box." + mapping[pos[1]];
            let rowClass = ".row." + mapping[pos[0]];
            let element = document.querySelector(rowClass).querySelector(colClass)
            runTurn(element)
        }

    } 

    function checkForWinner() {
        let gb = gameState.boardMatrix;

        for(let r=0;r<3;r++){
            if(gb[r][0] === gb[r][1] && gb[r][0] === gb[r][2] && gb[r][0] !== ""){
                return gb[r][0];
            } else if(gb[0][r] === gb[1][r] && gb[0][r] === gb[2][r] && gb[0][r] !== ""){
                return gb[0][r];
            }
        }
        if(gb[0][0] === gb[1][1] && gb[0][0] === gb[2][2] && gb[0][0] !== ""){
            return gb[0][0];
        } else if(gb[0][2] === gb[1][1] && gb[0][2] === gb[2][0] && gb[0][2] !== ""){
            return gb[0][2];
        }
        return null;

    }



    function getBoardPosition(element) {
        // Uses the class names of the box and the row div the box is inside to determine the 
        // board position.
        let rowNum = 0;
        let columnNum = 0;

        switch(element.className){
            case "box one":
                columnNum = 0;
                break;
            case "box two":
                columnNum = 1;
                break;
            case "box three":
                columnNum = 2;
                break;
        };

        let parent = element.parentNode;
        switch(parent.className){
            case "row one":
                rowNum = 0;
                break;
            case "row two":
                rowNum = 1;
                break;
            case "row three":
                rowNum = 2;
                break;
        }
        return [rowNum,columnNum]
    }

    function getNextUser(){
        if(gameState.currentUser === gameState.userOne){
            return gameState.userTwo;
        } else {
            return gameState.userOne;
        }
    }

    let buttons = document.querySelectorAll("button")
    for(var i=0;i<buttons.length;i++){
        buttons[i].addEventListener('click', function() {
            initializeGameState();
            if(!(this.name === "retry")){
                gameState.computerMode = this.name;
            }
            for(var i=0;i<boxes.length;i++){
                boxes[i].classList.remove("selected");
                boxes[i].innerHTML = ""
            }
        })
    }
}());