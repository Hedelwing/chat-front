<template>
  <div class="form-container mt-3" ref="form">
    <v-divider></v-divider>
    <div class="message-form pa-3">
      <v-expand-transition>
        <div class="d-flex align-start text-caption" v-if="isEditing">
          <span>Pедактирование</span>
          <v-btn class="ml-2" @click="cancel" x-small icon>
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-expand-transition>
      <div class="d-flex align-center">
        <v-textarea
          ref="messageInput"
          @keyup.ctrl.enter="handleSubmit"
          hide-details
          no-resize
          rows="2"
          placeholder="Сообщение"
          v-model="body"
          color="deep-purple"
          dense
          class="flex-grow-1"
        >
        </v-textarea>
        <div class="relative ml-2">
          <v-icon color="amber" @click="showSmiles = true" x-large>
            mdi-emoticon
          </v-icon>
          <v-expand-transition>
            <VEmojiPicker
              v-click-outside="{
                handler: emojiOutsideClick,
                closeConditional: () => showSmiles,
              }"
              v-if="showSmiles"
              class="emoji-picker"
              :show-search="false"
              @select="selectEmoji"
            />
          </v-expand-transition>
        </div>
        <v-btn
          class="ml-2"
          icon
          x-large
          color="deep-purple"
          @click="handleSubmit"
          ><v-icon>mdi-send</v-icon></v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { VEmojiPicker } from "v-emoji-picker";

export default {
  data() {
    return {
      body: this.defaultValue ?? "",
      showSmiles: false,
    };
  },
  watch: {
    defaultValue() {
      this.body = this.defaultValue;
      this.$refs.messageInput.focus();
    },
  },
  props: ["submit", "default-value", "is-editing"],
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    selectEmoji(emoji) {
      this.body += emoji.data;
      this.$refs.messageInput.focus();
    },
    emojiOutsideClick() {
      this.showSmiles = false;
      this.$refs.messageInput.focus();
    },
    async handleSubmit() {
      await this.submit(this.body);
      this.body = "";
      this.$refs.messageInput.focus();
    },
  },
  components: { VEmojiPicker },
};
</script>

.<style lang="sass">
.message-form
  background: white

.emoji
  display: flex !important
  justify-content: center
  align-items: center

.emoji-picker
  position: absolute
  top: -12px
  left: 50%
  transform: translate(-50%, -100%)
  max-width: 240px
  z-index: 10

.form-container
  background: map-get($material-light, "background")
  position: sticky
  bottom: 0
  z-index: 2
  width: 100%
  max-width: inherit
</style>

