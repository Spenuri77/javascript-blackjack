let cardTypes = ['cardClubs', 'cardDiamonds', 'cardHearts', 'cardSpades'];
let cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'K', 'Q', 'A'];
let playerCards = [];
let croupierCards = [];
let flipCard = document.getElementById('flip-card');
let flipCardInner = document.getElementById('flip-card-inner');
let playerScoreP = document.getElementById('player-score');
let croupierScoreP = document.getElementById('croupier-score');
let resultP = document.getElementById('result');
let popUpDiv = document.getElementById('pop-up');

let hitBtn = document.getElementById('hit-btn');
let standBtn = document.getElementById('stand-btn');
let doubleBtn = document.getElementById('double-btn');

let interval;
let interval2;

let croupierScore17 = false;
let playerStand = false;
let playerBust = false;
let playerBlackjack = false;
let playerMoreThan10 = false;
let croupierMoreThan10 = false;

let playerStake;

let cardSound = new Audio('flipcard.mp3');
let winSound = new Audio('win.mp3');
let defeatSound = new Audio('fiasco.mp3');

function blockButtons() {
    hitBtn.setAttribute('disabled', '');
    standBtn.setAttribute('disabled', '');
    doubleBtn.setAttribute('disabled', '');
}

function generateCard(playerType){
    cardSound.play();
    let cardType = String(cardTypes[Math.floor(Math.random() * cardTypes.length)]);
    let cardValueIndex = Math.floor(Math.random() * cardValues.length)
    let cardValue = cardValues[cardValueIndex];
    let card = 'Cards/' + cardType + cardValue + '.png';
    
    if(playerType == 'player'){
        if(cardValueIndex >= 0 && cardValueIndex <= 8){
            playerCards.push(cardValue);
        } else if(cardValueIndex >= 9 && cardValueIndex <= 11){
            playerCards.push(10);
        } else{
            if(playerMoreThan10){
                playerCards.push(1);
            } else{
                playerCards.push(11);
            }
        }
    } else if(playerType == 'croupier'){
        if(cardValueIndex >= 0 && cardValueIndex <= 8){
            croupierCards.push(cardValue);
        } else if(cardValueIndex >= 9 && cardValueIndex <= 11){
            croupierCards.push(10);
        } else{
            if(croupierMoreThan10){
                croupierCards.push(1);
            } else{
                croupierCards.push(11);
            }
        }
    }

    return card;
}

function countPlayerCards(){
    let playerCardsSum = 0;
    for (let i = 0; i < playerCards.length; i++) {
        playerCardsSum += playerCards[i];
    }
    playerScoreP.innerHTML = playerCardsSum;

    if(playerCardsSum == 21){
        playerBlackjack = true;
    } else if(playerCardsSum > 21){
        playerBust = true;
    } 
    
    if(playerCardsSum > 10){
        playerMoreThan10 = true;
    }

    return playerCardsSum;
}

function countCroupierCards(){
    let croupierCardsSum = 0;
    for (let i = 0; i < croupierCards.length; i++) {
        croupierCardsSum += croupierCards[i];
    }

    if(croupierCardsSum < 17){
        let cardImg = document.createElement('img');
        cardImg.src = generateCard('croupier');
        let croupierDiv = document.getElementById('croupier');
        croupierDiv.appendChild(cardImg);
    } else {
        croupierScore17 = true;
        clearInterval(interval);
    }
    croupierScoreP.innerHTML = croupierCardsSum;

    return croupierCardsSum;
}

function hit(){
    let cardImg = document.createElement('img');
    cardImg.src = generateCard('player');
    let playerDiv = document.getElementById('player');
    playerDiv.appendChild(cardImg);
    countPlayerCards();
}

function stand(){
    flipCardInner.style.transition = 'transform 0.6s';
    flipCardInner.style.transform = 'rotateY(180deg)';
    setTimeout(() => {
        interval = setInterval(countCroupierCards, 750);
    }, 750);
    playerStand = true;
}

function double(){
    doubleBtn.setAttribute('disabled', '');
    playerStake *= 2;
    let stakeP = document.getElementById('stake');
    stakeP.innerHTML = 'Stake: ' + playerStake;
}

function startGame(){
    playerStake = prompt("Enter your stake: ");

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement('img');
        cardImg.src = generateCard('player');
        let playerDiv = document.getElementById('player');
        playerDiv.appendChild(cardImg);
    }

    let croupier1 = document.getElementById('croupier-1');
    let croupier2 = document.getElementById('croupier-2');
    croupier1.src = generateCard('croupier');
    croupier2.src = generateCard('croupier');
    croupierScoreP.innerHTML = croupierCards[0];

    let stakeP = document.getElementById('stake');
    stakeP.innerHTML = 'Stake: ' + playerStake;

    countPlayerCards();
}

function checkResult() {
    if(playerBlackjack && playerCards.length == 2){
        winSound.play();
        blockButtons();
        flipCardInner.style.transform = 'rotateY(180deg)';
        let croupierScore = countCroupierCards();
        if(croupierScore == 21){
            popUpDiv.classList.add('active');
            resultP.innerHTML = 'Push!';
        } else{
            resultP.innerHTML = 'Blackjack in 2 cards! You won ' + playerStake * 2.5 + '$';
        }
    }

    if(playerBust){
        defeatSound.play();
        blockButtons();
        setTimeout(() => {
            popUpDiv.classList.add('active');
        }, 1500);
        resultP.innerHTML = 'Player bust!';
        flipCardInner.style.transform = 'rotateY(180deg)';
        countCroupierCards();
    }

    if (playerStand && croupierScore17){
        blockButtons();
        let playerScore = countPlayerCards();
        let croupierScore = countCroupierCards();
        flipCardInner.style.transform = 'rotateY(180deg)';
        
        popUpDiv.classList.add('active');

        if(croupierScore <= 21 && croupierScore > playerScore){
            defeatSound.play();
            resultP.innerHTML = 'Dealer win!';
        } else if(playerScore <= 21 && playerScore > croupierScore){
            winSound.play();
            resultP.innerHTML = 'Player win! You won ' + playerStake * 2 + '$';
        } else if(playerScore <= 21 && croupierScore > 21){
            winSound.play();
            resultP.innerHTML = 'Dealer bust!';
        } else if(playerScore == 21 && croupierScore == 21){
            winSound.play();
            resultP.innerHTML = 'Push!';
        } else if(playerScore == croupierScore){
            winSound.play();
            resultP.innerHTML = 'Push!';
        }
        clearInterval(interval2);
    }
}

function play(){
    hitBtn.removeAttribute('disabled');
    standBtn.removeAttribute('disabled');
    doubleBtn.removeAttribute('disabled');
    popUpDiv.classList.remove('active');
    playerCards = []
    croupierCards = []
    croupierScore17 = false;
    playerStand = false;
    playerBust = false;
    playerBlackjack = false;
    playerMoreThan10 = false;
    croupierMoreThan10 = false;
    flipCardInner.style.transition = 'transform 0s';
    flipCardInner.style.transform = 'rotateY(0deg)';
    resultP.innerHTML = '';
    let playerDiv = document.getElementById('player');
    let croupierDiv = document.getElementById('croupier');
    let playerImages = playerDiv.getElementsByTagName('img');
    let croupierImages = croupierDiv.getElementsByTagName('img');
    while(playerImages[0]){
        playerImages[0].parentNode.removeChild(playerImages[0]);
    }
    while(croupierImages.length > 3){
        croupierImages[3].parentNode.removeChild(croupierImages[3]);
    }
    startGame();
    interval2 = setInterval(checkResult, 1000);   
}