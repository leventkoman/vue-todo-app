<template>
  <div class="position-fixed top-10 w-50" style="left: 25%; top: 5%">
    <v-row>
      <v-col class="d-flex justify-center">
        <h3>TODO App List</h3>
      </v-col>
    </v-row>
    <v-skeleton-loader
        class="d-inline"
        :loading="isLoading"
        type="list-item-three-line"
    >
      <v-row>
        <v-col class="d-flex justify-space-between align-end">
          <v-text-field
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details="auto"
              label="Filter"
              max-width="350px"
              placeholder="Filter"
              v-model="searchString"
          ></v-text-field>
          <v-btn @click="addItemDialog()" prepend-icon="mdi-plus" color="indigo" density="default">Add new item</v-btn>
        </v-col>
      </v-row>
      <v-row class="mt-0" v-if="filteredTodos.length > 0">
        <v-col class="todo-list-container">
            <v-card class="my-2 d-flex justify-space-between align-center" v-for="todo in filteredTodos"
                    :key="todo">
              <v-col class="py-2 pl-6 v-col-5">
                <span>{{ todo.title }}</span>
              </v-col>
              <v-col class="py-2 v-col-3">
                <v-chip :color="todo.state.color">{{ todo.state.name }}</v-chip>
              </v-col>
              <v-col class="py-2 v-col-3">
                <span>{{ formatDate(todo.date) }}</span>
              </v-col>
              <v-col class="py-2 v-col-1 text-end">
                <div>
                  <v-icon color="info" size="small" @click="edit(todo)" class="mr-1 cursor-pointer">mdi-pencil</v-icon>
                  <v-icon color="error" size="small" @click="deleteItemDialog(todo)" class="cursor-pointer">mdi-delete
                  </v-icon>
                </div>
              </v-col>
            </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <v-card class="v-col-12 d-flex justify-center py-4 fill-height">
            No available todo
          </v-card>
        </v-col>
      </v-row>
    </v-skeleton-loader>
    <!-- Add/Update Dialog -->
    <v-dialog
        v-model="dialog"
        width="500px"
    >
      <v-card>
        <v-form @submit.prevent="submitForm" lazy-validation>
          <v-card-title class="d-flex justify-space-between">
            <span>{{ isEditMode ? 'Edit item' : 'Add new item' }}</span>
            <v-icon-btn
                icon="mdi-close"
                @click="dialog = false"
            ></v-icon-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row dense>
              <v-col
                  cols="12"
                  md="12"
                  sm="12"
              >
                <InputField
                    v-model="title"
                    v-bind="$attrs"
                    :error-messages="errors.title"
                    label="Title"
                    placeholder="Title"
                    required
                />
              </v-col>
              <v-col
                  cols="12"
                  md="12"
                  sm="12"
              >

                <TextAreaField
                    v-model="description"
                    v-bind="$attrs"
                    label="Description"
                    placeholder="Description"
                    :error-messages="errors.description"
                    rows="4"
                    no-resize
                />
              </v-col>
              <v-col
                  cols="12"
                  md="12"
                  sm="12"
              >
                <SelectField
                    v-model="state"
                    v-bind="$attrs"
                    label="States"
                    placeholder="States"
                    :error-messages="errors.state"
                    item-title="name"
                    :items="states"
                    :item-value="item => item"
                    required
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text="close"
                variant="text"
                @click="cancel()"
            ></v-btn>
            <v-btn
                color="primary"
                :text="isEditMode ? 'Save' : 'Create'"
                variant="text"
                type="submit"
                :disabled="!meta.valid"
            ></v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- Delete Dialog -->
    <v-dialog
        v-model="deleteDialog"
        width="500px"
    >
      <v-sheet
          class="pa-4 text-center mx-auto"
          elevation="12"
          max-width="600"
          rounded="lg"
          width="100%"
      >
        <v-icon
            class="mb-5 opacity-70"
            color="warning"
            icon="mdi-alert-circle-outline"
            size="80"
        ></v-icon>

        <h2 class="text-h5 mb-6">Are you sure waant to remove this item?</h2>

        <p class="mb-4 text-medium-emphasis text-body-2">
          {{ selectedItem.title }}
        </p>

        <v-divider class="mb-4"></v-divider>

        <div class="text-end">
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text="close"
              variant="text"
              @click="deleteDialog = false"
          ></v-btn>
          <v-btn
              class="text-none"
              color="error"
              variant="flat"
              @click="deleteItem()"
          >
            Delete
          </v-btn>
        </div>
      </v-sheet>
    </v-dialog>
  </div>
