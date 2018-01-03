<template>
  <div id="wrapper">
    <div class="container">
      <div style="width: auto;text-align:center;" class="card card-container vcenter">
        <img id="profile-img" class="profile-img-card" src="static/images/logo.png" />
        <div>
          <div class="alert alert-danger" v-if="error.is && sent.was">{{ error.message }}</div>
          <form @submit.prevent="login" class="form-signin">
            <span id="reauth-email" class="reauth-email"></span>
            <input v-model="username" type="text" name="username" id="inputUsername" class="form-control" placeholder="Username" autofocus>
            <input v-model="password" name="password" type="password" id="inputPassword" class="form-control" placeholder="Password">
            <button class="btn btn-lg btn-primary btn-block btn-signin" type="submit">Sign in</button>
          </form>
          <!-- /form -->
        </div>
      </div>
      <!-- /card-container -->
    </div>
    <!-- /container -->
  </div>
</template>

<script>
  export default {
    created() {
      document.title = 'Login';
    },
    data() {
      return {
        username: '',
        password: '',
        sent: {
          was: false,
          error: false,
          message: '',
        },
      };
    },
    methods: {
      login() {
      if (this.username && this.password){
        this.sent.was = true;
        this.axios.post('http://127.0.0.1:5000/user', {
          username: this.username,
          password: this.password,
        })
          .then((resp) => {
            if (resp.data.success) {
              window.location.href = 'www.google.com';
            } else {
              this.sent.error = true;
              this.sent.message = resp.data.message;
            }
          });
      }
      },
    },
    computed: {
      error() {
        if (this.sent.error) {
          return {
            is: true,
            message: this.sent.message,
          }
        } else if (this.username.length < 1) {
          return {
            is: true,
            message: 'Please fill in the username',
          };
        } else if (this.password.length < 1) {
          return {
            is: true,
            message: 'Plase fill in the Password',
          };
        }

        return {
          is: false,
          message: '',
        };
      },
    },
  };

</script>


<style lang="scss" scoped>
  .alert {
    max-width: 227px;
  }
  .container {
    display: flex;
  }

  #wrapper {
    height: 100vh;
    background-color: #385777;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-container.card {
    text-align: left;
    padding: 40px 40px;
  }

  .card-container.card>* {
    display: inline-block;
    vertical-align: middle;
  }


  .btn {
    font-weight: 700;
    height: 36px;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    cursor: default;
  }
  /*
 * Card component
 */

  .card {
    background-color: #F7F7F7;
    /* just in case there no content*/
    padding: 20px 25px 30px;
    margin: 0 auto 25px;
    /* shadows and rounded borders */
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  }

  .profile-img-card {
    height: 96px;
    margin-right: 20px;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
  }
  /*
 * Form styles
 */

  .profile-name-card {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin: 10px 0 0;
    min-height: 1em;
  }

  .reauth-email {
    display: block;
    color: #404040;
    line-height: 2;
    margin-bottom: 10px;
    font-size: 14px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .form-signin #inputUsername,
  .form-signin #inputPassword {
    direction: ltr;
    height: 44px;
    font-size: 16px;
  }

  .form-signin input[type=email],
  .form-signin input[type=password],
  .form-signin input[type=text],
  .form-signin button {
    width: 100%;
    display: block;
    margin-bottom: 10px;
    z-index: 1;
    position: relative;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .form-signin .form-control:focus {
    border-color: rgb(104, 145, 162);
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgb(104, 145, 162);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgb(104, 145, 162);
  }

  .btn.btn-signin {
    /*background-color: #4d90fe; */
    background-color: rgb(104, 145, 162);
    /* background-color: linear-gradient(rgb(104, 145, 162), rgb(12, 97, 33));*/
    padding: 0px;
    font-weight: 700;
    font-size: 14px;
    height: 36px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    border: none;
    -o-transition: all 0.218s;
    -moz-transition: all 0.218s;
    -webkit-transition: all 0.218s;
    transition: all 0.218s;
  }

  .btn.btn-signin:hover,
  .btn.btn-signin:active,
  .btn.btn-signin:focus {
    background-color: rgb(12, 97, 33);
  }

  .forgot-password {
    color: rgb(104, 145, 162);
  }

  .forgot-password:hover,
  .forgot-password:active,
  .forgot-password:focus {
    color: rgb(12, 97, 33);
  }

  .vcenter {
    display: inline-block;
    vertical-align: middle;
    float: none;
  }

</style>
