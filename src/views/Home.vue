<template>
  <v-app>
    <v-container class="d-flex justify-center align-center fill-height">
      <div class="d-flex align-center flex-wrap">
        <div class="presentation-item d-flex justify-center mr-0 mr-md-12">
          <v-icon size="96" color="deep-purple darken-2">
            mdi-message-text
          </v-icon>
        </div>
        <div class="d-flex justify-center presentation-item">
          <div>
            <h1 class="h1">Добро пожаловать!</h1>
            <p class="subtitle-1 mt-2">
              Просто чат и ничего более. Наслаждайтесь!
            </p>
            <div>
              <v-btn class="mr-2 mt-4" link to="/signin">Войти</v-btn>
              <v-btn class="deep-purple white--text mt-4" link to="/signup">
                Зарегистрироваться
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<style lang="sass" scoped>
.presentation-item
  @media(max-width: map-get($grid-breakpoints, "md"))
    flex-grow: 1
    flex-basis: 100%
</style>