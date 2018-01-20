import {
  logError, serverErrorRedirect,
} from '@/assets/js/errors';
import { api_server } from '@/assets/js/config';
import axios from 'axios';


// Logs user out from the server and from the instance
export const logUserOut = (context) => {
    axios({
      url: `${api_server}/user/logout`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }).then(context.commit('LOG_USER_OUT'));
};


// Fetches students from the server
export const fetchStudents = (context, payload) => {
    let url;

    // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest -> UX ftw
    if (payload !== undefined && 'first' in payload) {
      url = `${api_server}/api/student/all?first=${payload.first}`;
    } else {
      url = `${api_server}/api/student/all`;
    }

    // Fetching the students
    axios.get(url)
    .then((resp) => {
      if (resp.data.success) {
        context.commit('SET_STUDENTS', resp.data.students);
      } else {
        logError(resp.data.message);
      }
    })
    .catch((error) => {
        apiError();
    });
};

// Fetches parents from the server
export const fetchParents = (context, payload) => {
    let url;

    // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest
    if (payload !== undefined && 'first' in payload) {
      url = `${api_server}/api/parent/all?first=${payload.first}`;
    } else {
      url = `${api_server}/api/parent/all`;
    }

    axios.get(url)
    .then((resp) => {
      if (resp.data.success) {
        context.commit('SET_PARENTS', resp.data.parents);
      } else {
        logError(resp.data.message);
      }
    })
    .catch((error) => {
      apiError();
    });
};

// Fetches all the professors from the API
export const fetchProfessors = (context, payload) => {
    let url;

    // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest
    if (payload !== undefined && 'first' in payload) {
      url = `${api_server}/api/professor/all?first=${payload.first}`;
    } else {
      url = `${api_server}/api/professor/all`;
    }

    axios.get(url)
    .then((resp) => {
      if (resp.data.success) {
        context.commit('SET_PROFESSORS', resp.data.professors);
      } else {
        logError(resp.data.message);
      }
    })
    .catch((error) => {
      apiError();
    });
};

// Fetches all the classes from the API
export const fetchClasses = (context, payload) => {
    let url;

    // This is because first I fetch just a few parents so the loading feels instant and then I fetch the rest
    if (payload !== undefined && 'first' in payload) {
      url = `${api_server}/api/class/all?first=${payload.first}`;
    } else {
      url = `${api_server}/api/class/all`;
    }

    axios.get(url)
    .then((resp) => {
      if (resp.data.success) {
        context.commit('SET_CLASSES', resp.data.classes);
      } else {
        logError(resp.data.message);
      }
    })
    .catch((error) => {
      apiError();
    });
};
