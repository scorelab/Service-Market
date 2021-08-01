import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Select,
  FormLabel,
  FormControlLabel,
  OutlinedInput,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
  Input,
  Chip,
  MenuItem,
  IconButton,
} from '@material-ui/core';

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});


export default function SubscriptionList(props) {
    const classes = useStyles();
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell>Service Name</TableCell>
                        <TableCell align="right">Intermediary</TableCell>
                        <TableCell align="right">Start Date</TableCell>
                        <TableCell align="right">End Date</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.subList.map((row,i) => (
                        <TableRow key={i}>
                            <TableCell>{row.serviceName}</TableCell>
                            <TableCell align="right">{row.intermediaryName}</TableCell>
                            <TableCell align="right">{row.startDate && moment(row.startDate).format("DD MMMM YYYY")}</TableCell>
                            <TableCell align="right">{row.endDate && moment(row.endDate).format("DD MMMM YYYY")}</TableCell>
                            <TableCell align="right">{row.status}</TableCell>
                            <TableCell align="right">{row.value}</TableCell>
                            <TableCell align="right">
                                <ButtonGroup variant="text" color="primary" size="large" aria-label="text primary button group">
                                    <Button><VisibilityIcon /></Button>
                                    <Button><DeleteIcon /></Button>
                                </ButtonGroup>
                            </TableCell>
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell colSpan={4} />
                        <TableCell colSpan={1}>Total</TableCell>
                        <TableCell align="right">{props.subList.reduce((sum, item) => sum + item.value,0)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export { SubscriptionList };
