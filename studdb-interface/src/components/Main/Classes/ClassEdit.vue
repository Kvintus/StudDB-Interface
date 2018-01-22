<template>
  <div>
    <div style="padding-left: 50px;" class="container vs-main-con">
      <div style="margin-left: -25px;" v-if="isError" class="alert alert-danger">{{ alertMessage }}</div>
      <div>
        <div style="margin-bottom: 2rem;" class="row">
          <h1 style="margin-left: 0;" class="card-heading">Class: {{ rclass.name}}</h1>
          <!-- Edit Button -->
          <div class="edit-button-con">
            <button v-if="user.privilege >= 3 && !isError" @click="$router.push({ name: 'classesList' })" id="editClassButton" class="btn btn-outline-secondary mr-3">Cancel</button>
            <button @click="saveTheEdit" id="updateStudent" class="btn btn-outline-primary mr-3">Save</button>
            <button @click="deleteClass" id="deleteStudent" class="btn btn-outline-danger">
              Delete
            </button>
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
                      <input :class="{'is-invalid': rclass.letter === ''}" class="form-control" v-model="rclass['letter']" :placeholder="oldRclass.letter"
                        type="text">
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="vs-table-info">
                    <p>Class Teacher ID:</p>
                  </td>
                  <td>
                    <p>
                      <input class="form-control" v-model="rclass.professors[0]['id']" :placeholder="oldRclass.professors > 0 && oldRclass.professors[0] !== undefined ? oldRclass.professors[0]['id'] : ''"
                        type="number">
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="vs-table-info">
                    <p>Room: </p>
                  </td>
                  <td>
                    <p>
                      <input :class="{'is-invalid': rclass.room === ''}" class="form-control" v-model="rclass.room" :placeholder="oldRclass.room"
                        type="text">
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="vs-table-info">
                    <p>Start: </p>
                  </td>
                  <td>
                    <p>
                      <input :class="{'is-invalid': rclass.start === ''}" class="form-control" v-model="rclass.start" :placeholder="oldRclass.start"
                        type="number">
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
                <input id="newChildIdInput" v-model="newPupilID" class="form-control" placeholder="Pupil ID" type="number">
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
    deleteEntry,
    commitTheUpdateToServer,
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
          professors: [{id: undefined}],
        },
        oldRclass: {
          pupils: [],
          professors: [],
        },
        alertMessage: '',
      }
    },
    watch: {
      '$route.params.id': function (val) {
        this.rclass = {
          pupils: [],
          professors: [],
        };
        this.fetchClass(val);
      }
    },
    methods: {
      async saveTheEdit() {
        // Do the error checking
        if (this.checkRequiredAndSetError()) {
          let classToSend = this.parseClassToSend(this.rclass);

          // Try to reach out to the server
          let response
          try {
            response = await commitTheUpdateToServer('class', classToSend, this.$store.getters.user.api_key);
          } catch (error) {
            serverErrorRedirect();
            return;
          }

          // Check if everything went smoothly on the backend, else display error
          if (response.data.success) {
            this.$router.push({
              name: 'classView',
              params: {
                id: classToSend.id
              }
            });
          } else {
            this.setTimoutError(response.data.message);
          }
        }
      },
      async deleteClass() {
        // Reaching out to the server
        let response = await deleteEntry('class', this.parent.id, this.$store.getters.user.api_key);
        if (response) {
          // Checking if everything went smootly on the backend
          if (response.success) {
            this.$router.push({
              name: 'classesList'
            });
            // If the token has expired show the expired error
          } else if ('expired' in response.message) {
            this.setTimoutError('Your token has expired please logout and then login again.');
          }

        } else {
          serverErrorRedirect();
        }
      },
      setClass(data) {
        if (data.success) {
          // Save the student
          this.rclass = data.rclass;
          this.oldRclass = JSON.parse(JSON.stringify(data.rclass))
          // Set the alert message to none if there was any
          this.alertMessage = '';
          document.title = 'altname' in this.rclass ? `${this.rclass.altname} (${this.rclass.name})` : this.rclass.name;
        } else {
          this.setPermanentAlert(data.message);
        }
      },
      // Fetch the class
      async fetchClass(id) {
        const response = await fetchSingle('class', id);

        if (response) {
          this.setClass(response);
        } else {
          serverErrorRedirect()
        }
      },
    },
    computed: {
      user() {
        return this.$store.getters.user;
      },
      isClassEmpty() {
        return Object.keys(this.rclass).length <= 2;
      },
      isError() {
        return this.isClassEmpty && this.alertMessage.length > 0;
      }
    },
    beforeRouteEnter: async(to, from, next) => {
      const response = await fetchSingle('class', to.params.id);

      if (!response) {
        serverErrorRedirect();
        return;
      }

      if (response.success) {
        document.title = 'altname' in response.rclass ? `${response.rclass.altname} (${response.rclass.name})` :
          response.rclass.name;
      }
      next(vm => {
        vm.setClass(response);
      });
    }
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
