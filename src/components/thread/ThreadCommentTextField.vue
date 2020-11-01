<template>
  <div class="text-field">
    <v-progress-linear
      indeterminate
      height="2"
      v-show="isSubmitting"
    ></v-progress-linear>
    <v-textarea
      solo
      flat
      hide-details
      style="border:none"
      rows="1"
      auto-grow
      placeholder="Leave a comment."
      v-model="content"
    ></v-textarea>
    <v-divider></v-divider>
    <div class="d-flex pa-1">
      <v-spacer></v-spacer>
      <v-btn text @click="onCancel">Cancel</v-btn>
      <v-btn
        depressed
        color="primary"
        @click="onSubmit"
        :disabled="content.length === 0"
        >Submit</v-btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ThreadRetrieveModel, PostWritable } from '@/lutan-api';
import { accountModule } from '@/store/modules/account';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { LogInRequired } from '@/utils/account';
import { createPost } from '@/utils/lutan-apis';

@Component
export default class ThreadCommentTextField extends Vue {
  private isSubmitting = false;
  private content = '';

  @Prop({ required: true }) thread!: ThreadRetrieveModel;

  @LogInRequired
  async onSubmit() {
    this.isSubmitting = true;
    const post: PostWritable = {
      poster: accountModule.user!.id,
      thread: this.thread.id!,
      content: this.content,
      parent: null,
    };

    const result = await createPost(post);
    if (result === 0) {
      this.content = '';
      this.$emit('submit');
    }
    this.isSubmitting = false;
  }

  onCancel() {
    this.content = '';
  }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.text-field {
  border: 1px solid map-get($grey, lighten-1);
}
</style>
