<script setup>
import Image from "primevue/image";
import LoadingPic from "@/assets/loadingpic.svg"; 
import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  // Simulate back-end loading time, then redirect to results page
  setTimeout(() => {
    const query = route.query.q
    router.replace({ name: 'results', query: { q: query } })
  }, 5000) // 5 seconds loading screen
})

</script>

<template>
  <div class="loading-wrapper">
    <div class="loading-container">
      <div class="loading-text">
        <h1>Gathering the best research articles just for you...</h1>
      </div>
      
      <div class="loading-image">
        <Image :src="LoadingPic" width="250"/>
      </div>
    </div>
  </div> 
</template>

<style>
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  box-sizing: border-box;
  margin-top: 100px;
}

.loading-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width:100%;
  max-width: 800px;
}

.loading-image {
  flex: 1;
  display: flex;
  justify-content: center; 
  max-width: 100%;
  height: auto;
  padding-bottom: 20px;
}

.loading-text h1 {
  font-size: 30px;
  font-weight: bold;
  line-height: 1.4;
  color: #000;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid #000;
  width: 0;
  animation: typing 5s steps(50, end) infinite, blink 0.75s step-end infinite;
}

@keyframes typing {
  0% { width: 0 }
  50% { width: 100% }
  100% { width: 0 }
}

@keyframes blink {
  from, to { border-color: transparent }
  50% { border-color: black }
}

</style>
