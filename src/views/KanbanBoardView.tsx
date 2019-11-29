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
import AddBoxIcon                 from '@material-ui/icons/AddBox';
import clsx                       from 'clsx';
import marked                     from 'marked';
import createDOMPurify            from 'dompurify';
import { Qr }                     from 'red-agate-barcode/modules/barcode/Qr';
import { LaneDef,
         StatusLaneDef,
         KanbanRecord,
         KanbanBoardState, 
         KanbanBoardRecord }      from '../types';
import gensym                     from '../lib/gensym';
import { parseISODate }           from '../lib/datetime';
import { isDark }                 from '../lib/theme';
import { mapDispatchToProps,
         mapStateToProps,
         KanbanBoardActions }     from '../dispatchers/KanbanBoardDispatcher';
import KanbanDialog               from '../components/KanbanDialog';
import TextInputDialog            from '../components/TextInputDialog';
import { getConstructedAppStore } from '../store';
import                                 './KanbanBoardView.css';



type StickysProps = KanbanBoardActions & {
    records: KanbanRecord[],
    taskStatus: StatusLaneDef,
    teamOrStory: LaneDef,
    taskStatuses: StatusLaneDef[],
    teamOrStories: LaneDef[],
    board: KanbanBoardRecord,
};

type StickyProps = KanbanBoardActions & {
    record: KanbanRecord,
    taskStatus: StatusLaneDef,
    teamOrStory: LaneDef,
    taskStatuses: StatusLaneDef[],
    teamOrStories: LaneDef[],
    board: KanbanBoardRecord,
};

type KanbanBoardViewProps = KanbanBoardState & KanbanBoardActions & RouteComponentProps<{id: string}> & {
};


const DOMPurify = createDOMPurify(window);


const useStyles = makeStyles(theme => ({
    root: {},
    smallIcon: {
        width: '20px',
        height: '20px',
    },
}));


const mapNeverStateToProps = () => ({});

const agent = window.navigator.userAgent.toLowerCase();
const firefox = (agent.indexOf('firefox') !== -1);


