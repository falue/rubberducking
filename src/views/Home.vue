<template>

<v-container fluid :class="$vuetify.breakpoint.xsOnly ? '' : 'fill-height'">
  <v-row align="center" justify="center">
  <v-col class="py-0">
  <v-card
    class="mx-auto my-0"
    max-width="850"
    elevation="0"
  >
    <!-- <h1>Stage: {{stage}} - {{messageIndex}}</h1> -->
    <v-container class="py-0">
      <v-row>
        <v-col v-if="debuggingInProgress" cols="12" xs="12" sm="6" class="py-0 miny-200"
        :align="$vuetify.breakpoint.smAndUp ? 'right' : ''">
          <!-- MESSAGES -->
          <transition-group name="slide-x-reverse-transition">
            <div v-for="(currentMessage, i) in currentMessages" :key="i+'xxx'" class="">
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

        <v-col cols="12" xs="12" :sm="debuggingInProgress ? 6 : 12" class="text-center relative py-0"
        :class="!debuggingInProgress && $vuetify.breakpoint.xsOnly ? 'pt-6 mt-6' : ''">
            <!-- SHADOW -->
            <img
              class="absolute mr-3 shadow_duck"
              :class="[debuggingInProgress ? 'pr-6' : '', speaking ? 'speaking' : '', shake ? 'shake' : '', bounce ? 'bounce' : '', wobble ? 'wobble' : '', squeeze ? 'squeeze' : '']"
              :width="$vuetify.breakpoint.smAndUp ? '100%' : '80%'"
              style="max-width:550px"
              alt="Logo Shadow"
              :src="require('../assets/rubberduck_shadow.png?v=1')"
            >
            <!-- DUCKY -->
            <img
              class="relative duck"
              :class="[debuggingInProgress ? '' : 'pointer', speaking ? 'speaking' : '', shake ? 'shake' : '', bounce ? 'bounce' : '', wobble ? 'wobble' : '', squeeze ? 'squeeze' : '']"
              :width="$vuetify.breakpoint.smAndUp ? '100%' : '80%'"
              style="max-width:550px"
              alt="Logo"
              :src="require('../assets/rubberduck.png?v=1')"
              @click="startDucking()"
            >
          
          <div class="text-right">
            <!-- MUTE BUTTON -->
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
      // Ducky actions
      bounce: false,
      shake: false,
      wobble: false,
      squeeze: false,
      // speeeech
      speaking: false,
      selectedVoice: 0,
      synth: window.speechSynthesis,
      voiceList: [],
      Speech: new window.SpeechSynthesisUtterance(),
      quacks: ["Quack", "Quaack!", "Squieek!", "Quack, quack", "Quack!", "Quack eroni.", "Quaaaaak!"],
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
      let voiceDefaultEn = 0;
      for(let i = 0; i < this.voiceList.length; i++) {
        //console.log(i, this.voiceList[i].name, this.voiceList[i].lang, this.voiceList[i].lang === 'en-GB', this.voiceList[i].lang.startsWith('en-'));
        // look for en-GB and en_GB (android chrome)
        if(this.voiceList[i].lang === 'en-GB' || this.voiceList[i].lang === 'en_GB') voiceGB = i;
        // look for en- and en_ (android chrome)
        if(this.voiceList[i].lang.startsWith('en-') || this.voiceList[i].lang.startsWith('en_')) voiceUS = i;
        if(this.voiceList[i].lang.startsWith('en')) voiceDefaultEn = i;
      }
      // console.log("voiceGB:", voiceGB);
      // console.log("voiceUS:", voiceUS);
      if(voiceGB > 0) return voiceGB;
      if(voiceUS > 0) return voiceUS;
      return voiceDefaultEn;
    },

    listenForSpeechEvents () {
      this.Speech.onstart = () => {
        this.speaking = true;
      }
      this.Speech.onend = () => {
        this.speaking = false;
      }
    },

    async startDucking() {
      // Do not start again if in progress
      if(this.debuggingInProgress) {
        // Squeeze the duck
        this.squeeze = true;
        let quack = this.quacks[this.$helpers.randomBetween(0, this.quacks.length-1)];
        if(this.currentMessages.length < 4) this.currentMessages.push(quack);
        if(!this.mute) {
          this.speak(quack);
          await this.$helpers.sleep(1000);
        }
        this.squeeze = false;
      } else {
        this.selectedVoice = this.setVoice();
        this.debuggingInProgress = true;
        this.clearMessages();

        for(let i = 0; i < this.script.length; i++) {
          this.stage = i;
          // Depending on the state, multiplay this step for certain times.
          let repeats = i === 2 ? 4 : i === 4 ? 6 : 1;
          for(let x = 0; x < repeats; x++) {
            await this.displayMessage();
          }
          this.spokenMessages = [];
        }
        // Clean up at the end
        await this.clearMessages();
        this.debuggingInProgress = false;
        await this.randomDuckyAction();
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
      if(this.$helpers.randomBetween(1, 6) === 1) await this.randomDuckyAction();
      await this.$helpers.sleep(this.$helpers.randomBetween(5000, 8000));
    },

    prepareBeforeSpoken(text) {
      text = text.replace("I'm", "I am");
      text = text.replace("Sir/Madame", "Sir stroke Madame");
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

    async randomDuckyAction() {
      let rand = this.$helpers.randomBetween(1, 3);
      if(rand === 1) {
        this.bounce = true;
      } else if(rand === 2) {
        this.shake = true;
      } else {
        this.wobble = true;
      }
      await this.$helpers.sleep(2000);
      this.bounce = false;
      this.shake = false;
      this.wobble = false;
    },

    async speak(text) {
      while(this.speaking) {
        await this.$helpers.sleep(50);
      }
      this.synth.cancel();  // Cancel talking to not overlap, which does trigger the old text again
      this.Speech.text = text;
      this.Speech.voice = this.voiceList[this.selectedVoice];
      //if(!this.speaking)  // Do not speak if something else is still saying something
      this.synth.speak(this.Speech);
    }
  },
}
</script>

