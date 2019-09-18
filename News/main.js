//Adrian Chitu
var numberOfItems; //total number of the items that should be paginated
var limitPerPage = 4; // Limit of articles per each page
var currentPage = 0; //current Page
var pageNumber = 0; // page number
var articles; //variable for storing the api response

document.addEventListener('DOMContentLoaded', onDomLoad); // event listener in order to structure code better and give priority to some functions

function onDomLoad() {


    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()

    // Opening connection, using the GET request 
    request.open('GET', 'https://content.guardianapis.com/search?api-key=test');

    request.onload = function () {

        // JSON data here
        var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {

            numberOfItems = data.response.results.length; //number of items frog the API
            articles = data.response.results; //The JSON containing the results

            pageNumber = Math.ceil(numberOfItems / limitPerPage);
            var container = document.getElementsByClassName('pagination')[0];


            var previousPage = appendPage('<', '<');
            container.append(previousPage);
            for (var i = 0; i < pageNumber; i++) {


                // pgNumber.setAttribute('class', 'page-item');
                var pgNumber = appendPage(i, i + 1);

                container.append(pgNumber);

            }

            var nextPage = appendPage('>', '>');
            container.append(nextPage);

            for (var i = currentPage * limitPerPage; i < (currentPage + 1) * limitPerPage; i++) {
                createArticle(data.response.results[i], limitPerPage * pageNumber + i);
            }


        } else {
            console.log('error')
        }
    }

    // Send request
    request.send();

    //creating the favorite list
    var container = document.getElementById('container');
    var favoriteList = document.createElement('div');
    favoriteList.setAttribute('id', 'favoriteList');
    // favoriteList.setAttribute('ondrop', 'drop(event)');
    favoriteList.addEventListener('drop', drop);
    // favoriteList.setAttribute('ondragover', 'allowDrop(event)');
    favoriteList.addEventListener('dragover', allowDrop);
    container.append(favoriteList);
    var title = document.createElement('h3');
    title.innerHTML = "Favorite List";
    title.style.color = 'darkblue';
    favoriteList.append(title);
    var desc = document.createElement('h4');
    desc.innerHTML = 'You can add your favorite articles either by clicking the add button if you want to remove them later or by dragging and dropping the article in this section if you want it to remain here';
    favoriteList.append(desc);


}

function appendPage(index, content) {
    var pgNumber = document.createElement('li');
    pgNumber.classList.add('page-item');
    var link = document.createElement('a');
    link.setAttribute('href', '#');
    link.innerHTML = content;
    link.addEventListener('click', onPageClick);
    link.setAttribute('data-id', index);
    pgNumber.append(link);

    return pgNumber;
}

//function to enable clicking on the desired page
function onPageClick(ev) {
    var pageContainer = document.getElementById('content');
    var dataId = ev.target.getAttribute('data-id');
    var link = ev.target;
    if (dataId === '<') {
        if (currentPage === 0) {
            link.classList.add('disabled');
            return;
        } else {
            link.classList.remove('disabled');
            currentPage--;
        }
    } else if (dataId === '>') {
        if (currentPage === pageNumber - 1) {
            link.classList.add('disabled');
            return;
        } else {
            link.classList.remove('disabled');
            currentPage++;
        }
    } else {
        currentPage = parseInt(dataId);
    }
    while (pageContainer.children.length > 0) {
        pageContainer.removeChild(pageContainer.firstChild);
    }


    var stop = (currentPage + 1) * limitPerPage;
    if (stop > articles.length) {
        stop = articles.length;
    }

    for (var i = currentPage * limitPerPage; i < stop; i++) {
        createArticle(articles[i], limitPerPage * pageNumber + i);
    }
}

