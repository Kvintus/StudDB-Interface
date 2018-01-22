<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-moj">
    <a class="navbar-brand" href="#">
      <img src="/static/images/logo.png" alt="">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse"
      aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav mr-auto">
        <li id="nav-students" class="nav-item">
          <router-link tag="a" class="nav-link" :class="{'active': route === '/list/students'}" :to="{name: 'studentsList'}">Students</router-link>
        </li>
        <li id="nav-classes" class="nav-item">
          <router-link tag="a" class="nav-link" :class="{'active': route === '/list/classes'}" :to="{name: 'classesList'}">Classes</router-link>
        </li>
        <li id="nav-professors" class="nav-item">
          <router-link tag="a" class="nav-link" :class="{'active': route === '/list/professors'}" :to="{name: 'professorsList'}">Professors</router-link>
        </li>
        <li id="nav-parents" class="nav-item">
          <router-link tag="a" class="nav-link" :class="{'active': route === '/list/parents'}" :to="{name: 'parentsList'}">Parents</router-link>
        </li>
        <!-- Add Button -->
        <li v-if="route.indexOf('/list') != -1 && user.privilege >=3" id="nav-parents" class="nav-item">
          <router-link tag="a" class="add-menu-button btn btn-outline-success" :to="{name: `${whatToAdd}Add`}">Add {{ whatToAdd }}</router-link>
        </li>
      </ul>
      <ul class="navbar-nav navbar-right">
        <li class="nav-item dropdown">
          <div class="user-container nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <p class="user-name">{{ user.username }}</p>
            <i class="fa fa-user user-icon" aria-hidden="true"></i>
          </div>
          <div class="dropdown-menu drp" aria-labelledby="navbarDropdownMenuLink">
            <a @click="logout" class="logout">
              <div class="dropdown-item logout-con">
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                Logout
              </div>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {
    computed: {
      // Return a currently logged-in user
      user() {
        return this.$store.state.user;
      },
      // Returns current route
      route() {
        return this.$route.path;
      },
      // Returns a string of the current route in singular
      whatToAdd() {
        // If there's a word 'classes' in the route
        if (this.route.indexOf('classes') != -1) {
          return 'class'
        } else {
          return this.route.slice('/list/'.length, this.route.length - 1) // route: '/list/students' -> student
        }
      }
    },
    methods: {
      logout() {
        this.$store.dispatch('logUserOut');
        this.$router.push({
          name: 'LoginRoute'
        });
      },
    },
  };

</script>


<style lang="scss" scoped>
  .bg-moj {
    background-color: #385777;
  }

  .add-menu-button {
    margin-left: 50px;
    @media screen and (max-width: 768px) {
      margin-left: 0px;
    }
  }

  .navbar-brand {
    img {
      width: 130px;
      border-radius: 50%;
      margin-top: -10px;
    }
  }

  .user-icon {
    font-size: 30px;
    color: white;
  }

  .user-name {
    display: inline;
    color: white;
    margin-right: 10px;
    font-size: 24px;
  }

  .user-container {
    cursor: pointer;
  }

  .drp {
    margin-left: -35px;
  }

  .dropdown-menu {
    /* Own Styles */
    padding: 0;

    /* Divider */
    .dropdown-divider {
      margin: 0;
    }
    /* Item */
    .dropdown-item {
      padding: 12px;
      &:hover {
        background-color: rgba(233, 233, 233, 0.39);
      }
    }
    /* First item of the dropdown */
    a:first-child {
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
    }
    /* Last item of the dropdown */
    a:last-child {
      border-bottom-left-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
    }
  }

  .logout {
    /* Own styles */
    display: inline;
    cursor: pointer;
    text-decoration: none !important;

    /* Container */
    .logout-con {
      color: #999;
      &:hover {
        color: gray;
      }
    }

    .fa-sign-out {
      margin-top: 3px;
      margin-right: 5px;
      float: right;
    }
  }

</style>
