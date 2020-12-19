<template>
  <div class="test">
    <h1>This is the test page</h1>

    <v-row justify="center">
      <a
        v-for="(eco, i) in ecosystem"
        :key="i"
        :href="eco.href"
        class="subheading mx-3"
        target="_blank"
      >
        {{ eco.text }}
      </a>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'Test',

    data: () => ({
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
    }),
  }
</script>
