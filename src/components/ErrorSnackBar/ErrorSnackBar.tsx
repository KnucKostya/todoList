import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import {useAppDispatch, useAppSelector} from "../../app/store";
import {SetErrorAC} from "../../app/app-reducer";
import {Alert} from "@mui/material";


export function CustomizedSnackbars() {

    const error = useAppSelector<null|string>(state => state.app.error)
    const dispatch = useAppDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(SetErrorAC(null))
    };

    return (
            <Snackbar open={!!error} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
    );
}