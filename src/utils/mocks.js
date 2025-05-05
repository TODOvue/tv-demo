import Default from './demos/default.vue?raw'
import IsDevComponent from './demos/isDevComponent.vue?raw';
import HideBackground from './demos/hideBackground.vue?raw';
import DemoStyle from './demos/demoStyle.vue?raw';

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
    propsData: { demoStyle: true },
    description: 'This is a demo display for TODOvue components. Use this area to showcase the component\'s usage, props, variants, and live behavior in isolation.',
    html: DemoStyle
  }
]
