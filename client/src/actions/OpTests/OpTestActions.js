import config from '../../config';
import repository from '../../repository';
import { LogoutCurrentUser } from '../UserActions';
import { FETCH_TESTS_SUCCESS, FETCH_TESTS_FAIL } from '../AdminTestActions';

export const FetchPublicTests = () => dispatch => {
    let url = config.instance.getAdminApiUrl() + 'getAllTests';
    repository.getData(url)
        .then((res) => {
            dispatch({
                type: FETCH_TESTS_SUCCESS,
                payload: res.data
            });
        })
        .catch((err) => {
            if(err.data && err.data.message === 'Invalid token.') {
                dispatch(LogoutCurrentUser());
            }
            else {
                dispatch({
                    type: FETCH_TESTS_FAIL,
                    payload: err.statusText
                });
            }
        });
}

export const FetchMyTests = () => dispatch => {
    let url = config.instance.getAdminApiUrl() + 'getMyTests';
    repository.getData(url)
        .then((res) => {
            dispatch({
                type: FETCH_TESTS_SUCCESS,
                payload: res.data
            });
        })
        .catch((err) => {
            if(err.data && err.data.message === 'Invalid token.') {
                dispatch(LogoutCurrentUser());
            }
            else {
                dispatch({
                    type: FETCH_TESTS_FAIL,
                    payload: err.statusText
                });
            }
        });
}

export const SendBulkInvites = (model) => dispatch => {
    return new Promise((resolve, reject) => {

        let url = config.instance.getCandidateApiUrl() + 'sendInvite';
    
        repository.updateData(url, model)
            .then((res) => {
                // dispatch({
                //     type: TEST_PUBLISHED,
                //     payload: res.data
                // });
                resolve();
            })
            .catch((err) => {
                // dispatch({
                //     type: PUBLISH_TEST_FAIL,
                //     payload: err
                // });
                reject('Error while publishing. Please retry after some time: ' + err);
            });
    
    })
}