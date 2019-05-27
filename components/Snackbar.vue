<template>
  <v-snackbar
    v-model="snackbar"
    :color="color || 'error'"
    :multi-line="mode === 'multi-line'"
    :timeout="timeout"
    :vertical="mode === 'vertical'"
  >
    {{ text }}
  </v-snackbar>
</template>

<script>
export default {
  props: {
    text: String,
    color: String,
    show: Boolean
  },
  data: () => ({
    mode: "",
    timeout: 4500
  }),
  methods: {
    onClose() {
        this.snackbar = false;
    }
  },
  computed: {
    snackbar: {
      get() {
        return this.show;
      },
      set(val) {}
    }
  }
};
</script>