<template>
    <header class="header">
      <div class="header-inner">
        <router-link to="/" class="logo-container">
          <img src="@/assets/logo.svg" alt="Logo" class="logo" />
          <span class="logo-text">PromptScholar</span>
        </router-link>
      </div>
    </header>
  </template>
  
  <style scoped>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: 70px;
    width: 100%;
    background-color: #ffffff;
    border-bottom: 1px solid #ddd;
    padding: 0 ; 
  }
  
  .header-inner {
    margin: 0 auto;
    padding: 0 130px;
    height: 100%;
    display: flex;
    align-items: center;
}

  .logo-container {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items:center;
  }
  
  .logo {
    height: 40px;    
    width: auto; 
    object-fit: contain;
  }

  .logo-text {
    margin-left: 10px;
    font-size: 1.2rem;
    font-weight: bold;
  }
  </style>