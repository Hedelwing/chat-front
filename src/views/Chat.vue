<template>
  <app-layot>
    <template v-slot:header>
      <v-btn class="mr-auto" @click="$router.push('/chats')" plain>
        <v-icon left> mdi-arrow-left </v-icon>
        Назад
      </v-btn>
      <v-spacer></v-spacer>
      <div v-if="chat.messages">
        <span class="mr-2 text-subtitle-1">{{ chat.title }}</span>
        <v-avatar>
          <v-img src="/noimage.png"></v-img>
        </v-avatar>
      </div>
    </template>
    <div
      class="d-flex flex-column justify-end flex-grow-1"
      style="transition: 0.2s ease"
      ref="main"
    >
      <div v-if="chat.messages" class="d-flex flex-column justify-end">
        <div class="relative">
          <v-expand-transition>
            <v-progress-circular
              v-if="loading"
              class="d-block mx-auto py-2"
              color="deep-purple"
              indeterminate
            ></v-progress-circular>
          </v-expand-transition>
          <div v-for="(msgs, day) in formattedMessages" :key="day">
            <h5
              class="text-center d-flex flex-column mt-2 grey--text subtitle-1"
            >
              {{ day }}
            </h5>
            <div
              v-for="message in msgs"
              :key="message.id"
              class="py-2 d-flex align-end px-4"
              :class="{
                'justify-end': message.sender.id === me.id,
                'grey lighten-4 new-msg': !message.isViewed,
              }"
              style="transition: 0.5s ease-in"
            >
              <message
                :key="message.id"
                :message="message"
                :updateMessage="setUpdatingMessage"
                :deleteMessage="deleteMessage"
                :userIsSender="message.sender.id === me.id"
              ></message>
            </div>
          </div>
          <div style="position: absolute; right: 12px">
            <v-scale-transition>
              <v-btn
                fab
                color="deep-purple"
                class="scroll-btn"
                v-if="showScrollBtn"
                @click="scrollToBottom"
              >
                <v-badge
                  color="red"
                  :content="newMessages"
                  :value="newMessages"
                >
                  <v-icon color="white"> mdi-arrow-down </v-icon>
                </v-badge>
              </v-btn>
            </v-scale-transition>
          </div>
        </div>
      </div>
      <div ref="endAncor"></div>
      <message-form
        :default-value="editingMessage && editingMessage.body"
        :is-editing="!!editingMessage"
        :submit="editingMessage ? updateMessage : sendMessage"
        @cancel="editingMessage = null"
      ></message-form>
    </div>
  </app-layot>
</template>


<script>
import { messageObserverQuery, sendMessageQuery } from "../graphql/Messages";
import { groupBy } from "lodash";
import {
  dateGetters,
  removeById,
  setIn,
  updateById,
  updateStore,
} from "../utils";
import MessageForm from "../components/MessageForm.vue";
import Message from "../components/Message.vue";
import meQuery from "../graphql/Me";
import deleteMessage from "../graphql/DeleteMessage";
import updateMessage from "../graphql/UpdateMessage";
import { getChatQuery } from "../graphql/GetChats";
import AppLayot from "../components/AppLayot.vue";
const sound = new Audio("/msg.mp3");

