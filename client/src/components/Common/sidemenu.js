import { Box, Button, Divider, Grid, IconButton, Typography } from '@material-ui/core';
import Collapse from "@material-ui/core/Collapse";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import CreateOutlined from '@material-ui/icons/CreateOutlined';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import RoomServiceIcon from '@material-ui/icons/RoomService';
import StreetviewIcon from '@material-ui/icons/Streetview';
import SyncIcon from '@material-ui/icons/Sync';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import ViewArray from '@material-ui/icons/ViewArray';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import * as ROUTES from '../../constants/routes';
import { W3Provider } from '../Web3';
import W3Context from '../Web3/context';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundImage: `linear-gradient(#cfd9df,#e2ebf0)`,
  },
  wallet: {
    padding: theme.spacing(5),
    flex: 1,
  },
  data: {
    textAlign: 'left',
  },
  logo: {
    width: drawerWidth * 0.8,
    padding: theme.spacing(1),
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  walletText: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  }
}));

function SideMenu() {
  const classes = useStyles();
  const authUser = useSelector(state => state.sessionState.authUser);

  return (
    <Drawer
      open={true}
      variant='permanent'
      anchor='left'
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Grid container justify="center">
        <img className={classes.logo} src={'/media/logo.png'} alt="Service Market" />
      </Grid>
      <Divider variant="middle" />

      <div>
        <W3Provider>
          <Wallet />
        </W3Provider>
        {authUser &&
          <List>
            <ExpandableMenuItem title="Service" icon={<RoomServiceIcon />}>
              <MenuItem title="New" icon={<CreateOutlined />} to={ROUTES.ADD_SERVICE} />
              <MenuItem title="Services" icon={< ViewArray />} to={ROUTES.VIEW_SERVICE} />
              <MenuItem title="Clients" icon={<ViewArray />} to={ROUTES.VIEW_SERVICE_CLIENTS} />
            </ExpandableMenuItem>
            <ExpandableMenuItem title="Intermediation" icon={<StreetviewIcon />}>
              <MenuItem title="New" icon={<CreateOutlined />} to={ROUTES.ADD_INTERMEDIATION} />
              <MenuItem title="Intermediations" icon={<ViewArray />} to={ROUTES.VIEW_INTERMEDIATION} />
              <MenuItem title="Clients" icon={<ViewArray />} to={ROUTES.VIEW_INT_CLIENTS} />
            </ExpandableMenuItem>
            <ExpandableMenuItem title="Subscription" icon={<TouchAppIcon />}>
              <MenuItem title="New" icon={<CreateOutlined />} to={ROUTES.ADD_SUBSCRIPTION} />
              <MenuItem title="Subscriptions" icon={<ViewArray />} to={ROUTES.VIEW_SUBSCRIPTION} />
            </ExpandableMenuItem>
          </List>
        }
      </div>
    </Drawer>

  );
}

const Wallet = (props) => {

  const classes = useStyles();
  const { account, balance, refresh } = useContext(W3Context);
  const handleRefresh = () => {
    refresh()
  };

  return (
    <div className={classes.wallet}>
      <Grid container className={classes.walletText}>
        <Grid item xs={6}>
          <Typography variant="h5" flex >Wallet</Typography>
        </Grid>
        <Grid item xs={6}>
          <IconButton aria-label="delete" onClick={handleRefresh}><SyncIcon /></IconButton>
        </Grid>
      </Grid>
      {!!account &&
        <div className={classes.data}>
          <Typography color="textSecondary">
            Status: "Connected"
          </Typography>
          <Typography color="textSecondary">
            Account: {account ? account.toString().replace(account.toString().substring(4, 40), "***") : ' -'}
          </Typography>
          <Typography color="textSecondary">
            Balance: {account ? Number(balance).toFixed(3) + " Eth" : ' -'}
          </Typography>
          <Button size="small">See More</Button>
        </div>
      }
      {!account &&
        <div className={classes.data}>
          <Typography color="textSecondary">
            Please Connect to the wallet.
          </Typography>
        </div>
      }
    </div>
  );
};


const MenuItem = ({ icon, title, to }) => {
  return (
    <div component="nav">
      <ListItem button component={Link} to={to}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    </div>
  );
};


const ExpandableMenuItem = ({ children, title, icon }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div component="nav">
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Box pl={2}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      </Box>
    </div >
  );
};

export default SideMenu;