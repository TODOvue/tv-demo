import Default from './demos/default.vue?raw'
import IsDevComponent from './demos/isDevComponent.vue?raw';
import HideBackground from './demos/hideBackground.vue?raw';
import DemoStyle from './demos/demoStyle.vue?raw';

const _style = {
  dark: {
    backgroundBody: "#000000",
    backgroundContent: "#1f1f1f",
    color: "#ffffff",
  },
  light: {
    backgroundBody: "#ffffff",
    backgroundContent: "#f5f5f5",
    color: "#000000",
  },
}

export const demos = [
  {
    id: 1,
    title: 'Default',
    propsData: {},
    description: 'This is a default demo display for TODOvue components. Use this area to showcase the component\'s usage, props, variants, and live behavior in isolation.',
    html: Default,
  },
  {
    id: 2,
    title: 'IsDevComponent',
    propsData: { isDevComponent: true },
    description: 'This is a demo display for TODOvue components. Use this area to showcase the component\'s usage, props, variants, and live behavior in isolation.',
    html: IsDevComponent
  },
  {
    id: 3,
    title: 'HideBackground',
    propsData: { hideBackground: true },
    description: 'This is a demo display for TODOvue components. Use this area to showcase the component\'s usage, props, variants, and live behavior in isolation.',
    html: HideBackground
  },
  {
    id: 4,
    title: 'DemoStyle',
    propsData: { demoStyle: _style },
    description: 'This is a demo display for TODOvue components. Use this area to showcase the component\'s usage, props, variants, and live behavior in isolation.',
    html: DemoStyle
  }
]