</template>
/* eslint-disable */
<script setup>
/* eslint-disable */
import {computed, inject, onMounted, ref} from "vue";
import {getStates} from "@/shared/services/states.service";
import {deleteTodo, addTodo, updateTodo, getTodos} from "@/shared/services/todo.service";
import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/yup";
import moment from "moment"
import * as yup from "yup";
import InputField from "@/components/input-field.vue";
import TextAreaField from "@/components/text-area-field.vue";
import SelectField from "@/components/select-field.vue";

const todos = ref([]);
const dialog = ref(false);
const deleteDialog = ref(false);
const isEditMode = ref(false);
const states = ref([]);
const searchString = ref("");
const isLoading = ref(false);
const selectedItem = ref(null);

const snack = inject("snackbarService");

const mainForm = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  state: yup.object().required("State is required"),
});

const {defineField, handleSubmit, resetForm, errors, setValues, meta} = useForm({
  validationSchema: toTypedSchema(mainForm)
});

const [title, titleAttr] = defineField('title');
const [description, descriptionAttr] = defineField('description');
const [state, stateAttr] = defineField('state');

const fetchStates = async () => {
  states.value = await getStates();
}

const filteredTodos = computed(() => {
  if (!searchString.value) return todos.value;

  const search = searchString.value.toLowerCase();

  return todos.value.filter((todo) => {
    return todo.title.toLowerCase().includes(search) ||
        todo.description.toLowerCase().includes(search) ||
        todo.state.name.toLowerCase().includes(search) ||
        todo.date.includes(search)
  });
})

const fetchTodos = async () => {
  isLoading.value = true;
  todos.value = await getTodos();
  isLoading.value = false;
}

onMounted(() => {
  fetchTodos();
});

const addItemDialog = async () => {
  await fetchStates();

  resetForm();
  isEditMode.value = false;
  dialog.value = true;
}

const edit = async (item) => {
  await fetchStates();

  setValues({
    id: item.id,
    title: item.title,
    description: item.description,
    state: item.state,
  })

  isEditMode.value = true;
  dialog.value = true;
}
const deleteItem = async () => {
  deleteDialog.value = false;
  if (!selectedItem.value.id) return;
  await deleteTodo(selectedItem.value.id);
  
  snack.error('Data was successfully deleted.');
  await fetchTodos();
}

const deleteItemDialog = async (item) => {
  deleteDialog.value = true;
  selectedItem.value = item;
}

const cancel = () => {
  dialog.value = false;
  resetForm();
}

const submitForm = handleSubmit(async (values) => {
  isLoading.value = true;
  const body = {
    id: isEditMode.value ? values.id : undefined,
    title: values.title,
    description: values.description,
    state: values.state,
    date: new Date().toISOString(),
  };

  dialog.value = false;

  if (isEditMode.value) {
    if (!values.id) return;
    await updateTodo(values.id, body);
    snack.info('Data was successfully saved.');
  } else {
    await addTodo(body);
    snack.success('Data was successfully created.');
  }

  await fetchTodos();

  resetForm();
});

const formatDate = (date) => {
  return moment(date).format("DD-MM-YYYY");
}
</script>

<style scoped>
.todo-list-container {
  max-height: 600px;
  overflow-y: auto;
}

.state {
  white-space: nowrap;
  display: inline-block;
  width: auto;
  padding: 4px 12px;
  border-radius: 16px;
  min-width: 35px;
  height: 32px;
  font-size: 14px;

  &.state-todo {
    background: #e0e0e0;
  }

  &.state-inprogress {
    color: #3f51b5;
    background: rgb(63, 81, 181, 0.12)
  }

  &.state-completed {
    background: rgb(76, 175, 80, 0.12);
    color: #4caf50;
  }
}
</style>