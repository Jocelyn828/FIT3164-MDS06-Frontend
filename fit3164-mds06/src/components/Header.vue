<template>
    <header class="header">
      <div class="logo-container">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <span class="logo-text">PromptScholar</span>
      </div>
    </header>
  </template>
  
  <style scoped>
  .header {
    width: 100%;
    background-color: #ffffff;
    border-bottom: 1px solid #ddd;
    padding: 1rem 0 ; 
  }
  
  .logo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
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