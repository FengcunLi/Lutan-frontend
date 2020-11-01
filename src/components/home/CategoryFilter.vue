<template>
  <div class="grey lighten-3">
    <CategoryTreeMenu
      :categoryTree="categoryTree"
      :selectable="true"
      :selectedCategories="selectedCategories"
      @change="onChange"
    />
    <v-divider></v-divider>
    <div class="d-flex justify-space-between">
      <v-btn text @click="onSelectAll">Select all</v-btn>
      <v-btn text @click="onClear">Clear</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CategoryTreeMenu from '@/components/CategoryTreeMenu.vue';
import { CategoryTree } from '@/lutan-api';

@Component({
  components: { CategoryTreeMenu },
})
export default class CategoryFilter extends Vue {
  @Prop({ required: true }) categoryTree!: CategoryTree;
  @Prop() selectedCategories!: CategoryTree[];

  onChange(value: CategoryTree[]) {
    this.$emit('change', value);
  }

  onSelectAll() {
    this.$emit('change', this.categoryTree.subcategories);
  }

  onClear() {
    this.$emit('change', []);
  }
}
</script>

<style scoped></style>
