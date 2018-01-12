<template>
  <div>

    <table id="tabulka" class="table sticky-header">
      <thead class="table-header">
        <tr>
          <th class="student-table-id" data-tsorter="numeric">
            <div>
              <input id="inputID" v-model="filters.id" class="table-header" type="text" placeholder="#">
              <img @click="changeSorter('id')" class="sipka sorter" :src="whichIcon('id')" alt="" srcset="">
            </div>
          </th>
          <th>
            <div>
              <input id="inputName" v-model="filters.name" class="table-header" type="text" placeholder="Name">
              <img @click="changeSorter('name')" class="sipka sorter" :src="whichIcon('name')" alt="" srcset="">
            </div>
          </th>

          <th>
            <div>
              <input id="inputStart" v-model="filters.start" class="table-header" type="text" placeholder="Start">
              <img @click="changeSorter('start')" class="sipka sorter" :src="whichIcon('start')" alt="" srcset="">
            </div>
          </th>
          <th>
            <div>
              <input class="table-header dis" type="text" placeholder="Class Room" disabled>
              <div class=""></div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tempClass in classes" :key="tempClass.id" class="display-row">
          <td>{{ tempClass['id'] }}</td>
          <td>
            <span v-if="'altname' in tempClass" class="class-altname">{{ 'altname' in tempClass ? tempClass.altname : '' }}</span>
            <span class="class-name">{{ tempClass.name }}</span>
          </td>
          <td>{{ tempClass['start'] }}</td>
          <td>{{ tempClass['room'] }}</td>
        </tr>
      </tbody>
    </table>
    <!-- The rendering was not working so I had to do this -->
    <p v-if="false">{{ allClasses }}</p>
  </div>
</template>

<script>
  let sticky = require('@/assets/js/stickyTableHeader');
  import AoSorter from '@/assets/js/Filters_and_Sorters/arrayOfObjectsSorter';
  import allFilters from '@/assets/js/Filters_and_Sorters/filters';
  import axios from 'axios'

  export default {
    data() {
      return {
        // All classes
        allClasses: '{}',

        // All the filters in one object
        filters: {
          id: '',
          name: '',
          start: '',
        },

        // Sorter
        sorter: {
          by: 'id',
          order: 'desc',
        },
      }
    },
    methods: {
      // Fetch the classes 
      fetchClasses() {
        console.log('Fething the data');
        axios.get(`${this.$store.state.server}/api/classes/all`)
          .then((resp) => {
            if (resp.data.success) {
              console.log('Got the data');
              // Stores the classes in the strinified format because it didn't work the normal way
              this.allClasses = JSON.stringify(resp.data.classes);
            } else {
              // TODO: Display error
              console.log(resp.message);
            }
          })
          .catch((error) => {
            // TODO: Display the error somehow
            console.log(error);
          });
      },
      // Change what we are sorting by and takes care of the order automatically
      changeSorter(by) {
        // If we are already sorting by the same value then only change the order, else it will change what value we are sorting by 
        if (this.sorter.by === by) {
          if (this.sorter.order === 'asc') {
            this.sorter.order = 'desc';
          } else {
            this.sorter.order = 'asc';
          }
        } else {
          this.sorter.by = by;
          this.sorter.order = 'desc';
        }
      },

      // Will decide which icon to use based on the sorter
      whichIcon(by) {
        if (this.sorter.by === by) {
          return `static/images/icons/${this.sorter.order}.png`
        } else {
          return 'static/images/icons/no.png';
        }
      }
    },

    computed: {
      // Returns a list of studens who passed all the filters and are sorted
      classes() {

        // If there are no classes loaded yet
        if (this.allClasses === '{}') {
          return {};
        }

        // If the classes has been loaded, filter them and return the filtered array
        let beforeFilter = JSON.parse(this.allClasses);
        let tempArr = beforeFilter
          // ID filter, return only exact matches 
          .filter(allFilters.filterById(this.filters.id))
          // Name filter, if the student's name starts with the value of the filter
          .filter(allFilters.containsByProperty(this.filters.name, 'name'))
          // Surname filter, if the student's surname starts with the value of the filter
          .filter(allFilters.containsByProperty(this.filters.start, 'start'))
          // Sorts the filteres array with the setting in the sorter object
          .sort(AoSorter(this.sorter));
        return tempArr
      },
    },
    created() {
      this.fetchClasses();
    },
    updated() {
      // "Turns on" the sticky header
      $(document).ready(function () {
        $(".sticky-header").floatThead({
          scrollingTop: 60
        });
      });

    }
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

  .display-row {
    cursor: pointer;
    transition: background-color 0.5s ease;
    &:hover {
      background-color: #f1fbff;
      ;
    }
  }

  .class-name {
    color: rgb(184, 184, 184);
  }

  .class-altname {
    margin-right: 10px;
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
