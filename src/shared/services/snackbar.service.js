import {  ref} from "vue";


// export const SnackbarService = reactive({
//     text: "",
//     timeout: 3000,
//     action: "X",
//     btnColor: "indigo",
//     backGroundColor: null,
//     show: false,
//
//     open(txt, duration = 300000, act = "X", btn = "white", backGround = "") {
//         this.text = txt;
//         this.timeout = duration;
//         this.action = act;
//         this.btnColor = btn;
//         this.backGroundColor = backGround;
//         this.show = true;
//     },
//     success(txt, duration = 300000, act = "X", btn = "white") {
//         this.text = txt;
//         this.timeout = duration;
//         this.action = act;
//         this.btnColor = btn;
//     },
//     close() {
//         this.show = false;
//     }
// });

const snackbarState = ref({
    text: "",
    timeout: 3000,
    action: "X",
    btnColor: "",
    backGround: "",
    show: false,
});

const showSnackbar = (text, timeout, action, btnColor, backGround) => {
    snackbarState.value = {
        ...snackbarState.value,
        show: true,
        text,
        timeout,
        action,
        btnColor,
        backGround
    }
};

export const snackbarService = {
    state: snackbarState,
    
    info: (text, timeout = 3000) => {
        showSnackbar(text, timeout, "X", "white", "info");
    },
    
    success: (text, timeout = 3000) => {
        showSnackbar(text, timeout, "X", "black", "success");
    },
    
    error: (text, timeout = 3000) => {
        showSnackbar(text, timeout, "X", "white", "error");
    },
    
    warning: (text, timeout = 3000) => {
        showSnackbar(text, timeout, "X", "info", "warning");
    },
    
    close: () => {
        snackbarState.value.show = false;
    },
}
