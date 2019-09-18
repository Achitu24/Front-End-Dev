var tasks = [{
    title: 'Training AJAX',
    description: 'Write slides',
    assignee: 'Irina',
    priority: 3,
    blockReason: '',
    id: 1,
    state: 'notStarted'
}, {
    title: 'Training JS',
    description: 'Write exercises',
    assignee: 'Razvan',
    priority: 5,
    blockReason: '',
    id: 2,
    state: 'progress'
}, {
    title: 'Practice DOM',
    description: 'Do Practice',
    assignee: 'Gigel',
    priority: 1,
    blockReason: 'Nu am timp',
    id: 3,
    state: 'blocked'
}, {
    title: 'Forms',
    description: 'Write slides',
    assignee: 'Irina',
    priority: 3,
    blockReason: '',
    id: 4,
    state: 'finished'
}]


var connections = {
    unknownPile: ['notStartedPile'],
    notStartedPile: ['progressPile', 'blockedPile'],
    progressPile: ['blockedPile', 'finishedPile', 'notStartedPile'],
    blockedPile: ['progressPile', 'notStartedPile'],
    finishedPile: []
}

var isManager = true;
var people = ['Irina', 'Razvan', 'Gigel', 'Adrian'];

document.addEventListener('DOMContentLoaded', onload);


function onload() {

    for (var i = 0; i < tasks.length; i++) {
        addTask(tasks[i]);
    }

    var jobButton = document.getElementById('jobButton');
    jobButton.addEventListener('click', addJob);

    var admin = document.getElementById('adminToggle');
    admin.addEventListener('click', adminMode);

    var poepleAdd = document.getElementById('peopleAdd');
    poepleAdd.addEventListener('click', addPeople);

    adminMode();
    populateSelect();
    peoplePile();


}


function addTask(task) {
    var taskContainer = document.createElement('div');
    taskContainer.setAttribute('id', task.id);
    taskContainer.style.marginTop = '-20px';
    var title = document.createElement('div');
    var description = document.createElement('div');
    var assignee = document.createElement('div');
    var priority = document.createElement('div');
    var reason = document.createElement('div');
    reason.setAttribute('id', 'reason');
    var line = document.createElement('hr');


    title.textContent = task.title;
    description.textContent = task.description;
    assignee.textContent = task.assignee;
    priority.textContent = task.priority;
    reason.textContent = task.reason;

    var container = document.getElementById(task.state + 'Pile');
    container.append(taskContainer);
    taskContainer.append(title);
    taskContainer.append(description);
    taskContainer.append(assignee);
    taskContainer.append(priority);
    taskContainer.append(reason);
    taskContainer.append(line);

    taskContainer.setAttribute('draggable', true);
    taskContainer.addEventListener('dragstart', onDragStart);
}

function onDragStart(ev) {
    var target = ev.target.closest("div[draggable=true]");
    ev.dataTransfer.setData('id', target.id);

}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var id = ev.dataTransfer.getData('id');
    var task = document.getElementById(id); //task din pile vechi
    var sourcePile = task.parentElement.id;
    var destinationPile = ev.target.id;


    if (connections[sourcePile].includes(destinationPile)) {
        if (destinationPile === 'blockedPile') {
            var blkReason = "";
            while (blkReason.trim() === "") {
                blkReason = prompt('Why is this task blocked?');
                if (blkReason === null) {
                    break;
                } else if (blkReason.trim() !== "") {
                    task.lastChild.previousSibling.innerHTML = blkReason;
                    ev.target.appendChild(task);
                    setTimeout(function () {
                        var dest = document.getElementById('progressPile');
                        dest.appendChild(task);
                    }, 5000);
                }
            }
        } else if (destinationPile === 'finishedPile') {
            ev.target.appendChild(task);
            var clock = document.getElementById('stopWatch');
            timer(clock);
        } else {
            ev.target.appendChild(task); //!!!!!!!!!!!!!!!!!!!
        }
    }
}

function addJob() {
    var jobTitle = document.getElementById('jobTitle');
    var jobDescription = document.getElementById('jobDescription');
    var jobName = document.getElementById('nameSelect');
    var jobPriority = document.getElementById('jobPriority');
    if (jobTitle.value === '' || jobDescription.value === '') {
        alert('Please input both fields');
    } else {
        var newTask = {
            title: jobTitle.value,
            description: jobDescription.value,
            assignee: jobName.value,
            priority: jobPriority.value,
            blockReason: '',
            id: tasks.length + 1,
            state: isManager ? 'unknown' : 'notStarted'
        }

        tasks.push(newTask);

        addTask(newTask);

        jobTitle.value = "";
        jobDescription.value = "";
        jobName.value = "";
        jobPriority.value = "";

    }
}



