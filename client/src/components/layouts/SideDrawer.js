import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Dashboard, Book, Assessment, ViewQuilt, PermIdentity, Polymer, Airplay,
    SupervisorAccount, Work, LocalLibrary, Home, BusinessCenter, Category,
    LibraryBooks  } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom'
import AuthHelper from '../../AuthHelper';
import { Avatar } from '@material-ui/core';

const MenuItems = [
    { routeName: 'dashboard', routeCaption: 'Dashboard', icon: Home, app: 'TeachAssesment' },
    { routeName: 'mcqs', routeCaption: 'Library', icon: LibraryBooks, app: 'TeachAssesment' },
    { routeName: 'tests', routeCaption: 'Tests', icon: Assessment, app: 'TeachAssesment' },
    { routeName: 'invitations', routeCaption: 'Invitations', icon: SupervisorAccount, app: 'TeachAssesment' },
    { routeName: 'categories', routeCaption: 'Categories', icon: Category, app: 'TeachAssesment' },
    { routeName: 'skills', routeCaption: 'Skills', icon: Polymer, app: 'TeachAssesment' },
    { routeName: 'grades', routeCaption: 'Grades', icon: LocalLibrary, app: 'TeachAssesment' },
    { routeName: 'orgs', routeCaption: 'Organizations', icon: BusinessCenter, app: 'TeachAssesment' },
    { routeName: 'users', routeCaption: 'Users', icon: PermIdentity, app: 'TeachAssesment' },
];

const getIcon = (menuItem) => {
    /*if(menuItem.routeName === 'skills') {
        return (
            <Avatar>S</Avatar>
        )
    }*/
    let icon = menuItem.icon;
    return (
        React.createElement(icon)
    )
}

const SideDrawer = (props) => {
    const { classes, openState, theme } = props;
    return (
            <Drawer
            variant="permanent"
            className={classNames(classes.drawer, {
            [classes.drawerOpen]: openState,
            [classes.drawerClose]: !openState,
            })}
            classes={{
            paper: classNames({
                [classes.drawerOpen]: openState,
                [classes.drawerClose]: !openState,
            }),
            }}
            open={openState}
            >
            <div className={classes.toolbar}>
            <IconButton onClick={() => props.onDrawerClose()}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            </div>
            <Divider />
            <List>
            {MenuItems.map((menuItem, index) => (
                <div key={index}>
                    {AuthHelper.isLoggedIn() && menuItem.routeName !== 'login' &&
                    <Link to={"/" + menuItem.routeName} key={index}>
                        <ListItem button key={menuItem.routeCaption}>
                            {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                            <ListItemIcon title={menuItem.routeCaption}>{getIcon(menuItem)}</ListItemIcon>
                            <ListItemText style={{textDecoration: 'none'}} primary={menuItem.routeCaption} />
                        </ListItem>
                    </Link>
                    }
                    {!AuthHelper.isLoggedIn() && menuItem.routeName === 'login' &&
                    <Link to={"/" + menuItem.routeName} key={index}>
                        <ListItem button key={menuItem.routeCaption}>
                            <ListItemIcon title={menuItem.routeCaption}>{getIcon(menuItem)}</ListItemIcon>
                            <ListItemText style={{textDecoration: 'none'}} primary={menuItem.routeCaption} />
                        </ListItem>
                    </Link>
                    }
                    {menuItem.app === 'Hitech' &&
                    <Link to={"/" + menuItem.routeName} key={index}>
                        <ListItem button key={menuItem.routeCaption}>
                            <ListItemIcon title={menuItem.routeCaption}>{getIcon(menuItem)}</ListItemIcon>
                            <ListItemText style={{textDecoration: 'none'}} primary={menuItem.routeCaption} />
                        </ListItem>
                    </Link>}
            </div>
            ))}
            </List>
            </Drawer>
                );
}
export default SideDrawer;