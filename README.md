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



## Getting started

1. Go [https://shellyln.github.io/knbn/#/](https://shellyln.github.io/knbn/#/)
1. Create  [IBM Cloud Lite account](https://www.ibm.com/cloud/free/) to get managed CouchDB server ([IBM Cloudant®](https://www.ibm.com/cloud/cloudant))
    * [Sign up for IBM Cloud](https://cloud.ibm.com/registration)
    * [Get Started With Cloudant in IBM Cloud](https://developer.ibm.com/clouddataservices/docs/cloudant/get-started/)
1. Setup remote server configurations on [Settings view](https://shellyln.github.io/knbn/#/config/)



## Deploying to your site

```sh
git clone https://github.com/shellyln/kanban-board-app.git
cd kanban-board
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
| `display.autoUpdate`         |  |
| `display.autoUpdateInterval` |  |


### Board Settings
Tap or Click `Editor` menu item of drawer and edit YAML text.

| Key                          | Description |
|------------------------------|-------------|
| `name`                       |  |
| `taskStatuses[i].value`      |  |
| `taskStatuses[i].caption`    |  |
| `taskStatuses[i].className`  |  |
| `taskStatuses[i].completed`  |  |
| `teamOrStories[i].value`     |  |
| `teamOrStories[i].caption`   |  |
| `teamOrStories[i].className` |  |
| `tags[i].value`              |  |
| `tags[i].className`          |  |
| `displayBarcode`             |  |
| `displayMemo`                |  |
| `displayFlags`               |  |
| `displayTags`                |  |
| `preferArchive`              |  |
| `boardStyle`                 |  |
| `calendarStyle`              |  |
| `records[i]._id`             |  |
| `records[i].dueDate`         |  |
| `records[i].taskStatus`      |  |
| `records[i].teamOrStory`     |  |
| `records[i].flags[j]`        |  |
| `records[i].tags[j]`         |  |
| `records[i].description`     |  |
| `records[i].barcode`         |  |
| `records[i].memo`            |  |



## License
[ISC](https://github.com/shellyln/kanban-board-app/blob/master/LICENSE.md)  
Copyright (c) 2019 Shellyl_N and Authors.
