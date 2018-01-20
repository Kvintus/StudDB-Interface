<template>
  <div>
    <div class="container vs-main-con">
      <!-- Alert -->
      <div v-if="isWarning" class="alert alert-danger">{{ alertMessage }}</div>
      <div>
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
                      <input :class="{'is-invalid': parent.name === ''}" id="nameInput" v-model="parent.name" class="form-control" type="text">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="vs-table-info">
                    <p>Surname: </p>
                  </td>
                  <td>
                    <div class="mb-1 col-sm-10">
                      <input :class="{'is-invalid': parent.surname === ''}" v-model="parent.surname" class="form-control" type="text">
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
                    <input :class="{'is-invalid': parent.email === ''}" v-model="parent.email" class="form-control" type="text">
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
                    <input :class="{'is-invalid': parent.phone === ''}" v-model="parent.phone" class="form-control" type="text">
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
                    <input v-model="parent.adress" class="form-control" type="text">
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Children -->
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
          <button @click="uploadParent" id="updateParent" class="btn btn-outline-primary">Save</button>
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
    deleteEntry,
    fetchSingle,
    uploadToTheServer
  } from '@/assets/js/comunication';
  import childrenManipulationMixin from './Mixins/childrenManipulationMixin';
  import checksMixin from './Mixins/checksMixin';
  import parseParentMixin from './Mixins/parseParentMixin';

  export default {
    mixins: [isMale, setTimeoutAlert, childrenManipulationMixin, checksMixin, parseParentMixin],
    data() {
      return {
        newChildID: '',
        parent: {
          children: [],
          id: '',
          name: '',
          surname: '',
          phone: '',
          email: '',
        },
        alertMessage: '',
      };
    },
    methods: {
      async uploadParent() {
        console.log('uploading');
        // Do the error checking
        if (this.checkRequiredAndSetError() && this.checkRegexAndSetError()) {
          let parentToSend = this.parseParentToSend(this.parent);

          console.log(parentToSend);

          // Try to reach out to the server
          let response
          try {
            response = await uploadToTheServer('parent', parentToSend, this.$store.getters.user.api_key);
          } catch (error) {
            serverErrorRedirect();
            return;
          }

          console.log(response);

          // Check if everything went smoothly on the backend, else display error
          if (response.data.success) {
            this.$router.push({
              name: 'parentView',
              params: {
                id: response.data.parentID,
              }
            });
          } else {
            this.setTimoutError(response.data.message);
          }
        }
      },
      goBack() {
        this.$router.push({
          name: 'parentsList',
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
