export default {
  methods: {
    checkRegexAndSetError() {
      const phoneReg = /^\+([0-9]{3})\x20([0-9]{3})\x20([0-9]{3})\x20([0-9]{3})$/;
      const emailReg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      if (this.student.email !== '' && this.student.email !== null && this.student.email !== undefined && !emailReg.test(this.student.email)) {
        this.setTimoutError('Invalid email format! Example: jondoe@gmail.com');
        return false;
      } else if (this.student.phone !== '' && this.student.phone !== null && this.student.phone !== undefined && !phoneReg.test(this.student.phone)) {
        this.setTimoutError('Invalid phone number format! Example: +421 512 451 541');
        return false;
      }
      return true;
    },
    checkRequiredAndSetError() {
      if (
        (this.student.name !== '' && this.student.name !== undefined) &&
        (this.student.surname !== '' && this.student.surname !== undefined) &&
        (this.student.birth !== '' && this.student.birth !== undefined) &&
        (this.student.start !== '' && this.student.start !== undefined)
      ) {
        return true;
      }
      this.setTimoutError('Please fill in all required fields.');
      return false;
    },
  },
};
