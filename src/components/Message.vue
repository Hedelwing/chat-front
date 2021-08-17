<template>
  <div
    class="d-flex align-end justify-end grid"
    :class="[userIsSender ? 'flex-row pl-14' : 'flex-row-reverse pr-14']"
    ref="msg"
  >
    <div
      class="pa-3 d-flex flex-column deep-purple lighten-5 elevation-3"
      :class="[userIsSender ? 'message_my-message' : 'message_member-message']"
      style="max-width: 90%"
    >
      <div class="d-flex align-center">
        <span class="mr-auto font-weight-bold subtitle-2">{{
          message.sender.nickname
        }}</span>
        <small class="ml-2 text-caption grey--text">{{
          message.createdAt.time
        }}</small>
        <v-btn
          class="ml-2"
          v-if="userIsSender"
          icon
          x-small
          @click="() => updateMessage(message.id, message.body)"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
        <v-btn
          class="ml-2"
          v-if="userIsSender"
          icon
          x-small
          @click.once="() => deleteMessage(message.id)"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
      </div>
      <div class="text-container">{{ message.body }}</div>
    </div>
    <avatar
      :text="message.sender.nickname"
      :image="message.sender.avatar"
    ></avatar>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { getChatQuery } from "../graphql/GetChats";
import Avatar from "./Avatar.vue";
export default {
  components: { Avatar },
  props: ["message", "updateMessage", "deleteMessage", "userIsSender"],
  mounted() {
    if (!this.message.isViewed) {
      let observer = new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting) {
          const { id, chatId } = this.message;
          this.$apollo
            .mutate({
              mutation: gql`
                mutation ($id: ID!) {
                  markAsRead(messageId: $id)
                }
              `,
              throttle: 2500,
              variables: { id },
              update(store) {
                const { chat } = store.readQuery({
                  query: getChatQuery,
                  variables: {
                    chatId,
                  },
                });

                chat.messages = chat.messages.map((message) =>
                  message.id == id ? { ...message, isViewed: true } : message
                );

                store.writeQuery({
                  query: getChatQuery,
                  variables: {
                    chatId,
                  },
                  data: { chat },
                });
              },
            })
            .then(() => {
              observer.unobserve(this.$refs.msg);
            });
        }
      });

      observer.observe(this.$refs.msg);
    }
  },
};
</script>

<style lang="sass" scoped>
.message
  &_my-message
    border-radius: 16px 16px 0 16px
    margin-left: auto

  &_member-message
    border-radius: 16px 16px 16px 0
    margin-right: auto

.grid
  display: grid
  grid-gap: 8px
  grid-template-columns: auto auto

.text-container
  white-space: pre-wrap
  word-wrap: break-word
  word-break: break-all
</style>