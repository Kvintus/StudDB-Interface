<template>
  <div>
    <div style="padding-left: 50px;" class="container vs-main-con">
    <div style="margin-left: -25px;" v-if="isError" class="alert alert-danger">{{ alertMessage }}</div>
      <div style="margin-bottom: 2rem;" class="row">
        <h1 style="margin-left: 0;" class="card-heading">Class: {{ 'altname' in rclass ? `${rclass.altname} | ${rclass.name}` : rclass.name}}</h1>
      </div>
      <div class="row">
        <div style="align-items: flex-start; " class="col">
          <p style="font-size: 2rem; margin-bottom: 1.3rem" class="view-rel-headline">Info: </p>
          <br>
          <div class="class-info">
            <table>
              <tr>
                <td style="padding-right: 90px;" class="vs-table-info">
                  <p>Name:</p>
                </td>
                <td>
                  <p>
                    <placeholder v-if="isError" :min="8" :max="12"></placeholder>
                    <span v-else>{{ 'altname' in rclass ? `${rclass.altname} | ${rclass.name}` : rclass.name}}</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td class="vs-table-info">
                  <p>Class teacher:</p>
                </td>
                <td>
                  <p v-if="isError" >
                    <placeholder :min="8" :max="12"></placeholder>
                  </p>
                    <div style="display: inline-block" v-else>
                      <router-link v-if="rclass.professors.length > 0" class="teacher-ref" :to="{ name: 'professorView', params: { id: rclass.professors[0].id } }">{{ rclass['professors'][0]['wholeName'] }}</router-link>
                      <p v-else>No teacher yet</p>
                    </div>
                </td>
              </tr>

              <tr>
                <td class="vs-table-info">
                  <p>Room: </p>
                </td>
                <td>
                  <p>
                    <placeholder v-if="isError" :min="4" :max="5"></placeholder>
                    <span v-else>{{ rclass['room'] }}</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td class="vs-table-info">
                  <p>Start: </p>
                </td>
                <td>
                  <p>
                    <placeholder v-if="isError" :min="4" :max="7"></placeholder>
                    <span v-else>{{ rclass['start'] }}</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td class="vs-table-info">
                  <p>ID:</p>
                </td>
                <td>
                  <p class="vs-gray-info">
                    <placeholder v-if="isError" :min="2" :max="4"></placeholder>
                    <span v-else>{{ rclass['id'] }}</span>
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

            <!-- Placeholder Students -->
            <div v-if="isError" style="margin-left: 50px" class="parents-con">
              <div v-for="i in 12" :key="i">
                <a class="relative-ref custom-button" href="#">
                  <placeholder :min="6" :max="8"></placeholder>
                  <placeholder :min="6" :max="8"></placeholder>
                </a>
                <br>
              </div>
            </div>

            <!-- Normal Students -->
            <div v-else style="margin-left: 50px" class="parents-con">
              <div v-for="pupil in rclass.pupils" :key="pupil.id">
                <router-link class="relative-ref custom-button" :to="{ name: 'studentView', params: { id: pupil.id } }">{{ pupil['name'] }} {{ pupil['surname'] }}</router-link>
                <br>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Edit Button -->
      <div v-if="user.privilege >= 3 && !isError" class="row manipulate-buttons-con">
        <button @click="editClass" id="editClassButton" class="btn btn-outline-secondary">Edit</button>
      </div>
    </div>
  </div>

</template>

<script>
  import {
    fetchSingle
  } from '@/assets/js/comunication';
  import Placeholder from '@/components/shared/Placeholder';
  import {
    setPermanentAlert
  } from '@/assets/js/Mixins/cardErrorMixins';
  import {
    serverErrorRedirect
  } from '@/assets/js/errors';

  export default {
    mixins: [setPermanentAlert],
    components: {
      Placeholder,
    },
    data() {
      return {
        rclass: {
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
      editClass() {
        this.$router.push({
          name: 'classEdit',
          params: {
            id: this.rclass.id
          }
        })
      },
      setClass(data) {
        if (data.success) {
          // Save the student
          this.rclass = data.rclass;
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
