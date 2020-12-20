<template>

<v-container fill-height fluid>
  <v-row align="center"
      justify="center">
      <v-col>
  <v-card
    class="mx-auto my-4"
    max-width="450"
    elevation="0"
  >
    <!-- <h1>Stage: {{stage}} - {{messageIndex}}</h1> -->

    <transition-group name="scale-transition" 
      class="pt-6">
      <div
        style="display: inline-block"
        v-for="(currentMessage, i) in currentMessages" :key="i"
        class="rounded elevation-5 ma-2 px-4 py-2 white--text inline primary"
        v-html="currentMessage"
      >
      </div>
    </transition-group>

    <v-img
      width="333"
      class="pt-6"
      contain
        alt="Logo"
        :src="require('../assets/rubberduck.png')"
        transition="scale-transition"
        @click="startDucking()"
      >
      <v-icon large v-if="speaking" class="red--text">
        mdi-waveform
      </v-icon>
    </v-img>

    <v-btn icon @click="about = true">
      <v-icon class="grey--text">
        mdi-information-variant
      </v-icon>
    </v-btn>

    <About v-if="about" @close="about=false" />

    <!--
      script ist eingeteilt in 6 phasen. jeweils array mit diversen textbausteinen (split strings #: mehrere bubbles nacheinander, etwas zeitversetzt erscheint zweite oder dritte nachricht):
(texte dürfen HTML beinhalten für links etc)
1. welcome (randomly pick 1)
2. Explain project/situation (randomly pick 3-6)
3. Übergangstexte zu phase 4 (randomly pick 1)
4. Debugging. Endless loop of generic questions (ab und an: kleine bubble mit "solved?" -> enter phase 5)
5. thank you goodbye! (randomly pick 1)
6. Could i help you? ok - nope. any other questions? -> jump to phase 4 again
7. That'll be 400USD please ;)
 -->
  </v-card>
      </v-col>
  </v-row>
</v-container>
</template>
<script>
import script from '../assets/script.js';
import About from '@/components/About'

export default {
  name: 'Home',
  components: {
    About
  },
  data () {
    return {
      script: script,
      stage: 0,
      messageIndex: 0,
      currentMessages: [],
      spokenMessages: [],
      about: false,
      // speeeech
      speaking: false,
      selectedVoice: 51,
      synth: window.speechSynthesis,
      voiceList: [],
      Speech: new window.SpeechSynthesisUtterance(),
    } 
  },
  created() {
    this.voiceList = this.synth.getVoices();
    this.synth.onvoiceschanged = () => {  // Needed to keep the right voice
      this.voiceList = this.synth.getVoices();
    }
    for(let i = 0; i < this.voiceList.length; i++) {
      console.log(i, this.voiceList[i].name, this.voiceList[i].lang);
    }
    this.listenForSpeechEvents();
    
    // this.startDucking();
  },

  computed: {
  },

  methods: {
    listenForSpeechEvents () {
      this.Speech.onstart = () => {
        this.speaking = true;
        //console.log("start speech");
      }
      this.Speech.onend = () => {
        this.speaking = false;
        //console.log("end speech");
      }
    },
    async startDucking() {
      this.clearMessages();

      for(let i = 0; i < this.script.length; i++) {
        this.stage = i;
        // Depending on the state, multiplay this step for certain times.
        let repeats = i === 1 ? 4 : i === 3 ? 6 : 1;
        for(let x = 0; x < repeats; x++) {
          await this.displayMessage();
        }
        this.spokenMessages = [];
      }
      //clean up at the end
      await this.$helpers.sleep(2000);
      await this.clearMessages();
    },

    randomMessage(max) {
      let rand = this.$helpers.randomBetween(0, max);
      // Reset spokenMessages if everything was already used
      if(max === this.spokenMessages.length) this.spokenMessages = [];

      if(this.$helpers.arrayContains(this.spokenMessages, rand)) {
        return this.randomMessage(max);
      } else {
        this.spokenMessages.push(this.messageIndex);
        return rand;
      }
    },

    async displayMessage() {
      let maxAnswers = this.script[this.stage].length-1;

      // Do not repeat used messages:
      this.messageIndex = this.randomMessage(maxAnswers);

      let messages = this.script[this.stage][this.messageIndex].split("##");
      let bubblesPerMessage = messages.length;
      for(let i = 0; i < bubblesPerMessage; i++) {
        console.log(this.stage, this.messageIndex, i);
        this.currentMessages.push(messages[i]);
        this.speak(this.$helpers.stripHtml(messages[i]));
        await this.$helpers.sleep(this.$helpers.randomBetween(500, 2000));  // wait inbetween 
      }
      await this.$helpers.sleep(this.$helpers.randomBetween(5000, 8000));
      await this.clearMessages();
    },

    async clearMessages() {
      this.currentMessages = [];
      await this.$helpers.sleep(200);
    },

    speak(text) {
      this.Speech.text = text;
      this.Speech.voice = this.voiceList[this.selectedVoice];
      this.synth.speak(this.Speech);
    }
  },
}
</script>
