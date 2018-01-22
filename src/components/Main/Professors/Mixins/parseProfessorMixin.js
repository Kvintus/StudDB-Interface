export default {
  methods: {
    // Trims the professor object of unnecessary data
    parseProfessorToSend(professor) {
      // Copying the student object
      const professorToSend = JSON.parse(JSON.stringify(professor));

      // Map the professor (the server only cares about the ids)
      professorToSend.classes = professorToSend.classes.map(element => element.id);

      return professorToSend;
    },
  },
};
