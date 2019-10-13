// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import React                      from 'react';
import { connect }                from 'react-redux';
import { RouteComponentProps }    from 'react-router-dom';
import { makeStyles,
         useTheme }               from '@material-ui/core/styles';
import Typography                 from '@material-ui/core/Typography';
import IconButton                 from '@material-ui/core/IconButton';
import ChevronLeftIcon            from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon           from '@material-ui/icons/ChevronRight';
import SkipPreviousIcon           from '@material-ui/icons/SkipPrevious';
import SkipNextIcon               from '@material-ui/icons/SkipNext';
import CalendarTodayIcon          from '@material-ui/icons/CalendarToday';
import clsx                       from 'clsx';
import { KanbanRecord,
         CalendarState,
         KanbanBoardState, 
         KanbanBoardRecord }      from '../types';
import { parseISODate }           from '../lib/datetime';
import { mapDispatchToProps,
         mapStateToProps,
         CalendarActions }        from '../dispatchers/CalendarViewDispatcher';
import KanbanDialog               from '../components/KanbanDialog';
import TextInputDialog            from '../components/TextInputDialog';
import { getConstructedAppStore } from '../store';
import                                 './CalendarView.css';



type CalendarItemProps = CalendarState & CalendarActions &
        { kanbanBoardState: KanbanBoardState } & {
    board: KanbanBoardRecord,
    record: KanbanRecord,
};


type CalendarViewProps = CalendarState & CalendarActions &
        { kanbanBoardState: KanbanBoardState } & RouteComponentProps<{id: string}> & {
};


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        color: 'var(--main-text-color)',
        backgroundColor: 'var(--main-bg-color)',
    },
    calendar: {
        width: 'calc(100% - 30px)',
        height: '100%',
        margin: '15px',
        border: 'solid 1px var(--main-text-color)',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
    },
    calendarTitle: {
        position: 'relative',
        height: '30px',
    },
    calendarTitleToolBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '3px 3px 6px 4px',
        overflow: 'hidden',
        width: 'calc(100% - 30px)',
        height: '39px',
    },
    calendarTopLeftHeader: {
        border: 'solid 1px var(--main-text-color)',
        borderCollapse: 'collapse',
        padding: '5px',
    },
    calendarDaysHeader: {
        border: 'solid 1px var(--main-text-color)',
        borderCollapse: 'collapse',
        padding: '5px',
        width: '14%',
    },
    calendarSundayHeader: {
        border: 'solid 1px var(--main-text-color)',
        borderCollapse: 'collapse',
        padding: '5px',
        width: '14%',
        backgroundColor: 'var(--weak-header-bg-color)',
        color: 'var(--calendar-sunday-color)',
    },
    calendarSaturdayHeader: {
        border: 'solid 1px var(--main-text-color)',
        borderCollapse: 'collapse',
        padding: '5px',
        width: '14%',
        backgroundColor: 'var(--weak-header-bg-color)',
        color: 'var(--calendar-saturday-color)',
    },
    calendarCell: {
        border: 'solid 1px var(--main-text-color)',
        borderCollapse: 'collapse',
        padding: '5px',
        verticalAlign: 'top',
    },
    calendarWeekendCell: {
        border: 'solid 1px var(--main-text-color)',
        borderCollapse: 'collapse',
        padding: '5px',
        verticalAlign: 'top',
        backgroundColor: 'var(--weak-data-bg-color)',
    },
    calendarCellCaptionToday: {
        color: 'var(--calendar-today-color)',
        backgroundColor: 'var(--calendar-today-bg-color)',
        borderRadius: '10px',
        border: 'solid 1.5px var(--calendar-today-bg-color)',
    },
    chip: {
        fontSize: 'smaller',
        borderRadius: '5px',
        backgroundColor:'var(--sticky-blue-color)',
        color: 'var(--main-text-color)',
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        marginBottom: '2px',
        paddingLeft: '3px',
        paddingRight: '3px',
    },
    chipWrap: {
        '&:hover': {
            cursor: 'pointer',
        }
    }
}));


