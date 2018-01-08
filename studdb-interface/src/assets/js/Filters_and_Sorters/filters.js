/*
    All these functions return another functions which will be the ones run in the filter method
*/

export default {
    // Returns an object with the id that was passed to the main function in the 'value'
    filterById(value) {
        return student => value === '' || student.id == value;
    },
    // Returns objects whose names start with the name specified in the 'value'
    filterByName(value) {
        return student => value === '' || student.name.toUpperCase().indexOf(value.toUpperCase()) === 0;
    },
    // Returns objects whose surnames start with the name specified in the 'value'
    filterBySurname(value) {
        return student => value === '' || student.surname.toUpperCase().indexOf(value.toUpperCase()) === 0;
    },
};