//function for creating articles
function createArticle(results, index) {
    console.log(results.webTitle);
    console.log(results.sectionName);
    console.log(results.webUrl);
    console.log(results.webPublicationDate);

    var page = document.getElementById('content');
    var card = document.createElement('div');
    // card.setAttribute('class', 'list-group');
    card.classList.add('list-group');
    card.addEventListener('dragstart', onDragStart);
    card.setAttribute('draggable', true);
    card.setAttribute('id', 'dragElem' + index);

    var jsLink = document.createElement('a');
    jsLink.setAttribute('href', '#');
    // jsLink.setAttribute('class', 'list-group-item active')
    jsLink.classList.add('list-group-item', 'active');

    var title = document.createElement('h4');
    // title.setAttribute('class', 'list-group-item-heading')
    title.classList.add('list-group-item-heading');
    title.textContent = results.webTitle;

    var article = document.createElement('p');
    // article.setAttribute('class', 'list-group-item-text');
    article.classList.add('list-group-item-text');
    article.textContent = 'Section: ' + results.sectionName;

    var webUrl = document.createElement('a');
    webUrl.setAttribute('href', results.webUrl);
    webUrl.innerHTML = results.webUrl;
    webUrl.style.color = "white";

    var publicationDate = document.createElement('p');
    publicationDate.textContent = "Publication date: " + results.webPublicationDate;
    publicationDate.style.fontSize = '20px';

    var addButton = document.createElement('a');
    addButton.setAttribute('href', '#');
    // addButton.setAttribute('id', 'addButton' + index);
    addButton.classList.add('addButton');
    addButton.innerHTML = 'Add Article';
    addButton.addEventListener('click', addArticle);

    var deleteButton = document.createElement('a');
    deleteButton.setAttribute('href', '#');
    // deleteButton.setAttribute('id', 'deleteButton' + index);
    deleteButton.classList.add('deleteButton');
    deleteButton.innerHTML = 'Delete Article';
    deleteButton.addEventListener('click', deleteArticle);

    page.append(card);
    card.append(jsLink);
    jsLink.append(title);
    jsLink.append(article);
    jsLink.append(webUrl);
    jsLink.append(publicationDate);
    jsLink.append(addButton);
    jsLink.append(deleteButton);

}

//function to add an article when a certain button is clicked
function addArticle(ev) {
    var articleDiv = ev.target.parentElement.parentElement;
    var aux = articleDiv.cloneNode(true);
    aux.setAttribute('id', 'copiedItem' + aux.getAttribute('id'));
    aux.setAttribute('draggable', false);

    var target = document.getElementById('favoriteList');
    target.append(aux);


    var deleteButton = aux.getElementsByClassName('deleteButton')[0];
    deleteButton.addEventListener('click', deleteArticle);
    var addButton = aux.getElementsByClassName('addButton')[0];
    addButton.parentElement.removeChild(addButton);

    var disableAdd = articleDiv.getElementsByClassName('addButton')[0];
    disableAdd.classList.add('disabled');
}

//function to delete an article when a certain button is clicked
function deleteArticle(ev) {

    var copy = ev.target.closest('.list-group');

    if (copy.id.indexOf('copiedItem') > -1) {
        var originalId = copy.id.replace('copiedItem', '');
        var element = document.getElementById(originalId);

        var button = element.getElementsByClassName('addButton')[0];
        button.classList.remove('disabled');
    }

    copy.parentElement.removeChild(copy);


    //-----attempt1-----
    // while (element.parentElement.hasChildNodes()) {
    // element.parentElement.parentElement.removeChild(element.parentElement.parentElement.firstChild);
    // element.parentElement.parentElement.removeChild(element.parentNode)
    // }

}

//drag and drop functions
function allowDrop(ev) {
    ev.preventDefault();
}

function onDragStart(ev) {
    var target = ev.target.closest("div[draggable=true]");
    ev.dataTransfer.setData('id', target.id);

}

function drop(ev) {
    ev.preventDefault();
    var id = ev.dataTransfer.getData('id');
    var articleDiv = document.getElementById(id)
    var aux = articleDiv.cloneNode(true);

    aux.setAttribute('id', 'copiedItem' + aux.getAttribute('id'));
    aux.setAttribute('draggable', false);

    var target = document.getElementById('favoriteList');
    target.append(aux);


    var deleteButton = aux.getElementsByClassName('deleteButton')[0];
    deleteButton.addEventListener('click', deleteArticle);
    var addButton = aux.getElementsByClassName('addButton')[0];
    addButton.parentElement.removeChild(addButton);

    var disableAdd = articleDiv.getElementsByClassName('addButton')[0];
    disableAdd.classList.add('disabled');




    //handler pentru delete

    ev.target.appendChild(news);
}