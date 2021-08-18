<template>
  <div class="form-container mt-5" ref="form">
    <div class="message-form flex-grow-1 pa-2 pa-md-3 d-flex align-center flex-wrap">
      <v-expand-transition>
        <div class="d-flex align-start text-caption edit-notify flex-grow-1" v-if="isEditing">
          <span>Pедактирование</span>
          <v-btn class="ml-2" @click="cancel" x-small icon>
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-expand-transition>
      <div class="relative">
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
      <div class="d-flex align-center flex-grow-1 ml-2">
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
  min-height: $message-input-height

.emoji
  display: flex !important
  justify-content: center
  align-items: center

.emoji-picker
  position: absolute
  top: -20px
  left: -8px
  transform: translateY(-100%)
  z-index: 10
  max-width: 300px

.form-container
  background: map-get($material-light, "background")
  position: sticky
  bottom: 0
  z-index: 5
  width: 100%
  max-width: inherit
  border-top: 1px solid rgb(224, 224, 224)

.edit-notify
  flex-basis: 100%

#Categories > .category
  padding: 5px 2px
</style>

