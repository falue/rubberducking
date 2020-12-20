<template>
    <v-dialog model="dialog" max-width="600">
      <v-card-title>
        This is a silly website.
      </v-card-title>
      <v-card-text>
      "In software engineering, rubber duck debugging is a method of debugging code. (...)
      The name is a reference to a story in the book The Pragmatic Programmer in which a programmer would carry around a rubber duck and debug their code by forcing themselves to explain it, line-by-line, to the duck. (...)
      In describing what the code is supposed to do and observing what it actually does, any incongruity between these two becomes apparent."
      </v-card-text>
      <v-card-subtitle>
        From <a href="" target="_blank"></a>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn @click="dialog=false; $emit('close')">
          Close
        </v-btn>
      </v-card-actions>
    </v-dialog>
</template>

<script>
export default {
  name: 'About',
  props: {
  },

  data () {
    return {
      dialog:true,
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>