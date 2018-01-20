export default {
    methods: {
        // Sets permanent alert
      setPermanentAlert(message) {
        document.title = 'Error';
        this.alertMessage = message;
      },

      // Sets alert that timesout after 5 secs
      setTimoutError(message) {
        this.alertMessage = message;
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000);
      },
    },
};
