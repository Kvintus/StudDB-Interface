export default {
  methods: {
    checkRequiredAndSetError() {
      if (
        (this.rclass.letter !== '' && this.rclass.letter !== undefined) &&
        (this.rclass.room !== '' && this.rclass.room !== undefined) &&
        (this.rclass.start !== '' && this.rclass.start !== undefined)
      ) {
        return true;
      }
      this.setTimoutError('Please fill in all required fields.');
      return false;
    },
  },
};
