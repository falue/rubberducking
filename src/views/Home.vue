<template>

<v-container fill-height fluid>
  <v-row align="center"
      justify="center">
      <v-col>
  <v-card
    class="mx-auto my-4"
    max-width="850"
    elevation="0"
  >
    <!-- <h1>Stage: {{stage}} - {{messageIndex}}</h1> -->
    <v-container>
      <v-row>
        <v-col v-if="debuggingInProgress" cols="12" xs="12" sm="6" class="miny-200" :align="$vuetify.breakpoint.smAndUp ? 'right' : ''">
          <!-- MESSAGES -->
          <transition-group name="scale-transition">
            <div v-for="(currentMessage, i) in currentMessages" :key="i" class="">
              <div
                class="rounded elevation-5 ma-2 px-4 py-2 white--text inline-block primary"
                v-html="currentMessage"
              >
              </div>
                <div
                  class="relative"
                  :class="$vuetify.breakpoint.smAndUp ? 'right triangleBottom' : 'left triangleLeft'"
                ><v-icon x-small color="primary">mdi-triangle</v-icon>
                </div>
            </div>
          </transition-group>
        </v-col>

        <v-col cols="12" xs="12" :sm="debuggingInProgress ? 6 : 12" class="text-center">
          <!-- DUCKY -->
            <img
              class="pt-6"
              :class="[debuggingInProgress ? '' : 'pointer', speaking ? 'speaking' : '']"
              width="100%"
              style="max-width:550px"
              alt="Logo"
              :src="require('../assets/rubberduck.png')"
              @click="startDucking()"
            >

          <div class="text-right">
            <!-- SPEAKER -->
            <v-btn icon @click="mute = !mute">
              <v-icon class="grey--text">
                {{mute ? 'mdi-volume-mute' : 'mdi-volume-high'}}
              </v-icon>
            </v-btn>
            <!-- ABOUT BUTTON -->
            <v-btn icon @click="about = true">
              <v-icon class="grey--text">
                mdi-information-variant
              </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <About v-if="about" @close="about=false" />

    <!--
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
      mute: false,
      about: false,
      debuggingInProgress: false,
      // speeeech
      speaking: false,
      selectedVoice: 0,
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
    this.listenForSpeechEvents();
  },

  computed: {
  },

  methods: {
    setVoice() {
      let voiceGB = 0;
      let voiceUS = 0;
      for(let i = 0; i < this.voiceList.length; i++) {
        console.log(i, this.voiceList[i].name, this.voiceList[i].lang, this.voiceList[i].lang === 'en-GB', this.voiceList[i].lang.startsWith('en-'));
        // look for en-GB
        if(this.voiceList[i].lang === 'en-GB') voiceGB = i;
        // look for en-
        if(this.voiceList[i].lang.startsWith('en-')) voiceUS = i;
      }
      // console.log("voiceGB:", voiceGB);
      // console.log("voiceUS:", voiceUS);
      if(voiceGB > 0) return voiceGB;
      if(voiceUS > 0) return voiceUS;
      return 0
    },

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
      this.selectedVoice = this.setVoice();

      // Do not start again if in progress
      if(this.debuggingInProgress) {
        this.speak("Quack");
        await this.$helpers.sleep(1000);
      } else {
        this.debuggingInProgress = true;
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
        this.debuggingInProgress = false;  // ???
      }
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
        // console.log(this.stage, this.messageIndex, i);
        this.currentMessages.push(messages[i]);
        if(this.mute) {
          this.speaking = true;
        } else {
          this.speak(this.prepareBeforeSpoken(messages[i]));
        }
        await this.$helpers.sleep(this.$helpers.randomBetween(500, 2000));  // wait inbetween 
      }
      await this.$helpers.sleep(3000);
      if(this.mute) this.speaking = false;
      await this.clearMessages();
      await this.$helpers.sleep(this.$helpers.randomBetween(5000, 8000));
    },

    prepareBeforeSpoken(text) {
      text = text.replace("';'", "semicolon");
      text = text.replace("'\"'", "quotes");
      text = text.replace("'''", "single quotes");
      text = text.replace("'“'", "cursive quotes");
      text = text.replace("'‘'", "cursive single quotes");
      text = this.$helpers.stripHtml(text);
      return text;
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

<style scoped>
  @-webkit-keyframes shake {
    0% { -webkit-transform: translate(2px, 1px) rotate(0deg); }
    10% { -webkit-transform: translate(-1px, -2px) rotate(-1deg); }
    20% { -webkit-transform: translate(-3px, 0px) rotate(1deg); }
    30% { -webkit-transform: translate(0px, 2px) rotate(0deg); }
    40% { -webkit-transform: translate(1px, -1px) rotate(1deg); }
    50% { -webkit-transform: translate(-1px, 2px) rotate(-1deg); }
    60% { -webkit-transform: translate(-3px, 1px) rotate(0deg); }
    70% { -webkit-transform: translate(2px, 1px) rotate(-1deg); }
    80% { -webkit-transform: translate(-1px, -1px) rotate(1deg); }
    90% { -webkit-transform: translate(2px, 2px) rotate(0deg); }
    100% { -webkit-transform: translate(1px, -2px) rotate(-1deg); }
  }
  .speaking {
    -webkit-animation-name: shake;
    -webkit-animation-duration: 1.8s;
    -webkit-transform-origin:50% 50%;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
  }

  .triangleBottom {
    transform: translateX(-.1em) translateY(-1.8em)
  }

  .triangleLeft {
    transform: translateX(0.8em) translateY(-1em) scale(1, -1);
  }
</style>