// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import React                  from 'react';
import Button                 from '@material-ui/core/Button';
import TextField              from '@material-ui/core/TextField';
import Dialog                 from '@material-ui/core/Dialog';
import DialogActions          from '@material-ui/core/DialogActions';
import DialogContent          from '@material-ui/core/DialogContent';
import DialogContentText      from '@material-ui/core/DialogContentText';
import DialogTitle            from '@material-ui/core/DialogTitle';
import CheckIcon              from '@material-ui/icons/Check';
import CancelIcon             from '@material-ui/icons/Cancel';
import { useTheme }           from '@material-ui/core/styles';
import gensym                 from '../lib/gensym';
import { ConfirmDialogProps } from '../types';



const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(props.open);
    const [inputValue, setInputValue] = React.useState('');

    const formDialogTitleId = gensym();

    function handleCancelClick() {
        setOpen(false);
        props.onClose(false);
    }

    function handleApplyClick() {
        if (props.confirmingTextValue && props.confirmingTextValue !== inputValue) {
            return;
        }
        setOpen(false);
        props.onClose(true);
    }

    function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value);
    }

    return (
        <Dialog open={open} onClose={handleCancelClick} aria-labelledby={formDialogTitleId}>
            {props.fab ? props.fab : <></>}
            <DialogTitle id={formDialogTitleId} style={{textAlign: 'center'}}>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText style={{textAlign: 'center'}}>
                    {(props.message || '').split('\n').map((x, index, arr) =>
                        <span key={'content-' + index}>
                            {x}
                            {index <= (arr.length - 1) ? <br/> : <></>}
                        </span>)
                    }
                </DialogContentText>
            </DialogContent>
            {props.confirmingTextValue ?
                <TextField
                    autoFocus
                    margin="dense"
                    label={props.confirmingTextLabel}
                    value={inputValue}
                    onChange={handleValueChange}
                    style={{marginLeft: theme.spacing(1), marginRight: theme.spacing(1), marginBottom: theme.spacing(1)}}
                    /> :
                    <></>
            }
            <DialogActions style={{margin: 'auto'}}>
                {!props.singleButton?
                    <Button
                        variant="outlined"
                        color="default"
                        onClick={handleCancelClick} >
                        <CancelIcon /><span style={{marginLeft: theme.spacing(1)}} />{props.cancelButtonCaption || 'Cancel'}
                    </Button> :
                    <></>
                }
                <Button
                    variant="contained"
                    color={props.colorIsSecondary ? 'secondary' : 'primary'}
                    disabled={props.confirmingTextValue ? inputValue !== props.confirmingTextValue : false}
                    onClick={handleApplyClick} >
                    <CheckIcon /><span style={{marginLeft: theme.spacing(1)}} />{props.applyButtonCaption || 'Apply'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default ConfirmDialog;
