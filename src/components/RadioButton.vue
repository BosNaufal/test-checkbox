<template>
  <div class="RadioButton-container">
    <div>
      <div
        data-testid="RadioButton-check"
        :data-value="value"
        :data-name="name"
        :data-checked="isChecked.toString()"
        :class="{
          'RadioButton-check': true,
          'RadioButton-check--is_checked': isChecked,
        }"
        @click="$emit('checked', value)"
      >
        <!-- If need fallback or monolith rendering components -->
        <input
          class="RadioButton-input"
          type="radio"
          :name="name"
          :value="value"
          :checked="isChecked"
        />
      </div>
    </div>
    <span>{{ label }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

const RadioButtonProps = Vue.extend({
  props: {
    customClass: {
      type: String,
    },
    name: {
      type: String,
    },
    value: {
      type: String,
    },
    label: {
      type: String,
    },
    choosen: {
      type: String,
    },
  },
});

@Component({
  model: {
    prop: "choosen",
    event: "checked",
  },
})
export default class RadioButton extends RadioButtonProps {
  get isChecked(): boolean {
    return this.choosen === this.value;
  }
  handleCheck(): void {
    this.$emit("change", this.value);
  }
}
</script>

<style lang="less">
.RadioButton {
  &-container {
    display: flex;
    margin-top: 7px;
  }
  &-input {
    display: none;
  }
  &-check {
    cursor: pointer;
    border-radius: 50%;
    padding: 3px;
    display: inline-block;
    border: 2px solid red;
    margin-right: 7px;

    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 9px;
      height: 9px;
      background: transparent;
    }

    &--is_checked {
      &::after {
        background: red;
      }
    }
  }
}
</style>
