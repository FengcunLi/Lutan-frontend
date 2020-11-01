<template>
  <v-container>
    <div class="text-h5 mb-4">Edit Thread</div>
    <ThreadForm :threadId="id" />
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ThreadForm from '@/components/ThreadForm.vue';

@Component({
  components: {
    ThreadForm,
  },
})
export default class ThreadEdit extends Vue {
  @Prop({ required: true }) id!: string;
}
</script>

<style scoped></style>
