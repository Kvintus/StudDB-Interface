<template>
<div>
    <app-navbar></app-navbar>
    <router-view></router-view>
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

<style>
 body {
   /* Thanks to the navbar */
   margin-top: 60px;
 }
</style>

