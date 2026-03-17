<template>
  <!-- ───────── Main wrapper ───────── -->
  <div class="todo-page">

    <!-- ─── Hero Header ─── -->
    <div class="todo-header">
      <div class="todo-header__inner">
        <div class="todo-header__title-group">
          <div class="todo-header__icon">
            <v-icon color="white" size="28">mdi-check-circle-outline</v-icon>
          </div>
          <div>
            <h1 class="todo-header__title">My Tasks</h1>
            <p class="todo-header__subtitle">Stay organised, stay productive</p>
          </div>
        </div>
        <div class="todo-header__stats">
          <div class="stat-chip">
            <span class="stat-chip__num">{{ todos.length }}</span>
            <span class="stat-chip__label">Total</span>
          </div>
          <div class="stat-chip stat-chip--done">
            <span class="stat-chip__num">{{ doneCount }}</span>
            <span class="stat-chip__label">Done</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Content ─── -->
    <div class="todo-content">
      <v-skeleton-loader :loading="isLoading" type="list-item-three-line, list-item-three-line" class="skeleton-wrapper">

        <!-- Toolbar row -->
        <div class="todo-toolbar">
          <v-text-field
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              label="Search tasks…"
              variant="outlined"
              density="compact"
              rounded="lg"
              v-model="searchString"
              class="todo-search"
              bg-color="white"
          />
          <v-btn
              @click="addItemDialog()"
              prepend-icon="mdi-plus"
              color="indigo"
              variant="flat"
              rounded="lg"
              class="todo-add-btn"
          >
            Add Task
          </v-btn>
        </div>

        <!-- Todo list -->
        <div v-if="filteredTodos.length > 0" class="todo-list">
          <div
              class="todo-card"
              v-for="todo in filteredTodos"
              :key="todo.id"
          >
            <!-- Left accent bar -->
            <div class="todo-card__accent" :style="{ background: todo.state.color }"></div>

            <!-- Main info -->
            <div class="todo-card__body">
              <span class="todo-card__title">{{ todo.title }}</span>
              <span class="todo-card__date">
                <v-icon size="13" class="mr-1" style="opacity:.5">mdi-calendar-outline</v-icon>
                {{ formatDate(todo.date) }}
              </span>
            </div>

            <!-- State chip, centred -->
            <div class="todo-card__state">
              <v-chip
                  :color="todo.state.color"
                  variant="tonal"
                  size="small"
                  class="font-weight-medium"
              >
                {{ todo.state.name }}
              </v-chip>
            </div>

            <!-- Actions -->
            <div class="todo-card__actions">
              <v-btn
                  icon
                  variant="plain"
                  size="small"
                  color="indigo"
                  @click="edit(todo)"
                  class="action-btn"
              >
                <v-icon size="18">mdi-pencil-outline</v-icon>
                <v-tooltip activator="parent" location="top">Edit</v-tooltip>
              </v-btn>
              <v-btn
                  icon
                  variant="plain"
                  size="small"
                  color="error"
                  @click="deleteItemDialog(todo)"
                  class="action-btn"
              >
                <v-icon size="18">mdi-trash-can-outline</v-icon>
                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="todo-empty">
          <v-icon size="64" color="indigo-lighten-3" class="mb-4">mdi-clipboard-text-outline</v-icon>
          <p class="todo-empty__title">No tasks found</p>
          <p class="todo-empty__sub">{{ searchString ? 'Try a different search term.' : 'Click "Add Task" to get started!' }}</p>
        </div>

      </v-skeleton-loader>
    </div>

    <!-- ─────────────── Add/Edit Dialog ─────────────── -->
    <v-dialog v-model="dialog" :max-width="560" scrollable>
      <v-card rounded="xl" elevation="0" border>
        <v-form @submit.prevent="submitForm" lazy-validation>
          <!-- Header -->
          <div class="dialog-header">
            <div class="dialog-header__icon" :class="isEditMode ? 'dialog-header__icon--edit' : 'dialog-header__icon--add'">
              <v-icon color="white" size="20">{{ isEditMode ? 'mdi-pencil-outline' : 'mdi-plus' }}</v-icon>
            </div>
            <span class="dialog-header__title">{{ isEditMode ? 'Edit Task' : 'New Task' }}</span>
            <v-spacer />
            <v-btn icon variant="text" size="small" @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <v-divider />

          <v-card-text class="pa-6">
            <v-row dense>
              <v-col cols="12">
                <InputField
                    v-model="title"
                    v-bind="$attrs"
                    :error-messages="errors.title"
                    label="Task title"
                    placeholder="What needs to be done?"
                    required
                />
              </v-col>
              <v-col cols="12">
                <TextAreaField
                    v-model="description"
                    v-bind="$attrs"
                    label="Description"
                    placeholder="Add details (optional)"
                    :error-messages="errors.description"
                    rows="4"
                    no-resize
                />
              </v-col>
              <v-col cols="12">
                <SelectField
                    v-model="state"
                    v-bind="$attrs"
                    label="Status"
                    placeholder="Choose a status"
                    :error-messages="errors.state"
                    item-title="name"
                    :items="states"
                    :item-value="item => item"
                    required
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn variant="text" color="grey-darken-1" rounded="lg" @click="cancel()">Cancel</v-btn>
            <v-btn
                color="indigo"
                variant="flat"
                rounded="lg"
                type="submit"
                :disabled="!meta.valid"
                class="px-6"
            >
              {{ isEditMode ? 'Save changes' : 'Create task' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- ─────────────── Delete Dialog ─────────────── -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card rounded="xl" class="text-center pa-6" elevation="0" border>
        <div class="delete-icon-wrap">
          <v-icon color="error" size="48">mdi-trash-can-outline</v-icon>
        </div>
        <h2 class="text-h6 font-weight-bold mt-4 mb-2">Delete Task?</h2>
        <p class="text-body-2 text-medium-emphasis mb-2">
          You're about to permanently delete:
        </p>
        <p class="text-body-1 font-weight-medium mb-6 px-4" style="color:#3730a3">
          "{{ selectedItem?.title }}"
        </p>
        <v-divider class="mb-4" />
        <div class="d-flex justify-end gap-3">
          <v-btn variant="text" color="grey-darken-1" rounded="lg" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" class="px-6" @click="deleteItem()">Delete</v-btn>
        </div>
      </v-card>
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

const doneCount = computed(() =>
  todos.value.filter(t => t.state?.name?.toLowerCase() === 'completed' || t.state?.name?.toLowerCase() === 'done').length
);

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
  snack.error('Task deleted successfully.');
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
    snack.info('Task updated successfully.');
  } else {
    await addTodo(body);
    snack.success('Task created successfully.');
  }
  await fetchTodos();
  resetForm();
});

