import {
    serverErrorRedirect,
  } from '@/assets/js/errors';
  import {
    fetchSingle,
  } from '@/assets/js/comunication';

export default {
    methods: {
        async addChild() {
            // Check if the field isn't empty
            if (this.newChildID.length > 0) {
              // Fetch the parrent
              const response = await fetchSingle('student', this.newChildID);
              if (response) {
                if (response.success) {
                  this.parent.children.unshift(
                    {
                      id: response.student.id,
                      wholeName: `${response.student.name} ${response.student.surname}`,
                    },
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
            this.newChildID = '';
          },
          // Removes the parent from the parent list
          removeChild(id) {
            this.parent.children = this.parent.children.filter(item => item.id !== id);
          },
    },
};
