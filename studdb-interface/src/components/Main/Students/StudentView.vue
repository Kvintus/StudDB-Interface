<template>
<div>
    <div class="container vs-main-con">
    <!-- Alert -->
    <div v-if="isError" class="alert alert-danger">{{ alertMessage }}</div>
    <div class="row">
      <h1 class="card-heading">Student:</h1>
    </div>
    <div class="row">
      <div v-if="!isStudentEmpty || alertMessage.length > 0" class="col prof-image-con">
        <img v-if="!isMale && student.surname !== undefined" src="static/images/placeholder_female.jpg" alt="">
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
                <p>
                  <placeholder v-if="isError" :min="9" :max="12"></placeholder>
                  <span v-else>{{ student['name'] }}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td class="vs-table-info">
                <p>Surname: </p>
              </td>
              <td>
                <p>
                  <placeholder v-if="isError" :min="9" :max="12"></placeholder>
                  <span v-else>{{ student['surname'] }}</span>
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
                  <span v-else>{{ student['id'] }}</span>
                </p>
              </td>
            </tr>

            <tr>
              <td class="vs-table-info">
                <p>Start:</p>
              </td>
              <td>
                <p class="vs-gray-info">
                  <placeholder v-if="isError" :min="5" :max="5"></placeholder>
                  <span>{{ student['start'] }}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td class="vs-table-info">
                <p>Class:</p>
              </td>
              <td>
                <p v-if="isError">
                  <placeholder :min="4" :max="7"></placeholder>
                </p>
                <div v-else>
                  <a v-if="'altname' in student.class" class="class-ref" href="#">{{ student['class']['altname'] }}</a>
                  <a v-else class="class-ref" href="#">{{ student['class']['name'] }}</a>
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
            <td style="padding-right: 50px;" class="vs-table-info">
              <p>
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </p>
            </td>
            <td>
              <p>
                <placeholder v-if="isError" :min="10" :max="16"></placeholder>
                <span v-else>{{ student['email'] }}</span>
              </p>
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
              <p>
                <placeholder v-if="isError" :min="12" :max="18"></placeholder>
                <span v-else>{{ student['phone'] }}</span>
              </p>
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
              <p>
                <placeholder v-if="isError" :min="14" :max="20"></placeholder>
                <span v-else>{{ student['adress'] }}</span>
              </p>
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
              <p class="no-bottom-margin">
                <placeholder v-if="isError" :min="8" :max="12"></placeholder>
                <span>{{ student['birth'] }}</span>
              </p>
            </td>
          </tr>
        </table>
      </div>
      <div class="col main-parent-con">
        <div>
          <p class="view-rel-headline">Parents</p>
          <div class="parents-con">
            <!-- Placeholder Parents -->
            <div v-if="isError" style="padding: 0px;" v-for="i in 2" :key="i">
              <button class="relative-ref custom-button">
                <placeholder :min="6" :max="8"></placeholder>
              </button>
              <br>
            </div>
            <!-- Normal Parents -->
            <div style="padding: 0px;" v-for="parent in student.parents" :key="parent.id">
              <a class="relative-ref custom-button" href="#">{{ parent['wholeName']}}</a>
              <br>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div v-if="user !== undefined && user.privilege >= 3 && !isStudentEmpty" class="row manipulate-buttons-con">
      <button @click="editStudent" class="btn btn-outline-secondary">Edit</button>
    </div>

  </div>
</div>
</template>

<script>
  import isMale from '@/assets/js/isMaleMixin';
  import { logError, serverErrorRedirect } from '@/assets/js/errors';
  import Placeholder from '@/components/shared/Placeholder'
  import axios from 'axios';
  import { api_server } from '@/assets/js/config';
  import { fetchSingle } from '@/assets/js/comunication';
  import { setPermanentAlert } from '@/assets/js/Mixins/cardErrorMixins';

  export default {
    mixins: [isMale, setPermanentAlert],
    components: {
      Placeholder
    },
    data() {
      return {
        student: {
          'class': {},
        },
        alertMessage: '',
      };
    },
    watch: {
      '$route.params.id': function (val) {
        this.student = {
          'class': {}
        };
        this.fetchStudent(val);
      }
    },
    methods: {
      editStudent() {
        this.$router.push({ name: 'studentEdit', params: { id: this.student.id } })
      },
      setStudent(data) {
        if (data.success) {
              // Save the student
              this.student = data.student;
              // Set the alert message to none if there was any
              this.alertMessage = '';
              document.title = `${data.student.name} ${data.student.surname}`;         
            } else {
              this.setPermanentAlert(data.message);
            }
      },
      // Fetch the student
      async fetchStudent(id) {
        const response = await fetchSingle('student', id);

        if (response) {
          this.setStudent(response);
        } else {
          serverErrorRedirect()
        }
      }
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      isStudentEmpty() {
        return Object.keys(this.student).length <= 1;
      },
      isError() {
        return this.isStudentEmpty && this.alertMessage.length > 0;
      }
    },
    beforeRouteEnter: async (to, from, next) => {
      const response = await fetchSingle('student', to.params.id);

      if (!response) {
        serverErrorRedirect();
        return;
      }

      if (response.success) {
        document.title = `${response.student.name} ${response.student.surname}`;
      }
      next(vm => {
        vm.setStudent(response);
      });
    }
  }

</script>

<style lang="scss">
</style>
