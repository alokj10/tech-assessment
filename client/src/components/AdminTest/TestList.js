import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { PersonAdd } from '@material-ui/icons';
import LoadingComponent from '../lib/LoadingComponent';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CanSendInvite } from '../../common/HelperFunctions';

const TestList = (props) => {
    let { tests } = props;
    return (
        <div>
        {!tests && <LoadingComponent /> }
        {tests && tests.length === 0 && <Typography align="center" variant="subtitle1">No Tests Found </Typography> }
        {tests && tests.length > 0 && 
        <Table>
            <TableHead>
            <TableRow>
                <CustomTableCell>Test</CustomTableCell>
                <CustomTableCell align="left">Status</CustomTableCell>
                <CustomTableCell align="left">Created On</CustomTableCell>
                <CustomTableCell align="left">Author</CustomTableCell>
                <CustomTableCell align="right"></CustomTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {tests.map((test, index) => (
                <TableRow key={index}>
                <CustomTableCell component="th" scope="row">
                    <Link to={ {pathname: "/testConsole", state: { testId: test.id } }}>
                        {test.test_meta.testName}
                    </Link>
                </CustomTableCell>
                <CustomTableCell align="left"><Typography variant="subtitle2" >{test.test_meta.status.toUpperCase()}</Typography></CustomTableCell>
                <CustomTableCell align="left">{test.test_meta.createdOn}</CustomTableCell>
                <CustomTableCell align="left">{test.user_meta.name}</CustomTableCell>
                <CustomTableCell align="right" scope="row" component="th">
                    {CanSendInvite(test.test_meta.status) &&
                    <Link to={ {pathname: "/inviteConsole", state: { testId: test.id } }}>
                        <PersonAdd />
                    </Link>
                    }
                </CustomTableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        }
        </div>
    );
}
const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);
export default TestList;