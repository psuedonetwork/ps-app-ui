import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { TVChartContainer } from '../../components/molecules/TVChartContainer/index';

// Redux Components
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NavFrame from "../../components/organisms/navigation/MainNavigationFrame"; // The top navigation bar and side navigation panel

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));


const CryptoDetail = (props) => {
    const classes = useStyles();
  
    return (
      <NavFrame page={"CryptoDetail"}>
          <TVChartContainer />
      </NavFrame>
    );
  }
// Component Properties
CryptoDetail.propTypes = {}

// Component State
function CryptoDetailState(state) {
  return {
  }
}
export default connect(CryptoDetailState)(CryptoDetail);