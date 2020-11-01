import {
  Action,
  Module,
  Mutation,
  VuexModule,
  getModule,
} from 'vuex-module-decorators';
import { CategoriesApi, CategoryTree } from '@/lutan-api';

import store from '@/store';

export interface CategoryState {
  _categoryTree: CategoryTree | null;
}

@Module({ dynamic: true, store, name: 'category' })
class Category extends VuexModule implements CategoryState {
  public _categoryTree: CategoryTree | null = null;

  @Mutation
  private SET_CATEGORY_TREE(categoryTree: CategoryTree) {
    this._categoryTree = categoryTree;
  }

  @Action
  public async getCategoryTree() {
    if (this._categoryTree !== null) {
      return this._categoryTree;
    }

    const categoriesApi = new CategoriesApi();
    try {
      const response = await categoriesApi.categoriesTreeRead(1);
      if (response.status === 200) {
        const categoryTree = response.data;
        this.SET_CATEGORY_TREE(categoryTree);
      }
    } catch (error) {
      console.error(error);
    }

    return this._categoryTree;
  }
}

export const categoryModule = getModule(Category);
