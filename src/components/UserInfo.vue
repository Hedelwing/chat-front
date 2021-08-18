<template>
  <div v-if="me" class="d-flex align-center pa-3">
    <div class="relative">
      <avatar :image="me.avatar" :text="me.nickname"></avatar>
      <v-btn class="white edit-control" @click="isOpen = true" x-small icon>
        <v-icon color="black">mdi-lead-pencil</v-icon>
      </v-btn>
    </div>

    <div class="ml-2 white--text">
      <div class="text-h6">
        {{ me.nickname }}
      </div>
      <div class="caption">
        {{ me.email }}
      </div>
    </div>
    <v-btn color="red" class="ml-auto" @click.once="logout" icon>
      <v-icon> mdi-exit-to-app </v-icon>
    </v-btn>

    <v-dialog v-model="isOpen" max-width="300px">
      <v-card
        @drop.prevent="loadImage"
        @dragover.prevent
        :class="{ 'green lighten-5': dragEntered }"
      >
        <div v-if="!imageSrc" class="pa-1">
          <div class="d-flex drag-box flex-column align-center pa-5">
            <div v-show="error" class="text--center text-caption mb-5">
              <v-icon color="red">mdi-alert</v-icon>
              <span class="ml-2">{{ error }}</span>
            </div>
            <p class="text-subtitle-1 text-center">
              Начните перетаскивать изображение
            </p>
            <label
              class="v-btn v-btn--is-elevated v-size--default green--text"
              style="cursor: pointer"
            >
              <v-icon color="green">mdi-upload</v-icon>
              <span class="ml-2">Выбрать файл</span>
              <input
                name="file"
                @change="loadImage"
                type="file"
                class="d-none"
              />
            </label>
          </div>
        </div>
        <div v-if="imageSrc">
          <cropper
            style="overflow: hidden"
            :size-restrictions-algorithm="percentsRestriction"
            :canvas="{
              maxHeight: 300,
              maxWidth: 300,
            }"
            ref="cropper"
            stencil-component="circle-stencil"
            :src="imageSrc"
          />
          <div class="d-flex justify-space-between pa-2">
            <v-btn @click="imageSrc = null">Отмена</v-btn>
            <v-btn class="white--text" color="deep-purple" @click="upload"
              >Загрузить</v-btn
            >
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
  <div v-else>
    <v-skeleton-loader
      v-bind="attrs"
      type="list-item-avatar-two-line"
    ></v-skeleton-loader>
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import meQuery from "../graphql/Me";
import uploadAvatar from "../graphql/UploadAvatar";
import signOut from "../graphql/SignOut";
import Avatar from "./Avatar.vue";
import { logout } from "../utils";

const validateImageMinSize = (image, size) =>
  new Promise((res, rej) => {
    const img = new Image();

    img.src = image;
    img.onload = () => {
      const { width, height } = img;
      Math.min(width, height) < size
        ? rej("Слишком маленькое изображение")
        : res();
    };
  });

export default {
  data() {
    return {
      dragEntered: false,
      me: {},
      isOpen: false,
      imageSrc: null,
      error: null,
    };
  },
  watch: {
    isOpen() {
      if (!this.isOpen) this.clearImage();
    },
  },
  components: {
    Cropper,
    Avatar,
  },
  apollo: {
    me: {
      query: meQuery,
    },
  },
  methods: {
    percentsRestriction() {
      return {
        minWidth: 200,
        minHeight: 200,
      };
    },
    clearImage() {
      if (this.imageSrc) {
        URL.revokeObjectURL(this.imageSrc);
        this.imageSrc = null;
      }
    },
    logout() {
      this.$apollo
        .mutate({
          mutation: signOut,
        })
        .then(() => {
          logout();
          this.$router.push("/signin");
        });
    },
    upload() {
      const { canvas } = this.$refs.cropper.getResult();
      if (canvas) {
        canvas.toBlob((blob) => {
          this.$apollo
            .mutate({
              mutation: uploadAvatar,
              variables: { file: blob },
            })
            .then(() => {
              this.isOpen = false;
            });
        }, "image/jpeg");
      }
    },
    loadImage(e) {
      const [file] = (e.target?.files || e.dataTransfer?.files) ?? [];

      if (file) {
        const isAllowedFormat =
          ["image/jpeg", "image/webp", "image/png"].indexOf(file.type) !== -1;

        if (!isAllowedFormat) {
          this.error = "Неподдерживаемый формат";
        }

        this.clearImage();

        const blob = URL.createObjectURL(file);

        const reader = new FileReader();
        reader.onload = () => {
          validateImageMinSize(blob, 200)
            .then(() => {
              this.error = null;
              this.imageSrc = blob;
            })
            .catch((err) => {
              this.error = err;

              this.clearImage();
            });
        };

        reader.readAsArrayBuffer(file);
      }
    },
  },
};
</script>

<style lang="sass">
.vue-advanced-cropper__background, .vue-advanced-cropper__foreground
  background: white

.drag-box
  border: 2px dashed green

.edit-control
  position: absolute
  bottom: 0
  right: 0
</style>