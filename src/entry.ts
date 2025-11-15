import TvDemo from './components/TvDemo.vue'
import './style.scss'

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
