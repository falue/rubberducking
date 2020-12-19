<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <router-link to="/">
        <v-img
        width="125"
        contain
          alt="Logo"
          :src="require('./assets/logo.png')"
          transition="scale-transition"
        />
      </router-link>

      <v-spacer></v-spacer>

      <v-form>
        <v-text-field
          class="mt-6"
          placeholder="Find.."
          filled
          rounded
          dense
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-form>

      <v-spacer></v-spacer>

      <router-link to="/Test" class="mr-2">
        <v-btn color="primary" depressed>Test</v-btn>
      </router-link>
      <router-link to="/About">
        <v-btn color="primary" depressed>About</v-btn>
      </router-link>

    </v-app-bar>

    <v-main>
   <!--     <v-row class="text-center">
     <v-col cols="12">
        <v-img
          :src="require('./assets/logo.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
     
    </v-row> -->
      <router-view></router-view>
    </v-main>
    
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    //HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>
