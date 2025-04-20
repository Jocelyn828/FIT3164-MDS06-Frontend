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
  min-height: 100vh;
}

.content-container {
  flex: 1;
  padding-top: 70px;
}
</style>
