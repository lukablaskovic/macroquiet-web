<script setup>
    import { useCarouselStore } from '@/stores/carouselStore'
    import { images } from "@/stores/images.js";
    const carouselStore = useCarouselStore()
</script>

<template> 
    <div class="h-[240px] xs:h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] xl:h-[520px] 2xl:h-[600px] | overflow-hidden relative | transition-all duration-300">
        <MQ_carouselTitle class="mt-8 sm:mt-7 md:mt-4 xl:mt-6 2xl:mt-2 | transition-all duration-300"/>
        <carousel :items-to-show="1" :wrapAround="true" :autoplay="10000" :transition="1000" :mouseDrag="false" :touchDrag="false" class="h-full relative">
            <slide v-for="p in carouselStore.pictures" class="h-full">
                <div class="h-full w-full overflow-hidden bg-cover bg-center" :style="'background-image: url('+images.Carousel[carouselStore.activeCarouselName][p]+')'">
                    <div class="w-full h-full bg-gradient-to-b from-MQ_dark opacity-25 absolute top-0"></div>
                </div>
            </slide>
        </carousel>
    </div>
    
    <hr class="border-2 border-MQ_light drop-shadow-MQ relative">

</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import MQ_carouselTitle from './MQ_carouselTitle.vue'

export default {
    name: 'MQ_Carousel',
    components: { Carousel, Slide, MQ_carouselTitle },
}
</script>

<style lang="scss">
.carousel__viewport, .carousel__track { height: 100%; }
.carousel__slide::before { content: '' !important; }
</style>