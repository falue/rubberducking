<template>
  <v-app>
    <!-- DUCKY -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- FOOTER -->
    <v-card-title class="justify-center fixed bottom caption grey--text fill-width" :class="$vuetify.breakpoint.smAndUp ? 'pb-6 mb-6' : ''">
      <div class="text-center">
        Foolishly made by <a href="https://github.com/falue" target="_blank">Fabian Lüscher</a>
        for you <v-icon x-small class="error--text px-1">mdi-heart</v-icon>
        <br>
        <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" title="See creative commons license">CC0 1.0</a>
        - 2020
        <br>
        Like this? <a href="https://paypal.me/fluescher" target="_blank">Please support this project on paypal</a>
      </div>
    </v-card-title>
    
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
  },

  data: () => ({
  }),
};
</script>
