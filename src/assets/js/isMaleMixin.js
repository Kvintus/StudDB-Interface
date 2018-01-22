export default {
  methods: {
    isMale(what) {
      if ('surname' in this[what] && this[what].surname !== undefined) {
        const lastThreeChars = this[what].surname.slice(-3);
        return !(lastThreeChars === 'ova' || lastThreeChars === 'ová');
      }
      return false;
    },
  },
};
