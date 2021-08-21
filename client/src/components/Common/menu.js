import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Store';
import Person from '@material-ui/icons/Person';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import SettingIcon from '@material-ui/icons/Settings';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Card, CardActions, CardContent, Divider } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Messages from '../Messages/Messages';
import { useSelector } from 'react-redux';
import { withFirebase } from '../Firebase';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({

    grow: {
        flexGrow: 1,
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function TopMenu({ firebase }) {
    const classes = useStyles();
    const authUser = useSelector(state => state.sessionState.authUser);

    const [anchorElN, setAnchorElN] = React.useState(null);
    const [anchorElP, setAnchorElP] = React.useState(null);

    const handleClickN = (event) => {
        setAnchorElN(event.currentTarget);
    };

    const handleCloseN = () => {
        setAnchorElN(null);
    };

    const handleClickP = (event) => {
        setAnchorElP(event.currentTarget);
    };

    const handleCloseP = () => {
        setAnchorElP(null);
    };

    const openN = Boolean(anchorElN);
    const idN = openN ? 'popoverN' : undefined;
    const openP = Boolean(anchorElP);
    const idP = openP ? 'popoverP' : undefined;

    return (
        <AppBar position='fixed' className={classes.appBar}>
            <Toolbar>
                <IconButton
                    edge='start'
                    className={classes.menuButton}
                    color='inherit'
                    aria-label='menu'
                    component={Link} to={ROUTES.HOME}
                >
                    <MenuIcon />
                </IconButton>
                <Button className={classes.menuButton} component={Link} to={ROUTES.HOW_IT_WORKS} >How It Works</Button>
                <Button className={classes.menuButton} >About</Button>
                <Button className={classes.menuButton} >Contact</Button>

                <div className={classes.grow} />
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>
                {!authUser &&
                    <IconButton component={Link} to={ROUTES.SIGN_IN}>
                        <AccountCircleIcon />
                    </IconButton>
                }
                {authUser &&
                    <div>
                        <IconButton aria-describedby={idN} onClick={handleClickN}>
                            <NotificationsIcon />
                        </IconButton>
                        <Popover
                            id={idN}
                            open={openN}
                            anchorEl={anchorElN}
                            onClose={handleCloseN}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >

                            <Messages />
                        </Popover>
                        <IconButton aria-describedby={idP} onClick={handleClickP}>
                            <Person />
                        </IconButton>
                        <Popover
                            id={idP}
                            open={openP}
                            anchorEl={anchorElP}
                            onClose={handleCloseP}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <Card className={classes.root} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {authUser.username}
                                    </Typography>
                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        {authUser.email}
                                    </Typography>
                                    <Divider></Divider>
                                </CardContent>
                                <CardActions>
                                    <IconButton component={Link} to={ROUTES.ACCOUNT} ><SettingIcon /></IconButton>
                                    <IconButton onClick={firebase.doSignOut}>
                                        <PowerSettingsNewIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Popover>
                    </div>}
            </Toolbar>
        </AppBar >
    );
}

export default withFirebase(TopMenu);