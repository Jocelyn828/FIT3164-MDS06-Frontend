<script setup>
import { RouterView } from "vue-router";
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-layout">
    <Header />
    <main class="content-container">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%; 
}

.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* prevent whole-page scroll */
}

.content-container {
  flex: 1;
  overflow-y: auto;  /* only scroll main content */
}
</style>
