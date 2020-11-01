<template>
  <div v-if="categoryTree">
    <v-list-item
      v-if="
        categoryTree.subcategories && categoryTree.subcategories.length === 0
      "
    >
      <v-list-item-title @click="$emit('click-on-item', categoryTree)">
        {{ categoryTree.name }}
      </v-list-item-title>
    </v-list-item>

    <v-list-group v-else sub-group :value="true">
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>
            {{ categoryTree.name }}
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <TreeChart
        v-for="categorySubtree in categoryTree.subcategories"
        :categoryTree="categorySubtree"
        :key="categorySubtree.name"
        class="pl-4"
        @click-on-item="$emit('click-on-item', $event)"
      />
    </v-list-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CategoryTree } from '@/lutan-api';

@Component
export default class TreeChart extends Vue {
  @Prop() private categoryTree!: CategoryTree;

  created() {
    console.log(this.categoryTree);
  }
}
</script>

<style scoped></style>
