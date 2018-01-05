<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-moj">
    <a class="navbar-brand" href="#">
      <img src="static/images/logo.png" alt="">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse"
      aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav mr-auto">
        <li id="nav-students" class="nav-item">
          <router-link tag="a" class="nav-link" :class="{'active': route==='/list'}" :to="{name: 'StudentsList'}">Students</router-link>
        </li>
        <li id="nav-classes" class="nav-item">
          <router-link tag="a" class="nav-link" :to="{name: 'ClassesList'}">Classes</router-link>
        </li>
        <li id="nav-professors" class="nav-item">
          <router-link tag="a" class="nav-link" :to="{name: 'ProfessorsList'}">Professors</router-link>
        </li>
        <li id="nav-parents" class="nav-item">
          <router-link tag="a" class="nav-link" :to="{name: 'ParentsList'}">Parents</router-link>
        </li>
        <!--                     <% if currentAdd %>
                    <li id="nav-parents" class="nav-item">
                            <a class="add-menu-button btn btn-outline-success" href="%% currentAdd['where'] %%">Add %% currentAdd['what'] %%</a>
                    </li>
                    <% endif %> -->
      </ul>
      <ul class="navbar-nav navbar-right">
        <li class="nav-item dropdown">
          <div class="user-container nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <p class="user-name">{{ user.username }}</p>
            <i class="fa fa-user user-icon" aria-hidden="true"></i>
          </div>
          <div class="dropdown-menu drp" aria-labelledby="navbarDropdownMenuLink">
            <div v-if="user.privilege >= 3">
              <a style="color: #6f6f6f" class="dropdown-item" href="%% url_for('register') %%">Register</a>
              <div class="dropdown-divider"></div>
            </div>
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
      user() {
        return this.$store.state.user;
      },
      route() {
        return this.$route.path;
      },
    },
    methods: {
      logout() {
        this.$store.commit('logUserOut');
        this.$router.push({name: 'LoginRoute'});
      },
    },
  };

</script>

<style lang="scss" scoped>
  .bg-moj {
    background-color: #385777;
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
