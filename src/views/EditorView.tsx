// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import React                          from 'react';
import { connect }                    from 'react-redux';
import { RouteComponentProps }        from 'react-router-dom';
import { makeStyles,
         useTheme }                   from '@material-ui/core/styles';
import Button                         from '@material-ui/core/Button';
import CheckIcon                      from '@material-ui/icons/Check';
import DeleteIcon                     from '@material-ui/icons/Delete';
import Typography                     from '@material-ui/core/Typography';
import Fab                            from '@material-ui/core/Fab';
import clsx                           from 'clsx';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import                                     'codemirror/lib/codemirror.css';
import                                     'codemirror/theme/material.css';
import                                     'codemirror/mode/yaml/yaml';
import jsYaml                         from 'js-yaml';
import { KanbanBoardState,
         KanbanBoardRecord }          from '../types';
import { mapDispatchToProps,
         mapStateToProps,
         KanbanBoardActions }         from '../dispatchers/KanbanBoardDispatcher';
import ConfirmDialog                  from '../components/ConfirmDialog';
import { pickEditableBoardProps,
         validateBoardProps }         from '../lib/validation';
import                                     './EditorView.css';



type EditorViewProps = KanbanBoardState & KanbanBoardActions & RouteComponentProps<{id: string}> & {
};


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        color: 'var(--main-text-color)',
        backgroundColor: 'var(--main-bg-color)',
        width: '100%',
        height: '100%',
    },
    header: {
        height: '45px',
        position: 'relative',
    },
    codemirror: {
        display: 'grid',
        width: 'calc(100% - 20px)',
        height: 'calc(100vh - 65px)',
    },
    fabSave: {
        position: 'absolute',
        margin: theme.spacing(1),
        left: theme.spacing(1),
        top: theme.spacing(1) / 10,
    },
    fabDelete: {
        position: 'absolute',
        margin: theme.spacing(1),
        right: theme.spacing(1),
        top: theme.spacing(1) / 10,
    },
}));


const EditorView: React.FC<EditorViewProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [confirmDeletingOpen, setConfirmDeletingOpen] = React.useState(false);
    const [editorValue, setEditorValue] = React.useState('');
    const [editCount, setEditCount] = React.useState(0);
    // NOTE: codeMirror.current.props.value is NOT updated after onChange event.
    // const codeMirror = useRef((null as any) as CodeMirror);

    function handleSaveClick() {
        try {
            const data: KanbanBoardRecord = jsYaml.load(editorValue) as any;
            if (data) {
                validateBoardProps(data);
                props.editBoardAndStickys(Object.assign({}, data, { _id: props.activeBoard._id }));
            } else {
                //
            }
        } catch (e) {
            props.showAlertDialog({
                open: true,
                title: 'Error',
                message: e.message || String(e),
                singleButton: true,
                colorIsSecondary: true,
                onClose: () => props.closeAlertDialog(),
            });
        }
    }

    function handleConfirmDeleting(apply: boolean) {
        setConfirmDeletingOpen(false);
        if (apply) {
            props.deleteBoard(props.activeBoard._id);
        }
    }

    function handleEditorChange(editor: any, data: any, value: string) {
        setEditorValue(value);
        setEditCount(editCount + 1);
    }

    if (props.match.params.id) {
        if (props.activeBoard._id !== props.match.params.id) {
            const index = props.boards.findIndex(x => x._id === props.match.params.id);
            props.changeActiveBoard(props.match.params.id);

            // NOTE: dirty hack
            setTimeout(() => {
                setEditCount(0);
            }, 30);

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

    return (
        <div className={clsx(classes.root)}>
            <div className={clsx(classes.header)}>
                <Typography variant="h6" align="center" style={{marginTop: '0px'}}>{props.activeBoard.name}</Typography>
                <Button
                    className={clsx(classes.fabSave)}
                    variant="contained"
                    color="primary"
                    disabled={editCount === 0}
                    onClick={handleSaveClick} >
                    <CheckIcon />
                    <Typography variant="body1" style={{marginLeft: theme.spacing(1)}} >
                        Save
                    </Typography>
                </Button>
                {props.boards.length > 1 ?
                    <Button
                        className={clsx(classes.fabDelete)}
                        variant="outlined"
                        color="secondary"
                        onClick={ev => setConfirmDeletingOpen(true)} >
                        <DeleteIcon color="secondary" />
                        <Typography variant="body1" color="secondary" style={{marginLeft: theme.spacing(1)}} >
                            Delete
                        </Typography>
                    </Button> :
                    <></>
                }
            </div>
            <div>
                <CodeMirror
                    className={clsx(classes.codemirror)}
                    value={`# Board settings\n\n${
                        jsYaml.dump(pickEditableBoardProps(props.activeBoard), {lineWidth: 1000})
                    }`}
                    options={{
                        mode: 'yaml',
                        theme: 'material',
                        lineNumbers: true,
                        lineWrapping: true,
                    }}
                    onChange={handleEditorChange}
                />
            </div>
            {confirmDeletingOpen ?
                <ConfirmDialog
                    open={confirmDeletingOpen}
                    title="Delete board"
                    message="Are you sure want to delete the board?"
                    colorIsSecondary={true}
                    applyButtonCaption="Delete"
                    confirmingTextLabel={'Type "Delete board" to delete this board.'}
                    confirmingTextValue="Delete board"
                    fab={
                        <Fab size="large" variant="round" aria-label="delete" color="secondary" style={{margin: 'auto'}}>
                            <DeleteIcon />
                        </Fab>
                    }
                    onClose={handleConfirmDeleting} /> :
                <></>
            }
        </div>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(EditorView);
