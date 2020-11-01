<template>
  <div class="app-bar-container">
    <v-container>
      <div class="d-flex align-center">
        <div>
          <router-link :to="{ name: 'Home' }">
            <h4 class="text-h4 text-uppercase black--text">
              Lutan
            </h4>
          </router-link>
        </div>
        <div
          class="d-none d-md-block text-subtitle-1 text-uppercase ml-4 nav-links"
        >
          <router-link class="mr-4" :to="{ name: 'Home' }">
            <span>Threads</span>
          </router-link>
          <router-link class="mr-4" :to="{ name: 'UserList' }">
            <span>Users</span>
          </router-link>
        </div>
        <v-spacer></v-spacer>

        <router-link :to="{ name: 'ThreadCreate' }">
          <v-btn text color="primary">Create thread</v-btn>
        </router-link>

        <div v-if="user === null" class="d-none d-md-block">
          <v-btn text @click="openLogInDialog">Log In</v-btn>
          <v-btn text @click="openSignUpDialog">Sign Up</v-btn>
        </div>
        <v-menu v-if="user === null" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" class="d-md-none">
              <v-icon>
                mdi-account
              </v-icon>
            </v-btn>
          </template>
          <v-list dense class="text-uppercase">
            <v-list-item @click="openLogInDialog">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-2">
                  Log In
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="openSignUpDialog">
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-2">
                  Sign Up
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu v-else offset-y open-on-hover bottom>
          <template v-slot:activator="{ on, attrs }">
            <div class="d-flex align-center" v-on="on" v-bind="attrs">
              <Avatar :user="user" class="mr-4" />
              <div class="d-none d-md-block">
                {{ user.first_name }} {{ user.last_name }}
              </div>
            </div>
          </template>

          <v-list dense class="text-uppercase">
            <v-list-item>
              <v-list-item-title>
                <router-link
                  :to="{
                    name: 'UserRetrieve',
                    params: { id: user.id.toString() },
                  }"
                >
                  Profile
                </router-link>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="logOut" role="button"
                >Log Out
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div>
        <div class="d-flex d-md-none mt-2">
          <v-tabs grow>
            <v-tab exact :to="{ name: 'Home' }">Threads</v-tab>
            <v-tab exact :to="{ name: 'UserList' }">Users</v-tab>
          </v-tabs>
        </div>
      </div>
    </v-container>
    <v-divider></v-divider>
  </div>
</template>

<script lang="ts">
import { accountModule } from '@/store/modules/account';
import { Component, Vue } from 'vue-property-decorator';
import Avatar from '@/components/account/Avatar.vue';

@Component({
  components: { Avatar },
})
export default class AppBar extends Vue {
  private get user() {
    return accountModule.user;
  }

  openLogInDialog() {
    accountModule.setLogInDialog(true);
  }

  openSignUpDialog() {
    accountModule.setSignUpDialog(true);
  }

  async logOut() {
    await accountModule.logOut();
    // this.$router.push('/');
  }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.app-bar-container {
  position: sticky;
  position: -webkit-sticky;
  top: 0px;
  z-index: 100;
  background-color: white;
}

.nav-links a {
  span {
    color: #888;
  }

  &.router-link-exact-active {
    span {
      color: var(--v-primary-base);
    }
  }
}
</style>
