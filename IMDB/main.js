document.addEventListener('DOMContentLoaded', onLoaded);

var movies = [{
        title: 'Dumbo',
        rating: 3,
        maxRating: 5,
        url: "",
        genre: 'Animation',
        id: 0
    },
    {
        title: 'Avengers',
        rating: 0,
        maxRating: 5,
        url: "",
        genre: 'Action'
    },
    {
        title: 'Alladin',
        rating: 2,
        maxRating: 5,
        url: "",
        genre: 'Fantasy'
    }, {
        title: 'Alladin',
        rating: 4,
        maxRating: 5,
        url: "",
        genre: 'Fantasy'
    }, {
        title: 'Alladin',
        rating: 3,
        maxRating: 5,
        url: "",
        genre: 'Fantasy'
    }, {
        title: 'Alladin',
        rating: 3,
        maxRating: 5,
        url: "",
        genre: 'Fantasy'
    }

]

var sorted = {
    isSorted: false,
    field: ''
}

function onLoaded() {

    createElements();


    var container = document.getElementsByClassName("container")[0];
    //de mutat in html!!!
    var form = document.createElement('div');
    form.setAttribute('id', 'addingform');
    var question = document.createElement('p');
    question.innerHTML = "Add a Movie"
    var q2 = document.createElement('input');
    q2.setAttribute('placeholder', 'Name of the movie');
    q2.setAttribute('id', 'titleInput');


    var q3 = document.createElement('input');
    q3.setAttribute('placeholder', 'rating');
    q3.setAttribute('id', 'ratingInput');

    var addButton = document.createElement('button');
    addButton.innerHTML = 'Add Movie';

    container.append(form);
    form.append(question);
    form.append(q2);
    form.append(q3);
    form.append(addButton);

    addButton.addEventListener('click', addElement);

    var selectBox = document.getElementById('selectBox');
    selectBox.addEventListener('change', sortSelect);
}

function createElements() {
    var container = document.getElementsByClassName("container")[0];

    for (var i = 0; i < movies.length; i++) {
        var movieContainer = document.createElement('div');
        var movieImg = document.createElement('img');
        var movieLink = document.createElement('a');
        var movieRating = document.createElement('div');
        var ratingStars = document.createElement('div');

        for (var j = 0; j < movies[i].maxRating; j++) {
            var star = document.createElement('div');
            star.setAttribute('id', 'r' + i + '-' + j);
            star.className = 'check';
            if (j < movies[i].rating) {
                star.className = 'rated';
            }
            star.setAttribute('data-stars', j + 1);
            star.setAttribute('data-id', i);
            star.addEventListener('click', ratingStar);
            star.addEventListener('click', timer);
            ratingStars.append(star);
        }

        movieContainer.className = 'movies';
        movieLink.innerHTML = movies[i].title;
        movieLink.setAttribute('href', movies[i].url);

        movieRating.innerHTML = movies[i].rating + '/' + movies[i].maxRating;

        movieContainer.append(movieImg);
        movieContainer.append(movieLink);
        movieContainer.append(movieRating);
        movieContainer.append(ratingStars);

        container.append(movieContainer);



    }
}

function addElement() {
    var titleInput = document.getElementById('titleInput');
    var ratingInput = document.getElementById('ratingInput');
    var newElement = {
        title: titleInput.value,
        rating: ratingInput.value,
        maxRating: 5,
        url: "",
        genre: 'Fantasy'
    };

    if (sorted.isSorted) {
        search = binarySearch(movies, newElement, 0);
        elem = search.elem;
        index = search.index;
        if (newElement[sorted.field] < elem[sorted.field]) {

            movies.splice(index, 0, elem);
        } else {
            movies.splice(index + 1, 0, elem);
        }
    } else {
        movies.push(newElement);
    }
}

function binarySearch(mList, elem, index) {
    var middleIndex = Math.floor(mList.length / 2);

    if (middleIndex == 0) {

        return {
            elem: mList[0],
            index: index
        };
    } else {
        if (mList[middleIndex][sorted.field] < elem[sorted.field]) {

            var rightPart = mList.slice(middleIndex, mList.length);
            return binarySearch(rightPart, elem, index + middleIndex + 1);
        } else {
            var leftPart = mList.slice(0, middleIndex);
            return binarySearch(leftPart, elem, index - middleIndex - 1);
        }
    }
}



function ratingStar(event) {
    var starclone = event.target.nextElementSibling;

    var star = event.target;

    var rating = parseInt(star.getAttribute("data-stars"));

    var entryId = parseInt(star.getAttribute("data-id"));

    movies[entryId].rating = rating;
    star.parentElement.previousElementSibling.innerHTML = rating + '/' + movies[entryId].maxRating;

    while (star) {
        star.className = "rated";

        star = star.previousElementSibling;
    }

    while (starclone) {
        starclone.className = "check";

        starclone = starclone.nextElementSibling;
    }

}


function sortSelect() {
    var selectBox = document.getElementById('selectBox');
    var selectBox = selectBox.options[selectBox.selectedIndex].value;

    sorted.isSorted = true;
    sorted.field = selectBox;

    for (var i = 0; i < movies.length; i++) {
        for (var j = 0; j < movies.length - 1; j++) {
            if (movies[i][selectBox] > movies[j][selectBox]) {
                var aux = movies[i][selectBox];
                movies[i][selectBox] = movies[j][selectBox];
                movies[j][selectBox] = aux;
            }
        }
    }



    var movieElements = document.getElementsByClassName('movies');

    var movLenght = movieElements.length;
    for (var i = 0; i < movLenght; i++) {
        movieElements[0].parentElement.removeChild(movieElements[0]);
    }

    createElements();

}


var time = document.getElementById("timer");

var seconds = 0,
    minutes = 0,
    hours = 0,
    t;

function Counter() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    time.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

function timer() {
    t = setTimeout(Counter, 1000);
}