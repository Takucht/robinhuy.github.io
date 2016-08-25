var JOB_TYPE = ['todo', 'doing', 'done'];
var list = getStorageData();

$(function () {
    // Add job to lists
    JOB_TYPE.forEach(function (type) {
        var jobType = list[type] || [];
        jobType.forEach(function (jobName) {
            addJobToList(type, jobName);
        });
    });

    // Init sortable
    initSortable();
});

function initSortable() {
    $('.sorted-list').sortable({
        connectWith: '.sorted-list',
        placeholder: 'ui-state-highlight',
        start: function (event, ui) {
            // Add style class
            $(ui.item[0]).addClass('dragging');

            // Set column and position
            var columnID = ui.item.context.parentElement.getAttribute('id');
            ui.item.oldColumnID = columnID;
            ui.item.oldItemPosition = ui.item.index();
        },
        stop: function (event, ui) {
            // Remove style class
            $(ui.item[0]).removeClass('dragging');

            // Get old and new column
            var item = ui.item;
            var oldItemPosition = item.oldItemPosition;
            var oldColumnID = item.oldColumnID;
            var newColumnID = item.context.parentElement.getAttribute('id');
            var oldColumn = list[oldColumnID] || [];
            var newColumn = list[newColumnID] || [];

            // Remove Item from old position
            console.log(list[oldColumnID]);
            oldColumn.splice(oldItemPosition, 1)[0];
            list[oldColumnID] = oldColumn;

            // Add item to new position
            newColumn.splice(item.index(), 0, item[0].innerText);
            list[newColumnID] = newColumn;

            // Store data to local storage
            console.log(list);
            setStorageData(list);
        }
    });
}

function getStorageData() {
    if (typeof(Storage) !== "undefined") {
        var data;

        try {
            data = JSON.parse(localStorage.getItem('list')) || {};
        } catch (e) {
            data = {};
        }

        return data;
    } else {
        alert('Sorry! Your browser is too old to use this application.');
        return {};
    }
}

function setStorageData(data) {
    localStorage.setItem('list', JSON.stringify(data));
}

function newJob(type, input) {
    var jobName = $(input).val();

    // Check key press is Enter
    if (event.key === "Enter" && jobName !== "") {
        // Get data from local storage
        var list = getStorageData();

        // Store data to local storage
        if (!list[type]) list[type] = [];
        list[type].push(jobName);
        setStorageData(list);

        // Add job to list and reset input
        addJobToList(type, jobName);
        $(input).val('');
        initSortable();
        console.log(list);
    }
}

function addJobToList(type, jobName) {
    var item = '<div class="collection-item"> ' + jobName +
        '<span class="badge" onclick="editJob(this)"><i class="tiny material-icons">mode_edit</i></span>' +
        '</div>';
    $('#' + type).append(item);
}

function editJob(span) {
    
}

function clearJob(type) {
    // Update data
    list[type] = [];
    setStorageData(list);

    // Remove all items of column by type
    $('#' + type).html('');
}