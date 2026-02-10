<script setup>
import {defineProps, defineEmits} from 'vue';

const props = defineProps({
  modelValue: [String, Object],
  label: [String],
  placeholder: [String],
  required: [Boolean],
  errorMessages: {
    type: [String, Array],
    default: () => [],
  },
  items: Array,
  itemValue: {
    type: [String, Function],
    default: "value",
  },
  itemName: {
    type: [String, Function],
    default: "name",
  }
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <v-select
      :model-value="props.modelValue"
      @update:model-value="val => emit('update:modelValue', val)"
      :label="props.label"
      :placeholder="props.placeholder"
      :required="props.required"
      :error-messages="props.errorMessages"
      :items="props.items"
      :item-value="props.itemValue"
      :item-name="props.itemName"
  ></v-select>
</template>

<style scoped>

</style>