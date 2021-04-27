<template>
  <div id="app">
    <div class="container">
      <div class="inner">
        <div class="header">
          <b>Choosen:</b>
          <span>{{ " " }}</span>
          <span>{{ choosen }}</span>
        </div>

        <radio-button
          name="radio-button-group"
          value="Radio 1"
          label="Label Radio 1"
          v-model="choosen"
        ></radio-button>

        <radio-button name="radio-button-group" value="Radio 2" v-model="choosen">
          <template slot:default slot-scope="{ isCurrentChecked }">
            <input
              type="text"
              :disabled="!isCurrentChecked"
              :placeholder="isCurrentChecked ? 'Is Choosen' : 'Disabled'"
            />
          </template>
        </radio-button>

        <radio-button
          name="radio-button-group"
          value="Radio 3"
          label="Label Radio 3"
          v-model="choosen"
        ></radio-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import RadioButton from "./components/RadioButton.vue";

@Component({
  components: {
    RadioButton,
  },
})
export default class App extends Vue {
  choosen = "Radio 1";
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.inner {
  margin: 0 auto;
  display: inline-block;
  border: 1px solid #ddd;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.header {
  margin-bottom: 15px;
}
</style>
