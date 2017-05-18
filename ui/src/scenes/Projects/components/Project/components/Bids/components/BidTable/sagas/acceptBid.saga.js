import {
  takeLatest, put, call
} from 'redux-saga/effects';
import {
  ACCEPT_BID,
  acceptBidSuccess,
  acceptBidFailure
} from '../actions/acceptBid.actions';
import { browserHistory } from 'react-router';
import { API_URL, API_MOCK } from '../../../../../../../../../environment';
import { handleApiError } from '../../../../../../../../../lib/apiErrorHandler';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { setUserMessage } from '../../../../../../../../../components/UserMessage/user-message.action';

const url = API_URL + '/projects/:projectName/bids/:id';

function acceptBidCall(username, projectName, id) {

  if(API_MOCK) {
    return new Promise(function(resolve,reject){
      resolve({});
    });
  }
  else {
    const apiUrl = url.replace(':projectName', projectName).replace(':id', id);

    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username })
    })
    .then(handleApiError)
    .then(function(response) {
      return response.json();
    })
    .catch(function(error){
      throw error;
    });
  }
}

function* acceptBid(action){
  try {
    yield put(showLoading());
    yield call(acceptBidCall, action.username, action.projectName, action.id);
    yield put(hideLoading());
    yield put(acceptBidSuccess());
    yield put(setUserMessage('Bid Accepted'));
    browserHistory.goBack(); // todo: update current project data on the page instead?
  }
  catch(err) {
    yield put(acceptBidFailure(err));
  }
}

export default function* watchBidAccept() {
  yield takeLatest(ACCEPT_BID, acceptBid);
}
