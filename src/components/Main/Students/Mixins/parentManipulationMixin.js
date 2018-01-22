import {
    serverErrorRedirect,
  } from '@/assets/js/errors';
  import {
    fetchSingle,
  } from '@/assets/js/comunication';

export default {
    methods: {
        async addParent() {
            // Check if the field isn't empty
            if (this.newParentID.length > 0) {
              // Fetch the parrent
              const response = await fetchSingle('parent', this.newParentID);
              if (response) {
                if (response.success) {
                  this.student.parents.unshift(
                    {
                      id: response.parent.id,
                      wholeName: `${response.parent.name} ${response.parent.surname}`,
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
            this.newParentID = '';
          },
          // Removes the parent from the parent list
          removeParent(id) {
            this.student.parents = this.student.parents.filter((item) => item.id !== id);
          },
    },
};
