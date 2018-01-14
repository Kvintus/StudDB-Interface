<template>
  <span class="placeholder" :class="{'placeholder-animation':loading}">{{ theInsideString }}</span>
</template>

<script>
  export default {
    props: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        loading: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    computed: {
      theInsideString() {
        // Generating the length
        const len = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
        let placeholder = '';

        // Populating it
        for (let i = 0; i < len; i++) {
          placeholder += ' ';
        }

        return placeholder;
      },
    },
  }

</script>


<style lang="scss" scoped>
  @keyframes placeHolderShimmer {
    0% {
      background-position: -468px 0
    }
    100% {
      background-position: 468px 0
    }
  }

  .placeholder-animation {
    animation-duration: 1.3s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    background-size: 800px 104px;
  }


  .placeholder {
    height: 96px;
    position: relative;
    margin: 0px;
    padding: 0px;
    color: rgb(225, 225, 225);
    background-color: rgb(225, 225, 225);
  }

</style>
