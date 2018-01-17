<template>
  <div class="container vs-main-con">
    <!-- Alert -->
    <div v-if="isError" class="alert alert-danger">{{ alertMessage }}</div>
    <div class="row">
      <h1 class="card-heading">Student:</h1>
    </div>
    <div v-if="!isError" class="row">
      <div class="col prof-image-con">
        <img v-if="!isMale" src="static/images/placeholder_female.jpg" alt="">
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
                <div class="mb-1 col-sm-10">
                  <input v-model="student.name" class="form-control" :placeholder="oldStudent.name" type="text">
                </div>
              </td>
            </tr>
            <tr>
              <td class="vs-table-info">
                <p>Surname: </p>
              </td>
              <td>
                <div class="mb-1 col-sm-10">
                  <input v-model="student.surname" class="form-control" :placeholder="oldStudent.surname" type="text">
                </div>
              </td>
            </tr>
            <tr>
              <td class="vs-table-info">
                <p>ID:</p>
              </td>
              <td>
                <p class="vs-gray-info">
                  <span>{{ oldStudent['id'] }}</span>
                </p>
              </td>
            </tr>

            <tr>
              <td class="vs-table-info">
                <p>Start:</p>
              </td>
              <td>
                <div class="mb-1 col-sm-10">
                  <input v-model="student.start" class="form-control" :placeholder="oldStudent.start" type="number">
                </div>
              </td>
            </tr>
            <tr>
              <td class="vs-table-info">
                <p>Class ID:</p>
              </td>
              <td>
                <div class="mb-1 col-sm-10">
                  <input v-model="student.class.id" class="form-control" :placeholder="oldStudent.class.id" type="number">
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
                <input v-model="student.email" class="form-control" :placeholder="oldStudent.email" type="text">
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
                <input v-model="student.phone" class="form-control" :placeholder="oldStudent.phone" type="text">
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
                <input v-model="student.adress" class="form-control" :placeholder="oldStudent.adress" type="text">
              </div>
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
              <div class="mb-1 col-sm-12">
                <input v-model="student.birth" class="form-control" :placeholder="oldStudent.birth" type="date">
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Parents -->
      <div class="col main-parent-con">
        <div>
          <p class="view-rel-headline">Parents</p>
          <div class="parents-con">
            <div id="addParentDiv" class="col-sm-6">
              <input v-model="newParentID" class="form-control" placeholder="Parent ID" type="text">
              <p @click="addParent" id="add-parent-button">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </p>
            </div>

            <br>

            <!-- Listing parents -->
            <div style="padding: 0px;" v-for="parent in oldStudent.parents" :key="parent.id">
              <a class="relative-ref custom-button" href="#">{{ parent['wholeName']}}</a>
              <i onclick="hideParent(this)" class="delete fa fa-times" aria-hidden="true"></i>
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
</template>

<script>
  import isMale from '@/assets/js/isMaleMixin';
  import showError from '@/assets/js/globalError';
  import {
    api_server
  } from '@/assets/js/config';

  import axios from 'axios';

  export default {
    mixins: [isMale],
    data() {
      return {
        newParentID: '',
        student: {
          name: '',
          surname: '',
          email: '',
          phone: '',
          adress: '',
          birth: '',
          start: '',
          classID: '',
          parents: [],
        },
        oldStudent: {
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
      addParent() {

      },
      setPermanentAlert(message) {
        document.title = 'Error';
        this.alertMessage = message;
      },
      setStudent(data) {
        if (data.success) {
          // Save the student
          this.oldStudent = this.student = data.student;
          // Set the alert message to none if there was any
          this.alertMessage = '';
          document.title = `Edit | ${data.student.name} ${data.student.surname}`;
        } else {
          this.setPermanentAlert(data.message);
        }
      },
      // Fetch the student
      fetchStudent(id) {
        this.axios.get(`${api_server}/api/student`, {
            params: {
              id,
            }
          })
          .then(resp => {
            this.setStudent(resp.data);
          })
          .catch(err => {
            showError(err);
          });
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
    beforeRouteEnter: (to, from, next) => {
      axios.get(`${api_server}/api/student`, {
        params: {
          id: to.params.id,
        }
      }).then(resp => {
        document.title = `Edit | ${resp.data.student.name} ${resp.data.student.surname}`;
        next(vm => {
          vm.setStudent(resp.data);
        });
      });
    }
  }

</script>

<style lang="scss" scoped>
  $nice-gray: #b1b1b1;

  .delete {
    padding-left: 12px;
    color: #ff6767;

    &:hover {
      color: #f84242;
      cursor: pointer;
    }
  }

  #addParentDiv {
    padding-left: 0px;
    padding-right: 0px;
    display: flex;
    align-items: center;
    input {
      width: 160px;
    }
  }

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

    input {
      margin-left: 0px;
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

    .col-sm-10 {
      padding-left: 0px;
    }
  }

  .view-rel-headline {
    display: inline-block;
    color: gray;
    font-size: 26px;
    margin-bottom: 15px;
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
    display: inline-block;
    margin-bottom: 10px;
  }

  .parents-con {
    margin-left: 20px;
  }


  #add-parent-button {
    margin-left: 20px;
    margin-bottom: 0px;
    color: gray;
    display: inline-block;
    font-size: 20px;
    transition: 200ms ease;

    &:hover {
      color: rgb(82, 82, 82);
    }
  }

</style>
