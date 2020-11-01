<template>
  <div>
    <v-progress-linear
      indeterminate
      height="4"
      v-show="isSubmitting"
    ></v-progress-linear>

    <v-form v-model="valid" ref="form" class="pa-6">
      <div class="text-subtitle-1">Login</div>
      <v-text-field
        v-model="email"
        label="Email"
        required
        :rules="emailRules"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
        :rules="passwordRules"
      ></v-text-field>
      <div class="d-flex mb-2">
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="onCancel">
          Cancel
        </v-btn>
        <v-btn color="primary" depressed @click="onSubmit" :disabled="!valid">
          Submit
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import { accountModule } from '@/store/modules/account';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { snackbarsModule } from '@/store/modules/snackbars';

@Component
export default class LoginForm extends Vue {
  private isSubmitting = false;
  private valid = false;
  private email = '';
  private password = '';

  @Ref('form') formElement!: HTMLFormElement;

  private emailRules = [
    (v: string) => !!v || 'Email is required',
    (v: string) => {
      const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return pattern.test(v) || 'Email must be valid';
    },
  ];

  private passwordRules = [(v: string) => !!v || 'Password is required'];

  private onCancel() {
    this.isSubmitting = false;
    this.formElement.reset();
    this.$emit('close');
  }

  private async onSubmit() {
    if (this.formElement.validate()) {
      try {
        await accountModule.logIn({
          email: this.email,
          password: this.password,
        });

        try {
          await accountModule.getProfile();
          this.formElement.reset();
          this.$emit('success');
          snackbarsModule.addSnackbar({
            message: `Welcome back ${accountModule.user!.first_name} ${
              accountModule.user!.last_name
            }`,
            color: 'success',
          });
        } catch (error) {
          snackbarsModule.addSnackbar({
            message: 'Failed to get your profile. Please try again later.',
            color: 'error',
          });
        }
      } catch (error) {
        snackbarsModule.addSnackbar({
          message: 'The email or password is not correct. Failed to log in.',
          color: 'error',
        });
      }

      this.isSubmitting = false;
    }
  }
}
</script>

<style scoped></style>
