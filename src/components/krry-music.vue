<script setup lang="ts">
import { ref, Ref, computed, getCurrentInstance } from 'vue'
import { getMusic } from '@/service/api'
import { useMusicStore } from '@/store/music'
import emitter from '@/bus'
const musicStore = useMusicStore()
const { proxy }: any = getCurrentInstance()
const basePath = proxy.basePath

interface MusicListType {
  [propName: string]: string | number
  title: string
}

const isPlay = ref(false)
const firstTime = ref(true) // 是否是第一次播放
const musicList: Ref<MusicListType[]> = ref([])
const isTransition = ref(false)
const currIndex = ref(0)

const audioRef: Ref<HTMLAudioElement | null> = ref(null)
const musicTitle = computed(() => {
  if (musicList.value && musicList.value.length) {
    let allTitle = musicList.value[currIndex.value].title
    return allTitle.substr(0, allTitle.lastIndexOf('.'))
  } else {
    return ''
  }
})
const musicLen = computed(() => {
  return musicList.value.length
})
const musicLink = computed(() => {
  return `${basePath}/music/${musicList.value[currIndex.value].title}`
})

emitter.on('operateMusic', (id: number) => {
  if (id) {
    currIndex.value = musicList.value.findIndex((ele: any) => ele.id === id)
    play()
  } else {
    pause()
  }
})

const getMusicList = async () => {
  let { result }: any = await getMusic()
  musicList.value = randomArray(result.data)
  init()
}
getMusicList()

const init = () => {
  if (audioRef.value) {
    audioRef.value.src = musicLink.value
    audioRef.value.volume = 0.5
  }
  document.addEventListener('keydown', (e) => {
    if (e.altKey) {
      switch (e.key) {
        case 'Enter':
          !isTransition.value && (isPlay.value ? pause() : play())
          break
        case 'ArrowRight':
          next(true)
          break
        case 'ArrowLeft':
          next(false)
          break
        default:
          break
      }
    }
  })
}
const play = () => {
  firstTime.value = false
  if (audioRef.value) {
    if (audioRef.value.src !== encodeURI(musicLink.value)) {
      audioRef.value.src = musicLink.value
    }
    audioRef.value.play()
  }
  isPlay.value = true
  musicStore.setMusic(musicList.value[currIndex.value])
}
const pause = () => {
  audioRef.value && audioRef.value.pause()
  isPlay.value = false
  musicStore.setMusic({})
}
const next = (flag: boolean) => {
  pause()
  isTransition.value = true
  setTimeout(() => {
    // flag 是 true 代表下一曲，false 代表上一曲
    currIndex.value = flag
      ? currIndex.value === musicLen.value - 1
        ? 0
        : ++currIndex.value
      : currIndex.value === 0
      ? musicLen.value - 1
      : --currIndex.value
    audioRef.value && (audioRef.value.src = musicLink.value)
    play()
    isTransition.value = false
  }, 300)
}
const randomArray = (arr: MusicListType[]) => {
  return arr.sort(() => 0.5 - Math.random())
}
</script>

<template>
  <section>
    <!--播放器-->
    <audio ref="audioRef" @ended="next(true)"></audio>
    <div
      class="music"
      :class="{ playing: isPlay }"
      :title="isPlay ? '暂停Alt+Enter' : '播放Alt+Enter'"
      @click="!isTransition && (isPlay ? pause() : play())"
    >
      <img src="@/assets/pic/music.svg" width="25" height="25" />
    </div>
    <div class="op-btn">
      <span class="next-btn">
        <i
          class="iconfont icon-skip_next"
          title="下一首Alt+Right"
          @click="next(true)"
        />
      </span>
      <span class="pre-btn">
        <i
          class="iconfont icon-skip-previous"
          title="上一首Alt+Left"
          @click="next(false)"
        />
      </span>
    </div>
    <div class="title" :class="!firstTime && (isPlay ? 'titleIn' : 'titleOut')">
      {{ musicTitle }}
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  position: fixed;
  top: 78px;
  right: 0;
  left: 0;
  z-index: 1010;
  width: 1080px;
  max-width: 100%;
  margin: 0 auto;

  .title {
    position: absolute;
    right: 64px;
    margin-top: 3.5px;
    color: rgb(255 97 92 / 100%);
    visibility: hidden;
  }

  .titleIn {
    visibility: visible;
    animation: bounceInRight 1s linear, out-text 10s linear forwards;
  }

  .titleOut {
    visibility: visible;
    animation: bounceOutRight 1s linear forwards;
  }

  .music {
    position: absolute;
    right: 28px;
    cursor: url(../assets/pic/cursor.cur), pointer !important;

    &:hover {
      + .op-btn {
        visibility: visible;
        opacity: 0.76;
      }
    }

    img {
      animation: out-btn 4s linear forwards;

      &:hover {
        animation: in-btn 1s forwards;
      }
    }
  }

  .playing {
    animation: play 1.8s infinite linear;
  }

  .op-btn {
    visibility: hidden;
    opacity: 0;
    transition: 0.5s;

    &:hover {
      visibility: visible;
      opacity: 0.76;
    }
  }

  .next-btn {
    position: absolute;
    top: 1px;
    right: 4px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: right;
    cursor: url(../assets/pic/cursor.cur), pointer !important;

    i {
      font-size: 22px;
    }
  }

  .pre-btn {
    position: absolute;
    top: 24px;
    right: 27.5px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    cursor: url(../assets/pic/cursor.cur), pointer !important;

    i {
      font-size: 22px;
    }
  }
}

@keyframes play {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes out-text {
  from {
    opacity: 1;
  }

  to {
    opacity: 0.3;
  }
}

@keyframes out-btn {
  from {
    opacity: 1;
  }

  to {
    opacity: 0.6;
  }
}

@keyframes in-btn {
  from {
    opacity: 0.6;
  }

  to {
    opacity: 1;
  }
}
</style>
