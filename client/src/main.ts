import { createApp } from 'vue'
import './style.css'
import router from "./router";
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import { createBootstrap } from 'bootstrap-vue-next'

const app = createApp(App);
app.use(createBootstrap());
app.use(router);
app.mount('#app');