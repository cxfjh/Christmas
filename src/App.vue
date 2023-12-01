<template>
  <div class="app" @click="animationTransition()">
    <div class="present" ref="present" @click="show()">贺卡</div>
    <div class="sendBtn" ref="sendBtn" @click="send()">祝福</div>

    <div class="blessing" ref="blessing">
      <div @click="blessingMasks()"></div>
      <input placeholder="可以给Qity一个祝福吗!" v-model.lazy="blessingValue" />
      <p><button @click="rouse()">联系作者</button><button @click="sendBlessing()">发送祝福</button></p>
    </div>

    <christmas-animation v-if="animation" ref="animationRef"></christmas-animation>
    <christmas-tree v-if="tree" ref="treeRef"></christmas-tree>
    <christmas-cards v-if="cards" @disappear="display()" :message="message"></christmas-cards>

    <div class="boxLoading" ref="boxLoadingRef" @click.once="boxLoading()"></div>
  </div>
</template>

<script setup>
import ChristmasAnimation from './components/ChristmasAnimation.vue';
import ChristmasTree from './components/ChristmasTree.vue';
import ChristmasCards from './components/ChristmasCards.vue';
import { clickEffect } from './animation/AnimatedEffects.js';
import { ref, onMounted } from 'vue';

const present = ref(null);
const animation = ref(false);
const tree = ref(false);
const cards = ref(false);
const animationRef = ref(null);
const treeRef = ref(null);
const transitionTime = ref(null);
const message = ref(0);
const isStart = ref(null);
const boxLoadingRef = ref(null);
const audioElement = ref(null);
const sendBtn = ref(null);
const blessing = ref(null);
const blessingValue = ref('');

// 异步加载音频
const loadAudio = async () => {
  const audioUrl = './music/music.mp3';
  const response = await fetch(audioUrl);
  const blob = await response.blob();
  audioElement.value = new Audio();
  audioElement.value.src = URL.createObjectURL(blob);
  audioElement.value.loop = true;
};

// 异步加载JS文件
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// 开启动画
const start = async () => {
  transitionTime.value = new Date().getTime();
  animation.value = true;
  boxLoadingRef.value.style.transform = 'translateY(1000%)';
  audioElement.value.play();
};

// 点击按钮
const boxLoading = () => {
  if (isStart.value != 1) return isStart.value = 0;
  setTimeout(() => { boxLoadingRef.value.style.display = 'none'; }, 1200);
  start();
};

// 送祝福
const send = () => { blessing.value.style.transform = 'translateY(0%)'; };

const blessingMasks = () => { blessing.value.style.transform = 'translateY(-120%)'; };

// 发送祝福
const sendBlessing = async () => {
  if (blessingValue.value.length < 1) return alert('请输入祝福语');
  const data = await postBlessing(blessingValue.value);
  alert(data);
};

// 联系作者
const rouse = () => location.href = 'mqqwpa://im/chat?chat_type=wpa&uin=2192787729&version=1&src_type=web&web_src=http:://wpa.b.qq.com';

// 显示贺卡
const show = () => {
  cards.value = true;
  message.value += 1;
  treeRef.value.changeBackground();
  present.value.style.transform = 'translate(-100%, 100%)';
  sendBtn.value.style.transform = 'translate(100%, 100%)';
};

// 隐藏贺卡
const display = () => {
  present.value.style.transform = 'translate(50%, 100%)';
  sendBtn.value.style.transform = 'translate(-50%, 100%)';
};

// 动画转场加载圣诞树
const animationTransition = () => {
  if (new Date().getTime() - transitionTime.value < 4500 || transitionTime.value == null) return;
  tree.value = true;
  setTimeout(() => { treeRef.value.transition(); }, 100);
  transitionTime.value = null;
  animationRef.value.transition();
  setTimeout(() => { animation.value = false }, 3000);
  setTimeout(() => { display(); }, 7000);
  clickEffect();
};

// 加载初始动画JS文件
const ChristmasAnimationJS = async () => {
  const url = './ChristmasAnimationJS/';
  const scripts = ['bodymovin.js', 'data.js'];
  let index = 2;
  if (localStorage.getItem('animationData') != null) { index = 1; }
  for (let i = 0; i < index; i++) {
    await loadScript(url + scripts[i]);
    if (i == 1) { localStorage.setItem('animationData', JSON.stringify(animationData)); };
  };
  await loadAudio();
  audioElement.value.play();
  if (isStart.value != 0) return isStart.value = 1;
  start();
};

// 加载圣诞树JS文件
const ChristmasTreeJS = async () => {
  const url = './ChristmasTreeJS/';
  const scripts = ['gsap.min.js', 'MorphSVGPlugin3.min.js', 'DrawSVGPlugin3.min.js', 'MotionPathPlugin.min.js', 'Physics2DPlugin3.min.js', 'EasePack3.min.js'];
  for (let i = 0; i < scripts.length; i++) { await loadScript(url + scripts[i]); };
};

// 祝福请求
const postBlessing = async (info) => {
  try {
    const response = await fetch('https://j464g00137.zicp.fun/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ message: info })
    });
    await response.json();
    return '作者已经收到你的祝福了，谢谢！'
  } catch (error) { return '作者好像不在家！' }
};

// 异步加载js
onMounted(async () => {
  await ChristmasAnimationJS();
  await ChristmasTreeJS();
});
</script>

<style scoped>
.app {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: fixed;
}

.present,
.sendBtn {
  width: 70px;
  height: 45px;
  background-color: #ff4081;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 15px;
  font-family: kaiti;
  transform: translate(-100%, 100%);
  transition: 0.5s ease-in-out;
  z-index: 40;
}

.sendBtn {
  transform: translate(100%, 100%);
  right: 0;
}

.blessing {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  position: fixed;
  transform: translateY(-120%);
  transition: 1s;
  z-index: 200;
}

.blessing>div {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.5);
}

.blessing>p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blessing>p>button {
  margin: 20px;
  height: 40px;
  width: 90px;
  font-family: kaiti;
  font-size: 16px;
}

.blessing>input {
  width: 215px;
  height: 50px;
  text-align: center;
  font-size: 15px;
  font-family: kaiti;
}

.boxLoading {
  width: 70px;
  height: 70px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transform: translateY(0%);
  transition: 1.5s;
  z-index: 100;
}

.boxLoading:before {
  content: '';
  width: 70px;
  height: 5px;
  background: #fff;
  opacity: 0.7;
  position: absolute;
  top: 80px;
  left: 0;
  border-radius: 50%;
  animation: shadow .5s linear infinite;
}

.boxLoading:after {
  content: '';
  width: 70px;
  height: 70px;
  background: #e04960;
  animation: animate .5s linear infinite;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
}

@keyframes animate {
  17% {
    border-bottom-right-radius: 3px;
  }

  25% {
    transform: translateY(9px) rotate(22.5deg);
  }

  50% {
    transform: translateY(18px) scale(1, .9) rotate(45deg);
    border-bottom-right-radius: 40px;
  }

  75% {
    transform: translateY(9px) rotate(67.5deg);
  }

  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes shadow {

  0%,
  100% {
    transform: scale(1, 1);
  }

  50% {
    transform: scale(1.2, 1);
  }
}
</style>