function adminMode() {
    isManager = !isManager;

    var adminMod = document.getElementById('adminToggle');
    if (isManager) {
        adminMod.innerHTML = 'UserMode';
        document.getElementById('finishedPile').style.display = 'none';
        document.getElementById('progressPile').style.display = 'none';
        document.getElementById('blockedPile').style.display = 'none';
        document.getElementById('unknownPile').style.display = 'block'
        document.getElementById('jobPriority').style.display = 'block';
        document.getElementById('nameSelect').style.display = 'none';
        document.getElementById('notStartedPile').style.marginRight = '0px';
        document.getElementsByClassName('peopleContainer')[0].style.display = 'block';


    } else if (!isManager) {
        document.getElementById('adminToggle').innerHTML = 'AdminMode';
        document.getElementById('finishedPile').style.display = 'block';
        document.getElementById('progressPile').style.display = 'block';
        document.getElementById('blockedPile').style.display = 'block';
        document.getElementById('unknownPile').style.display = 'none';
        document.getElementById('jobPriority').style.display = 'none';
        document.getElementById('nameSelect').style.display = 'block';
        document.getElementById('notStartedPile').style.marginRight = '0px';
        document.getElementsByClassName('peopleContainer')[0].style.display = 'none';
    }
}

function peoplePile() {
    var peoplePile = document.getElementById('peoplePile');
    for (var i = 0; i < people.length; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute('id', `tr${i}`);
        var td = document.createElement('td');

        td.innerHTML = people[i];

        var td2 = document.createElement('td');
        var button = document.createElement('button');
        button.innerHTML = 'Delete';
        button.setAttribute('id', `button${i}`);
        button.setAttribute('data-id', i);
        button.addEventListener('click', deletePeople);

        td2.append(button);
        tr.append(td);
        tr.append(td2);
        peoplePile.append(tr);
    }


}

function populateSelect() {
    var select = document.getElementById('nameSelect');
    for (var i = 0; i < people.length; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', people[i]);
        option.innerHTML = people[i];
        select.append(option);
    }
}

function deletePeople(ev) {
    var name = ev.target.parentElement.previousSibling.textContent;

    var total = tasks.reduce(function (colector, current) {
        if (current.assignee === name && current.state !== 'finished') {
            colector++;
        }
        return colector;
    }, 0);

    if (total === 0) {
        var trId = ev.target.id.replace('button', 'tr');
        var tr = document.getElementById(trId);
        tr.parentElement.removeChild(tr);

        var indexBtn = parseInt(ev.target.getAttribute('data-id'));

        var select = document.getElementById('nameSelect');
        select.removeChild(select.children[indexBtn]);
    } else {
        alert('Nu se poate sterge');
    }
}

function addPeople() {
    var peopleName = document.getElementById('peopleName');

    if (peopleName.value === "") {
        alert("Please input a name");
    } else {
        people.push(peopleName.value);
        var select = document.getElementById('nameSelect');
        var option = document.createElement('option');
        option.setAttribute('value', peopleName.value);
        option.innerHTML = peopleName.value;
        select.append(option);

        var peoplePile = document.getElementById('peoplePile');
        var tr = document.createElement('tr');
        tr.setAttribute('id', 'tr' + (people.length - 1));
        var td = document.createElement('td');
        td.innerHTML = peopleName.value;

        var td2 = document.createElement('td');
        var button = document.createElement('button');
        button.innerHTML = 'Delete';
        button.setAttribute('id', 'button' + (people.length - 1));
        button.setAttribute('data-id', people.length - 1);
        button.addEventListener('click', deletePeople);

        td2.append(button);
        tr.append(td);
        tr.append(td2);
        peoplePile.append(tr);
    }
}

var seconds = 0;
var minutes = 0;
var hours = 0;

var interval;

function timer(clock) {
    if (interval) {
        clearInterval(interval);
        seconds = 0;
        minutes = 0;
        hours = 0;
    }
    interval = setInterval(function () {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }

        clock.innerHTML = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    }, 1000);
}