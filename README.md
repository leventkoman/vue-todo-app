## Vue Todo App

A simple yet modern Todo application built with **Vue 3** and **Vuetify 3**, using a local **JSON server** as a mock backend.  
The app supports creating, updating, deleting, and filtering todo items with different states (e.g. Todo, In Progress, Completed), and is designed to be **responsive** across mobile, tablet, and desktop.

---

### Features

- **Vue 3 + Vuetify 3** UI  
- **Responsive layout** (mobile-first design)  
- **CRUD operations** for todos  
- **Filter/search** todos by text and state  
- **State chips** with colors (e.g. Todo, In Progress, Completed)  
- **Form validation** with `vee-validate` + `yup`  
- **Mock API** with `json-server` (local `db.json`)  
- Global **snackbar notifications** for feedback  

---

### Tech Stack

- **Frontend**: Vue 3, Vue Router, Vuetify 3  
- **Validation**: vee-validate, @vee-validate/yup, yup  
- **Date handling**: moment  
- **Mock backend**: json-server  
- **Tooling**: Vue CLI, ESLint  

---

### Getting Started

#### 1. Clone the repository

```bash
git clone <REPO_URL>
cd todo-app
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Run the mock API (json-server)

In one terminal:

```bash
npm run json-server
```

This starts `json-server` on:

- Base URL: `http://localhost:3000`  
- Todos: `http://localhost:3000/todos`  
- States: `http://localhost:3000/states`  

#### 4. Run the Vue dev server

In another terminal:

```bash
npm run serve
```

Then open:

- App: `http://localhost:8080`  

---

### Available NPM Scripts

```jsonc
"scripts": {
  "serve": "vue-cli-service serve",          // Start dev server
  "build": "vue-cli-service build",          // Build for production
  "lint": "vue-cli-service lint",            // Run ESLint
  "json-server": "json-server --watch src/shared/database/db.json --port 3000" // Mock API
}
```

#### Build for production

```bash
npm run build
```

The output will be in the `dist` folder.

---

### Project Structure (high level)

```text
src/
  App.vue                     # Root component
  main.js                     # App bootstrap (Vue, Router, Vuetify)
  router/
    index.js                  # Route configuration
  views/
    CardView.vue              # Main Todo list view (responsive layout)
  components/
    app-snack-bar.vue         # Global snackbar component
    input-field.vue           # Reusable input field
    select-field.vue          # Reusable select field
    text-area-field.vue       # Reusable textarea field
  assets/
    styles/
      _reset.scss             # Base styles
  shared/
    database/
      db.json                 # Mock data for json-server
    services/
      snackbar.service.js     # Snackbar service
      states.service.js       # States API service
      todo.service.js         # Todo API service
```

---

### Responsive Design

- Main UI is in `CardView.vue`, using Vuetify grid (`v-row`, `v-col`) with breakpoint props (`cols`, `sm`, `md`).  
- Controls (filter input + add button) stack on small screens and align horizontally on larger screens.  
- Todo list container uses a max-height with scroll and adjusts height/padding via media queries for better usability on phones.  

---

### License

This project is available under your preferred license.  
If you plan to open source it, you can add a section here, for example:

```text
MIT License
```
