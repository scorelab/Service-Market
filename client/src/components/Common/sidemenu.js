import React, { useContext, useEffect, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Person from '@material-ui/icons/Person';
import Work from '@material-ui/icons/Work';
import CreateOutlined from '@material-ui/icons/CreateOutlined';
import ViewArray from '@material-ui/icons/ViewArray';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import * as ROUTES from '../../constants/routes';
import { Link } from "react-router-dom";
import TouchAppIcon from '@material-ui/icons/TouchApp';
import StreetviewIcon from '@material-ui/icons/Streetview';
import RoomServiceIcon from '@material-ui/icons/RoomService';
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
}));

function SideMenu() {
  const classes = useStyles();
  const w3 = useContext(W3Context);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(!w3.loading,[isConnected]);
  });

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
        <Wallet is_connected={isConnected} />
        <List>
          <ExpandableMenuItem title="Service" icon={<RoomServiceIcon />}>
            <MenuItem title="New Service" icon={<CreateOutlined />} to={ROUTES.ADD_SERVICE} />
            <MenuItem title="My Services" icon={< ViewArray />} to={ROUTES.VIEW_SERVICE} />
          </ExpandableMenuItem>
          <ExpandableMenuItem title="Intermediation" icon={<StreetviewIcon />}>
            <MenuItem title="New Intermediation" icon={<CreateOutlined />} to={ROUTES.ADD_INTERMEDIATION} />
            <MenuItem title="My Intermediations" icon={<ViewArray />} to={ROUTES.VIEW_INTERMEDIATION} />
          </ExpandableMenuItem>
          <ExpandableMenuItem title="Subscription" icon={<TouchAppIcon />}>
            <MenuItem title="New Subscription" icon={<CreateOutlined />} to={ROUTES.ADD_SUBSCRIPTION} />
            <MenuItem title="My Subscriptions" icon={<ViewArray />} to={ROUTES.VIEW_SUBSCRIPTION} />
          </ExpandableMenuItem>
        </List>
      </div>
    </Drawer>

  );
}

const Wallet = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.wallet}>
      <Typography variant="h6">Wallet</Typography>

      <div className={classes.data}>
        <Typography color="textSecondary">
          {props.isConnected? "Connected":"Not Connected" }
        </Typography>
        <Typography color="textSecondary">
          Accounts: 10
        </Typography>
        <Typography color="textSecondary">
          Balance: 0.5 Eth
        </Typography>
      </div>

      <Button size="small">See More</Button>
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