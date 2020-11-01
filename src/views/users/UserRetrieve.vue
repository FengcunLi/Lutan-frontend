<template>
  <v-container>
    <div v-if="user" class="d-flex mb-4">
      <div style="width: 120px" class="flex-column d-flex align-center">
        <v-img height="120px" width="120px" :src="avatarSrc"></v-img>
        <div v-if="self && self.id == id">
          <v-btn
            small
            outlined
            rounded
            color="primary"
            id="pick-avatar"
            class="mt-1"
          >
            Change Avatar
          </v-btn>
          <AvatarCropper
            @uploaded="handleUploaded"
            trigger="#pick-avatar"
            :uploadUrl="uploadUrl"
            :uploadHeaders="avatarUploadHeaders"
            uploadFormName="image"
          />
        </div>
      </div>
      <div class="ml-4">
        <div class="text-h6">{{ user.first_name }} {{ user.last_name }}</div>
        <div class="text-body-2 text-uppercase">
          Joined At {{ user.date_joined | dateFormat }}
        </div>
        <div class="text-body-2 text-uppercase">
          Posts {{ user.posts.length }}
        </div>
        <div class="text-body-2 text-uppercase">
          Threads {{ user.threads.length }}
        </div>
        <div class="text-body-2 text-uppercase">
          Followers {{ user.followers.length }}
        </div>
      </div>
    </div>
    <v-divider></v-divider>

    <v-row>
      <v-col cols="12" md="2">
        <v-tabs :vertical="vertical" v-model="tabModel" center-active grow>
          <v-tab v-for="tab in tabs" :key="tab.name" class="justify-start">
            <v-icon left>
              {{ tab.icon }}
            </v-icon>
            {{ tab.name }}
          </v-tab>
        </v-tabs>
      </v-col>

      <v-col cols="12" md="10">
        <v-tabs-items v-model="tabModel">
          <v-tab-item :key="`Posts`">
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <!-- <ProfileCard /> -->
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="`Threads`">
            <v-card flat>
              <v-card-text>
                <ThreadList :starterId="id" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item key="Followers">
            <v-card flat>
              <v-card-text>
                <UserList :followingUserSearch="id" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item key="Following">
            <v-card flat>
              <v-card-text>
                <UserList :followedByUserSearch="id" />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AvatarCropper from '@/components/account/AvatarCropper.vue';
import { BASE_PATH } from '@/lutan-api/base';
import { Avatar, UserProxy } from '@/lutan-api';
import ProfileCard from '@/components/account/ProfileCard.vue';
import lutanApis from '@/utils/lutan-apis';
import { snackbarsModule } from '@/store/modules/snackbars';
import ThreadList from '@/components/thread/ThreadList.vue';
import { accountModule } from '@/store/modules/account';
import UserList from '@/components/account/UserList.vue';

@Component({
  components: {
    AvatarCropper,
    ProfileCard,
    ThreadList,
    UserList,
  },
})
export default class UserRetrieve extends Vue {
  @Prop({ required: true }) id!: string;
  private user: UserProxy | null = null;
  private uploadUrl = BASE_PATH + '/avatars/';

  private tabModel: string | null = null;
  private avatarUploadHeaders = {
    Authorization: `Token ${accountModule.getAuthToken}`,
  };
  private avatarSrc: string | null = null;

  private showThreadList = false;

  get self() {
    return accountModule.user;
  }
  get vertical() {
    if (
      this.$vuetify.breakpoint.name === 'sm' ||
      this.$vuetify.breakpoint.name === 'xs'
    ) {
      return false;
    }
    return true;
  }

  async created() {
    try {
      const response = await lutanApis.authApi.authUsersRead(parseInt(this.id));
      if (response.status == 200) {
        this.user = response.data;
        const avatar =
          this.user.avatars?.find(avatar => avatar.width == 200) || null;
        this.avatarSrc = avatar?.image || null;
      }
    } catch (error) {
      snackbarsModule.addSnackbar({
        message: 'Failed to load user. Please try again later.',
        color: 'error',
      });
    }
  }

  private tabs = [
    {
      name: 'Posts',
      icon: 'mdi-account',
    },
    {
      name: 'Threads',
      icon: 'mdi-lock',
    },
    {
      name: 'Followers',
      icon: 'mdi-access-point',
    },
    {
      name: 'Following',
      icon: 'mdi-access-point',
    },
  ];

  handleUploaded(resp: Avatar) {
    this.avatarSrc = resp.image || null;
  }
}
</script>

<style scoped></style>
