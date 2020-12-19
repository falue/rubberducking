// import Vue from 'vue';

export default {
  sleep: async function (ms) {
    // use like this: await this.sleep(delay);
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  randomBetween: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  stripHtml(text) {
    return text.trim().replace(/<(?:.|\n)*?>/gm, '').replace(/['\\"]+/g, '');
  },

  arrayContains(array, key) {
    //console.log(array, key, array.indexOf(key), array.indexOf(key) >= 0)
    return array.indexOf(key) >= 0;
  },
/* 
  getRandomWords: function(wordcount, joint='') {
    // check out https://github.com/punkave/random-words
    return Vue.prototype.$randomWords({
        exactly:wordcount,
        //wordsPerString: 1,
        join: joint,  // if set, string with joint as joint between
        maxLength: 6,  // word length
        formatter: (word, index)=> {
          return index === 0 ? word.slice(0,1).toUpperCase().concat(word.slice(1)) : word;
        }}
      )
  }, */

  removeFromArray(array, key) {
    const index = array.indexOf(key);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  },

  startsWithAnyElement: function(haystack, needle) {
    return haystack.some(function (hay) {
        // console.log("le loop: ", needle, hay, needle.startsWith(hay))
        return needle.startsWith(hay);
    })
  },

  truncate(string, length, dots='...') {
    if(string.length <= length) return string;
    length -= dots.length;
    return  string.substring(0,length/2) + dots + string.substring(string.length-length/2, string.length)
  },

  ellipsis(string, length, dots='...') {
    if(string.length <= length) return string;
    length -= dots.length;
    return  string.substring(0,length) + dots
  },

  capitalize(string) {
    if(string && string.length) {
      return string[0].toUpperCase() + string.slice(1);
    } else {
      return string
    }
  },
}
