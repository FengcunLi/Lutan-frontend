import {
  Action,
  Module,
  Mutation,
  MutationAction,
  VuexModule,
  getModule,
} from 'vuex-module-decorators';
import { AuthApi, TokenCreate, UserCreate, UserProxy } from '@/lutan-api';

import store from '@/store';

interface AccountState {
  user: UserProxy | null;
  authToken: string;
}

const authApi = new AuthApi();

@Module({
  dynamic: true,
  store,
  name: 'account',
  preserveState: localStorage.getItem('vuex') !== null,
})
class AccountModule extends VuexModule implements AccountState {
  public user: UserProxy | null = null;
  public authToken = '';

  public logInDialog = false;
  public signUpDialog = false;

  get getAuthToken() {
    return this.authToken;
  }

  @Mutation
  SET_LOG_IN_DIALOG(value: boolean) {
    this.logInDialog = value;
  }

  @Action
  setLogInDialog(value: boolean) {
    this.context.commit('SET_LOG_IN_DIALOG', value);
  }

  @Mutation
  SET_SIGN_UP_DIALOG(value: boolean) {
    this.signUpDialog = value;
  }

  @Action
  setSignUpDialog(value: boolean) {
    this.context.commit('SET_SIGN_UP_DIALOG', value);
  }

  @Mutation
  CLEAR_AUTH_TOKEN() {
    this.authToken = '';
  }

  @Mutation
  CLEAR_USER() {
    this.user = null;
  }

  @MutationAction
  public async logIn({ email, password }: { email: string; password: string }) {
    const data: TokenCreate = {
      email,
      password,
    };
    const response = await authApi.authTokenLoginCreate(data);
    if (response.status === 200) {
      const authToken: string = (response.data as any).auth_token;
      return { authToken };
    } else {
      throw new Error(
        `Response status is supposed to be 200 but got ${response.status}`
      );
    }
  }

  @MutationAction
  public async getProfile() {
    const response = await authApi.authUsersMeRead(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        headers: {
          Authorization: `Token ${this.getters!.getAuthToken}`,
        },
      }
    );
    if (response.status === 200) {
      return { user: (response.data as any) as UserProxy };
    } else {
      throw new Error(
        `Response status is supposed to be 200 but got ${response.status}`
      );
    }
  }

  @Action
  public async logOut() {
    try {
      const response = await authApi.authTokenLogoutCreate({
        headers: {
          Authorization: `Token ${this.getAuthToken}`,
        },
      });
      if (response.status === 204) {
        this.context.commit('CLEAR_AUTH_TOKEN');
        this.context.commit('CLEAR_USER');
      } else {
        throw new Error(
          `Response status is supposed to be 204 but got ${response.status}`
        );
      }
    } catch (error) {
      this.context.commit('CLEAR_AUTH_TOKEN');
      this.context.commit('CLEAR_USER');
    }
  }

  @Action
  public async signUp(data: UserCreate) {
    const response = await authApi.authUsersCreate(data);
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(
        `Response status is supposed to be 201 but got ${response.status}`
      );
    }
  }
}

export const accountModule = getModule(AccountModule);
