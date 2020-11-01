<template>
  <div>
    <v-list>
      <v-list-item
        v-for="user in users"
        :key="user.id"
        @click="clickTitle(user.id)"
      >
        <v-list-item-avatar>
          <Avatar :user="user" :size="32" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ user.first_name }} {{ user.last_name }}
          </v-list-item-title>
          <v-list-item-subtitle class="d-flex">
            <v-spacer></v-spacer>
            <span class="mr-4 text-uppercase">
              posts {{ user.posts.length }}
            </span>
            <span class="mr-4 text-uppercase">
              threads {{ user.threads.length }}
            </span>
            <span class="mr-4 text-uppercase">
              followers {{ user.followers.length }}
            </span>
          </v-list-item-subtitle>
          <v-divider></v-divider>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-pagination
      v-if="paginationLength > 0"
      :length="paginationLength"
      :value="page"
      :total-visible="7"
      @input="onPageChanged"
    >
    </v-pagination>
  </div>
</template>

<script lang="ts">
import { UserProxy } from '@/lutan-api';
import lutanApis from '@/utils/lutan-apis';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Avatar from '@/components/account/Avatar.vue';
import { snackbarsModule } from '@/store/modules/snackbars';

@Component({
  components: { Avatar },
})
export default class UserList extends Vue {
  @Prop({ default: null }) followingUserSearch!: number | null;
  @Prop({ default: null }) followedByUserSearch!: number | null;

  private users: UserProxy[] = [];
  private page: number | null = null;
  private pageSize = 10;
  private totalThreadsCount: number | null = null;

  get paginationLength() {
    // Only show v-pagination when this.totalThreadsCount is not null and not zero.
    if (this.totalThreadsCount) {
      return Math.ceil(this.totalThreadsCount / this.pageSize);
    } else {
      return null;
    }
  }

  async created() {
    await this.fetchUsers(1);
    this.page = 1;
  }

  async onPageChanged(page: number) {
    await this.fetchUsers(page);
    this.page = page;
  }

  async fetchUsers(page: number) {
    try {
      const response = await lutanApis.authApi.authUsersList(
        undefined,
        this.followingUserSearch || undefined,
        this.followedByUserSearch || undefined,
        undefined,
        page,
        this.pageSize
      );
      if (response.status === 200) {
        this.users = response.data.results;
        this.totalThreadsCount = response.data.count;
      }
    } catch (error) {
      snackbarsModule.addSnackbar({
        message: 'Failed to load user list. Please try again later.',
        color: 'error',
      });
    }
  }

  clickTitle(userId: number) {
    this.$router.push({
      name: 'UserRetrieve',
      params: { id: userId.toString() },
    });
  }
}
</script>

<style scoped></style>
