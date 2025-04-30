<script setup>
import Image from "primevue/image";
import MainPic from "@/assets/mainpic.svg"; 
import { useRouter } from "vue-router";

const router = useRouter();

const getStarted = () => {
    router.push({ name: "search" });
};
</script>

<template>
  <div class="main-wrapper">
    <div class="main-container">
        <div class="main-text">
            <h1>Supercharge Your</h1>
            <h1>Literature Review with AI!</h1>
            <h2>Find, Refine, Discover - AI-Driven Literature Review!</h2>
        </div>
        <Button class="start-button" label="Get Started" icon="pi pi-arrow-right" iconPos="right" @click="getStarted" />
        <div class="main-image">
            <Image :src="MainPic" width="500"/>
        </div>
    </div>
  </div> 
</template>

<style>
.main-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 20px;
  box-sizing: border-box;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width:100%;
  max-width: 800px;
}

.main-image {
  flex: 1;
  display: flex;
  justify-content: center; 
  max-width: 100%;
  height: auto;
  padding-top: 30px
}

.main-text h1 {
  font-size: 45px;
  font-weight: bold;
  line-height: 1;
  color: #000;
  margin: 0;
  white-space: normal;
  width: auto;
  text-align: center;
}

.main-text h2 {
  font-size: 16px;
  font-weight: lighter;
  line-height: 1.4;
  color: #000;
  margin: 20;
  white-space: normal;
  width: auto;
  text-align: center;
}

.start-button {
  background-color: black; 
  color: white; 
  font-size: 14px;           
  top: 5px;
  bottom: 30px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
