<template>
<div>
    <div class="container vs-main-con">
    <!-- Alert -->
    <div v-if="isError" class="alert alert-danger">{{ alertMessage }}</div>
    <div class="row">
      <h1 class="card-heading">Parent:</h1>
    </div>
    <div class="row">
      <div v-if="!isParentEmpty || alertMessage.length > 0" class="col prof-image-con">
        <img v-if="!isMale('parent') && parent.surname !== undefined" src="static/images/placeholder_female.jpg" alt="">
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
                  <span v-else>{{ parent['name'] }}</span>
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
                  <span v-else>{{ parent['surname'] }}</span>
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
                  <span v-else>{{ parent['id'] }}</span>
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
                <span v-else>{{ parent['email'] }}</span>
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
                <span v-else>{{ parent['phone'] }}</span>
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
                <span v-else>{{ parent['adress'] }}</span>
              </p>
            </td>
          </tr>
        </table>
      </div>
      <div class="col main-parent-con">
        <div>
          <p class="view-rel-headline">Children</p>
          <div class="parents-con">
            <!-- Placeholder Children -->
            <div v-if="isError" style="padding: 0px;" v-for="i in 2" :key="i">
              <button class="relative-ref custom-button">
                <placeholder :min="6" :max="8"></placeholder>
              </button>
              <br>
            </div>
            <!-- Normal Children -->
            <div style="padding: 0px;" v-for="child in parent.children" :key="child.id">
              <a class="relative-ref custom-button" @click="$router.push({name: 'studentView', params: { id: child.id }})">{{ child['wholeName']}}</a>
              <br>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div v-if="user !== undefined && user.privilege >= 3 && !isParentEmpty" class="row manipulate-buttons-con">
      <button @click="editParent" class="btn btn-outline-secondary">Edit</button>
    </div>

  </div>
</div>
</template>

<script>
  import isMale from '@/assets/js/isMaleMixin';
  import { logError, serverErrorRedirect } from '@/assets/js/errors';
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
        parent: {
        },
        alertMessage: '',
      };
    },
    watch: {
      '$route.params.id': function (val) {
        this.parent = {};
        this.fetchParent(val);
      }
    },
    methods: {
      editParent() {
        this.$router.push({ name: 'parentEdit', params: { id: this.parent.id } })
      },
      setParent(data) {
        if (data.success) {
              // Save the student
              this.parent = data.parent;
              // Set the alert message to none if there was any
              this.alertMessage = '';
              document.title = `${data.parent.name} ${data.parent.surname}`;         
            } else {
              this.setPermanentAlert(data.message);
            }
      },
      // Fetch the student
      async fetchParent(id) {
        const response = await fetchSingle('parent', id);

        if (response) {
          this.setParent(response);
        } else {
          serverErrorRedirect()
        }
      }
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      isParentEmpty() {
        return Object.keys(this.parent).length <= 1;
      },
      isError() {
        return this.isParentEmpty && this.alertMessage.length > 0;
      }
    },
    beforeRouteEnter: async (to, from, next) => {
      const response = await fetchSingle('parent', to.params.id);

      if (!response) {
        serverErrorRedirect();
        return;
      }

      if (response.success) {
        document.title = `${response.parent.name} ${response.parent.surname}`;
      }
      next(vm => {
        vm.setParent(response);
      });
    }
  }

</script>

<style lang="scss">
</style>
