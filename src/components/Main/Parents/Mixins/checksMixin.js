export default {
  methods: {
    checkRegexAndSetError() {
      const phoneReg = /^\+([0-9]{3})\x20([0-9]{3})\x20([0-9]{3})\x20([0-9]{3})$/;
      const emailReg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      if (this.parent.email !== '' && this.parent.email !== null && this.parent.email !== undefined && !emailReg.test(this.parent.email)) {
        this.setTimoutError('Invalid email format! Example: jondoe@gmail.com');
        return false;
      } else if (this.parent.phone !== '' && this.parent.phone !== null && this.parent.phone !== undefined && !phoneReg.test(this.parent.phone)) {
        this.setTimoutError('Invalid phone number format! Example: +421 512 451 541');
        return false;
      }
      return true;
    },
    checkRequiredAndSetError() {
      if (
        (this.parent.name !== '' && this.parent.name !== undefined) &&
        (this.parent.surname !== '' && this.parent.surname !== undefined) &&
        (this.parent.phone !== '' && this.parent.phone !== undefined) &&
        (this.parent.email !== '' && this.parent.email !== undefined)
      ) {
        return true;
      }
      this.setTimoutError('Please fill in all required fields.');
      return false;
    },
  },
};
