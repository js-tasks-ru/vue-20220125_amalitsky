<template>
  <div class="image-uploader">
    <label
      class="image-uploader__preview"
      :class="{
        'image-uploader__preview-loading': uploading,
      }"
      :style="coverStyles"
    >
      <span
        class="image-uploader__text"
        v-if="!selectedImageUrl"
      >
        Загрузить изображение
      </span>
      <span
        class="image-uploader__text"
        v-if="uploading"
      >
        Загрузка...
      </span>
      <span
        class="image-uploader__text"
        v-if="selectedImageUrl"
      >Удалить изображение</span>

      <input
        v-bind="$attrs"
        ref="fileInput"
        type="file"
        accept="image/*"
        class="image-uploader__input"
        :disabled="uploading"
        @click="onWrapperClick($event)"
        @change="onFileSelect($event)"
      />
    </label>
  </div>
</template>

<script>
export default {
  name: 'UiImageUploader',

  inheritAttrs: false,

  props: {
    preview: {
      type: String,
    },
    uploader: Function,
  },

  emits: ['select', 'upload', 'error', 'remove'],

  data() {
    return {
      uploading: false,
      selectedImageUrl: this.preview || '',
    };
  },

  computed: {
    coverStyles() {
      const { selectedImageUrl } = this;

      if (selectedImageUrl) {
        return {
          '--bg-url': `url(${selectedImageUrl})`,
        };
      }

      return null;
    },
  },

  watch: {
    // in case parent component changes preview programmatically
    preview(newPreviewValue) {
      if (!newPreviewValue) {
        this.remove(false);
      } else {
        this.selectedImageUrl = newPreviewValue;
      }
    },
  },

  methods: {
    remove(withEvent = true) {
      this.$refs.fileInput.value = '';
      this.selectedImageUrl = '';

      if (withEvent) {
        this.$emit('remove');
      }
    },
    onFileSelect(event) {
      const [file] = event.target.files;

      this.selectedImageUrl = URL.createObjectURL(file);

      this.$emit('select', file);

      if (this.uploader) {
        this.uploading = true;

        this.uploader(file)
          .then((result) => {
            this.$emit('upload', result);
          })
          .catch((err) => {
            this.$emit('error', err);
            this.remove(false);
          })
          .finally(() => this.uploading = false);
      }
    },
    onWrapperClick(event) {
      if (this.selectedImageUrl) {
        this.remove();
        event.preventDefault();
      }
    },
  },
};
</script>

<style scoped>
.image-uploader {
  --bg-url: url('/public/images/undraw_conference_speaker_6nt7.svg');
}

.image-uploader__input {
  opacity: 0;
  height: 0;
}

.image-uploader__preview {
  --bg-url: var(--default-cover);
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), var(--bg-url);
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  transition: 0.2s border-color;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 512px;
  height: 228px;
}

.image-uploader__text {
  color: var(--white);
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
}

.image-uploader__preview:hover {
  border-color: var(--blue);
}

.image-uploader__preview.image-uploader__preview-loading {
  cursor: no-drop;
}
</style>
