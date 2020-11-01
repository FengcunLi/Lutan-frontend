<template>
  <div>
    <v-progress-linear
      indeterminate
      height="4"
      v-show="isSubmitting"
    ></v-progress-linear>

    <v-form v-model="valid" ref="form" class="pa-6">
      <div class="text-subtitle-1">Sign Up</div>
      <v-text-field
        v-model="firstName"
        label="First name"
        required
        :rules="firstNameRules"
      ></v-text-field>
      <v-text-field
        v-model="lastName"
        label="Last name"
        required
        :rules="lastNameRules"
      ></v-text-field>
      <v-text-field
        v-model="email"
        label="Email"
        required
        :rules="emailRules"
        :error-messages="emailErrors"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
        :rules="passwordRules"
        :error-messages="passwordErrors"
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
import { UserCreate } from '@/lutan-api';
import { accountModule } from '@/store/modules/account';
import { snackbarsModule } from '@/store/modules/snackbars';
import { Component, Ref, Vue } from 'vue-property-decorator';

@Component
export default class SignUpForm extends Vue {
  private isSubmitting = false;
  private valid = false;
  private firstName = '';
  private lastName = '';
  private email = '';
  private password = '';
  private emailErrors: string[] = [];
  private passwordErrors: string[] = [];

  @Ref('form') formElement!: HTMLFormElement;

  private firstNameRules = [
    (v: string) => !!v || 'First name is required',
    (v: string) =>
      (!!v && v.length <= 10) || 'First name must be less than 10 characters',
  ];

  private lastNameRules = [
    (v: string) => !!v || 'Last name is required',
    (v: string) =>
      (!!v && v.length <= 10) || 'Last name must be less than 10 characters',
  ];

  private emailRules = [
    (v: string) => !!v || 'Email is required',
    (v: string) => {
      const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return pattern.test(v) || 'Email must be valid';
    },
  ];

  private passwordRules = [
    (v: string) => !!v || 'Password is required',
    (v: string) => {
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
      return (
        pattern.test(v) ||
        'Min. 8 characters with at least one lower case letter, capital letter, a number and a special character.'
      );
    },
  ];

  private onCancel() {
    this.isSubmitting = false;
    this.formElement.reset();
    this.$emit('close');
  }

  private async onSubmit() {
    if (this.formElement.validate()) {
      this.isSubmitting = true;

      const data: UserCreate = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        first_name: this.firstName,
        // eslint-disable-next-line @typescript-eslint/camelcase
        last_name: this.lastName,
        email: this.email,
        password: this.password,
      };

      try {
        await accountModule.signUp(data);
        this.formElement.reset();
        this.$emit('success');
        snackbarsModule.addSnackbar({
          message: 'Signed up successfully. Please log in.',
          color: 'success',
        });
      } catch (error) {
        if (error.response?.status === 400) {
          if ('email' in error.response.data) {
            this.emailErrors = error.response.data['email'];
            setTimeout(() => {
              this.emailErrors = [];
            }, 3000);
          }

          if ('password' in error.response.data) {
            this.passwordErrors = error.response.data['password'];
            setTimeout(() => {
              this.passwordErrors = [];
            }, 3000);
          }
        }
      }

      this.isSubmitting = false;
    }
  }
}
</script>

<style scoped></style>
