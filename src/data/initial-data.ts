// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export const boardStyle =
`/* per-board customized styles */
/*
.KanbanBoardView-sticky-note {width: 200px}
.KanbanBoardView-header-cell-task-statuses {min-width: 210px}
table.KanbanBoardView-board tbody th {
    padding: 10px;
    white-space: nowrap;
}
*/
table.KanbanBoardView-board thead th.status-backlog {
    background-color: var(--weak-header-bg-color);
}
table.KanbanBoardView-board td.status-backlog {
    background-color: var(--weak-data-bg-color);
}
table.KanbanBoardView-board thead th.status-done {
    background-color: var(--weak-header-bg-color);
}
table.KanbanBoardView-board td.status-done {
    background-color: var(--weak-data-bg-color);
}
.team-or-story-team-b .KanbanBoardView-sticky-note {
    background-color: var(--sticky-blue-color);
}
.status-done .KanbanBoardView-sticky-note {
    background-color: var(--sticky-green-color);
}
.KanbanBoardView-sticky-tags .tag-bug {
    color: white;
    background-color: red;
}
.KanbanBoardView-sticky-tags .tag-ok {
    color: white;
    background-color: green;
}
.KanbanBoardView-sticky-tags .tag-NG {
    color: white;
    background-color: #e91e63;
}
.KanbanBoardView-sticky-tags .tag-PR {
    color: white;
    background-color: purple;
}
`;


export const calendarStyle =
`/* per-board customized styles */
div.CalendarView-item-chip.status-done {
    background-color: var(--sticky-green-color);
}
`;


export const initialData = {
    "boards": [{
        "type": "kanbanBoard",
        "name": "Welcome Board",
        "taskStatuses": [{
            "value": "Backlog",
            "caption": "🛌 Backlog",
            "className": "status-backlog"
        }, {
            "value": "ToDo",
            "caption": "📯 ToDo",
            "className": "status-todo"
        }, {
            "value": "InProgress",
            "caption": "⛏ InProgress",
            "className": "status-inprogress"
        }, {
            "value": "Staging",
            "caption": "📦 Staging",
            "className": "status-staging"
        }, {
            "value": "Done",
            "caption": "🎉 Done",
            "className": "status-done",
            "completed": true
        }],
        "teamOrStories": [{
            "value": "Team A",
            "caption": "🐆 Team A",
            "className": "team-or-story-team-a"
        }, {
            "value": "Team B",
            "caption": "🦃 Team B",
            "className": "team-or-story-team-b"
        }, {
            "value": "Team C",
            "caption": "🐍 Team C",
            "className": "team-or-story-team-c"
        }],
        "tags": [{
            "value": "bug",
            "className": "tag-bug"
        }, {
            "value": "ok",
            "className": "tag-ok"
        }, {
            "value": "NG",
            "className": "tag-NG"
        }, {
            "value": "PR",
            "className": "tag-PR"
        }],
        "displayBarcode": true,
        "displayMemo": true,
        "displayFlags": true,
        "displayTags": true,
        "preferArchive": false,
        "boardStyle": boardStyle,
        "calendarStyle": calendarStyle
    }],
    "records": [{
        "type": "kanban",
        "dueDate": "",
        "description":
            "# Welcome to the Kanban Board App!\n" +
            "* This is a kanban (or sticky).\n" +
            "* Write one task for one kanban.\n" +
            "* To add a kanban to the board, Tap or click the “+” icon in the upper left corner of the board.\n" +
            "* Tap or click on kanban to edit.\n" +
            "* Drag and drop the kanban to change the status.",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": [],
        "boardId": "",
        "teamOrStory": "Team B",
        "taskStatus": "Backlog"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description":
            "* Board and Kanban data are stored in the browser's local “indexed DB”.\n" +
            "* You can use a remote [“CouchDB”](https://couchdb.apache.org) server to synchronize multiple device boards.\n" +
            "* You can get a fully managed CouchDB server with [“IBM Cloudant®” from IBM Cloud](https://www.ibm.com/cloud/cloudant).\n" +
            "* Create an [IBM Cloud Lite account](https://www.ibm.com/cloud/free/) and get a free tier without a credit card.",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": [],
        "boardId": "",
        "teamOrStory": "Team B",
        "taskStatus": "ToDo"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description":
            "# Go [Settings](#/config/) to setup\n\n" +
            "----\n\n" +
            "* `remote.endpointUrl`: Cloudant `External Endpoint` URL w/ DB name\n" +
            "  * e.g. `https://???-bluemix.cloudant.com/mydb`\n" +
            "* `remote.user`: Cloudant `API Key`\n" +
            "* `remote.password`: Cloudant `API Key`'s password",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": [],
        "boardId": "",
        "teamOrStory": "Team B",
        "taskStatus": "ToDo"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description":
            "* You can customize the appearance and behavior of the board and kanban in the configuration editor view.\n\n\n" +
            "----\n\n" +
            "# Go [Editor](#/edit/) to setup",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": [],
        "boardId": "",
        "teamOrStory": "Team B",
        "taskStatus": "InProgress"
    }, {
        "type": "kanban",
        "dueDate": "2030-01-01",
        "description":
            "### Hello, kanban board !\n\n" +
            "* ~aaa~\n" +
            "  * **bbb**\n" +
            "* *ccc*\n\n" +
            "----\n\n" +
            "https://shellyln.github.io/\n\n" +
            "![logo](https://shellyln.github.io/assets/image/shellyln.png)",
        "barcode": "12345",
        "memo": "memo",
        "flags": ["Marked"],
        "tags": ["PR", "bug", "ok", "NG"],
        "boardId": "",
        "teamOrStory": "Team B",
        "taskStatus": "Staging"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description":
            "# What is a Kanban Board?\n" +
            "https://www.atlassian.com/agile/kanban/boards",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": [],
        "boardId": "",
        "teamOrStory": "Team C",
        "taskStatus": "Backlog"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description":
            "# What are WIP limits?\n" +
            "https://www.atlassian.com/agile/kanban/wip-limits",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": [],
        "boardId": "",
        "teamOrStory": "Team C",
        "taskStatus": "Backlog"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description":
            "# Get Started With Cloudant in IBM Cloud\n" +
            "https://developer.ibm.com/clouddataservices/docs/cloudant/get-started/",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": [],
        "boardId": "",
        "teamOrStory": "Team C",
        "taskStatus": "ToDo"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description":
            "# Sign up for IBM Cloud\n" +
            "https://cloud.ibm.com/registration",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": [],
        "boardId": "",
        "teamOrStory": "Team C",
        "taskStatus": "ToDo"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description":
            "Release Kanban board app v0.0.1",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["ok", "merged", "v0.0.1", "feature-something", "#1", "#2"],
        "boardId": "",
        "teamOrStory": "Team A",
        "taskStatus": "Done"
    }, {
        "type": "kanban",
        "dueDate": "2030-01-01",
        "description": "This record is archived.",
        "barcode": "",
        "memo": "",
        "flags": ["Archived"],
        "tags": [],
        "boardId": "",
        "teamOrStory": "Team B",
        "taskStatus": "Backlog"
    }]
}
