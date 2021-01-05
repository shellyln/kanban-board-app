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
import { AppEventsState,
         AppConfigDbRecord }          from '../types';
import { mapDispatchToProps,
         mapStateToProps,
         AppEventsActions }           from '../dispatchers/AppEventsDispatcher';
import ConfirmDialog                  from '../components/ConfirmDialog';
import { pickEditableConfigProps,
         validateConfigProps }        from '../lib/validation';
import                                     './SettingsView.css';



type SettingsViewProps = AppEventsState & AppEventsActions & RouteComponentProps<{id: string}> & {
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


const SettingsView: React.FC<SettingsViewProps> = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [confirmResetAppOpen, setConfirmResetAppOpen] = React.useState(false);
    const [editorValue, setEditorValue] = React.useState('');
    const [editCount, setEditCount] = React.useState(0);

    function handleSaveClick() {
        try {
            const data: AppConfigDbRecord = jsYaml.load(editorValue) as any;
            if (data) {
                validateConfigProps(data);
                props.updateAppConfig(Object.assign({}, data));
            } else {
                throw new Error('object property "remote" is required.');
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

    function handleConfirmResetApplication(apply: boolean) {
        setConfirmResetAppOpen(false);
        if (apply) {
            props.resetApplication();
        }
    }

    function handleEditorChange(editor: any, data: any, value: string) {
        setEditorValue(value);
        setEditCount(editCount + 1);
    }

    return (
        <div className={clsx(classes.root)}>
            <div className={clsx(classes.header)}>
                <Typography variant="h6" align="center" style={{marginTop: '0px'}}>{'Application Settings'}</Typography>
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
                <Button
                    className={clsx(classes.fabDelete)}
                    variant="outlined"
                    color="secondary"
                    onClick={ev => setConfirmResetAppOpen(true)} >
                    <DeleteIcon color="secondary" />
                    <Typography variant="body1" color="secondary" style={{marginLeft: theme.spacing(1)}} >
                        Reset application
                    </Typography>
                </Button>
            </div>
            <div>
                <CodeMirror
                    className={clsx(classes.codemirror)}
                    value={`# App settings\n\n${
                        jsYaml.dump(pickEditableConfigProps(props.appConfig), {lineWidth: 1000})
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
            {confirmResetAppOpen ?
                <ConfirmDialog
                    open={confirmResetAppOpen}
                    title="Reset application"
                    message={'Are you sure want to reset application?\nAll local data and configurations will be REMOVED!'}
                    colorIsSecondary={true}
                    applyButtonCaption="Reset"
                    confirmingTextLabel={'Type "Reset application" to remove all data.'}
                    confirmingTextValue="Reset application"
                    fab={
                        <Fab size="large" variant="round" aria-label="reset application" color="secondary" style={{margin: 'auto'}}>
                            <DeleteIcon />
                        </Fab>
                    }
                    onClose={handleConfirmResetApplication} /> :
                <></>
            }
        </div>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
