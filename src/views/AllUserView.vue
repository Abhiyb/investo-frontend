<script setup>
import AppNavbar from '../components/Navbar.vue'
import AppSidebar from '../components/Sidebar.vue'
    import AllUsers from '../components/AllUsers.vue';
</script>

<template>
     <div class="app-container">
  <!-- Import Navbar component -->
  <AppNavbar />

<div class="content-wrapper">
  <!-- Import Sidebar component -->
  <AppSidebar />
  <div class="main-content">
    <AllUsers/>
</div></div></div>
</template>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
 /* Content Layout */
 .content-wrapper {
  display: flex;
  flex: 1;
}
.main-content {
  flex: 1;
  padding: 30px;
  background-color: #ffffff;
}
</style>