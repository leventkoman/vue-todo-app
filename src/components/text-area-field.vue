<script setup>
import {defineProps, defineEmits} from 'vue';

const props = defineProps({
  modelValue: [String],
  label: [String],
  placeholder: [String],
  required: {
    type: Boolean,
    default: false
  },
  errorMessages: {
    type: [String, Array],
    default: () => [],
  },
  row: [Number],
});

const emit = defineEmits(["update:modelValue"]);

</script>

<template>
  <v-textarea
      :model-value="props.modelValue"
      @update:model-value="val => emit('update:modelValue', val)"
      :label="props.label"
      :placeholder="props.placeholder"
      :required="props.required"
      :errorMessages="props.errorMessages"
      :row="props.row"
      v-bind="$attrs"
  ></v-textarea>
</template>

<style scoped>

</style>