# Kanban Board App

![welcome-board](https://raw.githubusercontent.com/shellyln/kanban-board-app/master/public/images/icons/icon-96x96.png)  

Kanban style task management board app

[https://shellyln.github.io/knbn/#/](https://shellyln.github.io/knbn/#/)

![welcome-board](https://raw.githubusercontent.com/shellyln/kanban-board-app/master/docs/images/welcome-board.png)


[![npm](https://img.shields.io/npm/v/kanban-board-app.svg)](https://www.npmjs.com/package/kanban-board-app)
[![GitHub release](https://img.shields.io/github/release/shellyln/kanban-board-app.svg)](https://github.com/shellyln/kanban-board-app/releases)
[![Travis](https://img.shields.io/travis/shellyln/kanban-board-app/master.svg)](https://travis-ci.org/shellyln/kanban-board-app)
[![GitHub forks](https://img.shields.io/github/forks/shellyln/kanban-board-app.svg?style=social&label=Fork)](https://github.com/shellyln/kanban-board-app/fork)
[![GitHub stars](https://img.shields.io/github/stars/shellyln/kanban-board-app.svg?style=social&label=Star)](https://github.com/shellyln/kanban-board-app)



## Features

* Manage tasks with multiple boards
* Manage tasks in team / story lanes
* Synchronize multiple device boards with [CouchDB](https://couchdb.apache.org) remote server
* Customize the appearance and behavior of the board and kanban in the configuration editor view
* Write kanban in Markdown syntax
* Add QR Code to kanban
* Calendar view
* Dark mode
* PWA (if building with the feature enabled)
    * See `src/index.tsx`
* Signage mode (Auto update & Go around)
    * See `display.autoUpdate` and `display.goAround` settings.


## Requirements

### Browsers
* Google Chrome: latest
* Firefox: latest
* Safari: latest



## Showcase

### Kanban board view

![welcome-board](https://raw.githubusercontent.com/shellyln/kanban-board-app/master/docs/images/welcome-board.png)
![welcome-board](https://raw.githubusercontent.com/shellyln/kanban-board-app/master/docs/images/edit-dialog.png)

### Calendar view

![calendar](https://raw.githubusercontent.com/shellyln/kanban-board-app/master/docs/images/calendar.png)

### Configuration editor view

![calendar](https://raw.githubusercontent.com/shellyln/kanban-board-app/master/docs/images/setting.png)



## Board Gallery

See [docs/gallery.md](https://github.com/shellyln/kanban-board-app/blob/master/docs/gallery.md) to get board templates.

* Basic Kanban board
* Empathy Map
* Business Model Canvas
* SWOT analysis
* Rota



## Getting started

1. Go [https://shellyln.github.io/knbn/#/](https://shellyln.github.io/knbn/#/)
1. Create  [IBM Cloud Lite account](https://www.ibm.com/cloud/free/) to get managed CouchDB server ([IBM Cloudant®](https://www.ibm.com/cloud/cloudant))
    * [Sign up for IBM Cloud](https://cloud.ibm.com/registration)
    * [Get Started With Cloudant in IBM Cloud](https://developer.ibm.com/clouddataservices/docs/cloudant/get-started/)
1. Setup remote server configurations on [Settings view](https://shellyln.github.io/knbn/#/config/)



## Deploying to your site

```sh
git clone https://github.com/shellyln/kanban-board-app.git
cd kanban-board-app
npm ci

vi package.json
# and edit "homepage" entry. see https://create-react-app.dev/docs/deployment

vi src/index.tsx
# and enable "serviceWorker.register()" if you want.

npm run build
```
and deploy `./build/*` to your site.

For more informations, see [README-scripts.md](https://github.com/shellyln/kanban-board-app/blob/master/README-scripts.md) and
[Create React App deployment docs](https://create-react-app.dev/docs/deployment).



## Settings
### App Settings
Tap or Click `Settings` menu item of drawer and edit YAML text.

| Key                          | Description                                                                                             |
|------------------------------|---------------------------------------------------------------------------------------------------------|
| `remote.endpointUrl`         | CouchDB / Cloudant `External Endpoint` URL w/ DB name. <br>e.g. `https://???-bluemix.cloudant.com/mydb` |
| `remote.user`                | CouchDB / Cloudant `user name` or `API Key`                                                             |
| `remote.password`            | CouchDB / Cloudant `password`                                                                           |
| `display.autoUpdate`         | If true, periodic automatic update of the currently displayed board is enabled.                         |
| `display.autoUpdateInterval` | Periodic automatic update interval in seconds.                                                          |
| `display.goAround`           | If true, move the active board to the next when periodic automatic updates are triggered.               |


### Board Settings
Tap or Click `Editor` menu item of drawer and edit YAML text.

| Key                          | Description |
|------------------------------|-------------|
| `name`                       | Board name |
| `taskStatuses[i].value`      | Internal value for this status. |
| `taskStatuses[i].caption`    | Caption for displaying this status. |
| `taskStatuses[i].className`  | CSS clas name for this status. |
| `taskStatuses[i].completed`  | If true, this status represents a completed task. |
| `teamOrStories[i].value`     | Internal value for this lane. |
| `teamOrStories[i].caption`   | Caption for displaying this lane. |
| `teamOrStories[i].className` | CSS clas name for this lane. |
| `tags[i].value`              | Internal value for this tag. |
| `tags[i].className`          | CSS clas name for this tag. |
| `displayBarcode`             | If true, displays the barcode (QR code) field of the kanban. |
| `displayMemo`                | If true, displays the memo field of the kanban. |
| `displayFlags`               | If true, displays the flags field of the kanban. |
| `displayTags`                | If true, displays the tags field of the kanban. |
| `preferArchive`              | If true, displays the `Archive` button in the kanban edit dialog instead of the `Delete` button. |
| `boardStyle`                 | CSS styles for board view. |
| `calendarStyle`              | CSS styles for calendar view. |
| `boardNote`                  | Board note |
| `records[i]._id`             | Id of the kanban record. |
| `records[i].dueDate`         | Due date of the kanban record. |
| `records[i].taskStatus`      | Task status internal value of the kanban record. |
| `records[i].teamOrStory`     | Lane internal value of the kanban record. |
| `records[i].flags[j]`        | Flags of the kanban record. (separate with commas)<br>Effective flags:<br>&nbsp;&nbsp;&nbsp;&nbsp;`Archived`: archived kanban record.<br>&nbsp;&nbsp;&nbsp;&nbsp;`Marked`: important or watched kanban record. display a pin (📍) icon. |
| `records[i].tags[j]`         | Tags of the kanban record. (separate with commas) |
| `records[i].description`     | Description of the kanban record. (Markdown syntax) |
| `records[i].barcode`         | Barcode (QR code) value of the kanban record. |
| `records[i].memo`            | Kanban record notes. This field is not displayed on the kanban. |



## Export / Import a board

Follow the steps below to import the board.

### Export
1. Open the `Editor` view of the board you want to export.
1. Copy all configuration text.

### Import
1. Click `New board...` to create a board.
1. Open the `Editor` view of the board that created.
1. Paste the configuration text and click the `Save` button.

Kanban item IDs will be regenerated. You don't care.



## Tips

### Change kanban stickys and status lanes width

Paste to the `boardStyle` of the configuration text.

```css
.KanbanBoardView-sticky-note {width: 100px}
.KanbanBoardView-header-cell-task-statuses {min-width: 160px}
```


### Limit the height of kanban stickys

Paste to the `boardStyle` of the configuration text.

```css
.KanbanBoardView-sticky-description {
    max-height: 170px;
    overflow-y: auto;
    scrollbar-width: thin;
}
.KanbanBoardView-sticky-description::-webkit-scrollbar {
    width: 10px;
}
```


### Display background text in the table cell

Paste to the `boardStyle` of the configuration text.

```css
table.KanbanBoardView-board td.status-backlog.team-or-story-team-b {
    padding-top: 35px;
    background: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 250 35"><rect x="0" y="0" width="250" height="35" fill="yellow"/><text font-size="14pt" x="5" y="5" font-family="sans-serif" dominant-baseline="text-before-edge" fill="gray">Cell Background Text</text></svg>') no-repeat left top;
    background-size: 250px 35px;
}
```



## FAQ

* I want to use with multiple board list. (personal, family, at work, ...)
  * You should be deployed to multiple subdirectories or multiple subdomains.
  * Or you can do it with multiple browser user profiles.



## License
[ISC](https://github.com/shellyln/kanban-board-app/blob/master/LICENSE.md)  
Copyright (c) 2019 Shellyl_N and Authors.
