<template>
  <v-app>
    <v-container class="d-flex justify-center align-center fill-height">
      <ValidationObserver ref="obs" v-slot="{ handleSubmit }">
        <v-card width="300" class="px-6 py-4">
          <v-card-title class="justify-center">Регистрация</v-card-title>
          <v-form @submit.prevent="handleSubmit(login)">
            <v-fade-transition>
              <small v-if="error" class="error--text">
                {{ error || "Ошибка соединения" }}
              </small>
            </v-fade-transition>
            <div class="mb-3">
              <TextInput
                label="Ник"
                name="nickname"
                rules="required|nickname"
                v-model="values.nickname"
              ></TextInput>
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
                Зарегистрироваться
              </v-btn>
            </div>
          </v-form>

          <div class="separator mb-3">или</div>

          <div class="d-flex justify-center">
            <v-btn color="deep-purple" link to="/signin" text> Войти </v-btn>
          </div>
        </v-card>
      </ValidationObserver>
    </v-container>
  </v-app>
</template>

<script>
import { ValidationObserver } from "vee-validate";
import TextInput from "../components/inputs/TextInput";
import { signUpQuery } from "../graphql/Auth";
import { login } from "../utils";

export default {
  data() {
    return {
      values: {
        nickname: "",
        email: "",
        password: "",
      },
      error: null,
    };
  },
  methods: {
    login() {
      this.$apollo
        .mutate({
          mutation: signUpQuery,
          variables: this.values,
        })
        .then(({ data: { signUp } }) => {
          login(signUp);
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