const CalendarItem_: React.FC<CalendarItemProps> = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const teamOrStory = props.board.teamOrStories.find(x => x.value === props.record.teamOrStory);
    const taskStatus = props.board.taskStatuses.find(x => x.value === props.record.taskStatus);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDate = props.record.dueDate ? parseISODate(props.record.dueDate) : null;
    const expired = (! (taskStatus && taskStatus.completed)) &&
        (dueDate ? dueDate < today : false);
    const archived = props.record.flags && props.record.flags.includes('Archived');

    function handleEditApply(rec: KanbanRecord) {
        props.updateSticky(rec);
        setOpen(false);
    }

    function handleArchive(id: string) {
        props.archiveSticky(id);
        setOpen(false);
    }

    function handleUnarchive(id: string) {
        props.unarchiveSticky(id);
        setOpen(false);
    }

    function handleDelete(id: string) {
        props.deleteSticky(id);
        setOpen(false);
    }

    function handleEditCancel() {
        setOpen(false);
    }

    return (
        <>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
                className={clsx(classes.chipWrap)}
                onClick={ev => setOpen(true)}>
                <div className={clsx(classes.chip) + ' CalendarView-item-chip' +
                    (teamOrStory ? ' ' + teamOrStory.className : '') +
                    (taskStatus ? ' ' + taskStatus.className : '') +
                    (expired ? ' expired' : '') +
                    (archived ? ' archived' : '')}>
                    {props.record.description.trim().replace(/\n/g, ' ').replace(/#+/g, '').trim()}
                </div>
            </a>
            {open ?
                <KanbanDialog
                    open={true}
                    record={props.record}
                    teamOrStories={props.kanbanBoardState.activeBoard.teamOrStories}
                    taskStatuses={props.kanbanBoardState.activeBoard.taskStatuses}
                    board={props.board}
                    onApply={handleEditApply}
                    onArchive={handleArchive}
                    onUnarchive={handleUnarchive}
                    onDelete={handleDelete}
                    onCancel={handleEditCancel} /> : <></>
            }
        </>
    );
}
const CalendarItem = connect(mapStateToProps, mapDispatchToProps)(CalendarItem_);

const CalendarView: React.FC<CalendarViewProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [textInputOpen, setTextInputOpen] = React.useState({
        open: false,
        title: '',
        message: '',
        fieldLabel: '',
        value: '',
        validator: (value: string) => value.trim().length <= 0,
        onClose: handleCloseDialogEditBoardName,
    });

    function handleClickEditBoardName() {
        const currentState = getConstructedAppStore().getState();
        setTextInputOpen(Object.assign({}, textInputOpen, {
            open: true,
            title: 'Edit board name',
            message: '',
            fieldLabel: 'Board name',
            value: currentState.kanbanBoard.activeBoard.name,
        }));
    }

    function handleCloseDialogEditBoardName(apply: boolean, value?: string) {
        setTextInputOpen(Object.assign({}, textInputOpen, { open: false }));
        if (apply && value) {
            const currentState = getConstructedAppStore().getState();
            props.updateBoardName({ boardId: currentState.kanbanBoard.activeBoardId, boardName: value });
        }
    }

    if (props.match.params.id) {
        if (props.kanbanBoardState.activeBoard._id !== props.match.params.id) {
            const index = props.kanbanBoardState.boards.findIndex(x => x._id === props.match.params.id);
            props.changeActiveBoard(props.match.params.id);
            return (
                <div className={classes.root}>
                    {index < 0 ?
                        <>
                            <Typography
                                style={{marginTop: theme.spacing(10)}}
                                variant="h4" align="center">
                                No boards found.
                            </Typography>
                            <Typography
                                style={{marginTop: theme.spacing(5), cursor: 'pointer', textDecoration: 'underline'}}
                                variant="body1" align="center"
                                onClick={ev => {props.history.push('/')}} >
                                Click here to show main board.
                            </Typography>
                        </> :
                        <></>
                    }
                </div>
            );
        }
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const month = props.activeMonth;

    const firstDateOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDateOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const firstDateOfCal = new Date(
        firstDateOfMonth.getFullYear(), firstDateOfMonth.getMonth(),
        1 - firstDateOfMonth.getDay());
    const lastDateOfCal = new Date(
        lastDateOfMonth.getFullYear(), lastDateOfMonth.getMonth(),
        lastDateOfMonth.getDate() + (6 - lastDateOfMonth.getDay()));
    const nextCalDate = new Date(
        lastDateOfCal.getFullYear(), lastDateOfCal.getMonth(),
        lastDateOfCal.getDate() + 1);

    const dates: Array<Date[]> = [];
    let week: Date[] = [];
    dates.push(week);
    for (let wd = firstDateOfCal;
            wd.getTime() <= lastDateOfCal.getTime();
            wd = new Date(wd.getFullYear(), wd.getMonth(), wd.getDate() + 1)) {
        if (7 <= week.length) {
            week = [];
            dates.push(week);
        }
        week.push(wd);
    }

    const stickys = props.kanbanBoardState.activeBoard.records.filter(x => {
        if (!x.dueDate) {
            return false;
        }
        const d = new Date(x.dueDate);
        if (firstDateOfCal <= d && d < nextCalDate) {
            return true;
        } else {
            return false;
        }
    });

    return (
        <div className={clsx(classes.root)}>
            <style dangerouslySetInnerHTML={{__html: props.kanbanBoardState.activeBoard.calendarStyle}}></style>
            <div className={clsx(classes.calendarTitle)}>
                <div className={clsx(classes.calendarTitleToolBar)}>
                    <IconButton onClick={ev => props.showToday()}>
                        <CalendarTodayIcon /><Typography variant="caption" style={{marginLeft: '1em'}}>Today</Typography>
                    </IconButton>
                    <IconButton onClick={ev => props.showPreviousYear()}>
                        <SkipPreviousIcon />
                    </IconButton>
                    <IconButton onClick={ev => props.showPreviousMonth()}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={ev => props.showNextMonth()}>
                        <ChevronRightIcon />
                    </IconButton>
                    <IconButton onClick={ev => props.showNextYear()}>
                        <SkipNextIcon />
                    </IconButton>
                    <Typography variant="h6" display="inline" style={{marginLeft: '2em'}}>{
                        props.activeMonth.toLocaleDateString(
                            (navigator as any).userLanguage || navigator.language || (navigator as any).browserLanguage || 'en',
                            {year: 'numeric', month: 'long'})
                    }</Typography>
                    <Typography variant="h6" display="inline" style={{marginLeft: '3em', cursor: 'pointer'}}
                        onClick={handleClickEditBoardName} >{
                        props.kanbanBoardState.activeBoard.name}</Typography>
                </div>
            </div>
            <table className={clsx(classes.calendar)}>
                <thead>
                    <tr>
                        <th className={clsx(classes.calendarTopLeftHeader)}></th>
                        <th className={clsx(classes.calendarSundayHeader)}>Sun</th>
                        <th className={clsx(classes.calendarDaysHeader)}>Mon</th>
                        <th className={clsx(classes.calendarDaysHeader)}>Tue</th>
                        <th className={clsx(classes.calendarDaysHeader)}>Wed</th>
                        <th className={clsx(classes.calendarDaysHeader)}>Thu</th>
                        <th className={clsx(classes.calendarDaysHeader)}>Fri</th>
                        <th className={clsx(classes.calendarSaturdayHeader)}>Sat</th>
                    </tr>
                </thead>
                <tbody>
                    {dates.map(week =>
                        <tr key={week[0].getTime()}>
                            <td className={clsx(classes.calendarCell)}></td>
                            {week.map((wd: Date, index: number) => {
                                const next = new Date(wd.getFullYear(), wd.getMonth(), wd.getDate() + 1);
                                return (
                                    <td key={wd.toISOString()}
                                        className={clsx(index === 0 || index === 6 ? classes.calendarWeekendCell :classes.calendarCell)}>
                                        <div style={{position: 'relative'}}>
                                            <div
                                                className={wd <= today && today < next ? clsx(classes.calendarCellCaptionToday) : ''}
                                                style={{position: 'absolute', top: '0', right: '0'}}>
                                                {wd.getDate()}
                                            </div>
                                            <div style={{paddingTop: '20px', minHeight: '80px'}}>
                                                {stickys.filter(x => {
                                                    const d = new Date(x.dueDate);
                                                    if (wd <= d && d < next) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }).map(x =>
                                                    <CalendarItem
                                                        board={props.kanbanBoardState.activeBoard}
                                                        key={x._id}
                                                        record={x} />
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    )}
                </tbody>
            </table>
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
        </div>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(CalendarView);
