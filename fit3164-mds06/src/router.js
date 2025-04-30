import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import SearchPage from "@/views/SearchPage.vue";
import ResultsPage from "@/views/ResultsPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: MainPage,
  },
  {
    path: "/search",
    name: "search",
    component: SearchPage,
  },
  {
    path: "/results",
    name: "results",
    component: ResultsPage,
    props: (route) => ({ query: route.query.q }), // Pass the search query as a prop
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;