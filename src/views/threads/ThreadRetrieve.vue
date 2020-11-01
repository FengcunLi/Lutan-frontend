<template>
  <v-container>
    <v-row v-if="thread">
      <v-col md="4" class="d-none d-md-block">
        <v-list dense class="grey lighten-3">
          <v-subheader class="pl-4 text-uppercase">Participants</v-subheader>
          <v-list-item
            v-for="participant in participants"
            :key="participant.id"
          >
            <v-list-item-avatar>
              <Avatar :user="participant" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ participant.first_name }} {{ participant.last_name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" md="8">
        <div>
          <h4 class="text-h5 mb-4">{{ thread.title }}</h4>
          <div class="d-flex align-center mb-2">
            <Avatar :user="thread.starter" :size="36" class="mr-4" />
            <div>
              {{ thread.starter.first_name }}
              {{ thread.starter.last_name }}
            </div>
            <v-spacer></v-spacer>
            <div class="d-flex">
              <v-btn
                small
                text
                color="primary"
                v-if="thread.can_change_this_thread"
                @click="onEdit"
              >
                Edit
              </v-btn>
              <ConfirmDialog
                v-if="thread.can_delete_this_thread"
                message="Are you sure to delete this thread?"
                @confirm="onDeleteThread"
              >
                <template v-slot:activator="{ click }">
                  <v-btn small text color="error" @click="click">
                    Delete
                  </v-btn>
                </template>
              </ConfirmDialog>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="mt-2 thread-content" v-html="thread.content"></div>
          <div class="grey--text text-overline">
            {{ thread.created_on | dateTimeFormat }}
          </div>
        </div>

        <ThreadCommentTextField
          :thread="thread"
          class="mb-6"
          @submit="onPostSubmit"
        />

        <div>
          <div v-for="post in thread.posts" :key="post.id" class="mb-8">
            <ThreadPostComponent
              :thread="thread"
              :post="post"
              class="mb-4"
              @submit="onPostSubmit"
            />
            <div
              v-for="reply in descendants.get(post.id)"
              :key="reply.id"
              class="mb-4 ml-8"
            >
              <ThreadPostComponent
                :thread="thread"
                :post="reply"
                @submit="onPostSubmit"
              />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ThreadRetrieveModel, Poster, PostReadOnly } from '@/lutan-api';
import ThreadCommentTextField from '@/components/thread/ThreadCommentTextField.vue';
import ThreadPostComponent from '@/components/thread/ThreadPostComponent.vue';
import Avatar from '@/components/account/Avatar.vue';
import lutanApis, { deleteThread } from '@/utils/lutan-apis';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { LogInRequired } from '@/utils/account';

@Component({
  components: {
    ThreadCommentTextField,
    ThreadPostComponent,
    Avatar,
    ConfirmDialog,
  },
})
export default class ThreadRetrieveView extends Vue {
  @Prop({ required: true }) id!: string;
  private thread: ThreadRetrieveModel | null = null;
  private descendants = new Map<number, PostReadOnly[]>();

  get allPosts() {
    if (this.thread && this.thread.posts) {
      let allPosts = this.thread.posts;
      for (const posts of this.descendants.values()) {
        allPosts = allPosts.concat(posts);
      }
      return allPosts;
    } else {
      return [];
    }
  }

  get participants() {
    const participants = new Map<number, Poster>();

    for (const post of this.allPosts) {
      const poster = post.poster;
      if (!participants.has(poster.id!)) {
        participants.set(poster.id!, poster);
      }
    }

    return participants.values();
  }

  static getDescendants(root: PostReadOnly) {
    let descendants = root.children!.map(post => {
      post.content =
        `<span class="text-subtitle-1">@${root.poster.first_name} ${root.poster.last_name}</span>` +
        post.content;
      return post;
    });

    for (const child of root.children!) {
      descendants = descendants.concat(
        ThreadRetrieveView.getDescendants(child)
      );
    }

    return descendants;
  }

  async fetchThread() {
    const threadsApi = lutanApis.threadsApi;
    try {
      const response = await threadsApi.threadsRead(this.id);
      if (response.status === 200) {
        this.thread = response.data;
        for (const post of this.thread.posts!) {
          this.descendants.set(
            post.id!,
            ThreadRetrieveView.getDescendants(post).sort((a, b) =>
              a.created_on! < b.created_on! ? -1 : 1
            )
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  created() {
    this.fetchThread();
  }
  onPostSubmit() {
    this.fetchThread();
  }

  onEdit() {
    this.$router.push({
      name: 'ThreadEdit',
      params: { id: this.thread!.id!.toString() },
    });
  }

  @LogInRequired
  async onDeleteThread() {
    await deleteThread(this.thread!.id!.toString());
    this.$router.push({ name: 'Home' });
  }
}
</script>

<style lang="scss" scoped>
.thread-content {
  ::v-deep img {
    max-width: 100%;
  }
}
</style>
