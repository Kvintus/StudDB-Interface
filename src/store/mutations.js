// Sets user from the payload (Loggs him in)
export const setUser = (state, payload) => {
    state.user = Object.assign({}, payload);
};

// Logs user out from the vuex session
export const LOG_USER_OUT = (state) => {
    state.user = {};
};

export const clearList = (state, which) => {
    state[which] = [];
};

// Saves the students from the passed-in payload into the global storage
export const SET_STUDENTS = (state, payload) => {
    state.students = payload.slice();
};

// Saves the parents from the passed-in payload into the global storage
export const SET_PARENTS = (state, payload) => {
    state.parents = payload.slice();
};

// Saves the parents from the passed-in payload into the global storage
export const SET_PROFESSORS = (state, payload) => {
    state.professors = payload.slice();
};

// Saves the classes from the passed-in payload into the global storage
export const SET_CLASSES = (state, payload) => {
    state.classes = payload.slice();
};
