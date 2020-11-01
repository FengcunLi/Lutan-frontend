<template>
  <div class="pt-2">
    <v-text-field
      v-model="search"
      label="Search category..."
      solo
      flat
      dense
      hide-details
      clearable
      clear-icon="mdi-close-circle-outline"
      class="mx-2"
    ></v-text-field>
    <v-treeview
      dense
      :items="categoryTree ? categoryTree.subcategories : []"
      item-children="subcategories"
      :search="search"
      open-on-click
      return-object
      activatable
      :active="active"
      @update:active="onUpdateActive"
      transition
      :selectable="selectable"
      @input="onInput"
      :value="selectedCategories"
    >
    </v-treeview>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CategoryTree } from '@/lutan-api/';
@Component
export default class CategoryTreeMenu extends Vue {
  @Prop({ required: true }) categoryTree!: CategoryTree;
  @Prop({ type: Boolean, default: false }) selectable!: boolean;
  @Prop() selectedCategories!: CategoryTree[];

  private search = '';
  private active: CategoryTree[] = [];

  onUpdateActive(value: CategoryTree[]) {
    this.active = value;
    this.$emit('activate', this.active[0]);
  }

  onInput(value: CategoryTree[]) {
    this.$emit('change', value);
  }
}
</script>

<style scoped></style>
