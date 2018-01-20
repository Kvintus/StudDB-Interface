<template>
<div>
    <app-navbar></app-navbar>
    <router-view class="matop"></router-view>
</div>
</template>

<script>
import Navbar from '@/components/shared/Navbar';

export default {
    components: {
        appNavbar: Navbar,
    },
};
</script>

<style scoped>
 .matop {
   /* Thanks to the navbar */
   margin-top: 100px;
 }
</style>

