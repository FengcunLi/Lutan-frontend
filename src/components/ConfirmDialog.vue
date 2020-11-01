<template>
  <div>
    <slot name="activator" :click="onActivate"> </slot>
    <v-dialog v-model="dialog" max-width="450px">
      <v-card>
        <v-card-text class="pt-6">
          {{ message }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialog = false">
            {{ cancelText }}
          </v-btn>
          <v-btn text @click="onConfirm">
            {{ confirmText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ConfirmDialog extends Vue {
  private dialog = false;
  @Prop({ required: true }) message!: string;
  @Prop({ default: 'Cancel' }) cancelText!: string;
  @Prop({ default: 'Confirm' }) confirmText!: string;

  onConfirm() {
    this.$emit('confirm');
    this.dialog = false;
  }

  onActivate() {
    this.dialog = true;
  }
}
</script>

<style scoped></style>
