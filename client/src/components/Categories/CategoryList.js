import React from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { CardHeader, CardContent, IconButton } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ListIcon from '@material-ui/icons/ViewHeadline';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField'
import Collapse from '@material-ui/core/Collapse';

const CategoryList = (props) => {
        console.log(props);
        return (
            <Card style={{padding: "4%"}}>
                <CardHeader 
                    avatar={
                        <Avatar aria-label="Recipe" style={styles.avatar}>
                            <ListIcon />
                        </Avatar>
                    }    
                    action={
                        // !props.searchEnabled && 
                        <IconButton onClick={() => props.onSearchEnable()}>
                            {!props.searchEnabled && <SearchIcon />}
                            {props.searchEnabled && <CloseIcon />}
                        </IconButton>
                    }            
                    title={`Categories ${props.categories ? "("+props.categories.length+")" : "" }`}>
                </CardHeader>
                <CardContent>
                    {
                        <Collapse in={props.searchEnabled}>
                        <FormControl variant="outlined" style={styles.formControl}>
                            <TextField
                                id="outlined-name"
                                label="Search"
                                placeholder="Enter search text here"
                                value={props.searchTerm}
                                onChange={(e) => props.onSearchCategory(e.target.value)}
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>
                        </Collapse>
                    }
                    <List dense={true}>
                        {props.categories && props.categories.length > 0
                        && props.categories.map((item, index) => {
                            return(
                            <ListItem key={index}
                                divider={true}
                                button={true} onClick={ () => props.onCategorySelect(item) }
                            >
                            <ListItemText
                                primary={item.title}
                                secondary={item.description}
                                />
                            </ListItem>)
                        })}
                        
                    </List>
                {(!props.categories || props.categories.length === 0) &&
                <Typography variant="h6" align="center">
                    There are currently no categories added
                </Typography>}
                </CardContent>
            </Card>
        );
}

export default CategoryList;

const styles = {
    avatar: {
        backgroundColor: '#555'
    },
    formControl: {
        width: '70%'
    }
}