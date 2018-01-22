<template>
<div>
    <div class="container vs-main-con">
    <!-- Alert -->
    <div v-if="isError" class="alert alert-danger">{{ alertMessage }}</div>
    <div class="row">
      <h1 class="card-heading">Professor:</h1>
    </div>
    <div class="row">
      <div v-if="!isProfessorEmpty || alertMessage.length > 0" class="col prof-image-con">
        <img v-if="!isMale('professor') && professor.surname !== undefined" src="static/images/placeholder_female.jpg" alt="">
        <img v-else src="static/images/placeholder_male.jpg" alt="">
      </div>
      <div class="col vs-text-con">
        <div>
          <table>
            <tr>
              <td class="vs-table-info">
                <p>Title:</p>
              </td>
              <td>
                <p class="vs-gray-info">
                  <placeholder v-if="isError" :min="5" :max="5"></placeholder>
                  <span>{{ professor['title'] }}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-right: 80px;" class="vs-table-info">
                <p>Name:</p>
              </td>
              <td>
                <p>
                  <placeholder v-if="isError" :min="9" :max="12"></placeholder>
                  <span v-else>{{ professor['name'] }}</span>
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
                  <span v-else>{{ professor['surname'] }}</span>
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
                  <span v-else>{{ professor['id'] }}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td class="vs-table-info">
                <p>Location:</p>
              </td>
              <td>
                <p class="vs-gray-info">
                  <placeholder v-if="isError" :min="5" :max="5"></placeholder>
                  <span>{{ professor['loc'] }}</span>
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
            <td style="padding-right: 50px;" class="vs-table-info">
              <p>
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </p>
            </td>
            <td>
              <p>
                <placeholder v-if="isError" :min="10" :max="16"></placeholder>
                <span v-else>{{ professor['email'] }}</span>
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
                <span v-else>{{ professor['phone'] }}</span>
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
                <span v-else>{{ professor['adress'] }}</span>
              </p>
            </td>
          </tr>
        </table>
      </div>
      <div class="col main-parent-con">
        <div>
          <p class="view-rel-headline">Classes</p>
          <div class="parents-con">
            <!-- Placeholder Classes -->
            <div v-if="isError" style="padding: 0px;" v-for="i in 2" :key="i">
              <button class="relative-ref custom-button">
                <placeholder :min="6" :max="8"></placeholder>
              </button>
              <br>
            </div>
            <!-- Normal Classes -->
            <div style="padding: 0px;" v-for="classe in professor.classes" :key="classe.id">
              <a class="relative-ref custom-button" @click="$router.push({name: 'classView', params: { id: classe.id }})">
                <span v-if="'altname' in classe"> {{ classe['altname'] }}</span>
                <span v-else> {{ classe['name'] }}</span>
              </a>
              <br>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div v-if="user !== undefined && user.privilege >= 3 && !isProfessorEmpty" class="row manipulate-buttons-con">
      <button @click="editProfessor" class="btn btn-outline-secondary">Edit</button>
    </div>

  </div>
</div>
</template>

<script>
  import isMale from '@/assets/js/isMaleMixin';
  import { serverErrorRedirect } from '@/assets/js/errors';
  import Placeholder from '@/components/shared/Placeholder'
  import { fetchSingle } from '@/assets/js/comunication';
  import { setPermanentAlert } from '@/assets/js/Mixins/cardErrorMixins';

  export default {
    mixins: [isMale, setPermanentAlert],
    components: {
      Placeholder
    },
    data() {
      return {
        professor: {
          classes: [],
        },
        alertMessage: '',
      };
    },
    watch: {
      '$route.params.id': function (val) {
        this.professor = {
          classes: []
        };
        this.fetchProfessor(val);
      }
    },
    methods: {
      editProfessor() {
        this.$router.push({ name: 'professorEdit', params: { id: this.professor.id } })
      },
      setProfessor(data) {
        if (data.success) {
              // Save the student
              this.professor = data.professor;
              // Set the alert message to none if there was any
              this.alertMessage = '';
              document.title = `${data.professor.name} ${data.professor.surname}`;         
            } else {
              this.setPermanentAlert(data.message);
            }
      },
      // Fetch the student
      async fetchProfessor(id) {
        const response = await fetchSingle('professor', id);

        if (response) {
          this.setProfessor(response);
        } else {
          serverErrorRedirect()
        }
      }
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      isProfessorEmpty() {
        return Object.keys(this.professor).length <= 1;
      },
      isError() {
        return this.isProfessorEmpty  && this.alertMessage.length > 0;
      }
    },
    beforeRouteEnter: async (to, from, next) => {
      const response = await fetchSingle('professor', to.params.id);
      if (!response) {
        serverErrorRedirect();
        return;
      }

      if (response.success) {
        document.title = `${response.professor.name} ${response.professor.surname}`;
      }
      next(vm => {
        vm.setProfessor(response);
      });
    }
  }

</script>
