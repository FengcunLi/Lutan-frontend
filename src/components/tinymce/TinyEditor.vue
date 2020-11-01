<template>
  <div class="tinymce-container" :style="{ width: width }">
    <Editor :id="id" v-model="tinymceContent" :init="initOptions" />
    <div
      class="editor-custom-btn-container d-none d-md-block"
      :class="{ fullscreen: fullscreen }"
    >
      <EditorImageUpload @success="onSuccess" />
    </div>

    <div
      class="editor-custom-btn-container-mobile d-md-none"
      :class="{ fullscreen: fullscreen }"
    >
      <EditorImageUpload @success="onSuccess" />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
// Docs: https://www.tiny.cloud/docs/advanced/usage-with-module-loaders/

// Import TinyMCE
import 'tinymce/tinymce';
// Default icons are required for TinyMCE 5.3 or above
import 'tinymce/icons/default';
// Import themes
import 'tinymce/themes/silver';
import 'tinymce/themes/mobile';
// Any plugins you want to use has to be imported
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/print';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/tabfocus';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

import Editor from '@tinymce/tinymce-vue'; // TinyMCE vue wrapper
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { appModule } from '@/store/modules/app';
import EditorImageUpload from './EditorImage.vue';
import { plugins, toolbar } from './conf';

const defaultId = () =>
  'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');

@Component({
  name: 'Tinymce',
  components: {
    Editor,
    EditorImageUpload,
  },
})
export default class extends Vue {
  @Prop({ required: true }) private value!: string;
  @Prop({ default: defaultId }) private id!: string;
  @Prop({ default: () => toolbar }) private toolbar!: string[];
  @Prop({ default: 'file edit insert view format table' })
  private menubar!: string;
  @Prop({ default: '360px' }) private height!: string | number;
  @Prop({ default: 'auto' }) private width!: string | number;

  private hasChange = false;
  private hasInit = false;
  private fullscreen = false;

  // https://www.tiny.cloud/docs/configure/localization/#language
  // and also see langs files under public/tinymce/langs folder
  private languageTypeList: { [key: string]: string } = {
    en: 'en',
    zh: 'zh_CN',
    es: 'es',
    ja: 'ja',
    ko: 'ko_KR',
  };

  get language() {
    return this.languageTypeList[appModule.language];
  }

  get tinymceContent() {
    return this.value;
  }

  set tinymceContent(value) {
    this.$emit('input', value);
  }

  get initOptions() {
    return {
      selector: `#${this.id}`,
      branding: false,
      height: this.height,
      body_class: 'panel-body',
      object_resizing: false,
      toolbar: this.toolbar,
      menubar: this.menubar,
      plugins: plugins,
      language: this.language,
      language_url:
        this.language === 'en'
          ? ''
          : `${process.env.BASE_URL}tinymce/langs/${this.language}.js`,
      skin_url: `${process.env.BASE_URL}tinymce/skins/ui/oxide`,
      emoticons_database_url: `${process.env.BASE_URL}tinymce/emojis.min.js`,
      end_container_on_empty_block: true,
      powerpaste_word_import: 'clean',
      code_dialog_height: 450,
      code_dialog_width: 1000,
      advlist_bullet_styles: 'square',
      advlist_number_styles: 'default',
      imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
      default_link_target: '_blank',
      link_title: false,
      // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
      nonbreaking_force_tab: true,

      // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
      // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
      convert_urls: false,

      init_instance_callback: (editor: any) => {
        if (this.value) {
          editor.setContent(this.value);
        }
        this.hasInit = true;

        editor.on('NodeChange Change KeyUp SetContent', () => {
          this.hasChange = true;
          this.$emit('input', editor.getContent());
        });
      },

      setup: (editor: any) => {
        editor.on('FullscreenStateChanged', (e: any) => {
          this.fullscreen = e.state;
        });
      },
    };
  }

  @Watch('language')
  private onLanguageChange() {
    const tinymceManager = (window as any).tinymce;
    const tinymceInstance = tinymceManager.get(this.id);
    if (this.fullscreen) {
      tinymceInstance.execCommand('mceFullScreen');
    }
    if (tinymceInstance) {
      tinymceInstance.destroy();
    }
    this.$nextTick(() => tinymceManager.init(this.initOptions));
  }

  private onSuccess(arr: string[]) {
    const tinymce = (window as any).tinymce.get(this.id);
    arr.forEach(v => {
      tinymce.insertContent(`<img class="wscnph" src="${v}" >`);
    });
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;

  // .mce-fullscreen {
  // z-index: 10000;
  // }

  textarea {
    visibility: hidden;
    z-index: -1;
  }
  .editor-custom-btn-container-mobile {
    position: absolute;
    right: 6px;
    bottom: 25px;
    z-index: 1;

    &.fullscreen {
      position: fixed;
      z-index: 1201;
    }
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 6px;
    top: 6px;
    z-index: 1;

    &.fullscreen {
      position: fixed;
      z-index: 1201;
    }

    // .editor-upload-btn {
    //   display: inline-block;
    // }
  }
}
</style>
