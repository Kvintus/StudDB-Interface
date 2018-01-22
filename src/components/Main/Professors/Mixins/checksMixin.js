export default {
  methods: {
    checkRegexAndSetError() {
      const phoneReg = /^\+([0-9]{3})\x20([0-9]{3})\x20([0-9]{3})\x20([0-9]{3})$/;
      const emailReg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      if (this.professor.email !== '' && this.professor.email !== null && this.professor.email !== undefined && !emailReg.test(this.professor.email)) {
        this.setTimoutError('Invalid email format! Example: jondoe@gmail.com');
        return false;
      } else if (this.professor.phone !== '' && this.professor.phone !== null && this.professor.phone !== undefined && !phoneReg.test(this.professor.phone)) {
        this.setTimoutError('Invalid phone number format! Example: +421 512 451 541');
        return false;
      }
      return true;
    },
    checkRequiredAndSetError() {
      if (
        (this.professor.name !== '' && this.professor.name !== undefined) &&
        (this.professor.surname !== '' && this.professor.surname !== undefined) &&
        (this.professor.phone !== '' && this.professor.phone !== undefined) &&
        (this.professor.email !== '' && this.professor.email !== undefined)
      ) {
        return true;
      }
      this.setTimoutError('Please fill in all required fields.');
      return false;
    },
  },
};
