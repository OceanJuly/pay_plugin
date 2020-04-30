import keyboard from './pay'
const zfcPassword = {
  install (Vue, options) {
    Vue.component('pay', keyboard)
  }
}

export default zfcPassword
