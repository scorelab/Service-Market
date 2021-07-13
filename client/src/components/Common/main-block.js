import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(5),
    },
    root: {
        width: '100%',
        flexGrow: 1,
    },
    title: {
        textAlign: "left",
    },
}));

function MainBlock(props) {
    const classes = useStyles();
    return (
        <main className={classes.root}>
            <div className={classes.toolbar} />
            <div className={classes.content}>
                <Typography variant="h4" gutterBottom className={classes.title}>
                    {props.title}
                </Typography>
                {props.children}
            </div>
        </main>

    )
};

export default MainBlock;
