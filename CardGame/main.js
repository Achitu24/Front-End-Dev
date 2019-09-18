var colors = ['red', 'orange', 'yellow', 'green'];
var usedColors = [];
var clickedCard;

var winningColor = [{
    display: 'All cards should have the same colors',
    internal: 'same-color'

}, {
    display: '2 red cards, 2 yellow cards',
    internal: '2r-2y'
}]

var selectedIndex;
var cardCounter = 0;

var availableSeconds = 180;
var countDown;



document.addEventListener('DOMContentLoaded', onload);

function onload() {

    addCard();

    var shuffle = document.getElementById('shuffleButton');
    shuffle.addEventListener('click', shuffleCards);

    var hCard = document.getElementsByClassName('emptyCards');

    for (var i = 0; i < hCard.length; i++) {
        hCard[i].addEventListener('click', highlight);
    }

    var discard = document.getElementById('deleteCard');
    discard.addEventListener('click', deleteCard);

    pickCondition();

    countDown = setInterval(counter, 1000);


}

function addCard() {
    var cardsContainer = document.getElementById('table');

    var tableCards = cardsContainer.getElementsByClassName('tableCards');

    for (var i = 0; i < tableCards.length; i++) {
        var state = tableCards[i].getAttribute('data-state');

        if (state === 'empty') {


            var found;
            var setColor;
            var randomnumber;
            var used;

            if (usedColors.length === 60) {
                alert('Am terminat pachetul');
                return;
            }

            while (true) {

                setColor = colors[Math.floor(Math.random() * colors.length)];
                randomnumber = Math.floor(Math.random() * 15) + 1;
                found = false;

                used = {
                    color: setColor,
                    number: randomnumber
                }

                for (var j = 0; j < usedColors.length; j++) {
                    if (used['color'] === usedColors[j]['color'] && used['number'] === usedColors[j]['number']) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    break;
                }




            }


            tableCards[i].style.backgroundColor = setColor;
            tableCards[i].innerHTML = randomnumber;
            tableCards[i].setAttribute('data-state', 'used');

            usedColors.push(used);
        }
    }
}

function shuffleCards() {
    var cardsContainer = document.getElementById('table');
    var tableCards = cardsContainer.getElementsByClassName('tableCards');
    for (var i = 0; i < tableCards.length; i++) {
        tableCards[i].setAttribute('data-state', 'empty');
    }
    addCard();
}

function dragStartCard(ev) {
    ev.dataTransfer.setData('color', ev.target.style.backgroundColor);
    ev.dataTransfer.setData('number', ev.target.innerHTML);
    ev.dataTransfer.setData('id', ev.target.id);
}

function dragoverCard(ev) {
    ev.preventDefault();
}

function dropCard(ev) {
    ev.preventDefault();
    var color = ev.dataTransfer.getData('color');
    var number = ev.dataTransfer.getData('number');
    var id = ev.dataTransfer.getData('id');

    ev.target.style.backgroundColor = color;
    ev.target.innerHTML = number;
    ev.target.setAttribute('data-state', 'used');
    cardCounter++;

    var initialCard = document.getElementById(id);

    initialCard.style.backgroundColor = 'white';
    initialCard.innerHTML = '';
    initialCard.setAttribute('data-state', 'empty');

    setTimeout(newCard, 1000);

    if (cardCounter === 4) {
        checkCards();
    }

}

function newCard() {
    addCard();
}



function highlight(ev) {

    if (ev.target.getAttribute('data-state') === "empty") {
        return;
    } else {

        if (clickedCard) {
            clickedCard.classList.remove('highlight');
        }

        clickedCard = ev.target;
        ev.target.classList.add('highlight');
        var miniCard = document.getElementById('miniCard');
        miniCard.style.backgroundColor = ev.target.style.backgroundColor;
        miniCard.innerHTML = ev.target.innerHTML
    }

}

function deleteCard() {
    clickedCard.classList.remove('highlight');
    clickedCard.setAttribute('data-state', 'empty');
    clickedCard.style.backgroundColor = 'white';
    clickedCard.innerHTML = '';
    cardCounter--;

    var miniCard = document.getElementById('miniCard');
    miniCard.style.backgroundColor = 'white';
    miniCard.innerHTML = '';
}

function pickCondition() {
    selectedIndex = Math.floor(Math.random() * winningColor.length);
    var winContainer = document.getElementById('win');
    var condition = document.createElement('li');
    condition.innerHTML = winningColor[selectedIndex].display;

    winContainer.append(condition);

}

function checkCards() {
    var colorMap = {};
    var cards = document.getElementsByClassName('emptyCards');

    for (var i = 0; i < cards.length; i++) {
        var cardColor = cards[i].style.backgroundColor;
        if (colorMap.hasOwnProperty(cardColor)) {
            colorMap[cardColor]++;
        } else {
            colorMap[cardColor] = 1;
        }
    }

    if (winningColor[selectedIndex].internal === "same-color") {
        if (Object.keys(colorMap).length === 1) {
            availableSeconds += 60;
            alert('You Win');
        }
    } else if (winningColor[selectedIndex].internal === "2r-2y") {
        if (Object.keys(colorMap).length === 2 && colorMap.hasOwnProperty('red') && colorMap.hasOwnProperty('yellow') && colorMap.red === 2 && colorMap.yellow === 2) {
            availableSeconds += 60;
            alert('You win');
        }
    }
}

function counter() {
    availableSeconds--;

    var timer = document.getElementById('countDown');
    timer.innerHTML = '00:' + parseInt(availableSeconds / 60) + ':' + availableSeconds % 60;

    if (availableSeconds === 0) {
        clearInterval(countDown);
        alert('You Lost');
    }
}

//conditiile pt numere
//pe shuffle sa scada 15 sec din timp
//inloctuirea unei carti odata la 15 sec
//dupa ce castiga se reseteaza jocul
//scor: la fiecare castig 50pct ( fara shuffle 10 pcr bonus)
//fara carti una peste alta
//marti : 8:00