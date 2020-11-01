<template>
  <v-avatar :size="size" color="indigo">
    <v-img
      v-if="user.avatars && user.avatars.length > 0"
      :src="user.avatars[0].image"
    ></v-img>
  </v-avatar>
</template>

<script lang="ts">
import { UserProxy } from '@/lutan-api';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Avatar extends Vue {
  @Prop({ required: true }) user!: UserProxy;
  @Prop({ type: Number, default: 28 }) size!: number;
}
</script>

<style scoped></style>
