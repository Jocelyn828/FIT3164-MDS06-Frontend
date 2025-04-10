<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Left Section: Logo + Icons -->
      <div class="footer-left">
        <div class="logo-row">
          <img src="@/assets/logo.svg" alt="Logo" class="footer-logo" />
          <span class="footer-title">PromptScholar</span>
        </div>
      </div>

      <!-- Right Section: About + Text -->
      <div class="footer-right">
        <h4><strong>About Us</strong></h4>
        <p>We are a group of final-year students from Monash University Malaysia, majoring in Data Science. 
          Our final year project focuses on developing an LLM-assisted literature review tool that helps users 
          generate effective search queries based on their research questions, refine them and retrieve relevant academic papers. </p>
        <p class="copyright">
          © 2025 Monash University Malaysia, Bachelor of Computer Science in Data Science, MDS06 Final Year Project.
        </p>
      </div>
    </div>
  </footer>
</template>
  
<style scoped>
.footer {
  width: 100%;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 20px 0px;
  font-size: 14px;
}

.footer-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 40px;   /* control spacing between left and right*/
}

.footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 200px;
}

.logo-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.footer-logo {
  height: 30px;
  width: auto;
  margin-right: 10px;
}

.footer-title {
  font-weight: bold;
  font-size: 16px;
}

.footer-right {
  max-width: 800px;
  text-align: left;
  font-size: 0.85rem;
  color: #555;
  flex-grow:1;
}

.footer-right p {
  margin: 4px 0;
  color: #666;
  line-height: 1.0;
}

.footer-right p strong {
  color: #000;
}

.footer-right .copyright {
  margin-top: 10px;
  font-size: 12px;
  color: #aaa;
}

.footer-right h4 {
  margin: 0 0 8px 0;
}

</style>