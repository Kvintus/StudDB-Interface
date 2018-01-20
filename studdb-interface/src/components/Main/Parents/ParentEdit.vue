<template>
<div>
<div class="container vs-main-con">
    <!-- Alert -->
    <div v-if="isError || isWarning" class="alert alert-danger">{{ alertMessage }}</div>
    <div v-if="!isError">
      <div class="row">
        <h1 class="card-heading">Parent:</h1>
      </div>
      <div class="row">
        <div class="col prof-image-con">
          <img v-if="!isMale('parent')" src="static/images/placeholder_female.jpg" alt="">
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
                    <input :class="{'is-invalid': parent.name === ''}" id="nameInput" v-model="parent.name" class="form-control" :placeholder="oldParent.name"
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
                    <input :class="{'is-invalid': parent.surname === ''}" v-model="parent.surname" class="form-control" :placeholder="oldParent.surname"
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
                    <span>{{ oldParent['id'] }}</span>
                  </p>
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
                  <input :class="{'is-invalid': parent.email === ''}" v-model="parent.email" class="form-control" :placeholder="oldParent.email" type="text">
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
                  <input :class="{'is-invalid': parent.phone === ''}" v-model="parent.phone" class="form-control" :placeholder="oldParent.phone" type="text">
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
                  <input v-model="parent.adress" class="form-control" :placeholder="oldParent.adress" type="text">
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Parents -->
        <div class="col main-parent-con">
          <div>
            <p class="view-rel-headline">Children</p>
            <div class="parents-con">

              <!-- Adding Child -->
              <div id="addParentDiv" class="col-sm-6">
                <input id="newChildIdInput" v-model="newChildID" class="form-control" placeholder="Child ID" type="number">
                <p id="add-parent-button">
                  <i @click="addChild" class="fa fa-plus-circle" aria-hidden="true"></i>
                </p>
              </div>

              <br>

              <!-- Listing Children -->
              <div style="padding: 0px;" v-for="child in parent.children" :key="child.id">
                <a class="relative-ref custom-button" href="#">{{ child['wholeName']}}</a>
                <i @click="removeChild(child.id)" class="delete fa fa-times" aria-hidden="true"></i>
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
        <button @click="saveTheEdit" id="updateParent" class="btn btn-outline-primary">Save</button>
        <button @click="deleteParent" id="deleteParent" class="btn btn-outline-danger">
          Delete
        </button>
      </div>

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
    deleteEntry,
    fetchSingle,
    commitTheUpdateToServer
  } from '@/assets/js/comunication';
  import childrenManipulationMixin from './Mixins/childrenManipulationMixin';
  import checksMixin from './Mixins/checksMixin';
  import parseParentMixin from './Mixins/parseParentMixin';

  export default {
    mixins: [isMale, setPermanentAlert, setTimeoutAlert, childrenManipulationMixin, checksMixin, parseParentMixin],
    data() {
      return {
        newChildID: '',
        parent: {
          id: '',
        },
        oldParent: {
          id: '',
        },
        alertMessage: '',
      };
    },
    watch: {
      '$route.params.id': function (val) {
        this.parent = {};
        this.fetchAndSetParent(val);
      }
    },
    methods: {
      async saveTheEdit() {
        // Do the error checking
        if (this.checkRequiredAndSetError() && this.checkRegexAndSetError()) {
          let parentToSend = this.parseParentToSend(this.parent);

          // Try to reach out to the server
          let response
          try {
            response = await commitTheUpdateToServer('parent', parentToSend, this.$store.getters.user.api_key);
          } catch (error) {
            serverErrorRedirect();
            return;
          }

          // Check if everything went smoothly on the backend, else display error
          if (response.data.success) {
            this.$router.push({
              name: 'parentView',
              params: {
                id: parentToSend.id
              }
            });
          } else {
            this.setTimoutError(response.data.message);
          }
        }
      },
      // Delete student from the database
      async deleteParent() {
        // Reaching out to the server
        let response = await deleteEntry('parent', this.parent.id, this.$store.getters.user.api_key);
        if (response) {
          // Checking if everything went smootly on the backend
          if (response.success) {
            this.$router.push({
              name: 'parentsList'
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
          name: 'parentView',
          params: {
            id: this.parent.id
          }
        });
      },
      // Parses the data from the API and save the student
      setParent(data) {
        if (data.success) {
          // Save the student
          this.oldParent = JSON.parse(JSON.stringify(data.parent));
          this.parent = JSON.parse(JSON.stringify(data.parent));

          // Set the alert message to none in case there was one there before
          this.alertMessage = '';
          document.title = `Edit | ${data.parent.name} ${data.parent.surname}`;
        } else {
          this.setPermanentAlert(data.message);
        }
      },

      // Fetches the student
      async fetchAndSetParent(id) {
        const response = await fetchSingle('parent', id);

        if (response) {
          this.setParent(response);
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
      isParentEmpty() {
        return Object.keys(this.parent).length <= 1;
      },

      // If the alert message is specified but the student is loaded
      isWarning() {
        return this.alertMessage !== undefined && this.alertMessage.length > 0;
      },

      // If the alertMessage is specified and there's no student loaded
      isError() {
        return this.isParentEmpty && this.alertMessage.length > 0;
      }
    },

    beforeRouteEnter: async(to, from, next) => {
      // Fetches the student data before entering the route and setting the title
      // Feels much faster this way instead of calling the fetchStudent method from inside the vm in the next()
      let response = await fetchSingle('parent', to.params.id);

      if (response) {
        // Set the title to the students name if the fetch was successful
        if (response.success) {
          document.title = `Edit | ${response.parent.name} ${response.parent.surname}`;
        }
        next(vm => {
          vm.setParent(response);
        });
      } else {
        serverErrorRedirect();
      }
    }
  }

</script>
