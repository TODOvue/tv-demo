import { App, Plugin } from 'vue'
import TvDemo from './components/TvDemo.vue'
import './style.scss'
import 'highlight.js/styles/monokai.css'
import 'vue-highlight-code/dist/style.css'

type SFCWithInstall<T> = T & Plugin

const TvDemoPlugin: SFCWithInstall<typeof TvDemo> = TvDemo as any

TvDemoPlugin.install = (app: App) => {
  app.component('TvDemo', TvDemo)
}

export { TvDemo }

export default TvDemoPlugin
