import { makeStyles } from '@material-ui/core';
import React from "react";

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
        padding: theme.spacing(5),
        width: '100%',
        height: '90vh',
    },
    root: {
        width: '100%',
    },
}));

function HowItWorksPage(props) {

    const classes = useStyles();

    return (
        <main className={classes.root}>
            <div className={classes.toolbar} />
            <iframe title="How It Works" frameborder="0" className={classes.content} src="how.html"></iframe>
        </main>
    );

}
export default HowItWorksPage;
