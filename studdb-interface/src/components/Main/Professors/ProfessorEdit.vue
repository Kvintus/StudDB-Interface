<template>
  <div>
    <div class="container vs-main-con">
      <!-- Alert -->
      <div v-if="isError || isWarning" class="alert alert-danger">{{ alertMessage }}</div>
      <div v-if="!isError">
        <div class="row">
          <h1 class="card-heading">Professor:</h1>
        </div>
        <div class="row">
          <div class="col prof-image-con">
            <img v-if="!isMale('professor')" src="static/images/placeholder_female.jpg" alt="">
            <img v-else src="static/images/placeholder_male.jpg" alt="">
          </div>
          <div class="col vs-text-con">
            <div>
              <table>
                <tr>
                  <td style="padding-right: 80px;" class="vs-table-info">
                    <p>Title:</p>
                  </td>
                  <td>
                    <div class="mb-1 col-sm-10 form-group">
                      <input id="titleInput" v-model="professor.title" class="form-control" :placeholder="oldProfessor.title" type="text">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-right: 80px;" class="vs-table-info">
                    <p>Name:</p>
                  </td>
                  <td>
                    <div class="mb-1 col-sm-10 form-group">
                      <input :class="{'is-invalid': professor.name === ''}" id="nameInput" v-model="professor.name" class="form-control" :placeholder="oldProfessor.name"
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
                      <input :class="{'is-invalid': professor.surname === ''}" v-model="professor.surname" class="form-control" :placeholder="oldProfessor.surname"
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
                      <span>{{ oldProfessor['id'] }}</span>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="vs-table-info">
                    <p>Location:</p>
                  </td>
                  <td>
                    <div class="mb-1 col-sm-10">
                      <input v-model="professor.loc" class="form-control" :placeholder="oldProfessor.loc" type="text">
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
                    <input :class="{'is-invalid': professor.email === ''}" v-model="professor.email" class="form-control" :placeholder="oldProfessor.email"
                      type="text">
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
                    <input :class="{'is-invalid': professor.phone === ''}" v-model="professor.phone" class="form-control" :placeholder="oldProfessor.phone"
                      type="text">
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
                    <input v-model="professor.adress" class="form-control" :placeholder="oldProfessor.adress" type="text">
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Classes -->
          <div class="col main-parent-con">
            <div>
              <p class="view-rel-headline">Classes</p>
              <div class="parents-con">

                <!-- Adding Class -->
                <div id="addParentDiv" class="col-sm-6">
                  <input id="newParentIdInput" v-model="newClassID" class="form-control" placeholder="Class ID" type="number">
                  <p id="add-parent-button">
                    <i @click="addClass" class="fa fa-plus-circle" aria-hidden="true"></i>
                  </p>
                </div>

                <br>

                <!-- Listing Classes -->
                <div style="padding: 0px;" v-for="classe in professor.classes" :key="classe.id">
                  <a class="relative-ref custom-button">
                    <span v-if="'altname' in classe"> {{ classe['altname'] }}</span>
                    <span v-else> {{ classe['name'] }}</span>
                  </a>
                  <i @click="removeClass(classe.id)" class="delete fa fa-times" aria-hidden="true"></i>
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
          <button @click="deleteProfessor" id="deleteStudent" class="btn btn-outline-danger">
            Delete
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  import isMale from '@/assets/js/isMaleMixin';
  import {
    setPermanentAlert,
    setTimeoutAlert
  } from '@/assets/js/Mixins/cardErrorMixins';
  import {
    serverErrorRedirect
  } from '@/assets/js/errors';
  import {
    deleteEntry,
    fetchSingle,
    commitTheUpdateToServer
  } from '@/assets/js/comunication';
  import classManipulationMixin from './Mixins/classManipulationMixin';
  import checksMixin from './Mixins/checksMixin';
  import parseProfessorMixin from './Mixins/parseProfessorMixin';

  export default {
    mixins: [isMale, setPermanentAlert, setTimeoutAlert, classManipulationMixin, checksMixin, parseProfessorMixin],
    data() {
      return {
        newClassID: '',
        professor: {},
        oldProfessor: {},
        alertMessage: '',
      };
    },
    watch: {
      '$route.params.id': function (val) {
        this.professor = {};
        this.fetchAndSetProfessor(val);
      }
    },
    methods: {
      async saveTheEdit() {
        // Do the error checking
        if (this.checkRequiredAndSetError() && this.checkRegexAndSetError()) {
          let professorToSend = this.parseProfessorToSend(this.professor);

          console.log(professorToSend);

          // Try to reach out to the server
          let response
          try {
            response = await commitTheUpdateToServer('professor', professorToSend, this.$store.getters.user.api_key);
          } catch (error) {
            serverErrorRedirect();
            return;
          }

          // Check if everything went smoothly on the backend, else display error
          if (response.data.success) {
            this.$router.push({
              name: 'professorView',
              params: {
                id: professorToSend.id
              }
            });
          } else {
            this.setTimoutError(response.data.message);
          }
        }
      },
      // Delete professor from the database
      async deleteProfessor() {
        // Reaching out to the server
        let response = await deleteEntry('professor', this.student.id, this.$store.getters.user.api_key);
        if (response) {
          // Checking if everything went smootly on the backend
          if (response.success) {
            this.$router.push({
              name: 'professorsList'
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
          name: 'professorView',
          params: {
            id: this.oldProfessor,
          }
        });
      },
      // Parses the data from the API and save the student
      setProfessor(data) {
        if (data.success) {
          // Save the student
          this.oldProfessor = JSON.parse(JSON.stringify(data.professor));
          this.professor = JSON.parse(JSON.stringify(data.professor));

          // Set the alert message to none in case there was one there before
          this.alertMessage = '';
          document.title = `Edit | ${data.professor.name} ${data.professor.surname}`;
        } else {
          this.setPermanentAlert(data.message);
        }
      },

      // Fetches the student
      async fetchAndSetProfessor(id) {
        const response = await fetchSingle('professor', id);

        if (response) {
          this.setProfessor(response);
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
      isProfessorEmpty() {
        return Object.keys(this.professor).length <= 1;
      },

      // If the alert message is specified but the student is loaded
      isWarning() {
        return this.alertMessage !== undefined && this.alertMessage.length > 0;
      },

      // If the alertMessage is specified and there's no student loaded
      isError() {
        return this.isProfessorEmpty && this.alertMessage.length > 0;
      }
    },

    beforeRouteEnter: async(to, from, next) => {
      // Fetches the student data before entering the route and setting the title
      // Feels much faster this way instead of calling the fetchStudent method from inside the vm in the next()
      let response = await fetchSingle('professor', to.params.id);

      if (response) {
        // Set the title to the students name if the fetch was successful
        if (response.success) {
          document.title = `Edit | ${response.professor.name} ${response.professor.surname}`;
        }
        next(vm => {
          vm.setProfessor(response);
        });
      } else {
        serverErrorRedirect();
      }
    }
  }

</script>

<style lang="scss" scoped>


</style>
