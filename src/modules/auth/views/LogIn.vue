<template>
  <span class="login100-form-title p-b-41">
    Sign In
  </span>
  <form class="login100-form validate-form p-b-33 p-t-5"
    @submit.prevent="onSubmit"
  >

    <div class="wrap-input100 validate-input" data-validate = "Enter email">
      <input v-model="userForm.email" class="input100" type="email" placeholder="example@mail.com" required>
      <span class="focus-input100" data-placeholder="&#xe818;"></span>
    </div>

    <div class="wrap-input100 validate-input" data-validate="Enter password">
      <input v-model="userForm.password" class="input100" type="password" placeholder="Password" required>
      <span class="focus-input100" data-placeholder="&#xe80f;"></span>
    </div>

    <div class="container-login100-form-btn m-t-32">
      <button class="login100-form-btn">
        Log In
      </button>
    </div>

    <div class="container-login100-form-btn m-t-32">
      <router-link :to="{ name: 'signup'}">Don't you have an account?</router-link>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

import useAuth from '@/modules/auth/composables/useAuth';

export default {
  setup() {
    const router = useRouter();

    const { logInUser } = useAuth();
    const userForm = ref({
      email: '',
      password: ''
    });

    return {
      userForm,
      // Methods
      onSubmit: async () => {
        const { ok, message } = await logInUser(userForm.value);

        if (!ok) {
          Swal.fire('Error', message, 'error');
        } else {
          router.push({ name: 'no-entry' });
        }
      }
    };
  }
};
</script>
