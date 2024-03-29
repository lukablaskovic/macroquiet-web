<template>
    <div class="grow flex flex-col justify-between items-start pt-16 absolute overflow-y-auto">
        <div class="flex flex-col | justify-center items-center bg-red | bg-opacity-30 p-2 | w-full">

            <MQ_h2 class="w-full" text="Log in to your account" :small="true"/>

            <Form @submit="onSubmit" class="w-full max-w-md flex justify-between px-12 sm:px-6 | transition-all duration-500" :validation-schema="schema">
                <div class="flex flex-col w-full justify-between items-center gap-2">

                    <!--GOOGLE LOGIN-->
                    <div v-if="false" class="flex justify-center items-center gap-4 -mt-2 md:-mt-4 lg:-mt-8">
                        <MQ_GoogleLogInButton text="Log in"/>
                    </div>

                    <MQ_h2_small v-if="false" :white="true" text="OR" class="mb-8 mt-2 px-4"/>

                    <!--INPUTS-->
                    <MQ_textInput label="E-mail" icon="envelope" />
                    <MQ_textInput :password="true" label="Password" icon="key"/>

                    <div class="text-xs text-MQ_light transition-all duration-500 flex justify-end w-full -mt-2 mb-2 relative z-20"
                        :class="submitting || type != 'none' ? 'opacity-0' : 'opacity-100 delay-500'">
                        <router-link class="text-MQ_light text-opacity-40 hover:underline hover:text-MQ_light | transition-all duration-300" to="/reset-password/enter-email">
                            Forgot your password?
                        </router-link> 
                    </div>
                    <MQ_checkBoxInput label="Remember me" value="true" />

                    <!--SUBMIT-->
                    <div class="w-full relative flex flex-col justify-center mt-2 items-center transition-all duration-500"
                        :class="submitting || type != 'none' ? 'h-16' : 'h-8 delay-500'">
                        <button @click="onSubmit()"
                            class="h-8 w-full group relative z-10 | flex flex-col justify-center overflow-hidden items-center | rounded-md bg-MQ_dark bg-opacity-25 drop-shadow-MQ | transition-all duration-500"
                            :class="submitting || type != 'none' ? 'opacity-0 delay-0' : 'opacity-100 delay-500'">
                            <div class="px-5 h-full | text-MQ_light group-hover:text-MQ_dark | group-hover:font-bold | z-10 | transition-all duration-500 | flex items-center text-sm">Log in</div>
                            <div class="absolute h-full left-0 w-0 group-hover:w-full bg-MQ_light group-hover:bg-MQ_red | transition-all duration-500"></div>
                        </button>
                        <img class="absolute | animate-spin_slow transition-all duration-500"
                            :src="macroquiet_logo_icon"
                            :class="submitting ? 'h-16 opacity-100 delay-500' : 'h-0 opacity-0 delay-0'">

                        <MQ_alert :show="type == 'warning'" color="rgb(220, 38, 68)" icon="fa-solid fa-triangle-exclamation"
                            class="absolute w-full top-0">
                            <b>{{ response }}!</b>
                        </MQ_alert>
                        <MQ_alert :show="type == 'success'" color="rgb(12, 173, 134)" icon="fa-solid fa-circle-check"
                            class="absolute w-full top-0">
                            <b>{{ response }}</b>
                        </MQ_alert>
                    </div>

                    <!--TO REGISTER-->
                    <div class="text-sm text-MQ_light transition-all duration-500 relative z-20"
                        :class="submitting || type != 'none' ? 'opacity-0' : 'opacity-100 delay-500'">
                        New to macroquiet? 
                        <router-link class="text-MQ_red hover:underline" to="/register">
                            Create an account here
                        </router-link> 
                    </div>

                </div>
            </Form>
        </div>
        <MQ_footerVue/>
    </div>
</template>

<script>
import MQ_textAreaInput from '@/components/Global/MQ_inputs/MQ_textAreaInput.vue';
import MQ_textInput from '@/components/Global/MQ_inputs/MQ_textInput.vue';
import MQ_h2 from '@/components/Global/MQ_h2/MQ_h2.vue';
import MQ_alert from '@/components/Global/MQ_alerts/MQ_alert.vue';
import { Form, Field } from 'vee-validate';
import { object, string } from 'yup';
import MQ_checkBoxInput from '@/components/Global/MQ_inputs/MQ_checkBoxInput.vue';
import MQ_h2_small from '@/components/Global/MQ_h2/MQ_h2_small.vue';
import { Auth } from "@/services";
import MQ_GoogleLogInButton from '@/components/Global/MQ_inputs/MQ_GoogleLogInButton.vue';
import { useGlobalStore } from '@/stores/globalStore'
import MQ_footerVue from '@/components/App/MQ_footer.vue';
import macroquiet_logo_icon from "@/assets/Logos/macroquiet_logo_icon.png";

let wait = function (seconds) { return new Promise((resolveFn) => { setTimeout(resolveFn, seconds * 1000); }); };

export default {
    name: "LogIn",
    components: { MQ_textInput, Form, Field, MQ_h2, MQ_textAreaInput, MQ_alert, MQ_checkBoxInput, MQ_h2_small, MQ_GoogleLogInButton, MQ_footerVue },
    setup() {
        const globalStore = useGlobalStore()
        const schema = object({
            "Password": string().required().label("Password"),
            "E-mail": string().required().email().label("Email"),
        });
        return { schema, globalStore, macroquiet_logo_icon };
    },
    data() {
        return {
            submitting: false,
            type: "none",
            response: "",
        }
    },
    methods: {
        async onSubmit(values) {
            if (values) {
                this.submitting = true;
                
                let userData = {
                    email: values["E-mail"],
                    password: values["Password"],
                    rememberMe: values["Remember me"],
                };
                try {
                    let tokenData = await Auth.logInMQ(userData);
                    this.response = "Successfully logged in!";
                    if (localStorage.user) localStorage.removeItem("user");

                    tokenData.data["edit"] = this.globalStore.edit;
                    localStorage.setItem("user", JSON.stringify(tokenData.data));

                    await wait(1);
                    this.submitting = false;
                    this.type = "success";
                    await wait(2);
                    this.type = "none";
                    await this.globalStore.setup();
                    this.$router.push({ path: "/", replace: true }).catch(() => { });
                } catch (e) {
                    this.response = e.response.data.error;
                    console.error("Error sending message! ", e);
                    await wait(1);
                    this.submitting = false;
                    this.type = "warning";
                    await wait(2);
                    this.type = "none";
                }
            }
        },
    },
}
</script>