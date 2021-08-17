<template>
  <v-app>
    <v-container class="d-flex justify-center align-center fill-height">
      <ValidationObserver ref="obs" v-slot="{ handleSubmit }">
        <v-card width="300" class="px-6 py-4">
          <v-card-title class="justify-center">Вход</v-card-title>
          <v-form @submit.prevent="handleSubmit(login)">
            <v-fade-transition>
              <small v-if="error" class="error--text">
                {{ error || "Ошибка соединения" }}
              </small>
            </v-fade-transition>
            <div class="mb-3">
              <TextInput
                label="Email"
                name="email"
                rules="required|email"
                v-model="values.email"
              ></TextInput>
              <TextInput
                label="Пароль"
                name="password"
                rules="required|min:8|hasUpperCase|hasLowerCase"
                v-model="values.password"
              ></TextInput>
            </div>

            <div class="d-flex justify-center mb-3">
              <v-btn
                color="deep-purple"
                :loading="$apollo.loading"
                class="white--text"
                type="submit"
              >
                Войти
              </v-btn>
            </div>
          </v-form>

          <div class="separator mb-3">или</div>

          <div class="d-flex justify-center">
            <v-btn color="deep-purple" link to="/signup" text>
              Зарегистрироваться
            </v-btn>
          </div>
        </v-card>
      </ValidationObserver>
    </v-container>
  </v-app>
</template>

<script>
import { ValidationObserver } from "vee-validate";
import TextInput from "../components/inputs/TextInput";
import { signInQuery } from "../graphql/Auth";
import { login } from "../utils";

export default {
  data() {
    return {
      values: {
        email: "marchhare@mail.com",
        password: "Tested0n",
      },
      error: null,
    };
  },
  methods: {
    login() {
      this.$apollo
        .mutate({
          mutation: signInQuery,
          variables: this.values,
        })
        .then(({ data: { signIn } }) => {
          login(signIn);
          this.$router.push("Chats");
        })
        .catch((e) => {
          this.error = e.message;
        });
    },
  },
  components: {
    TextInput,
    ValidationObserver,
  },
};
</script>