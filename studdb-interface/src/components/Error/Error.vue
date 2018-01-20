<template>
  <div style="margin-top: 80px;" class="container">
    <div class="alert alert-danger text-center">{{ errorMessage }}</div>
  </div>
</template>

<script>
import messages  from './messages.json';
export default {
  computed: {
    errorMessage() {
      const mes = messages[this.$route.params.which];
      // Because only programmers will try to change the parameter
      return mes === undefined ? 'Would you please stop messing with everything you can lay your hands on?!' : mes;
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      document.title = 'Error | ' + to.params.which;
    })
  }
}
</script>

<style scoped>
.alert {
  font-size: 1.5rem;
}
</style>


