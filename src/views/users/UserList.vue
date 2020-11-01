<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          prepend-icon="mdi-account-search-outline"
          hide-details
          clearable
          @keyup.enter="onSearchChanged"
          placeholder="Search users"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="(user, index) in users"
        :key="user.id"
        v-intersect.once.quiet="
          index == users.length - 1 ? onIntersect : () => {}
        "
      >
        <ProfileCard :user="user" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ProfileCard from '@/components/account/ProfileCard.vue';
import { UserProxy } from '@/lutan-api';
import * as _ from 'lodash';
import lutanApis from '@/utils/lutan-apis';

@Component({
  components: {
    ProfileCard,
  },
})
export default class UserList extends Vue {
  private users: UserProxy[] = [];
  private search: string | null = null;

  private pageSize = 20;
  private nextPage: number | null = null;

  static debounced = _.debounce((self: UserList) => {
    self.users = [];
    self.fetchUsers(1, self.search);
  }, 500);

  @Watch('search')
  onSearchChanged() {
    UserList.debounced(this);
  }

  onIntersect() {
    if (this.nextPage) {
      this.fetchUsers(this.nextPage, this.search);
    }
  }

  created() {
    this.fetchUsers(1, this.search);
  }

  async fetchUsers(page: number, search: string | null) {
    const response = await lutanApis.authApi.authUsersList(
      search || undefined,
      undefined,
      undefined,
      undefined,
      page,
      this.pageSize
    );
    if (response.status === 200) {
      this.users = [...this.users, ...response.data.results];
      if (response.data.next !== null) {
        this.nextPage = page + 1;
      } else {
        this.nextPage = null;
      }
    }
  }
}
</script>

<style scoped></style>
