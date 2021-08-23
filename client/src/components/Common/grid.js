import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {ServiceItem, IntItem} from './card';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function ShowCase(props) {
    const classes = useStyles();
    const { services, intermediaries } = props;
    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                {Object.keys(services || {}).map((k, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <ServiceItem sid={k} data={services[k]} />
                    </Grid>
                ))}

                {Object.keys(intermediaries || {}).map((k, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <IntItem sid={k} data={intermediaries[k]} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
