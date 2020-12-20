<template>
  <v-app>
    <!-- <v-app-bar
      app
      color="primary"
      dark
    >
      <router-link to="/">
        <v-icon x-large class="white--text">
          mdi-duck
        </v-icon>
      </router-link>

      <v-spacer></v-spacer>

      <router-link to="/Test" class="mr-2">
        <v-btn color="primary" depressed>Test</v-btn>
      </router-link>
      <router-link to="/About">
        <v-btn color="primary" depressed>About</v-btn>
      </router-link>

    </v-app-bar> -->

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-card-title class="justify-center caption grey--text fill-width" :class="$vuetify.breakpoint.smAndUp ? 'pb-6 mb-6' : ''">
      <div class="text-center">
        Proudly made by <a href="http://www.fluescher.ch" target="_blank" class="px-1">Fabian Lüscher</a>
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
