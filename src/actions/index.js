import { createAction } from 'redux-actions';
// import { uniqueId } from 'lodash';
import axios from 'axios';
import routes from '../routes';

export const showAlert = createAction('NOTIFICATION_SHOW');
export const closeAlert = createAction('NOTIFICATION_CLOSE');

export const sendMessageRequest = createAction('MESSAGE_SEND_REQUEST');
export const sendMessageSuccess = createAction('MESSAGE_SEND_SUCCESS');
export const sendMessageFailure = createAction('MESSAGE_SEND_FAILURE');

export const sendMessage = (message, userName, currentChannelId) => async (dispatch) => {
  dispatch(sendMessageRequest());
  try {
    const data = {
      data: {
        attributes: {
          message,
          userName,
          date: new Date(),
        },
      },
    };

    await axios.post(routes.postMessageUrl(currentChannelId), data);
  } catch (e) {
    dispatch(sendMessageFailure());
    dispatch(showAlert({
      alertProperty: {
        title: 'Message wasn\'t sent.',
        variant: 'danger',
        description: `Reason: ${e.message}. Try again later!`,
      },
    }));
  }
};
//   { id: generalChannelId, name: 'general', removable: false },
export const changeChannelId = createAction('CHANNEL_ID_CHANGE');

export const addChannelRequest = createAction('CHANNEL_ADD_REQUEST');
export const addChannelSuccess = createAction('CHANNEL_ADD_SUCCESS');
export const addChannelFailure = createAction('CHANNEL_ADD_FAILURE');

export const addChannel = name => async (dispatch) => {
  dispatch(addChannelRequest());
  const data = {
    data: {
      attributes: {
        name,
      },
    },
  };
  await axios.post(routes.channels(), data)
    .then(() => {
      dispatch(showAlert({ alertProperty: { title: 'Channel added!', variant: 'success' } }));
    }).catch((e) => {
      dispatch(addChannelFailure());
      dispatch(showAlert({
        alertProperty: {
          title: 'Channel wasn\'t added',
          description: `Reason: ${e.message}. Try again later`,
          variant: 'danger',
        },
      }));
    });
};

export const renameChannelRequest = createAction('CHANNEL_RENAME_REQUEST');
export const renameChannelSuccess = createAction('CHANNEL_RENAME_SUCCESS');
export const renameChannelFailure = createAction('CHANNEL_RENAME_FAILURE');

export const renameChannel = (name, id) => async (dispatch) => {
  dispatch(renameChannelRequest());
  const data = {
    data: {
      attributes: {
        name,
      },
    },
  };

  await axios.patch(routes.theChannelUrl(id), data)
    .then(() => {
      dispatch(showAlert({
        alertProperty: {
          title: 'Channel name was changed!',
          variant: 'success',
          description: `New channel name is '${name}'`,
        },
      }));
    })
    .catch((e) => {
      dispatch(renameChannelFailure());
      dispatch(showAlert({
        alertProperty: {
          title: 'Channel wasn\'t renamed',
          variant: 'danger',
          description: `Reason: ${e.message}. Try again later`,
        },
      }));
    });
};

export const removeChannelRequest = createAction('CHANNEL_REMOVE_REQUEST');
export const removeChannelSuccess = createAction('CHANNEL_REMOVE_SUCCESS');
export const removeChannelFailure = createAction('CHANNEL_REMOVE_FAILURE');

export const removeChannel = id => async (dispatch) => {
  dispatch(removeChannelRequest());
  axios.delete(routes.theChannelUrl(id))
    .then(() => {
      dispatch(showAlert({
        alertProperty: {
          title: 'Channel removed!',
          variant: 'success',
        },
      }));
    })
    .catch((e) => {
      dispatch(removeChannelFailure());
      dispatch(showAlert({
        alertProperty: {
          title: 'Channel wasn\'t removed!',
          variant: 'danger',
          description: `Reason: ${e.message}. Try again later!`,
        },
      }));
    });
};
