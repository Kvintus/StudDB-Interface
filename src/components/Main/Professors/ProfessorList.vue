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
              <input id="inputTitle" v-model="filters.title" class="table-header" type="text" placeholder="Title">
              <img @click="changeSorter('title')" class="sipka sorter" :src="whichIcon('title')" alt="" srcset="">
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
              <input id="inputSurname" v-model="filters.surname" class="table-header" type="text" placeholder="Surname">
              <img @click="changeSorter('surname')" class="sipka sorter" :src="whichIcon('surname')" alt="" srcset="">
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
        <!-- Loader -->
        <tr v-if="allProfessors.length === 0" v-for="i in 20" :key="i"  class="display-row">
          <td class="student-table-id">
            <placeholder :min="2" :max="5" :loading="placeholderAnimation"></placeholder>
          </td>
          <td>
            <placeholder :min="6" :max="9" :loading="placeholderAnimation"></placeholder>
          </td>
          <td>
            <placeholder :min="9" :max="12" :loading="placeholderAnimation"></placeholder>
          </td>
          <td>
            <placeholder :min="9" :max="12" :loading="placeholderAnimation"></placeholder>
          </td>
          <td class="student-table-email">
            <placeholder :min="22" :max="26" :loading="placeholderAnimation"></placeholder>
          </td>
          <td class="student-table-phone">
            <placeholder :min="18" :max="20" :loading="placeholderAnimation"></placeholder>
          </td>
        </tr>
        <!-- Real Values -->
        <tr v-if="allProfessors.length !== 0" v-for="professor in professors" :key="professor.id" @click="displayProfessor(professor.id)" class="display-row">
          <td class="student-table-id">{{ professor['id'] }}</td>
          <td >{{ professor['title'] }}</td>
          <td>{{ professor['name'] }}</td>
          <td>{{ professor['surname'] }}</td>
          <td class="student-table-email">{{ professor['email'] }}</td>
          <td class="student-table-phone">{{ professor['phone'] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  let sticky = require('@/assets/js/stickyTableHeader');
  import AoSorter from '@/assets/js/Filters_and_Sorters/arrayOfObjectsSorter';
  import allFilters from '@/assets/js/Filters_and_Sorters/filters';
  import randomPlaceholder from '@/assets/js/randomPlaceholder.js';
  import tableManipulationMixin from '@/assets/js/tableManipulationMixin.js';
  import Placeholder from '@/components/shared/Placeholder';

  export default {
    mixins: [tableManipulationMixin],
    components: {
      Placeholder,
    },
    data() {
      return {
        // All the filters in one object
        filters: {
          id: '',
          name: '',
          surname: '',
          title: '',
        },

        // Sorter
        sorter: {
          by: 'id',
          order: 'desc',
        },
        placeholderAnimation: true,
      }
    },
    methods: {
      displayProfessor(id) {
        this.$router.push({ name: 'professorView', params: { id, } })
      },
      randomPlaceholder,
    },
    computed: {
      allProfessors () {
        return this.$store.getters.professors;
      },
      // Returns a list of studens who passed all the filters and are sorted
      professors() {
        if (this.allProfessors === []) {
          return [];
        }

        return this.allProfessors
          // ID filter, return only exact matches 
          .filter(allFilters.filterById(this.filters.id))
          .filter(allFilters.filterByProperty(this.filters.title, 'title'))
           // Name filter, if the student's name starts with the value of the filter
          .filter(allFilters.filterByProperty(this.filters.name, 'name'))
          // Surname filter, if the student's surname starts with the value of the filter
          .filter(allFilters.filterByProperty(this.filters.surname, 'surname'))
          // Sorts the filteres array with the setting in the sorter object 
          .sort(AoSorter(this.sorter));
      },
    },
    updated() {
      // "Turns on" the sticky header
      $(document).ready(function () {
        $(".sticky-header").floatThead({
          scrollingTop: 60
        });
      });
    },
    destroyed() {
      // If the user navigates away it clears the student list
      this.$store.commit('clearList', 'professors');
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        vm.$store.dispatch('fetchProfessors', {
          first: 12,
        })
        vm.$store.dispatch('fetchProfessors');
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

  .display-row {
    cursor: pointer;
    transition: background-color 0.5s ease;
    &:hover {
      background-color: #f1fbff;
      ;
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
