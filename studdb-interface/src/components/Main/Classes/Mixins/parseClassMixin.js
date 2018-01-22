export default {
  methods: {
    // Trims the student object of unnecessary data
    parseClassToSend(tempClass) {
      // Copying the student object
      const classToSend = JSON.parse(JSON.stringify(tempClass));

      // Map the pupils (the server only cares about the ids)
      classToSend.pupils = classToSend.pupils.map(element => element.id);

      classToSend.professors = classToSend.professors.map(el => el.id);

      delete classToSend.altname;
      delete classToSend.name;

      return classToSend;
    },
  },
};
