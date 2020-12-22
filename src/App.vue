<template>
  <v-app>
    <!-- DUCKY -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- FOOTER -->
    <v-card-title class="justify-center fixed bottom caption grey--text fill-width" :class="$vuetify.breakpoint.smAndUp ? 'pb-6 mb-6' : ''">
      <div class="text-center">
        <Support/>  
      </div>
    </v-card-title>
    
  </v-app>
</template>

<script>
import Support from '@/components/Support'

export default {
  name: 'App',

  components: {
    Support
  },

  data: () => ({
  }),
};
</script>
