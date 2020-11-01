import App from './App.vue';
import Vue from 'vue';
import moment from 'moment';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.filter(
  'dateTimeFormat',
  (dateString: string, pattern = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(dateString).format(pattern);
  }
);

Vue.filter('dateFormat', (dateString: string, pattern = 'YYYY-MM-DD') => {
  return moment(dateString).format(pattern);
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
