// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import React, { useState }                      from 'react';
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
import { DragDropContext, Droppable, Draggable, ResponderProvided, DropResult } from "react-beautiful-dnd";

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

type CardsProps = KanbanBoardActions & {
    records: KanbanRecord[],
    taskStatus: StatusLaneDef,
    taskStatuses: StatusLaneDef[],
    teamOrStories: LaneDef[],
    board: KanbanBoardRecord,
};

type CardProps = KanbanBoardActions & {
    record: KanbanRecord,
    taskStatus: StatusLaneDef,
    //teamOrStory: LaneDef,
    taskStatuses: StatusLaneDef[],
    teamOrStories: LaneDef[],
    board: KanbanBoardRecord,
};

type FlowKanbanBoardViewProps = KanbanBoardState & KanbanBoardActions & RouteComponentProps<{id: string}> & {
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


const Card_: React.FC<CardProps> = (props) => {
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
                onClick={ev => setOpen(true)}
                >
                <div
                    className={ (expired ? ' expired' : '')} >
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
                    {/* <div className="KanbanBoardView-sticky-tags">id: {props.record._id} rank: {props.record.rank}</div> */}
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
const Card = connect(mapNeverStateToProps, mapDispatchToProps)(Card_);


const Cards_: React.FC<CardsProps> = (props) => {
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
                teamOrStoryValue: props.teamOrStories[0].value
            })
        } catch (e) {
            alert(e.message);
        }
        ev.preventDefault();
    }

    return (
        <div
            className={
                // 'KanbanBoardView-sticky-wrap ' + 
                (props.taskStatus.className || '')}
            data-status={props.taskStatus.value}
            >
            
            <Droppable key={props.taskStatus.value} droppableId={props.taskStatus.value}>
            {(provided, snapshot) => (
                <div 
                ref={provided.innerRef} 
                {...provided.droppableProps}>
                    {props.records.map((record, i) => (
                        <Draggable 
                        key={record._id}
                        draggableId={record._id} 
                        index={i} >
                            {(provided, snapshot) => (
                                <div   
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                    <Card 
                                    
                                        key={record._id || gensym()}
                                        //teamOrStory={null}
                                        taskStatus={props.taskStatus}
                                        teamOrStories={props.teamOrStories}
                                        taskStatuses={props.taskStatuses}
                                        board={props.board}
                                        record={record}/>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    
                  {provided.placeholder}
                </div>
            )}
            </Droppable>
            {(firefox && props.records.length === 0) ?
                // NOTE: hack for the height of div becomes 0 in Firefox
                <div style={{width: '100%', height: '100%'}}>&nbsp;</div> :
                <></>
            }
        </div>
    );
}
const Cards = connect(mapNeverStateToProps, mapDispatchToProps)(Cards_);


const FlowKanbanBoardView: React.FC<FlowKanbanBoardViewProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    function getAllRecords() {
        return props.activeBoard
    };
    
    const [filteredRecords, setFilteredRecords] = React.useState([] as KanbanRecord[]);
    React.useEffect(() => setFilteredRecords([...props.activeBoard.records].filter(x => (!x.flags || !x.flags.includes('Archived')) )), 
        [props.activeBoard.records])


    React.useEffect(() => {
        const r = {} as {[key:string]:KanbanRecord[]};
        const sorted = filteredRecords
            .sort((a,b) => (a.rank|| -1000) - (b.rank|| -1000));
        props.activeBoard.taskStatuses.forEach(x => r[x.value] = sorted.filter(c => c.taskStatus == x.value));
        setFilteredSortedRecords(r);
    }, [filteredRecords, props.activeBoard.taskStatuses]); //props.activeBoard.records
    

    const [filteredSortedRecords, setFilteredSortedRecords] = React.useState({} as {[key:string]:KanbanRecord[]});
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
    
    function onDragEnd(result: DropResult, provided: ResponderProvided) {
        
        if (result.destination) {


            const idx = result.destination!.index;
            const dstReorderedRecordsForStatus = filteredSortedRecords[result.destination?.droppableId] || [];


            const movingWithinSameList = result.source.droppableId === result.destination?.droppableId;
            const srcReorderedRecordsForStatus = movingWithinSameList ?
                dstReorderedRecordsForStatus : 
                filteredSortedRecords[result.source.droppableId] || [];
            const [removed] = srcReorderedRecordsForStatus.splice(result.source.index, 1);
            dstReorderedRecordsForStatus.splice(idx, 0, removed);


            const movedRecord = dstReorderedRecordsForStatus[idx];
            console.log(`movedRecord: ${movedRecord._id} rank: ${movedRecord.rank}`);
            const nextRank = idx < dstReorderedRecordsForStatus.length - 1 ? dstReorderedRecordsForStatus[idx + 1].rank : NaN;
            const prevRank = idx > 0 ? dstReorderedRecordsForStatus[idx-1].rank : NaN;

            
            const rank = (nextRank && prevRank) ? ((nextRank + prevRank) / 2) : (nextRank ? (nextRank - 1) : ((prevRank || 0) + 1));

            movedRecord.rank = rank;
            movedRecord.taskStatus = result.destination?.droppableId;
            props.updateSticky(movedRecord);

            const newFilteredSortedRecords = {...filteredSortedRecords};
            newFilteredSortedRecords[result.destination?.droppableId] = dstReorderedRecordsForStatus;
            if (!movingWithinSameList) {
                newFilteredSortedRecords[result.source.droppableId] = srcReorderedRecordsForStatus;
            }

            setFilteredSortedRecords(newFilteredSortedRecords);

        }
    }

    //fixup ranks
    
    // const unrankedRecords = filteredSortedRecords.filter(x => !x.rank);
    
    // if (unrankedRecords.length) {
    //     const maxRate = Math.max(...(unrankedRecords.map(x => x.rank)));
    //     unrankedRecords.forEach((rec, i) => {
    //         rec.rank = i + maxRate;
    //         props.updateSticky(rec);
    //     });
    
    // }
    
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
                    <tr>
                        <th>👀</th>
                        <DragDropContext onDragEnd={onDragEnd}>
                            {props.activeBoard.taskStatuses.map(taskStatus => (
                                <td key={taskStatus.value}
                                    className={
                                        (taskStatus.className || '')}>
                                    <Cards
                                        taskStatus={taskStatus}
                                        taskStatuses={props.activeBoard.taskStatuses}
                                        teamOrStories={props.activeBoard.teamOrStories}
                                        board={props.activeBoard}
                                        records={filteredSortedRecords[taskStatus.value] || []} />
                                </td>
                            ))}
                        </DragDropContext>
                    </tr>
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
export default connect(mapStateToProps, mapDispatchToProps)(FlowKanbanBoardView);
