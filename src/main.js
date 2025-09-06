import { createApp } from 'vue'
import './style.css'
import TvDemo from './demo/Demo.vue'
import 'highlight.js/styles/monokai.css';
import 'vue-highlight-code/dist/style.css';

createApp(TvDemo).mount('#tv-demo')
