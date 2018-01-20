<template>
  <div class="container vs-main-con">
    <!-- Alert -->
    <div v-if="isError || isWarning" class="alert alert-danger">{{ alertMessage }}</div>
    <div v-if="!isError">
      <div class="row">
        <h1 class="card-heading">Student:</h1>
      </div>
      <div class="row">
        <div class="col prof-image-con">
          <img v-if="!isMale" src="static/images/placeholder_female.jpg" alt="">
          <img v-else src="static/images/placeholder_male.jpg" alt="">
        </div>
        <div class="col vs-text-con">
          <div>
            <table>
              <tr>
                <td style="padding-right: 80px;" class="vs-table-info">
                  <p>Name:</p>
                </td>
                <td>
                  <div class="mb-1 col-sm-10 form-group">
                    <input :class="{'is-invalid': student.name === ''}" id="nameInput" v-model="student.name" class="form-control" :placeholder="oldStudent.name"
                      type="text">
                  </div>
                </td>
              </tr>
              <tr>
                <td class="vs-table-info">
                  <p>Surname: </p>
                </td>
                <td>
                  <div class="mb-1 col-sm-10">
                    <input :class="{'is-invalid': student.surname === ''}" v-model="student.surname" class="form-control" :placeholder="oldStudent.surname"
                      type="text">
                  </div>
                </td>
              </tr>
              <tr>
                <td class="vs-table-info">
                  <p>ID:</p>
                </td>
                <td>
                  <p class="vs-gray-info">
                    <span>{{ oldStudent['id'] }}</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td class="vs-table-info">
                  <p>Start:</p>
                </td>
                <td>
                  <div class="mb-1 col-sm-10">
                    <input v-model="student.start" class="form-control" :placeholder="oldStudent.start" type="number">
                  </div>
                </td>
              </tr>
              <tr>
                <td class="vs-table-info">
                  <p>Class ID:</p>
                </td>
                <td>
                  <div class="mb-1 col-sm-10">
                    <input v-model="student.class.id" :placeholder="oldStudent.class.id" class="form-control" type="number">
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <hr>

      <div class="row">
        <div style="margin-left: 20px;" class="col">
          <p class="view-rel-headline">Info</p>
          <table style="margin-left: 20px;">
            <!-- Email -->
            <tr>
              <td style="padding-right: 20px;" class="vs-table-info">
                <p>
                  <i class="fa fa-envelope" aria-hidden="true"></i>
                </p>
              </td>
              <td>
                <div class="mb-1 col-sm-12">
                  <input v-model="student.email" class="form-control" :placeholder="oldStudent.email" type="text">
                </div>
              </td>
            </tr>
            <!-- Phone -->
            <tr>
              <td class="vs-table-info">
                <p>
                  <i class="fa fa-phone" aria-hidden="true"></i>
                </p>
              </td>
              <td>
                <div class="mb-1 col-sm-12">
                  <input v-model="student.phone" class="form-control" :placeholder="oldStudent.phone" type="text">
                </div>
              </td>
            </tr>
            <!-- Adress -->
            <tr>
              <td class="vs-table-info">
                <p>
                  <i class="fa fa-home" aria-hidden="true"></i>
                </p>
              </td>
              <td>
                <div class="mb-1 col-sm-12">
                  <input v-model="student.adress" class="form-control" :placeholder="oldStudent.adress" type="text">
                </div>
              </td>
            </tr>
            <!-- Birthday -->
            <tr>
              <td class="vs-table-info">
                <p class="no-bottom-margin">
                  <i class="fa fa-birthday-cake" aria-hidden="true"></i>
                </p>
              </td>
              <td>
                <div class="mb-1 col-sm-12">
                  <input :class="{'is-invalid': student.birth === ''}" v-model="student.birth" class="form-control" :placeholder="oldStudent.birth"
                    type="date">
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Parents -->
        <div class="col main-parent-con">
          <div>
            <p class="view-rel-headline">Parents</p>
            <div class="parents-con">

              <!-- Adding Parent -->
              <div id="addParentDiv" class="col-sm-6">
                <input id="newParentIdInput" v-model="newParentID" class="form-control" placeholder="Parent ID" type="number">
                <p id="add-parent-button">
                  <i @click="addParent" class="fa fa-plus-circle" aria-hidden="true"></i>
                </p>
              </div>

              <br>

              <!-- Listing parents -->
              <div style="padding: 0px;" v-for="parent in student.parents" :key="parent.id">
                <a class="relative-ref custom-button" href="#">{{ parent['wholeName']}}</a>
                <i @click="removeParent(parent.id)" class="delete fa fa-times" aria-hidden="true"></i>
                <br>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="row manipulate-buttons-con">
        <div id="cancel-button-wrapper">
          <button @click="goBack" id="cancelEdit" class="btn btn-outline-secondary">Cancel</button>
        </div>
        <button @click="saveTheEdit" id="updateStudent" class="btn btn-outline-primary">Save</button>
        <button @click="deleteStudent" id="deleteStudent" class="btn btn-outline-danger">
          Delete
        </button>
      </div>

    </div>

  </div>
</template>

