<template>
  <div>
    <div class="d-flex align-center mb-2">
      <Avatar :user="post.poster" class="mr-4" />
      <div class="text-subtitle-2">
        {{ post.poster.first_name }} {{ post.poster.last_name }}
      </div>
    </div>
    <div v-html="post.content" class="text-body-2 post-content"></div>
    <div class="d-flex align-center grey--text text-overline">
      <v-btn
        icon
        small
        @click="onLike"
        v-if="post.can_like_this_post && !likedByCurrentUser"
      >
        <v-icon small>mdi-heart-outline</v-icon>
      </v-btn>
      <v-btn icon small @click="onCancelLike" v-if="likedByCurrentUser">
        <v-icon small>mdi-heart</v-icon>
      </v-btn>

      <div class="mr-3">{{ likesNumber }}</div>
      <div class="mr-3">
        {{ post.created_on | dateTimeFormat }}
      </div>
      <div class="text-decoration-underline" @click="onReply" role="button">
        Reply
      </div>
    </div>
    <v-expand-transition>
      <ThreadReplyTextField
        :post="post"
        :thread="thread"
        @cancel="isOpen = false"
        @submit="onSubmit"
        v-if="isOpen"
      />
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { PostReadOnly, ThreadRetrieveModel } from '@/lutan-api';
import { Component, Vue, Prop } from 'vue-property-decorator';
import ThreadReplyTextField from '@/components/thread/ThreadReplyTextField.vue';
import { accountModule } from '@/store/modules/account';
import Avatar from '@/components/account/Avatar.vue';
import { LogInRequired } from '@/utils/account';
import lutanApis from '@/utils/lutan-apis';
import { snackbarsModule } from '@/store/modules/snackbars';

@Component({
  components: {
    ThreadReplyTextField,
    Avatar,
  },
})
export default class ThreadPostComponent extends Vue {
  private isOpen = false;
  private likedByCurrentUser = false;
  private likesNumber = 0;

  private get user() {
    return accountModule.user;
  }

  @Prop({ required: true }) post!: PostReadOnly;
  @Prop({ required: true }) thread!: ThreadRetrieveModel;

  created() {
    this.likedByCurrentUser = this.post.liked_by_current_user || false;
    this.likesNumber = this.post.post_likes?.length || 0;
  }

  onReply() {
    this.isOpen = !this.isOpen;
  }

  @LogInRequired
  async onLike() {
    try {
      const response = await lutanApis.postsApi.postsLike(this.post.id!, {});
      if (response.status === 201) {
        snackbarsModule.addSnackbar({
          message: 'Liked post successfully.',
          color: 'success',
        });
        this.likedByCurrentUser = true;
        this.likesNumber++;
      }
    } catch (e) {
      snackbarsModule.addSnackbar({
        message: 'Failed to like post. Please try again later.',
        color: 'error',
      });
    }
  }

  @LogInRequired
  async onCancelLike() {
    try {
      const response = await lutanApis.postsApi.postsCancelLike(this.post.id!);
      if (response.status === 204) {
        snackbarsModule.addSnackbar({
          message: 'Canceled like successfully.',
          color: 'success',
        });
        this.likedByCurrentUser = false;
        this.likesNumber--;
      }
    } catch (e) {
      snackbarsModule.addSnackbar({
        message: 'Failed to cancel like. Please try again later.',
        color: 'error',
      });
    }
  }

  onSubmit() {
    this.isOpen = false;
    this.$emit('submit');
  }
}
</script>

<style lang="scss" scoped>
.post-content {
  ::v-deep img {
    max-width: 100%;
  }
}
</style>
