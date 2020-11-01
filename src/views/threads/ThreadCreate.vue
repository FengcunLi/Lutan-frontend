<template>
  <v-container>
    <div class="text-h5 mb-4">Create Thread</div>
    <ThreadForm />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ThreadForm from '@/components/ThreadForm.vue';

@Component({
  components: {
    ThreadForm,
  },
})
export default class ThreadCreate extends Vue {}
</script>

<style scoped></style>
