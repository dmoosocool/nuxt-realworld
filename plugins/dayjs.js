import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('date', (value, format = 'MMM DD, YYYY') => {
  return dayjs(value).format(format)
})