<script>
  import isMale from '@/assets/js/isMaleMixin';
  import { setPermanentAlert, setTimeoutAlert } from '@/assets/js/Mixins/cardErrorMixins';
  import {
    logError, serverErrorRedirect
  } from '@/assets/js/errors';
  import {
    api_server
  } from '@/assets/js/config';
  import {
    deleteEntry,
    fetchSingle
  } from '@/assets/js/comunication';

  export default {
    mixins: [isMale, setPermanentAlert, setTimeoutAlert],
    data() {
      return {
        newParentID: '',
        student: {
          id: '',
          'class': {
            id: ''
          }
        },
        oldStudent: {
          id: '',
          'class': {
            id: ''
          }
        },
        alertMessage: '',
      };
    },
    watch: {
      '$route.params.id': function (val) {
        this.student = {
          'class': {}
        };
        this.fetchAndSetStudent(val);
      }
    },
    methods: {
      checkRegexAndSetError() {
        const phoneReg =  /^\+([0-9]{3})\x20([0-9]{3})\x20([0-9]{3})\x20([0-9]{3})$/;
        const emailReg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (this.student.email !== '' && !emailReg.test(this.student.email)) {
          this.setTimoutError('Invalid email format! Example: jondoe@gmail.com');
          return false;
        } else if (this.student.phone !== '' && !phoneReg.test(this.student.phone)) {
          this.setTimoutError('Invalid phone number format! Example: +421 512 451 541');
          return false;
        }
        return true;
      },
      checkRequiredAndSetError() {
        if (
          this.student.name !== '' &&
          this.student.surname !== '' &&
          this.student.birth !== ''
        ) {
          return true;
        } else {
          return false;
          this.setTimoutError('Please fill in all required fields.');
        }
      },
      // Trims the student object of unnecessary data
      parseStudentToSend(student) {
        // Copying the student object
        const studentToSend = JSON.parse(JSON.stringify(student));

        // Map the parents (the server only cares about the ids)
        studentToSend.parents = studentToSend.parents.map(element => element.id);

        // The server doesn't care about classnames either
        delete studentToSend.class.altname;
        delete studentToSend.class.name

        return studentToSend
      },
      async saveTheEdit() {
        // Do the error checking
        if (this.checkRequiredAndSetError() && this.checkRegexAndSetError()) {
          let studentToSend = this.parseStudentToSend(this.student);

          // Try to reach out to the server
          let response
          try {
            response = await this.commitTheUpdateToServer('student', studentToSend, this.$store.getters.user.api_key);
          } catch (error) {
            serverErrorRedirect();
            return;
          }

          // Check if everything went smoothly on the backend, else display error
          if (response.data.success) {
            this.$router.push({
              name: 'studentView',
              params: {
                id: studentToSend.id
              }
            });
          } else {
            this.setTimoutError(response.data.message);
          }
        }
      },
      // Delete student from the database
      async deleteStudent() {
        // Reaching out to the server
        let response = await deleteEntry('student', this.student.id, this.$store.getters.user.api_key);
        if (response) {
          // Checking if everything went smootly on the backend
          if (response.success) {
            this.$router.push({
              name: 'studentsList'
            });
          // If the token has expired show the expired error
          } else if ('expired' in response.message) {
            this.setTimoutError('Your token has expired please logout and then login again.');
          }

        } else {
          serverErrorRedirect();
        }
      },
      goBack() {
        this.$router.push({
          name: 'studentView',
          params: {
            id: this.$route.params.id
          }
        });
      },
      removeParent(id) {
        this.student.parents = this.student.parents.filter(item => {
          return item.id !== id;
        })
      },
      async addParent() {
        // Check if the field isn't empty
        if (this.newParentID.length > 0) {
          // Fetch the parrent
          const response = await fetchSingle('parent', this.newParentID);
          if (response) {
            if (response.success) {
              this.student.parents.unshift({
                  id: response.parent.id,
                  wholeName: `${response.parent.name} ${response.parent.surname}`,
                });
            } else {
              this.setTimoutError(response.message)
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
      // Parses the data from the API and save the student
      setStudent(data) {
        if (data.success) {
          // Save the student
          this.oldStudent = JSON.parse(JSON.stringify(data.student));
          this.student = JSON.parse(JSON.stringify(data.student));

          // Set the alert message to none in case there was one there before
          this.alertMessage = '';
          document.title = `Edit | ${data.student.name} ${data.student.surname}`;
        } else {
          this.setPermanentAlert(data.message);
        }
      },

      // Fetches the student
      async fetchAndSetStudent(id) {
        const response = await fetchSingle('student', id);

        if (response) {
          this.setStudent(response);
        } else {
          serverErrorRedirect();
        }
      }
    },
    computed: {
      // Return the logged-in user
      user() {
        return this.$store.getters.user
      },

      // Boolean if the student object id empty
      isStudentEmpty() {
        return Object.keys(this.student).length <= 1;
      },

      // If the alert message is specified but the student is loaded
      isWarning() {
        return this.alertMessage !== undefined && this.alertMessage.length > 0;
      },

      // If the alertMessage is specified and there's no student loaded
      isError() {
        return this.isStudentEmpty && this.alertMessage.length > 0;
      }
    },

    beforeRouteEnter: async(to, from, next) => {
      // Fetches the student data before entering the route and setting the title
      // Feels much faster this way instead of calling the fetchStudent method from inside the vm in the next()
      let response = await fetchSingle('student', to.params.id);

      if (response) {
        // Set the title to the students name if the fetch was successful
        if (response.success) {
          document.title = `Edit | ${response.student.name} ${response.student.surname}`;
        }
        next(vm => {
          vm.setStudent(response);
        });
      } else {
        serverErrorRedirect();
      }
    }
  }

</script>

<style lang="scss" scoped>
</style>
