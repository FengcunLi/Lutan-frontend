<template>
  <div>
    <v-btn small depressed :loading="isProcessing" @click="onClick">
      <v-icon>mdi-upload</v-icon>
      Upload Image
    </v-btn>
    <input
      type="file"
      accept="image/*"
      multiple
      class="d-none"
      ref="fileInput"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'EditorImageUpload',
})
export default class EditorImageUpload extends Vue {
  private isProcessing = false;

  private onClick() {
    (this.$refs.fileInput as HTMLInputElement).click();
  }

  private async onChange(e: Event) {
    this.isProcessing = true;
    const target = e.target as HTMLInputElement;

    if (target.files && EditorImageUpload.validateImages(target.files)) {
      const filesInBase64 = await EditorImageUpload.readImagesAsync(
        target.files
      );
      this.$emit('success', filesInBase64);
    }

    this.isProcessing = false;
  }

  private static validateImages(files: FileList) {
    for (const file of files) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return false;
      }
      if (file.size / 1024 / 1024 > 2) {
        return false;
      }
    }
    return true;
  }

  private static readImagesAsync(files: FileList) {
    const promises: Promise<string>[] = [];

    for (const file of files) {
      promises.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
        })
      );
    }

    return Promise.all(promises);
  }
}
</script>

<style lang="scss" scoped></style>
