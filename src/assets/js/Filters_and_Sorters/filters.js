/*
    All these functions return another functions which will be the ones run in the filter method
*/

export default {
    // Returns an object with the id that was passed to the main function in the 'value'
    filterById(value) {
        return looper => value === '' || looper.id == value;
    },
    // Returns objects whose names start with the name specified in the 'value'
    filterByProperty(value, property) {
        return looper => value === '' || looper[property].toString().toUpperCase().indexOf(value.toUpperCase()) === 0;
    },
    // Returns objects that contain the 'value' on ther 'property'
    containsByProperty(value, property) {
        return looper => value === '' || looper[property].toString().toUpperCase().indexOf(value.toUpperCase()) > -1;
    },
};
