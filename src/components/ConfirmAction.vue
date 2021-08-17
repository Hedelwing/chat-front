<template>
  <v-card>
    <v-card-title class="text-h5">Вы уверены?</v-card-title>
    <v-card-text> Действие нельзя будет отменить </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="deep-purple white--text" @click="onCancel">Отмена</v-btn>
      <v-btn color="grey" @click="onAccept" text>Да</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  methods: {
    onCancel() {
      this.$emit("cancel");
    },
    onAccept() {
      this.$emit("accept");
    },
  },
};
</script>