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
      <div class="main-content">
        <div class="main-text">
          <h1>Supercharge Your <span class="highlight">Literature Review</span> with AI!</h1>
          <p class="subtitle">Find, Refine, Discover - Transform your research process with our AI-powered platform</p>
          <div class="features">
            <div class="feature-item">
              <i class="pi pi-search-plus feature-icon"></i>
              <span>Smart Search</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-bolt feature-icon"></i>
              <span>Instant Analysis</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-file-pdf feature-icon"></i>
              <span>Citation Export</span>
            </div>
          </div>
          <Button class="start-button" label="Get Started" icon="pi pi-arrow-right" iconPos="right" @click="getStarted" />
        </div>
        <div class="main-image">
          <Image :src="MainPic" alt="AI Literature Review Tool" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.main-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  min-height: 80vh;
  background-color: #f8f9fa;
}

.main-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 3rem;
}

.main-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.main-text {
  flex: 1;
  padding: 20px 0;
}

.main-text h1 {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #333;
  margin-bottom: 20px;
}

.highlight {
  color: #9D34DA;
  position: relative;
}

.subtitle {
  font-size: 1.1rem;
  line-height: 1.5;
  color: #6c757d;
  margin-bottom: 30px;
}

.features {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-weight: 500;
}

.feature-icon {
  color: #9D34DA;
  font-size: 1.2rem;
}

.start-button {
  background-color: #9D34DA;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 14px rgba(157, 52, 218, 0.3);
  transition: all 0.3s ease;
}

.start-button:hover {
  background-color: #7209b7;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(157, 52, 218, 0.4);
}

.main-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-image img {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1));
}

/* Responsive styles */
@media (max-width: 992px) {
  .main-container {
    padding: 2rem;
  }
  
  .main-content {
    flex-direction: column-reverse;
    text-align: center;
  }
  
  .main-text h1 {
    font-size: 2rem;
  }
  
  .features {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .main-text {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .main-wrapper {
    padding: 1rem;
  }
  
  .main-container {
    padding: 1.5rem;
  }
  
  .main-text h1 {
    font-size: 1.75rem;
  }
  
  .features {
    flex-direction: column;
    align-items: center;
  }
}
</style>