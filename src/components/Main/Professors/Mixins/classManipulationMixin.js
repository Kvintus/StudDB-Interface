import {
    serverErrorRedirect,
  } from '@/assets/js/errors';
  import {
    fetchSingle,
  } from '@/assets/js/comunication';

export default {
    methods: {
        async addClass() {
            // Check if the field isn't empty
            if (this.newClassID.length > 0) {
              // Fetch the parrent
              const response = await fetchSingle('class', this.newClassID);
              if (response) {
                if (response.success) {
                  this.professor.classes.unshift(
                      response.rclass,
                    );
                } else {
                  this.setTimoutError(response.message);
                }
              } else {
                serverErrorRedirect();
              }
            } else {
              this.setTimoutError('The ID field cannot be empty!!!');
            }
            // Clear the field
            this.newClassID = '';
          },
          // Removes the parent from the parent list
          removeClass(id) {
            this.professor.classes = this.professor.classes.filter(item => item.id !== id);
          },
    },
};
