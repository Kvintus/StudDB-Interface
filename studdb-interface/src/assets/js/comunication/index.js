import axios from 'axios';
import {
  api_server,
} from '@/assets/js/config';

// Returns the inforantion on whether the user is logged in on the server
// When return false there's been an error reaching out to the server\
export const getInformationAboutTheLogin = async (apiServer) => {
  try {
    const info = await axios({
      url: `${apiServer}/user/logged`,
      method: 'post',
      withCredentials: true, // To make sessions work
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return info.data;
  } catch (error) {
    return false;
  }
};

// Deletes a database entry based on API endpoint and ID of the entry
// In the payload should be
export const deleteEntry = async (where, id, key) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${api_server}/api/${where}`,
      data: {
        id,
      },
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': `${key}`,
      },
    });
    return response.data;
  } catch (e) {
    return false;
  }
};

export const fetchSingle = async (what, id) => {
  try {
    const response = await axios.get(`${api_server}/api/${what}`, {
      params: {
        id,
      },
    });
    return response.data;
  } catch (error) {
    return false;
  }
};

export const commitTheUpdateToServer = async (where, data, key) => axios({
    url: `${api_server}/api/${where}`,
    method: 'put',
    data,
    headers: {
      'X-API-KEY': `${key}`,
      'Content-Type': 'application/json',
    },
  });
