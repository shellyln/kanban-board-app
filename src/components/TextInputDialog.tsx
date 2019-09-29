// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import React                    from 'react';
import Button                   from '@material-ui/core/Button';
import TextField                from '@material-ui/core/TextField';
import Dialog                   from '@material-ui/core/Dialog';
import DialogActions            from '@material-ui/core/DialogActions';
import DialogContent            from '@material-ui/core/DialogContent';
import DialogContentText        from '@material-ui/core/DialogContentText';
import DialogTitle              from '@material-ui/core/DialogTitle';
import CheckIcon                from '@material-ui/icons/Check';
import CancelIcon               from '@material-ui/icons/Cancel';
import { useTheme }             from '@material-ui/core/styles';
import gensym                   from '../lib/gensym';
import { TextInputDialogProps } from '../types';



const TextInputDialog: React.FC<TextInputDialogProps> = (props) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(props.open);
    const [value, setValue] = React.useState(props.value);

    const formDialogTitleId = gensym();

    function handleCancelClick() {
        setOpen(false);
        props.onClose(false);
    }

    function handleApplyClick() {
        setOpen(false);
        props.onClose(true, value);
    }

    function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
    }

    return (
        <Dialog open={open} onClose={handleCancelClick} aria-labelledby={formDialogTitleId}>
            <DialogTitle id={formDialogTitleId}>{props.title}</DialogTitle>
            <DialogContent>
                {props.message ?
                    <DialogContentText>{props.message}</DialogContentText> :
                    <></>
                }
                <TextField
                    autoFocus
                    margin="dense"
                    label={props.fieldLabel}
                    fullWidth
                    value={value}
                    error={props.validator ? props.validator(value) : false}
                    onChange={handleValueChange}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="default"
                    onClick={handleCancelClick}>
                    <CancelIcon /><span style={{marginLeft: theme.spacing(1)}} />{props.cancelButtonCaption || 'Cancel'}
                </Button>
                <Button
                    variant="contained"
                    color={props.colorIsSecondary ? 'secondary' : 'primary'}
                    disabled={props.validator ? props.validator(value) : false}
                    onClick={handleApplyClick}>
                    <CheckIcon /><span style={{marginLeft: theme.spacing(1)}} />{props.applyButtonCaption || 'Apply'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default TextInputDialog;
