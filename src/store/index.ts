import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  modules: ['account'],
});

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store({ plugins: [vuexLocal.plugin] });
