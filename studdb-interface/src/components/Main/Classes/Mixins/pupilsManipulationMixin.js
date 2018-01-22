import {
  serverErrorRedirect,
} from '@/assets/js/errors';
import {
  fetchSingle,
} from '@/assets/js/comunication';

export default {
  methods: {
    async addPupil() {
      // Check if the field isn't empty
      if (this.newPupilID.length > 0) {
        // Fetch the student
        const response = await fetchSingle('student', this.newPupilID);
        if (response) {
          if (response.success) {
            console.log(response);
            this.rclass.pupils.unshift({
              id: response.student.id,
              name: response.student.name,
              surname: response.student.surname,
            });
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
    removePupil(id) {
      this.rclass.pupils = this.rclass.pupils.filter(item => item.id !== id);
    },
  },
};