const formatDate = (date) => {
  return moment(date).format("DD MMM YYYY");
}
</script>

<style scoped>
/* ── Page layout ── */
.todo-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Force v-skeleton-loader slot content to stack vertically */
.skeleton-wrapper {
  display: flex !important;
  flex-direction: column !important;
  width: 100% !important;
  gap: 0;
}

/* ── Header ── */
.todo-header {
  width: 100%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%);
  padding: 32px 16px 48px;
  box-shadow: 0 4px 24px rgba(79, 70, 229, 0.3);
}

.todo-header__inner {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.todo-header__title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.todo-header__icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.3);
  flex-shrink: 0;
}

.todo-header__title {
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
}

.todo-header__subtitle {
  margin: 0;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.75);
  font-weight: 400;
}

/* Stat chips in header */
.todo-header__stats {
  display: flex;
  gap: 12px;
}

.stat-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  padding: 8px 18px;
  min-width: 64px;
}

.stat-chip--done {
  background: rgba(134, 239, 172, 0.2);
  border-color: rgba(134, 239, 172, 0.35);
}

.stat-chip__num {
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.stat-chip__label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.75);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 2px;
}

/* ── Content card ── */
.todo-content {
  width: 100%;
  max-width: 760px;
  padding: 0 12px 60px;
  margin-top: -24px;
  flex: 1;
}

/* ── Toolbar ── */
.todo-toolbar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 20px;
  padding: 14px 16px;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.12);
  margin-bottom: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.todo-search {
  flex: 1;
  min-width: 180px;
}

.todo-add-btn {
  font-weight: 600;
  letter-spacing: 0;
  flex-shrink: 0;
}

/* ── Todo list ── */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 24px;
}

.todo-card {
  display: flex;
  align-items: center;
  gap: 0;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  border: 1px solid rgba(79, 70, 229, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.todo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.14);
}

/* coloured left accent bar */
.todo-card__accent {
  width: 5px;
  align-self: stretch;
  flex-shrink: 0;
}

.todo-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px 16px;
  min-width: 0;
}

.todo-card__title {
  font-weight: 600;
  font-size: 0.93rem;
  color: #1e1b4b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-card__date {
  font-size: 0.76rem;
  color: #94a3b8;
  margin-top: 3px;
  display: flex;
  align-items: center;
}

.todo-card__state {
  padding: 0 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.todo-card__actions {
  display: flex;
  align-items: center;
  padding: 0 10px 0 4px;
  gap: 2px;
}

.action-btn {
  opacity: 0.6;
  transition: opacity 0.15s;
}

.action-btn:hover {
  opacity: 1;
}

/* ── Empty state ── */
.todo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 20px;
  padding: 60px 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  text-align: center;
}

.todo-empty__title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #3730a3;
  margin: 0 0 6px;
}

.todo-empty__sub {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
}

/* ── Dialog header ── */
.dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
}

.dialog-header__icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-header__icon--add {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
}

.dialog-header__icon--edit {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
}

.dialog-header__title {
  font-weight: 700;
  font-size: 1rem;
  color: #1e1b4b;
}

/* ── Delete dialog ── */
.delete-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* ── Responsive tweaks ── */
@media (max-width: 600px) {
  .todo-header {
    padding: 24px 16px 40px;
  }

  .todo-header__stats {
    display: none;
  }

  .todo-toolbar {
    padding: 12px;
    border-radius: 16px;
    gap: 8px;
  }

  .todo-add-btn .v-btn__prepend {
    margin-right: 0;
  }

  .todo-card__state {
    display: none;
  }

  .todo-card__title {
    font-size: 0.88rem;
  }
}
</style>