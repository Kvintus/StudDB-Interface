<template>
    <div class="alert alert-danger">
        <p>{{ message }}</p>
    </div>
</template>

<script>
export default {
    computed: {
        message() {
            return this.$route.query.message;
        }
    }
}
</script>