export default {
  props: ["id"],
  data() {
    return {
      title: null,
      width: 0,
      loading: false,
      me: null,
      showScrollBtn: false,
      editingMessage: null,
      chat: {},
      observer: null,
      lockAutoscroll: false,
    };
  },
  components: {
    MessageForm,
    Message,
    AppLayot,
  },
  computed: {
    formattedMessages() {
      const formattedMessages = this.chat.messages.map((message) => ({
        ...message,
        createdAt: dateGetters(+message.createdAt),
      }));

      return groupBy(formattedMessages, "createdAt.date");
    },
    newMessages() {
      return this.chat.messages.reduce(
        (acc, message) => (message.isViewed ? acc : acc + 1),
        0
      );
    },
  },
  methods: {
    setUpdatingMessage(id) {
      this.editingMessage = this.chat.messages.find((msg) => msg.id === id);
    },
    sendMessage(body) {
      this.$apollo.mutate({
        mutation: sendMessageQuery,
        variables: { id: this.id, body },
        update: (store, { data }) => {
          const updateMessages = (data, { sendMessage }) =>
            setIn(data, "chat.messages", [...data.chat.messages, sendMessage]);

          {
            updateStore(
              store,
              {
                query: getChatQuery,
                variables: { chatId: this.id },
              },
              data,
              updateMessages
            );
          }
        },
      });
    },
    updateMessage(body) {
      this.$apollo
        .mutate({
          mutation: updateMessage,
          variables: { id: this.editingMessage.id, body },
          update(store, { data }) {
            const updateMessages = (data, { updateMessage }) =>
              setIn(
                data,
                "chat.messages",
                updateById(data.chat.messages, updateMessage.id, updateMessage)
              );

            updateStore(
              store,
              {
                query: getChatQuery,
                variables: { chatId: data.updateMessage.chatId },
              },
              data,
              updateMessages
            );
          },
        })
        .then(this.cancelMessageUpdating);
    },
    cancelMessageUpdating() {
      this.editingMessage = null;
    },
    deleteMessage(id) {
      this.$apollo.mutate({
        mutation: deleteMessage,
        variables: { id },
        update(store, { data }) {
          const updateMessages = (data, { deleteMessage: { id } }) =>
            setIn(data, "chat.messages", removeById(data.chat.messages, id));

          updateStore(
            store,
            {
              query: getChatQuery,
              variables: { chatId: data.deleteMessage.chatId },
            },
            data,
            updateMessages
          );
        },
      });
    },
    scrollToBottom() {
      this.$refs.endAncor.scrollIntoView({ behavior: "smooth" });
    },
    fetchMoreMessages() {
      if (document.documentElement.scrollTop === 0) {
        this.loading = true;

        this.$nextTick(() => {
          removeEventListener("scroll", this.fetchMoreMessages);

          const height = document.documentElement.scrollHeight;

          const [firstMessage] = this.chat.messages;

          this.$apollo.queries.chat
            .fetchMore({
              variables: { chatId: this.id, fromMessage: firstMessage.id },
              updateQuery: (previousResult, { fetchMoreResult }) =>
                setIn(previousResult, "chat.messages", [
                  ...fetchMoreResult.chat.messages,
                  ...previousResult.chat.messages,
                ]),
            })
            .then(({ data }) => {
              scrollTo(0, document.documentElement.scrollHeight - height);
              this.loading = false;

              if (data.chat.messages.length > 0)
                addEventListener("scroll", this.fetchMoreMessages);
            });
        });
      }
    },
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.showScrollBtn = false;
        this.lockAutoscroll = false;
      } else {
        this.showScrollBtn = true;
        this.lockAutoscroll = true;
      }
    });

    this.observer.observe(this.$refs.endAncor);
  },
  destroyed() {
    removeEventListener("scroll", this.fetchMoreMessages);
  },
  apollo: {
    me: meQuery,
    chat: {
      query: getChatQuery,
      variables() {
        return {
          chatId: this.id,
        };
      },
      result({
        data: {
          chat: { messages },
        },
      }) {
        if (messages.length !== 0)
          addEventListener("scroll", this.fetchMoreMessages);

        if (!this.lockAutoscroll)
          this.$nextTick(() => {
            const firstNewMessage = document.querySelector(".new-msg");
            firstNewMessage
              ? firstNewMessage.scrollIntoView({ block: "center" })
              : this.$refs.endAncor.scrollIntoView();
          });
      },
      subscribeToMore: {
        document: messageObserverQuery,
        variables() {
          return {
            chatId: this.id,
          };
        },
        updateQuery: (
          previousResult,
          {
            subscriptionData: {
              data: { messageObserver },
            },
          }
        ) => {
          const updateMessage = (messages, type, message) => {
            switch (type) {
              case "ADD":
                sound.play();

                return [...messages, message];

              case "UPDATE":
                return updateById(messages, message.id, message);

              case "DELETE":
                return removeById(messages, message.id);

              default:
                return messages;
            }
          };

          return ((data, { type, message }) =>
            setIn(
              data,
              "chat.messages",
              updateMessage(data.chat.messages, type, message)
            ))(previousResult, messageObserver);
        },
      },
    },
  },
};
</script>

<style lang="sass">
.scroll-btn
  bottom: $message-input-height + 24px
  position: fixed
  transform: translateX(-100%)
  z-index: 100
</style>