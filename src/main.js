import {createApp} from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import globalComponents from '@/global-components'
import appComponents from '@/app-components/index'
import utils from '@/utils'
import '@/libs'

import 'mosha-vue-toastify/dist/style.css'

import $ from 'jquery'
import './assets/css/main.css'
// SASS Theme
import './assets/sass/app.scss'
import {createI18n} from 'vue-i18n'
import ru from './i18n/messages/ru.json'
import kg from './i18n/messages/kg.json'
import en from './i18n/messages/en.json'


const i18n = createI18n({
  legacy: false,
  locale: 'ru', // язык по умолчанию
  fallbackLocale: 'ru',
  messages: {
   ru,kg, en
  }
})
const app = createApp(App)
  .use(store)
  .use(router)
  .use(i18n)


appComponents.forEach(c => {
  app.component(c.name, c.component)
})

globalComponents(app)
utils(app)

app.mount('#app')
