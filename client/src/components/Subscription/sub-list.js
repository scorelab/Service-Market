import React, { useContext, useState } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    DialogContentText,
} from '@material-ui/core';
import { MerkleTree } from '../../util/MerkelUtil';
import { toBuffer } from 'ethereumjs-util';

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});


export default function SubscriptionList(props) {
    const classes = useStyles();
    const [intAddress, setIntAddress] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { serviceAddress, isLockCreated, subList, web3, firebase } = props;

    const handleClose = event => {
        setIsOpen(false);
        setIntAddress(null)
    };

    const handleClickOpen = async (serviceId) => {
        setIsOpen(true);
        const service = await firebase.service(serviceId).get();
        const serviceData = service.val();
        const intermediary = await firebase.intermediary(serviceData.intermediary).get();
        const intermediaryData = intermediary.val();
        setIntAddress(intermediaryData.address);
    };

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell align="right">Start Date</TableCell>
                        <TableCell align="right">End Date</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subList.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row.serviceId}</TableCell>
                            <TableCell align="right">{row.startDate && moment(row.startDate).format("DD MMMM YYYY")}</TableCell>
                            <TableCell align="right">{row.endDate && moment(row.endDate).format("DD MMMM YYYY")}</TableCell>
                            <TableCell align="right">{row.status}</TableCell>
                            <TableCell align="right">{row.value}</TableCell>
                            <TableCell align="right">
                                <Button><DeleteIcon color="primary" /></Button>
                                {isLockCreated && <Button><VisibilityIcon onClick={() => handleClickOpen(row.serviceId)} color="primary" /></Button>}
                            </TableCell>
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell colSpan={4} />
                        <TableCell colSpan={1}>Total</TableCell>
                        <TableCell align="right">{subList.reduce((sum, item) => sum + item.value, 0)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <SigDialog
                isOpen={isOpen}
                handleClose={handleClose}
                serviceAddress={serviceAddress}
                intAddress={intAddress}
                web3={web3} />
        </TableContainer>
    );
}



const SigDialog = (props) => {
    const { isOpen, handleClose, serviceAddress, intAddress, web3 } = props

    const [signVal, setSignVal] = useState("");
    const [signature, setSignature] = useState("");

    const handleSign = () => {
        const mt = new MerkleTree();
        const hashVal = mt.H(mt.concat(toBuffer('0x'+signVal.toString('hex')), toBuffer(intAddress)));
        web3.eth.personal.sign('0x' + hashVal.toString('hex'), serviceAddress, (err, result) => {
            setSignature(result.toString('hex'));
        });
    };

    const onSignVal = event => {
        setSignVal(event.target.value);
    };


    return (
        <Dialog open={isOpen} maxWidth="sm" aria-labelledby="form-dialog-title" >
            <DialogTitle id="dialog">Sign for {intAddress}</DialogTitle>
            <DialogContent dividers={true}>
                <TextField
                    fullWidth
                    id="value"
                    label="Value"
                    defaultValue={signVal}
                    onChange={onSignVal}
                    type="number"
                    variant="outlined"
                />
                {signature &&
                    <DialogContentText
                        id="signature"
                        tabIndex={-1}
                    >Signature: {signature}
                    </DialogContentText>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSign} color="primary">
                    Sign
                </Button>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export { SubscriptionList };
