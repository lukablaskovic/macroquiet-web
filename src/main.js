import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

//GLOBAL STORES
import { createPinia } from "pinia";

/* Pinia global stores */
import { useCarouselStore } from "@/stores/carouselStore.js";
import { useGameStore } from "@/stores/gameStore.js";
import { useGlobalStore } from "@/stores/globalStore.js";
import { useTimelineStore } from "@/stores/timelineStore.js";

//JS SCREEN RESPONIVNESS
import { Vue3Mq } from "vue3-mq";

//IMAGE INPUT
import VImageInput from "vue3-img-input";

//TEXT EDITOR INPUT
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

//DATE INPUT
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

//EMAILJS
import { init } from "@emailjs/browser";

//GLOBAL STYLE
import "./style.css";

//PINIA AND VUE
const pinia = createPinia();
const app = createApp(App);

/* Init Pinia stores BEFORE setting up the router */
const carouselStore = useCarouselStore(pinia);
const gameStore = useGameStore(pinia);
const globalStore = useGlobalStore(pinia);
const timelineStore = useTimelineStore(pinia);

//GLOBAL COMPONENTS
app.component("v-image-input", VImageInput);
app.component("QuillEditor", QuillEditor);
app.component("VueDatePicker", VueDatePicker);

app.use(router);
app.use(pinia);
app.use(Vue3Mq, {
	breakpoints: {
		xxs: 0,
		xs: 480,
		sm: 640,
		md: 768,
		md2: 860,
		lg: 1024,
		xl: 1280,
		xl2: 1536,
		xl3: 1680,
	},
});

init(import.meta.env.VITE_EMAIL_JS);

app.mount("#app");

export { carouselStore, gameStore, globalStore, timelineStore };
