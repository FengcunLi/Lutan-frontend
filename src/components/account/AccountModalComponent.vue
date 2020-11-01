<template>
  <div class="d-flex">
    <v-dialog :value="logInDialog" persistent max-width="450px">
      <!-- <template v-slot:activator="{ on, attrs }">
        <slot name="logIn" v-bind:attrs="attrs" v-bind:on="on"></slot>
      </template> -->
      <v-card>
        <div class="d-flex justify-end">
          <v-btn icon @click="logInDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <LoginForm
          @close="logInDialog = false"
          @success="logInDialog = false"
        />
        <v-divider></v-divider>
        <div class="text-center py-4">
          Need an account?
          <span
            class="text-decoration-underline"
            @click="
              logInDialog = false;
              signUpDialog = true;
            "
          >
            Sign up
          </span>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog :value="signUpDialog" persistent max-width="450px">
      <!-- <template v-slot:activator="{ on, attrs }">
        <slot name="signUp" v-bind:attrs="attrs" v-bind:on="on"></slot>
      </template> -->
      <v-card>
        <div class="d-flex justify-end">
          <v-btn icon @click="signUpDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <SignUpForm
          @close="signUpDialog = false"
          @success="signUpDialog = false"
        />
        <v-divider></v-divider>
        <div class="text-center py-4">
          Already have an account?
          <span
            class="text-decoration-underline"
            @click="
              signUpDialog = false;
              logInDialog = true;
            "
          >
            Log in
          </span>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SignUpForm from './SignUpForm.vue';
import LoginForm from './LoginForm.vue';
import { accountModule } from '@/store/modules/account';

@Component({
  components: { SignUpForm, LoginForm },
})
export default class AccountModalComponent extends Vue {
  get logInDialog() {
    return accountModule.logInDialog;
  }
  set logInDialog(value: boolean) {
    accountModule.setLogInDialog(value);
  }

  get signUpDialog() {
    return accountModule.signUpDialog;
  }
  set signUpDialog(value: boolean) {
    accountModule.setSignUpDialog(value);
  }
}
</script>

<style scoped></style>
