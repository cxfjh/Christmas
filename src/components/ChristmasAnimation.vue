<template>
    <div>
        <div id="svgContainer" ref="svgContainer"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const svgContainer = ref(null);

onMounted(async () => {
    const svgContainer = document.getElementById('svgContainer');
    bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'svg',
        loop: false,
        animationData: JSON.parse(animationData),
    });
    animationData = null;
});

const transition = () => { svgContainer.value.style.transform = 'translate(-50%, -50%) scale(100)'; };

defineExpose({ transition });
</script>

<style scoped>
#svgContainer {
    width: 100%;
    height: 100%;
    background-color: #000;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    transition: 5s;
    transition-timing-function: ease-in-out;
    will-change: transform;
    z-index: 1;
}
</style>