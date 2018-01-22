<template>
  <div>
    <div class="container vs-main-con">
      <!-- Alert -->
      <div v-if="isWarning" class="alert alert-danger">{{ alertMessage }}</div>
      <div>
        <div class="row">
          <h1 class="card-heading">Add Professor:</h1>
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
                      <input id="titleInput" v-model="professor.title" class="form-control" type="text">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-right: 80px;" class="vs-table-info">
                    <p>Name:</p>
                  </td>
                  <td>
                    <div class="mb-1 col-sm-10 form-group">
                      <input :class="{'is-invalid': professor.name === ''}" id="nameInput" v-model="professor.name" class="form-control" 
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
                      <input :class="{'is-invalid': professor.surname === ''}" v-model="professor.surname" class="form-control" 
                        type="text">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="vs-table-info">
                    <p>Location:</p>
                  </td>
                  <td>
                    <div class="mb-1 col-sm-10">
                      <input v-model="professor.loc" class="form-control" type="text">
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
                    <input :class="{'is-invalid': professor.email === ''}" v-model="professor.email" class="form-control" 
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
                    <input :class="{'is-invalid': professor.phone === ''}" v-model="professor.phone" class="form-control"
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
                    <input v-model="professor.adress" class="form-control" type="text">
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
          <button @click="uploadProfessor" id="updateStudent" class="btn btn-outline-primary">Save</button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  import isMale from '@/assets/js/isMaleMixin';
  import {
    setTimeoutAlert
  } from '@/assets/js/Mixins/cardErrorMixins';
  import {
    serverErrorRedirect
  } from '@/assets/js/errors';
  import {
    fetchSingle,
    uploadToTheServer
  } from '@/assets/js/comunication';
  import classManipulationMixin from './Mixins/classManipulationMixin';
  import checksMixin from './Mixins/checksMixin';
  import parseProfessorMixin from './Mixins/parseProfessorMixin';

  export default {
    mixins: [isMale, setTimeoutAlert, classManipulationMixin, checksMixin, parseProfessorMixin],
    data() {
      return {
        newClassID: '',
        professor: {
          name: '',
          surname: '',
          email: '',
          phone: '',
          classes: [],
        },
        alertMessage: '',
      };
    },
    methods: {
      async uploadProfessor() {
        // Do the error checking
        if (this.checkRequiredAndSetError() && this.checkRegexAndSetError()) {
          let professorToSend = this.parseProfessorToSend(this.professor);
          
          // Try to reach out to the server
          let response
          try {
            response = await uploadToTheServer('professor', professorToSend, this.$store.getters.user.api_key);
          } catch (error) {
            serverErrorRedirect();
            return;
          }

          // Check if everything went smoothly on the backend, else display error
          if (response.data.success) {
            this.$router.push({
              name: 'professorView',
              params: {
                id: response.data.professorID
              }
            });
          } else {
            this.setTimoutError(response.data.message);
          }
        }
      },
      goBack() {
        this.$router.push({
          name: 'professorsList',
        });
      },
    },
    computed: {
      // Return the logged-in user
      user() {
        return this.$store.getters.user
      },

      // If the alert message is specified but the student is loaded
      isWarning() {
        return this.alertMessage !== undefined && this.alertMessage.length > 0;
      },
    },
  }

</script>

<style lang="scss" scoped>


</style>
