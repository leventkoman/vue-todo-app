<script setup>
import {defineEmits, defineProps} from 'vue'

const props = defineProps({
  modelValue: [String, Object],
  label: String,
  placeholder: String,
  errorMessages: {
    type: [String, Array],
    default: () => []
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["update:modelValue"])
</script>

<template>
  <v-text-field
      :model-value="props.modelValue"
      @update:model-value="val => emit('update:modelValue', val)"
      :error-messages="props.errorMessages"
      :label="props.label"
      :placeholder="props.placeholder"
      :required="props.required"
      v-bind="$attrs"
  />
</template>
<style scoped>
</style>