<template>
  <router-link
    :to="{
      name: 'UserRetrieve',
      params: { id: user.id },
    }"
  >
    <v-card outlined>
      <div class="d-flex justify-space-between pr-2">
        <div class="d-none d-sm-block">
          <v-img
            height="100px"
            width="100px"
            src="http://unsplash.it/200/1000?random&gravity=center"
          ></v-img>
        </div>
        <div class="d-sm-none">
          <v-img
            height="60px"
            width="60px"
            src="http://unsplash.it/200/1000?random&gravity=center"
          ></v-img>
        </div>
        <div>
          <div class="text-h6 text-end">
            {{ `${user.first_name} ${user.last_name}` }}
          </div>
          <div class="d-flex text-body-2">
            <div>posts {{ user.posts.length }}</div>
            <div class="ml-2">threads {{ user.threads.length }}</div>
            <div class="ml-2">followers {{ user.followers.length }}</div>
          </div>
          <div class="text-caption text-uppercase text-end">
            joined at {{ user.date_joined | dateFormat }}
          </div>
        </div>
      </div>
    </v-card>
  </router-link>
</template>

<script lang="ts">
import { UserProxy } from '@/lutan-api';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProfileCard extends Vue {
  @Prop({ required: true }) user!: UserProxy;
}
</script>

<style scoped lang="scss"></style>
