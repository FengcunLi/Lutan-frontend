<template>
  <div style="position:relative;min-height:200px">
    <div v-if="threads.length === 0" class="pt-6 text-center text-subtitle-1">
      There is no threads here :)
    </div>
    <v-list v-else>
      <v-list-item v-for="thread in threads" :key="thread.id">
        <v-list-item-content>
          <v-list-item-title @click="clickTitle(thread.id)" role="button">
            {{ thread.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="d-flex align-end">
            <router-link
              to="/starter"
              v-if="thread.category"
              class="d-none d-md-block"
            >
              <span class="caption grey--text">
                {{ thread.category.name }}
              </span>
            </router-link>
            <v-spacer></v-spacer>
            <div class="d-flex">
              <v-btn
                small
                text
                color="primary"
                v-if="thread.can_change_this_thread"
                @click="onEdit(thread)"
              >
                Edit
              </v-btn>
              <ConfirmDialog
                v-if="thread.can_delete_this_thread"
                message="Are you sure to delete this thread?"
                @confirm="onDeleteThread(thread)"
              >
                <template v-slot:activator="{ click }">
                  <v-btn small text color="error" @click="click">
                    Delete
                  </v-btn>
                </template>
              </ConfirmDialog>
            </div>
            <div class="caption grey--text">
              <div class="text-end">
                Created at {{ thread.created_on | dateTimeFormat }}
              </div>
              <div class="text-end">
                Last activity {{ thread.last_activity | dateTimeFormat }}
              </div>
            </div>
            <div class="ml-4">
              <v-icon color="grey" class="mr-1" small>
                mdi-message-outline
              </v-icon>
              <span class="overline">
                {{ thread.posts.length }}
              </span>
            </div>
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
    <v-overlay absolute opacity="0" :value="isLoading">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ThreadListModel } from '@/lutan-api';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import lutanApis, { deleteThread } from '@/utils/lutan-apis';
import { LogInRequired } from '@/utils/account';
import { snackbarsModule } from '@/store/modules/snackbars';

@Component({
  components: {
    ConfirmDialog,
  },
})
export default class ThreadList extends Vue {
  @Prop({ default: null }) titleSearch!: string | null;
  @Prop({ default: null }) categoriesSearch!: string | null;
  @Prop({ default: null }) starterId!: string | null;

  private threads: ThreadListModel[] = [];
  private page: number | null = null;
  private pageSize = 10;
  private totalThreadsCount: number | null = null;

  private isLoading = false;

  @Watch('titleSearch')
  async onTitleSearchChanged() {
    await this.fetchThreads(1);
    this.page = 1;
  }

  @Watch('categoriesSearch')
  async onCategoriesSearchChanged() {
    await this.fetchThreads(1);
    this.page = 1;
  }

  get paginationLength() {
    // Only show v-pagination when this.totalThreadsCount is not null and not zero.
    if (this.totalThreadsCount) {
      return Math.ceil(this.totalThreadsCount / this.pageSize);
    } else {
      return null;
    }
  }

  async created() {
    await this.fetchThreads(1);
    this.page = 1;
  }

  async onPageChanged(page: number) {
    await this.fetchThreads(page);
    this.page = page;
  }

  async fetchThreads(page: number) {
    this.isLoading = true;
    try {
      const response = await lutanApis.threadsApi.threadsList(
        this.titleSearch || undefined,
        this.categoriesSearch || undefined,
        this.starterId || undefined,
        page,
        this.pageSize
      );
      if (response.status === 200) {
        this.threads = response.data.results;
        this.totalThreadsCount = response.data.count;
      }
    } catch (error) {
      snackbarsModule.addSnackbar({
        message: 'Failed to load thread list. Please try again later.',
        color: 'error',
      });
    }
    this.isLoading = false;
  }

  @LogInRequired
  async onDeleteThread(thread: ThreadListModel) {
    await deleteThread(thread.id!.toString());
    this.threads = this.threads.filter(t => t.id !== thread.id);

    await this.fetchThreads(1);
    this.page = 1;
  }

  clickTitle(threadId: number) {
    this.$router.push({
      name: 'ThreadRetrieve',
      params: { id: threadId.toString() },
    });
  }

  onEdit(thread: ThreadListModel) {
    this.$router.push({
      name: 'ThreadEdit',
      params: { id: thread.id!.toString() },
    });
  }
}
</script>

<style scoped></style>
