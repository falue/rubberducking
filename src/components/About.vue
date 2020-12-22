<template>
  <v-dialog v-model="dialog" max-width="600" overlay-color="white">
    <v-card>
      <v-card-title>
        <img
          class="mr-3"
          style="max-width:60px"
          alt="icon"
          :src="require('../assets/icon.png?v=1')"
        >
        This is a silly website.
      </v-card-title>

      <v-card-subtitle class="italics py-3">
        Excerpt from <a href="https://en.wikipedia.org/wiki/Rubber_duck_debugging" target="_blank">wikipedia.org/wiki/Rubber_duck_debugging</a>:
      </v-card-subtitle>

      <v-card-text>
        <p class="px-4 mb-0">
          "In software engineering, rubber duck debugging is a method of debugging code. (...)
          The name is a reference to a story in the book <i>The Pragmatic Programmer</i> in which a programmer would carry around a rubber duck and debug their code by forcing themselves to explain it, line-by-line, to the duck. (...)
          In describing what the code is supposed to do and observing what it actually does, any incongruity between these two becomes apparent."
        </p>
      </v-card-text>

      <v-card-text>
        <Support/>
      </v-card-text>

      <v-card-actions class="pb-5">
        <v-spacer></v-spacer>
        <v-btn small class="primary" @click="dialog=false">
          Close
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Support from '@/components/Support'

export default {
  name: 'About',
  props: {
  },
  components: {
    Support
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