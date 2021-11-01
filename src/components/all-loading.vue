<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// rgb(235, 80, 85, 50%)
const colorList = ref([
  'rgb(238, 102, 102)',
  'rgb(252, 132, 82)',
  '#a8d991',
  '#ff9595'
])

const requesting = computed(() => store.state.blog.allLoading)
const flag = ref(true)

const first_color = ref('')
const second_color = ref('')
const third_color = ref('')

let index = 0

const getOrderColor = (notCopy?: boolean, pos?: number) => {
  if (notCopy) {
    first_color.value = colorList.value[index]
    index = colorList.value.length - 1 === index ? 0 : index + 1
  } else {
    if (pos === 2) {
      second_color.value = first_color.value
    } else {
      third_color.value = first_color.value
    }
  }
  requesting.value &&
    flag.value &&
    setTimeout(getOrderColor.bind(null, notCopy, pos), 1600)
}

const initTimer = () => {
  getOrderColor(true)
  setTimeout(getOrderColor.bind(null, false, 2), 150)
  setTimeout(getOrderColor.bind(null, false, 3), 300)
}

watch(
  () => requesting.value,
  (val) => {
    val && flag.value && initTimer()
  }
)

onMounted(() => {
  window.onblur = () => {
    flag.value = false
  }

  window.onfocus = () => {
    flag.value = true
    requesting.value && initTimer()
  }
})
</script>

<template>
  <div v-if="flag && requesting" class="all-loading">
    <svg
      width="140"
      height="64"
      viewBox="0 0 140 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.717-6.002 11.47-7.65 17.305-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z"
      ></path>
      <path
        d="M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z"
      ></path>
      <path
        d="M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.592-2.32 17.307 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z"
      ></path>
    </svg>
  </div>
</template>

<style lang="scss">
.all-loading {
  svg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;

    path {
      &:nth-child(1) {
        opacity: 0;
        animation: firstHeartOpacity 0.8s ease-in-out infinite alternate;
      }

      &:nth-child(2) {
        opacity: 0;
        animation: secondHeartOpacity 0.8s ease-in-out 0.15s infinite alternate;
      }

      &:nth-child(3) {
        opacity: 0;
        animation: thirdHeartOpacity 0.8s ease-in-out 0.3s infinite alternate;
      }
    }
  }
}

@keyframes firstHeartOpacity {
  from {
    fill: v-bind(first_color);
  }

  to {
    opacity: 0.9;
    fill: v-bind(first_color);
  }
}

@keyframes secondHeartOpacity {
  from {
    fill: v-bind(second_color);
  }

  to {
    opacity: 0.9;
    fill: v-bind(second_color);
  }
}

@keyframes thirdHeartOpacity {
  from {
    fill: v-bind(third_color);
  }

  to {
    opacity: 0.9;
    fill: v-bind(third_color);
  }
}
</style>
