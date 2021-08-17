<template>
  <v-avatar :size="sizes[size]">
    <v-img :src="image || '/noimage.png'"> </v-img>
  </v-avatar>
</template>

<script>
const sizes = {
  small: "2rem",
  medium: "3rem",
  large: "5rem",
};
export default {
  data() {
    return {
      sizes,
    };
  },
  props: {
    image: String,
    size: {
      validator: function (value) {
        return Object.keys(sizes).indexOf(value) !== -1;
      },
      default: "medium",
    },
  },
};
</script>

<style lang="sass" scoped>
$sizes: (small: 1rem, medium: 1.5rem, large: 3rem)

@each $key, $value in $sizes
  .#{$key}-text
    font-size: $value
</style>