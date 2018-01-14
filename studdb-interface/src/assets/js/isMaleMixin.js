export default {
  computed: {
    isMale() {
      if ('surname' in this.student) {
        const lastThreeChars = this.student.surname.slice(-3);
        return !(lastThreeChars === 'ova' || lastThreeChars === 'ová');
      }
      return false;
    },
  },
};
