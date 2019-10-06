// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import React                  from 'react';
import { connect }            from 'react-redux';
import { withRouter,
         RouteChildrenProps } from 'react-router';
import Drawer                 from '@material-ui/core/Drawer';
import Divider                from '@material-ui/core/Divider';
import IconButton             from '@material-ui/core/IconButton';
import ChevronLeftIcon        from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon       from '@material-ui/icons/ChevronRight';
import AddBoxIcon             from '@material-ui/icons/AddBox';
import TableChartIcon         from '@material-ui/icons/TableChart';
import CalendarTodayIcon      from '@material-ui/icons/CalendarToday';
import EditIcon               from '@material-ui/icons/Edit';
import SettingsIcon           from '@material-ui/icons/Settings';
import HelpIcon               from '@material-ui/icons/Help';
import ExpandLessIcon         from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon         from '@material-ui/icons/ExpandMore';
import Collapse               from '@material-ui/core/Collapse';
import List                   from '@material-ui/core/List';
import ListSubheader          from '@material-ui/core/ListSubheader';
import ListItem               from '@material-ui/core/ListItem';
import ListItemIcon           from '@material-ui/core/ListItemIcon';
import ListItemText           from '@material-ui/core/ListItemText';
import { makeStyles }         from '@material-ui/core/styles';
import useMediaQuery          from '@material-ui/core/useMediaQuery';
import clsx                   from 'clsx';
import { KanbanBoardState }   from '../types';
import { mapDispatchToProps,
         mapStateToProps,
         KanbanBoardActions } from '../dispatchers/KanbanBoardDispatcher';
import { getCurrentView }     from '../lib/util';
import TextInputDialog        from '../components/TextInputDialog';



type AppDrawerProps = KanbanBoardState & KanbanBoardActions & RouteChildrenProps<{}>;


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(6) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(6) + 1,
        },
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));


const AppDrawer: React.FC<AppDrawerProps> = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [textInputOpen, setTextInputOpen] = React.useState({
        open: false,
        title: '',
        message: '',
        fieldLabel: '',
        value: '',
        validator: (value: string) => value.trim().length <= 0,
        onClose: handleCloseDialogAddNewBoard,
    });
    const [boardsOpen, setBoardsOpen] = React.useState(true);
    const matchesPrint = useMediaQuery('print');

    function handleDrawerToggle() {
        setOpen(!open);
    }

    function handleClickChangeActiveBoard(id: string) {
        let view = 'kanban';
        if (props.history.location.pathname) {
            if (props.history.location.pathname.startsWith('/calendar/')) {
                view = 'calendar';
            } else if (props.history.location.pathname.startsWith('/edit/')) {
                view = 'edit';
            }
        }
        props.history.push(`/${view}/${id}`);
    }

    function handleClickAddNewBoard() {
        setTextInputOpen(Object.assign({}, textInputOpen, {
            open: true,
            title: 'New board',
            message: '',
            fieldLabel: 'Board name',
            value: '',
        }));
    }
    
    function handleCloseDialogAddNewBoard(apply: boolean, value?: string) {
        setTextInputOpen(Object.assign({}, textInputOpen, { open: false }));
        if (apply && value) {
            props.addBoard(value);
        }
    }

    function handleChangeView(viewName: string, id: string) {
        if (id === props.activeBoardId) {
            props.history.push(`/${viewName}/${id}`);
        }
    }

    function handleBoardsOpenClick() {
        setBoardsOpen(!boardsOpen);
    }

    let currentView = getCurrentView(props.history);

    return (
        <>
            {!matchesPrint ?
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                    anchor="left"
                    open={open}
                    >
                    <div className={''}>
                        <IconButton onClick={handleDrawerToggle}>
                            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    {open ?
                        <>
                            <List
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        Boards
                                    </ListSubheader>
                                }>
                                <ListItem button
                                    onClick={handleBoardsOpenClick}>
                                    {boardsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItem>
                                <Collapse in={boardsOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {props.boards.map(x =>
                                            <ListItem button
                                                    key={x._id}
                                                    selected={x._id === props.activeBoardId}
                                                    className={clsx(classes.nested)}
                                                    style={{fontWeight: x._id === props.activeBoardId ? 'bold' : 'normal'}}
                                                    onClick={ev => handleClickChangeActiveBoard(x._id)} >
                                                <ListItemText
                                                    primary={x.name} />
                                            </ListItem>
                                        )}
                                    </List>
                                </Collapse>
                            </List>
                            <ListItem button
                                onClick={handleClickAddNewBoard}>
                                <ListItemIcon><AddBoxIcon /></ListItemIcon>
                                <ListItemText primary="New board..." />
                            </ListItem>
                            <Divider />
                        </> :
                        <></>
                    }
                    <List>
                        {/* settings */}
                        <ListItem button
                                selected={currentView === 'kanban' || currentView === ''}
                                onClick={ev => handleChangeView('kanban', props.activeBoardId)}>
                            <ListItemIcon><TableChartIcon /></ListItemIcon>
                            {open ? <ListItemText primary="Kanban" /> : <></>}
                        </ListItem>
                        <ListItem button
                                selected={currentView === 'calendar'}
                                onClick={ev => handleChangeView('calendar', props.activeBoardId)}>
                            <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                            {open ? <ListItemText primary="Calendar" /> : <></>}
                        </ListItem>
                        <ListItem button
                                selected={currentView === 'edit'}
                                onClick={ev => handleChangeView('edit', props.activeBoardId)}>
                            <ListItemIcon><EditIcon /></ListItemIcon>
                            {open ? <ListItemText primary="Editor" /> : <></>}
                        </ListItem>
                    </List>
                    {open ?
                        <>
                            <Divider />
                            <ListItem button
                                    selected={currentView === 'config'}
                                    onClick={ev => props.history.push(`/config/`)}>
                                <ListItemIcon><SettingsIcon /></ListItemIcon>
                                {open ? <ListItemText primary="Settings" /> : <></>}
                            </ListItem>
                            <List>
                                <ListItem button
                                        onClick={ev => window.open('https://github.com/shellyln/kanban-board-app#tips', '_blank')}>
                                    <ListItemIcon><HelpIcon /></ListItemIcon>
                                    {open ? <ListItemText primary="Help" /> : <></>}
                                </ListItem>
                            </List>
                        </> :
                        <></>
                    }
                </Drawer> :
                <></>
            }
            {textInputOpen.open ?
                <TextInputDialog
                    open={true}
                    title={textInputOpen.title}
                    message={textInputOpen.message}
                    fieldLabel={textInputOpen.fieldLabel}
                    value={textInputOpen.value}
                    validator={textInputOpen.validator}
                    onClose={textInputOpen.onClose} /> :
                <></>
            }
        </>
    );
}
export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(AppDrawer) as any) as any) as React.FC;
