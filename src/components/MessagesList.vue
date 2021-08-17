<template>
  <div class="wrapper relative">
    <slot></slot>
    <div v-for="(msgs, day) in messages" :key="day">
      <h5 class="text-center d-flex flex-column mt-2 grey--text subtitle-1">
        {{ day }}
      </h5>
      <div
        v-for="message in msgs"
        :key="message.id"
        class="py-2 d-flex align-end"
        :class="{
          'justify-end': message.sender.id === me.id,
        }"
      >
        <message
          :key="message.id"
          :message="message"
          :deleteMessage="deleteMessage"
          :userIsSender="message.sender.id === me.id"
        ></message>
      </div>
    </div>
    <div style="position: absolute; right: 0">
      <v-scale-transition>
        <v-btn
          fab
          color="deep-purple"
          large
          class="scroll-btn"
          v-if="showScrollBtn"
          @click="scrollToBottom"
        >
          <v-icon color="white"> mdi-arrow-down </v-icon>
        </v-btn>
      </v-scale-transition>
    </div>
    <div ref="endAncor"></div>
  </div>
</template>

<script>
import Message from "../components/Message.vue";
import { meQuery } from "../graphql/Me";
import deleteMessage from "../graphql/DeleteMessage";
import updateMessage from "../graphql/UpdateMessage";
export default {
  data() {
    return {
      me: null,
      showScrollBtn: false,
    };
  },
  props: {
    messages: Object,
  },
  components: {
    Message,
  },
  apollo: {
    me: meQuery,
  },
  methods: {
    updateMessage(id, body) {
      this.$apollo.mutate({
        mutation: updateMessage,
        variables: { id, body },
      });
    },
    deleteMessage(id) {
      this.$apollo.mutate({
        mutation: deleteMessage,
        variables: { id },
      });
    },
    scrollToBottom() {
      this.$refs.endAncor.scrollIntoView({ behavior: "smooth" });
    },
    onScroll() {
      scrollY + innerHeight + 200 > document.body.clientHeight
        ? (this.showScrollBtn = false)
        : (this.showScrollBtn = true);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.endAncor.scrollIntoView();
    });

    addEventListener("scroll", this.onScroll);
  },
  destroyed() {
    removeEventListener("scroll", this.onScroll);
  },
};
</script>

<style lang="sass">
.scroll-btn
  bottom: $message-input-height
  position: fixed
  margin-right: 12px
  margin-bottom: 12px
  transform: translateX(-100%)

.wrapper
  padding-top: $messages-toolbar-height
</style>