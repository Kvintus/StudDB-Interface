<template>
  <table id="tabulka" class="table sticky-header">
    <thead class="table-header">
      <tr>
        <th class="student-table-id" data-tsorter="numeric">
          <div>
            <input id="inputID" v-model="idFilter" class="table-header" type="text" placeholder="#">
            <img onclick="switchB(this)" data-sorterID="id" class="sipka sorter" src="static/images/icons/desc.png'" alt="" srcset="">
          </div>
        </th>
        <th>
          <div>
            <input id="inputName" v-model="nameFilter" class="table-header" type="text" placeholder="Name">
            <img onclick="switchB(this)" data-sorterID="name" class="sipka sorter" src="static/images/icons/no.png" alt="" srcset="">
          </div>
        </th>

        <th>
          <div>
            <input id="inputSurname" v-model="surnameFilter" class="table-header" type="text" placeholder="Surname">
            <img onclick="switchB(this)" data-sorterID="surname" class="sipka sorter" src="static/images/icons/no.png" alt="" srcset="">
          </div>
        </th>
        <th class="student-table-email">
          <div>
            <input class="table-header dis" type="text" placeholder="Email" disabled>
            <div class="placeholderDiv"></div>
          </div>
        </th>
        <th class="student-table-phone">
          <div>
            <input class="table-header dis" type="text" placeholder="Phone" disabled>
            <div class=""></div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="student in students" :key="student.id" class="display-row">
        <td class="student-table-id">{{ student['id'] }}</td>
        <td>{{ student['name'] }}</td>
        <td>{{ student['surname'] }}</td>
        <td class="student-table-email">{{ student['email'] }}</td>
        <td class="student-table-phone">{{ student['phone'] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  let sticky = require('@/assets/js/stickyTableHeader');
  
  export default {
    data() {
      return {
        idFilter: '',
        nameFilter: '',
        surnameFilter: '',
      }
    },
    computed: {
      order() {
        return this.$route.query.order;
      },
      students() {
        return this.$store.state.students
        // ID filter, return only exact matches 
        .filter((student)=>{
          return this.idFilter === '' || student.id == this.idFilter;
        })
        // Name filter, if the student's name starts with the value of the filter
        .filter((student) => {
          return this.nameFilter === '' || student.name.toUpperCase().indexOf(this.nameFilter.toUpperCase()) === 0;
        })
        // Surname filter, if the student's surname starts with the value of the filter
        .filter((student) => {
          return this.surnameFilter === '' || student.surname.toUpperCase().indexOf(this.surnameFilter.toUpperCase()) === 0;
        });
        ;
      },
    },
    mounted() {
      // "Turns on" the sticky header
      $(document).ready(function () {
        $(".sticky-header").floatThead({
          scrollingTop: 60
        });
      });


    },
  }

</script>

<style lang="scss" scoped>
  .table-header {
    border: 0;
    padding-top: 15px;
    background-color: white;
    border-bottom: 0.13em solid rgb(155, 154, 154);
    &:focus {
      border-color: rgb(102, 102, 102);
      outline: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }

  .dis {
    border-bottom: 1.5px solid rgb(201, 201, 201);
  }

  .table thead th {
    vertical-align: top;
  }

  tab tbody {
    margin-top: 118px;
  }

  table.floatThead-table {
    border-top: none;
    border-bottom: none;
    background-color: #fff;
  }

  .sipka {
    filter: opacity(60%);
    display: inline-block;
    width: 20px;
    cursor: pointer;
  }

  table>thead>tr>th {
    text-align: left;
  }

  table>thead>tr>th>div {
    text-align: center;
    display: inline-block;
    height: auto;
  }

</style>