const Sticky_: React.FC<StickyProps> = (props) => {
    const [open, setOpen] = React.useState(false);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDate = props.record.dueDate ? parseISODate(props.record.dueDate) : null;
    const expired = (! props.taskStatus.completed) &&
        (dueDate ? dueDate < today : false);

    function handleOnDragStart(ev: React.DragEvent) {
        ev.dataTransfer.setData('elId', (ev.target as any).id);
    }

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
                id={gensym()}
                data-record-id={props.record._id || ''}
                className="KanbanBoardView-sticky-link"
                draggable
                onClick={ev => setOpen(true)}
                onDragStart={handleOnDragStart}>
                <div
                    className={'KanbanBoardView-sticky-note' + (expired ? ' expired' : '')} >
                    {props.board.displayTags && props.record.tags.length ?
                        <ul className="KanbanBoardView-sticky-tags">{
                            props.record.tags.map((x, index) => {
                                const tags = props.board.tags || [];
                                const matched = tags.find(q => q.value === x);
                                return (
                                    <li key={props.record._id + '-tag-' + index}
                                        className={matched ? matched.className : ''}>{x}</li>
                                );
                            })
                        }</ul> :
                        <></>
                    }
                    <div
                        className="KanbanBoardView-sticky-description"
                        dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked(props.record.description))}} />
                    {props.board.displayBarcode && props.record.barcode ?
                        <div className="KanbanBoardView-sticky-barcode"
                            dangerouslySetInnerHTML={{__html: new Qr({
                            fill: true,
                            fillColor: isDark ? '#fff' : '#000',
                            cellSize: 2,
                            unit: 'px',
                            data: props.record.barcode,
                        }).toImgTag()}} />
                        : <></>
                    }
                    {props.record.flags.includes('Marked') ?
                        <div className="marked">{'📍'}</div> :
                        <></>
                    }
                    {props.record.dueDate ?
                        <div className="due-date">{(expired ? '🔥' : '⏳' ) + props.record.dueDate}</div> :
                        <></>
                    }
                </div>
            </a>
            {open ?
                <KanbanDialog
                    open={true}
                    record={props.record}
                    teamOrStories={props.teamOrStories}
                    taskStatuses={props.taskStatuses}
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
const Sticky = connect(mapNeverStateToProps, mapDispatchToProps)(Sticky_);


const Stickys_: React.FC<StickysProps> = (props) => {
    function handleOnDragOver(ev: React.DragEvent) {
        ev.preventDefault();
    }

    function handleOnDrop(ev: React.DragEvent) {
        try {
            const elId = ev.dataTransfer.getData('elId');
            const el = document.getElementById(elId);
            props.updateStickyLanes({
                kanbanId: (el as any).dataset.recordId,
                taskStatusValue: props.taskStatus.value,
                teamOrStoryValue: props.teamOrStory.value,
            })
        } catch (e) {
            alert(e.message);
        }
        ev.preventDefault();
    }

    const filtered = props.records.filter(x => !x.flags || !x.flags.includes('Archived'));

    return (
        <div
            className={
                'KanbanBoardView-sticky-wrap ' + 
                (props.teamOrStory.className || '') + ' ' +
                (props.taskStatus.className || '')}
            data-status={props.taskStatus.value}
            data-team-or-story={props.teamOrStory.value}
            onDragOver={handleOnDragOver}
            onDrop={handleOnDrop}
            >
            {filtered.map(record => (
                <Sticky
                    key={record._id || gensym()}
                    teamOrStory={props.teamOrStory}
                    taskStatus={props.taskStatus}
                    teamOrStories={props.teamOrStories}
                    taskStatuses={props.taskStatuses}
                    board={props.board}
                    record={record}/>
            ))}
            {(firefox && filtered.length === 0) ?
                // NOTE: hack for the height of div becomes 0 in Firefox
                <div style={{width: '100%', height: '100%'}}>&nbsp;</div> :
                <></>
            }
        </div>
    );
}
const Stickys = connect(mapNeverStateToProps, mapDispatchToProps)(Stickys_);


const KanbanBoardView: React.FC<KanbanBoardViewProps> = (props) => {
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
        if (props.activeBoard._id !== props.match.params.id) {
            const index = props.boards.findIndex(x => x._id === props.match.params.id);
            props.changeActiveBoard(props.match.params.id);
            return (
                <div className="KanbanBoardView-content">
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

    return (
        <div className="KanbanBoardView-content">
            <style dangerouslySetInnerHTML={{__html: props.activeBoard.boardStyle}}></style>
            <Typography
                variant="h6" align="center" style={{cursor: 'pointer'}}
                onClick={handleClickEditBoardName} >{props.activeBoard.name}</Typography>
            <table className="KanbanBoardView-board">
                <thead>
                    <tr>
                        <th className="KanbanBoardView-header-cell-add-sticky">
                            <IconButton style={{margin: 0, padding: 0}}
                                        onClick={ev => props.addSticky()}>
                                <AddBoxIcon className={clsx(classes.smallIcon)} />
                            </IconButton>
                        </th>
                        {props.activeBoard.taskStatuses.map(taskStatus => (
                            <th key={taskStatus.value}
                                className={
                                    'KanbanBoardView-header-cell-task-statuses ' +
                                    (taskStatus.className || '')}>
                                {taskStatus.caption || taskStatus.value}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.activeBoard.teamOrStories.map(teamOrStory => (
                        <tr key={teamOrStory.value}>
                            <th className={
                                'KanbanBoardView-header-cell-team-or-stories ' +
                                (teamOrStory.className || '')}>
                                {teamOrStory.caption || teamOrStory.value}
                            </th>
                            {props.activeBoard.taskStatuses.map(taskStatus => (
                                <td key={taskStatus.value}
                                    className={
                                        (teamOrStory.className || '') + ' ' +
                                        (taskStatus.className || '')}>
                                    <Stickys
                                        teamOrStory={teamOrStory}
                                        taskStatus={taskStatus}
                                        teamOrStories={props.activeBoard.teamOrStories}
                                        taskStatuses={props.activeBoard.taskStatuses}
                                        board={props.activeBoard}
                                        records={props.activeBoard.records.filter(
                                            x => x.teamOrStory === teamOrStory.value &&
                                                 x.taskStatus  === taskStatus.value)} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {props.activeBoard.boardNote ?
                <div className="KanbanBoardView-board-note-wrap">
                    <div className="KanbanBoardView-board-note"
                        dangerouslySetInnerHTML={{__html : DOMPurify.sanitize(marked(props.activeBoard.boardNote))}} />
                </div> :
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
        </div>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(KanbanBoardView);
