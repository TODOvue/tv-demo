import TvDemo from './components/TvDemo.vue'
import './style.scss'
import 'highlight.js/styles/monokai.css';
import 'vue-highlight-code/dist/style.css';

(TvDemo as any).install = (app: any) => {
  app.component('TvDemo', TvDemo)
}

export const TvDemoPlugin = {
  install(app: any) {
    app.component('TvDemo', TvDemo)
  }
}

export { TvDemo }
export default TvDemo
