<template>
  <v-dialog v-model="dialog" max-width="600" overlay-color="white">
    <v-card>
      <v-card-title>
        This is a silly website.
      </v-card-title>
      <v-card-text>
      "In software engineering, rubber duck debugging is a method of debugging code. (...)
      The name is a reference to a story in the book <i>The Pragmatic Programmer</i> in which a programmer would carry around a rubber duck and debug their code by forcing themselves to explain it, line-by-line, to the duck. (...)
      In describing what the code is supposed to do and observing what it actually does, any incongruity between these two becomes apparent."
      </v-card-text>
      <v-card-subtitle class="italics">
        From <a href="https://en.wikipedia.org/wiki/Rubber_duck_debugging" target="_blank">wikipedia.org/wiki/Rubber_duck_debugging</a>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn @click="dialog=false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'About',
  props: {
  },

  data () {
    return {
      dialog: true,
    }
  },
  watch: {
    dialog() {
      this.$emit('close');
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>