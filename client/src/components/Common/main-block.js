import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(10),
    },
    root: {
        width: '100%',
        flexGrow: 1,
    },
}));

function MainBlock(props) {
    const classes = useStyles();
    return (
        <main className={classes.root}>
            <div className={classes.toolbar} />
            <div className={classes.content}>
                {props.children}
            </div>
        </main>

    )
};

export default MainBlock;
