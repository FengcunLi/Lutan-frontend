import {
  Action,
  Module,
  Mutation,
  VuexModule,
  getModule,
} from 'vuex-module-decorators';

import store from '@/store';

let snackbarId = 1;

export interface Snackbar {
  id: number;
  message: string;
  color: string;
  timeout: number;
}

@Module({
  dynamic: true,
  store,
  name: 'snackbars',
})
class SnackbarsModule extends VuexModule {
  public snackbars: Snackbar[] = [];

  @Mutation
  ADD_SNACKBAR(snackbar: Snackbar) {
    this.snackbars.push(snackbar);
  }

  @Mutation
  REMOVE_SNACKBAR(snackbar: Snackbar) {
    this.snackbars = this.snackbars.filter(s => s !== snackbar);
  }

  @Action
  addSnackbar({
    message,
    color,
    timeout = 5000,
  }: {
    message: string;
    color: string;
    timeout?: number;
  }) {
    this.context.commit('ADD_SNACKBAR', {
      id: snackbarId++,
      message,
      color,
      timeout,
    });
  }

  @Action
  removeSnackbar(snackbar: Snackbar) {
    this.context.commit('REMOVE_SNACKBAR', snackbar);
  }
}

export const snackbarsModule = getModule(SnackbarsModule);
