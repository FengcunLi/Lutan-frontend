<template>
  <v-container>
    <div class="d-block d-md-none" style="position: relative">
      <div
        class="d-flex align-center rounded-pill px-2 py-1"
        style="border: 1px solid grey"
        @click="isSelectingCategory = !isSelectingCategory"
      >
        <span class="text-subtitle-1 text-uppercase primary--text"
          >Categories</span
        >
        <v-spacer></v-spacer>
        <v-slide-x-transition>
          <v-icon v-show="!isSelectingCategory">mdi-chevron-down</v-icon>
        </v-slide-x-transition>
        <v-slide-x-reverse-transition>
          <v-icon v-show="isSelectingCategory">mdi-chevron-up</v-icon>
        </v-slide-x-reverse-transition>
      </div>

      <v-expand-transition>
        <div
          v-show="categoryTree && isSelectingCategory"
          class="category-tree-menu elevation-2 mx-3 mt-n3 grey lighten-3"
        >
          <CategoryFilter
            :categoryTree="categoryTree"
            :selectedCategories="selectedCategories"
            @change="onSelectedCategoriesChanged"
          />
        </div>
      </v-expand-transition>
    </div>

    <v-row>
      <v-col md="4" class="d-none d-md-block">
        <CategoryFilter
          :categoryTree="categoryTree"
          :selectedCategories="selectedCategories"
          @change="onSelectedCategoriesChanged"
        />
      </v-col>
      <v-col cols="12" md="8">
        <v-text-field
          solo
          rounded
          hide-details
          append-icon="fas fa-search"
          placeholder="Search threads"
          clearable
          v-model="search"
          @keyup.enter="onSearchSubmitted"
          @click:append="onSearchSubmitted"
          class="mb-3"
        />
        <ThreadList
          :titleSearch="titleSearch"
          :categoriesSearch="categoriesSearch"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { CategoryTree } from '@/lutan-api';
import { categoryModule } from '@/store/modules/categories';
import CategoryFilter from '@/components/home/CategoryFilter.vue';
import ThreadList from '@/components/thread/ThreadList.vue';

import * as _ from 'lodash';

@Component({
  components: {
    CategoryFilter,
    ThreadList,
  },
})
export default class Home extends Vue {
  private isSelectingCategory = false;
  private selectedCategories: CategoryTree[] = [];
  private categoryTree: CategoryTree | null = null;

  private search: string | null = null;
  private titleSearch: string | null = null;
  private categoriesSearch: string | null = null;

  onSelectedCategoriesChanged(value: CategoryTree[]) {
    this.selectedCategories = value;

    const leafNodes = new Set<number>();
    for (const category of this.selectedCategories) {
      for (const leafNode of Home.getLeafNodes(category)) {
        leafNodes.add(leafNode.id!);
      }
    }
    this.categoriesSearch = Array.from(leafNodes).join(',');
  }

  async created() {
    this.categoryTree = await categoryModule.getCategoryTree();

    if (this.categoryTree?.subcategories) {
      this.selectedCategories = this.categoryTree.subcategories;
    }
  }

  static debounced = _.debounce((self: Home) => {
    self.titleSearch = self.search || null;
  }, 500);

  @Watch('search')
  onSearchChanged() {
    Home.debounced(this);
  }

  onSearchSubmitted() {
    this.titleSearch = this.search;
  }

  static getLeafNodes(root: CategoryTree) {
    let result: CategoryTree[] = [];

    if (root.subcategories!.length === 0) {
      result.push(root);
    } else {
      for (const node of root.subcategories!) {
        result = [...result, ...Home.getLeafNodes(node)];
      }
    }

    return result;
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

.user-name {
  color: #1fa0ff;
}
</style>
