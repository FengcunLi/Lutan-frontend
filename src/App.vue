<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view :key="$route.path" />
    </v-main>
    <AccountModalComponent />
    <v-snackbar
      top
      v-for="(snackbar, index) in snackbars"
      :style="`padding-top: ${index * 60 + 8}px`"
      :key="snackbar.id"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      @input="onClose(snackbar)"
      :value="true"
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="onClose(snackbar)">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AccountModalComponent from '@/components/account/AccountModalComponent.vue';
import { Snackbar, snackbarsModule } from '@/store/modules/snackbars';
import AppBar from '@/components/AppBar.vue';

@Component({
  components: {
    AccountModalComponent,
    AppBar,
  },
})
export default class App extends Vue {
  private get snackbars() {
    return snackbarsModule.snackbars;
  }

  onClose(snackbar: Snackbar) {
    snackbarsModule.removeSnackbar(snackbar);
  }
}
</script>

<style lang="scss" scoped></style>

<style lang="scss">
a {
  text-decoration: none;
  // color: inherit;
}

.v-slide-group__prev {
  display: none !important;
}
</style>
