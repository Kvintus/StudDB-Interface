<template>
  <div>
    <div style="padding-left: 50px;" class="container vs-main-con">
      <div style="margin-left: -25px;" v-if="isError" class="alert alert-danger">{{ alertMessage }}</div>
      <div>
        <div style="margin-bottom: 2rem;" class="row">
          <h1 style="margin-left: 0;" class="card-heading">Add Class</h1>

          <!-- Edit Button -->
          <div class="edit-button-con">
            <button @click="uploadTheClass" id="updateStudent" class="btn btn-outline-primary mr-3">Save</button>
          </div>
        </div>
        <div class="row">
          <div style="align-items: flex-start; " class="col">
            <p style="font-size: 2rem; margin-bottom: 1.3rem" class="view-rel-headline">Info: </p>
            <br>
            <div class="class-info">
              <table>
                <tr>
                  <td style="padding-right: 90px;" class="vs-table-info">
                    <p>Letter:</p>
                  </td>
                  <td>
                    <p>
                      <input :class="{'is-invalid': rclass.letter === '' || rclass.letter === undefined}" class="form-control" v-model="rclass['letter']" type="text">
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="vs-table-info">
                    <p>Class Teacher ID:</p>
                  </td>
                  <td>
                    <p>
                      <input class="form-control" v-model="rclass.professors[0]['id']" type="number">
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="vs-table-info">
                    <p>Room: </p>
                  </td>
                  <td>
                    <p>
                      <input :class="{'is-invalid': rclass.room === '' || rclass.room === undefined}" class="form-control" v-model="rclass.room" type="text">
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="vs-table-info">
                    <p>Start: </p>
                  </td>
                  <td>
                    <p>
                      <input :class="{'is-invalid': rclass.start === '' || rclass.start === undefined}" class="form-control" v-model="rclass.start" type="number">
                    </p>
                  </td>
                </tr>

              </table>
            </div>
          </div>

          <!-- Displaying Students -->
          <div class="col main-parent-con">
            <div class="students-wrapper">
              <p style="font-size: 2rem; margin-bottom: 1.3rem" class="view-rel-headline">Students: </p>

              <!-- Adding Pupils -->
              <div style="margin-left: 50px; margin-bottom: 20px;" id="addParentDiv" class="col-sm-6">
                <input @keyup.enter.native="addPupil" id="newChildIdInput" v-model="newPupilID" class="form-control" placeholder="Pupil ID" type="number">
                <p id="add-parent-button">
                  <i @click="addPupil" class="fa fa-plus-circle" aria-hidden="true"></i>
                </p>
              </div>

              <!-- Normal Students -->
              <div style="margin-left: 50px" class="parents-con">
                <div v-for="pupil in rclass.pupils" :key="pupil.id">
                  <a class="relative-ref custom-button">{{ pupil['name'] }} {{ pupil['surname'] }}</a>
                  <i @click="removePupil(pupil.id)" class="delete fa fa-times" aria-hidden="true"></i>
                  <br>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
  import {
    fetchSingle,
    uploadToTheServer,
  } from '@/assets/js/comunication';
  import {
    setPermanentAlert,
    setTimeoutAlert,
  } from '@/assets/js/Mixins/cardErrorMixins';
  import {
    serverErrorRedirect
  } from '@/assets/js/errors';
  import pupilsManipulationMixin from './Mixins/pupilsManipulationMixin';
  import checkMixin from './Mixins/checksMixin';
  import parseClassMixin from './Mixins/parseClassMixin';

  export default {
    mixins: [setPermanentAlert, pupilsManipulationMixin, setTimeoutAlert, checkMixin, parseClassMixin],
    data() {
      return {
        newPupilID: undefined,
        rclass: {
          pupils: [],
          professors: [{
            id: undefined
          }],
        },
        alertMessage: '',
      }
    },
    methods: {
      async uploadTheClass() {
        // Do the error checking
        if (this.checkRequiredAndSetError()) {
          let classToSend = this.parseClassToSend(this.rclass);

          // Try to reach out to the server
          let response
          try {
            response = await uploadToTheServer('class', classToSend, this.$store.getters.user.api_key);
          } catch (error) {
            serverErrorRedirect();
            return;
          }

          // Check if everything went smoothly on the backend, else display error
          if (response.data.success) {
            this.$router.push({
              name: 'classView',
              params: {
                id: response.data.classID
              }
            });
          } else {
            this.setTimoutError(response.data.message);
          }
        }
      }
    },
    computed: {
      user() {
        return this.$store.getters.user;
      },
      isError() {
        return this.alertMessage.length > 0;
      }
    },
  }

</script>

<style lang="scss" scoped>
  .edit-button-con {
    margin-left: auto;
    margin-right: 20px;
    display: flex;
    align-items: center;
  }

  #editClassButton {
    height: 2.5rem;
  }

  .teacher-ref {
    padding-bottom: 1rem;
    font-size: 18px;
    color: gray;
    display: block;

    &:hover {
      text-decoration: none;
      color: rgb(87, 87, 87);
    }
  }

</style>
