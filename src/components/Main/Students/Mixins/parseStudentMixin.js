export default {
  methods: {
    // Trims the student object of unnecessary data
    parseStudentToSend(student) {
      // Copying the student object
      const studentToSend = JSON.parse(JSON.stringify(student));

      // Map the parents (the server only cares about the ids)
      studentToSend.parents = studentToSend.parents.map(element => element.id);

      // The server doesn't care about classnames either
      delete studentToSend.class.altname;
      delete studentToSend.class.name;

      return studentToSend;
    },
  },
};