<style scoped>
  .triangleBottom {
    transform: translateX(-.1em) translateY(-1.8em)
  }
  .triangleLeft {
    transform: translateX(0.8em) translateY(-1em) scale(1, -1);
  }

  /* ANIMATIONS */
  /* check for animations: https://codepen.io/nelledejones/pen/gOOPWrK?editors=0100 */

  /* SPEAKING */
  .duck.speaking {
    -webkit-animation-name: speaking;
    -webkit-animation-duration: 1.8s;
    -webkit-transform-origin:50% 50%;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
  }
  @-webkit-keyframes speaking {
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
  .shadow_duck.speaking {
    -webkit-animation-name: speaking-shadow;
    -webkit-animation-duration: 1.8s;
    -webkit-transform-origin:50% 50%;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
  }
  @-webkit-keyframes speaking-shadow {
    0% { -webkit-transform: translateX(3px) }
    10% { -webkit-transform: translateX(-2px) }
    20% { -webkit-transform: translateX(-3px) }
    30% { -webkit-transform: translateX(0px) }
    40% { -webkit-transform: translateX(1px) }
    50% { -webkit-transform: translateX(-1px) }
    60% { -webkit-transform: translateX(-4px) }
    70% { -webkit-transform: translateX(3px) }
    80% { -webkit-transform: translateX(-1px) }
    90% { -webkit-transform: translateX(3px) }
    100% { -webkit-transform: translateX(1px); }
  }


  /* BOUNCE */
  .duck.bounce {
    animation: bounce 2s ease infinite;
  }
  @keyframes bounce {
      70% { transform:translateY(0%); }
      80% { transform:translateY(-15%) rotate(-5deg); }
      90% { transform:translateY(0%); }
      95% { transform:translateY(-7%) rotate(0); }
      97% { transform:translateY(0%); }
      99% { transform:translateY(-3%) rotate(3deg); }
      100% { transform:translateY(0) rotate(0); }
  }
  .shadow_duck.bounce {
    animation: bounce-shadow 2s ease infinite;
    -webkit-transform-origin:50% 90%;
  }
  @keyframes bounce-shadow {
      70% { transform:scale(1); }
      80% { transform:scale(0.75); }
      90% { transform:scale(1); }
      95% { transform:scale(0.9); }
      97% { transform:scale(1); }
      99% { transform:scale(0.95); }
      100% { transform:scale(1); }
  }

  /* SHAKE */
  .duck.shake {
    animation: shake 2s ease infinite;
  }
  @keyframes shake {
    0%, 100% {transform: translateX(0) rotate(0deg);}
    10%, 30%, 50%, 70%, 90% {transform: translateX(-5px) rotate(-1deg);}
    20%, 40%, 60%, 80% {transform: translateX(5px) rotate(1deg);}
  }
   .shadow_duck.shake {
    animation: shake-shadow 2s ease infinite;
  }
  @keyframes shake-shadow {
    0%, 100% {transform: translateX(0);}
    10%, 30%, 50%, 70%, 90% {transform: translateX(-5px);}
    20%, 40%, 60%, 80% {transform: translateX(5px);}
  }

  /* WOBBLE */
  .duck.wobble {
    animation: wobble 1s ease 1;
  }
  @keyframes wobble {
    0% { transform: translateX(0%); }
    15% { transform: translateX(-8%) rotate(-5deg); }
    30% { transform: translateX(7%) rotate(3deg); }
    45% { transform: translateX(-8%) rotate(-3deg); }
    60% { transform: translateX(5%) rotate(2deg); }
    75% { transform: translateX(-2%) rotate(-1deg); }
    100% { transform: translateX(0%); }
  }
  .shadow_duck.wobble {
    animation: wobble-shadow 1s ease 1;
  }
  @keyframes wobble-shadow {
    0% { transform: translateX(0%); }
    15% { transform: translateX(-8%); }
    30% { transform: translateX(7%); }
    45% { transform: translateX(-8%); }
    60% { transform: translateX(5%); }
    75% { transform: translateX(-2%); }
    100% { transform: translateX(0%); }
  }

  /* SQUEEZE */
  .duck.squeeze {
    animation: squeeze 0.75s ease 1;
    -webkit-transform-origin:50% 100%;
  }
  @keyframes squeeze {
    from, to { transform: scale(1, 1); }
    12% { transform: scale(1.05, 0.9); }
  }
  .shadow_duck.squeeze {
    animation: squeeze-shadow 0.75s ease 1;
    -webkit-transform-origin:50% 90%;
  }
  @keyframes squeeze-shadow {
    from, to { transform: scale(1, 1); }
    12% { transform: scale(1.2, 1); }
  }
</style>
