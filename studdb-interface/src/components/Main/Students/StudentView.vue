<template>
  <div class="container vs-main-con">
    <div class="row">
      <h1 class="card-heading">Student:</h1>
    </div>
    <div class="row">
      <div class="col prof-image-con">
        <img v-if="isMale" src="static/images/placeholder_male.jpg" alt="">
        <img v-else src="static/images/placeholder_female.jpg" alt="">
      </div>
      <div class="col vs-text-con">
        <div>
          <table>
            <tr>
              <td style="padding-right: 80px;" class="vs-table-info">
                <p>Name:</p>
              </td>
              <td>
                <p>{{ student['name'] }}</p>
              </td>
            </tr>
            <tr>
              <td class="vs-table-info">
                <p>Surname: </p>
              </td>
              <td>
                <p>{{ student['surname'] }}</p>
              </td>
            </tr>
            <tr>
              <td class="vs-table-info">
                <p>ID:</p>
              </td>
              <td>
                <p class="vs-gray-info">{{ student['id'] }}</p>
              </td>
            </tr>

            <tr>
              <td class="vs-table-info">
                <p>Start:</p>
              </td>
              <td>
                <p class="vs-gray-info">{{ student['start'] }}</p>
              </td>
            </tr>
            <tr>
              <td class="vs-table-info">
                <p>Class:</p>
              </td>
              <td>
                <a v-if="'altname' in student.class" class="class-ref" href="#">{{ student['class']['altname'] }}</a>
                <a v-else class="class-ref" href="#">{{ student['class']['name'] }}</a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <hr>
    <div class="row">
      <div style="margin-left: 20px; display:flex;align-items: center;" class="col">
        <table>
          <tr>
            <td style="padding-right: 50px;" class="vs-table-info">
              <p>
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </p>
            </td>
            <td>
              <p>{{ student['email'] }}</p>
            </td>
          </tr>
          <tr>
            <td class="vs-table-info">
              <p>
                <i class="fa fa-phone" aria-hidden="true"></i>
              </p>
            </td>
            <td>
              <p>{{ student['phone'] }}</p>
            </td>
          </tr>
          <tr>
            <td class="vs-table-info">
              <p>
                <i class="fa fa-home" aria-hidden="true"></i>
              </p>
            </td>
            <td>
              <p>{{ student['adress'] }}</p>
            </td>
          </tr>
          <tr>
            <td class="vs-table-info">
              <p class="no-bottom-margin">
                <i class="fa fa-birthday-cake" aria-hidden="true"></i>
              </p>
            </td>
            <td>
              <p class="no-bottom-margin">{{ student['birth'] }}</p>
            </td>
          </tr>
        </table>
      </div>
      <div class="col main-parent-con">
        <div>
          <p class="view-rel-headline">Parents</p>
          <div class="parents-con">
            <div style="padding: 0px;" v-for="parent in student.parents" :key="parent">
              <a class="relative-ref custom-button"  href="#">{{ parent['wholeName']}}</a>
              <br>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div v-if="user !== undefined && user.privilege >= 3" class="row manipulate-buttons-con">
      <button id="editStudentButton" class="btn btn-outline-secondary">Edit</button>
    </div>

  </div>
</template>

<script>
  import isMale from '@/assets/js/isMaleMixin';
  import showError from '@/assets/js/globalError';
  import axios from 'axios';
  export default {
    mixins: [isMale],
    data() {
      return {
        student: {
          'class': {},
        },
      };
    },
    watch: {
      '$route': function(val) {
        this.fetchStudent(val.params.id);
      }
    },
    methods: {
      // Fetch the student
      fetchStudent(id) {
        axios.get(`${this.$store.state.server}/api/student?id=${id}`)
          .then(resp => {
            if (resp.data.success) {
              // Save the student
              this.student = resp.data.student;
              // Set the page title to students name 
              document.title = `${resp.data.student.name} ${resp.data.student.surname}`;
            } else {
              showError(resp.data.message);
            }
          })
          .catch(err => {
            showError(err);
          });

      }
    },
    computed: {
      user() {
        return this.$store.getters.user
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        console.log('Entergin the fucking route');
        vm.fetchStudent(vm.$route.params.id);
      })
    }
  }

</script>

<style lang="scss" scoped>
$nice-gray: #b1b1b1;
.card-heading {
    margin-left: 50px;
    font-size: 50px;
    font-family: sans-serif;
    color: #cccccc;
    margin-bottom: 12px;
}
.vs-main-con {
    margin-top: 100px;
    width: 60%;
    min-width: 367px;
    max-width: 865px;
    padding: 20px;
    background-color: rgba(255, 252, 252, 0.1);
    box-shadow: 0px 1px 12px 2px rgba(140, 140, 140, 0.75);
    -webkit-box-shadow: 0px 1px 12px 2px rgba(140, 140, 140, 0.75);
    -moz-box-shadow: 0px 1px 12px 2px rgba(140, 140, 140, 0.75);
    
    @media screen and (max-width: 600px) {
        width: 100%;
    }
    @media screen and (max-width: 906px) {
        padding-bottom: 20px;
        margin-bottom: 20px;
        min-width: 0px;
    }

    hr {
        margin-bottom: 1.7rem;
    }
}
.prof-image-con {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 18px;
    
    img {
        border-radius: 50%;
        width: 230px;
    }
}
.vs-table-info {
    color: gray;
}
.vs-gray-info {
    color: $nice-gray;
}
#vs-info-wrap {
    text-align: right;
}
.main-parent-con {
    @media screen and (max-width: 875px) {
        margin-top: 32px;
    }
}
.vs-text-con {
    font-size: 22px;
    align-items: center;
    display: flex;
    justify-content: center;
}
.view-rel-headline {
    display: inline-block;
    color: gray;
    font-size: 26px;
    margin-bottom: 5px;
}
.custom-button {
    margin-bottom: 0px;
    display: inline-block;
    color: #5a5a5a;
    padding: 6px;
    width: 160px;
    background-color: #f5f5f5;
    border: 1px solid gray;
    border-radius: 5px;
    transition: 200ms ease;
    &:hover {
        text-decoration: none;
        color: #5a5a5a;
        background-color: #eaeaea;
    }
}
.manipulate-buttons-con {
    justify-content: flex-end;
    margin-top: 18px;
    button {
        margin-right: 12px;
    }
}
.class-ref {
    margin-bottom: 1rem;
    display: block;
    color: $nice-gray;
    font-weight: 500;
    transition: 200ms ease;
    &:hover {
        text-decoration: none;
        color: #808080;
    }
}
.relative-ref {
    display: block;
}
.parents-con {
    margin-left: 20px;
}
</style>

