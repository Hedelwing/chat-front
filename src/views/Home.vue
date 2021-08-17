<template>
  <v-app>
    <v-container class="d-flex justify-center align-center fill-height">
      <div class="d-flex align-center">
        <div class="pa-5">
          <v-icon size="96" color="deep-purple darken-2">
            mdi-message-text
          </v-icon>
        </div>
        <div class="pa-5">
          <h1 class="h1 mb-2">Добро пожаловать!</h1>
          <p class="subtitle-1 mb-4">
            Просто чат и ничего более. Наслаждайтесь!
          </p>
          <div>
            <v-btn class="mr-2" link to="/signin">Войти</v-btn>
            <v-btn class="deep-purple white--text" link to="/signup">
              Зарегистрироваться
            </v-btn>
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>
