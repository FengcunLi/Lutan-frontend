<template>
  <v-form v-model="valid" ref="form">
    <v-text-field
      label="Thread Title"
      v-model="title"
      :rules="titleRules"
    ></v-text-field>

    <div style="position: relative" v-on-clickaway="clickaway">
      <v-text-field
        label="Category"
        append-icon="mdi-chevron-down"
        @click="
          isSelectingCategory = !isSelectingCategory;
          isDisabled = !isDisabled;
        "
        :disabled="isDisabled"
        :value="selectedCategory ? selectedCategory.name : null"
        :rules="categoryRules"
      />
      <v-expand-transition>
        <CategoryTreeMenu
          class="category-tree-menu elevation-6 mt-n4"
          v-show="categoryTree && isSelectingCategory"
          :categoryTree="categoryTree"
          @activate="onCategorySelected"
        />
      </v-expand-transition>
    </div>
    <v-input :error-messages="tinymceErrorMessages">
      <Tinymce v-model="content" :height="400" width="100%" />
    </v-input>
    <div class="d-flex justify-end mt-4">
      <v-btn depressed color="primary" @click="onSubmit">
        Submit
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import Tinymce from '@/components/tinymce/TinyEditor.vue';
import CategoryTreeMenu from '@/components/CategoryTreeMenu.vue';
import { CategorySimple, CategoryTree, ThreadWritable } from '@/lutan-api';
import { categoryModule } from '@/store/modules/categories';
import { LogInRequired } from '@/utils/account';
import { accountModule } from '@/store/modules/account';
import { snackbarsModule } from '@/store/modules/snackbars';
import lutanApis from '@/utils/lutan-apis';
import { mixin as clickaway } from 'vue-clickaway';

@Component({
  components: {
    Tinymce,
    CategoryTreeMenu,
  },
  mixins: [clickaway],
})
export default class ThreadForm extends Vue {
  private title = '';
  private selectedCategory: CategoryTree | CategorySimple | null = null;
  private content = '';

  private valid = false;
  private isSelectingCategory = false;
  private isDisabled = false;
  private categoryTree: CategoryTree | null = null;
  private tinymceErrorMessages: string[] = [];

  @Prop({ default: null }) threadId!: number | null;

  @Ref('form') formElement!: HTMLFormElement;

  private titleRules = [
    (v: string) => !!v || 'Thread title is required',
    (v: string) =>
      (!!v && v.length >= 5) || 'Thread title must be longer than 5 characters',
    (v: string) =>
      (!!v && v.length <= 150) ||
      'Thread title must be less than 150 characters',
  ];

  private categoryRules = [(v: string) => !!v || 'Thread category is required'];

  async created() {
    if (this.threadId !== null) {
      try {
        const response = await lutanApis.threadsApi.threadsRead(
          this.threadId.toString()
        );

        if (response.status === 200) {
          const thread = response.data;
          this.title = thread.title;
          this.selectedCategory = thread.category;
          this.content = thread.content!;
        }
      } catch (error) {
        snackbarsModule.addSnackbar({
          message: 'Failed to load thread. Please try again later.',
          color: 'error',
        });
      }
    }

    this.categoryTree = await categoryModule.getCategoryTree();
  }

  onCategorySelected(categoryTree: CategoryTree) {
    this.selectedCategory = categoryTree;
    this.isSelectingCategory = false;
    this.isDisabled = false;
  }

  clickaway() {
    this.isSelectingCategory = false;
    this.isDisabled = false;
  }

  @Watch('content')
  onContentChange() {
    if (this.content.length !== 0) {
      this.tinymceErrorMessages = [];
    } else {
      this.tinymceErrorMessages.push('Thread content is required.');
    }
  }

  @LogInRequired
  async onSubmit() {
    const condition1 = this.content.length === 0;
    const condition2 = !this.formElement.validate();

    if (condition1) {
      this.tinymceErrorMessages.push('Thread content is required.');
    }

    if (condition1 || condition2) {
      return;
    }

    const threadsApi = lutanApis.threadsApi;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const categoryId = this.selectedCategory!.id!;

    const thread: ThreadWritable = {
      title: this.title,
      category: categoryId,
      content: this.content,
      starter: accountModule.user!.id!,
    };

    let errorMessage = '';
    try {
      if (this.threadId === null) {
        errorMessage = 'Failed to create thread. Please try again later.';
        const response = await threadsApi.threadsCreate(thread);
        if (response.status === 201) {
          const result = response.data;
          snackbarsModule.addSnackbar({
            message: 'Created thread successfully.',
            color: 'success',
          });
          this.$router.push({
            name: 'ThreadRetrieve',
            params: { id: result.id!.toString() },
          });
        }
      } else {
        errorMessage = 'Failed to edit thread. Please try again later.';
        const response = await threadsApi.threadsUpdate(
          this.threadId.toString(),
          thread
        );
        if (response.status === 200) {
          const result = response.data;
          snackbarsModule.addSnackbar({
            message: 'Thread was edited successfully.',
            color: 'success',
          });
          this.$router.push({
            name: 'ThreadRetrieve',
            params: { id: result.id!.toString() },
          });
        }
      }
    } catch (error) {
      snackbarsModule.addSnackbar({
        message: errorMessage,
        color: 'error',
      });

      console.error(error);
    }
  }
}
</script>

<style lang="scss" scoped>
.category-tree-menu {
  position: absolute;
  top: calc(100%);
  // transform: translateX(-50%);
  // width: max-content;
  // width: 100%;
  left: 0;
  right: 0;
  // border-radius: 0px 0px 16px 16px;
  background-color: white;
  z-index: 100;
}
</style>
