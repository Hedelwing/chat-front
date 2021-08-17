<template>
  <app-layot>
    <template v-slot:header>
      <v-toolbar-title>Чаты</v-toolbar-title>
      <v-spacer></v-spacer>
    </template>
    <v-list v-if="chats">
      <v-list-item
        link
        :to="'/chats/' + chat.id"
        v-for="chat in chats"
        :key="chat.id"
        :class="{ 'grey lighten-4': chat.newMessages }"
      >
        <v-list-item-avatar size="56">
          <v-img src="/noimage.png"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="chat.title"></v-list-item-title>
          <div v-if="chat.lastMessage">
            <v-list-item-subtitle class="text-truncate d-flex align-center">
              <v-avatar size="24">
                <v-img :src="chat.lastMessage.sender.avatar"></v-img>
              </v-avatar>
              <span class="ml-2">{{ chat.lastMessage.body }}</span>
            </v-list-item-subtitle>
          </div>
          <div class="center-body subtitle-1" v-else>Нет сообщений</div>
        </v-list-item-content>
        <v-list-item-action v-if="chat.lastMessage">
          {{
            isToday(chat.lastMessage.createdAt.unix)
              ? chat.lastMessage.createdAt.time
              : chat.lastMessage.createdAt.date
          }}
        </v-list-item-action>
        <v-list-item-action>
          <v-badge
            color="deep-purple"
            inline
            :content="chat.newMessages"
            :value="chat.newMessages"
          >
          </v-badge>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <div v-else-if="$apollo.queries.chats.loading">
      <v-skeleton-loader
        v-for="i in 10"
        :key="i"
        type="list-item-avatar-two-line"
      ></v-skeleton-loader>
    </div>
    <div class="text-center caption my-4" v-else>Нет чатов</div>
  </app-layot>
</template>

<script>
import getChats, { getChatQuery } from "../graphql/GetChats";
import { dateGetters } from "../utils";
import { isToday } from "date-fns";
import { cache } from "../cache";
import AppLayot from "../components/AppLayot.vue";

export default {
  data() {
    return {
      chats: null,
    };
  },
  components: {
    AppLayot,
  },
  methods: {
    isToday,
  },
  apollo: {
    chats: {
      query: getChats,
      manual: true,
      result({ data }) {
        this.chats = data.chats.map((chat) => {
          const lastMessage = chat.messages.length
            ? chat.messages[chat.messages.length - 1]
            : null;

          const formattedChat = {
            ...chat,
            messages: chat.messages,
            lastMessage: lastMessage && {
              ...lastMessage,
              createdAt: dateGetters(+lastMessage.createdAt),
            },
          };

          cache.writeQuery({
            query: getChatQuery,
            variables: { chatId: formattedChat.id },
            data: { chat: formattedChat },
          });

          return formattedChat;
        });
      },
    },
  },
};
</script>

<style lang="sass" scoped>
.chat-card
  display: grid
  grid-template-areas: "left center-title right" "left center-body right"
  grid-template-columns: auto 1fr auto
  grid-template-rows: 1fr 1fr
  grid-gap: 8px

.left
  grid-area: left

.right
  grid-area: right

.left, .right
  align-self: center

.center-title
  grid-area: center-title

.center-body
  grid-area: center-body
</style>