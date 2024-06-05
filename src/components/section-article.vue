<script setup lang="ts">
import {
  toRefs,
  Ref,
  ref,
  shallowRef,
  watch,
  computed,
  getCurrentInstance
} from 'vue'
import { useRoute } from 'vue-router'
import { BlogItemType } from '@/util/const'

interface BlogType extends BlogItemType {
  title: string
}

export interface SectionArticleType {
  initBlogList: (defaultNum: number) => void
}

const props = withDefaults(
  defineProps<{
    blogList: BlogType[]
    defaultNum: number
    animeCover: number
  }>(),
  {
    blogList: () => [],
    defaultNum: 3,
    animeCover: 1
  }
)
const refresh = ref(false)

const blogShowList: Ref<BlogType[]> = ref([])
// 初始化博客骨架屏
const initBlogList = (defaultNum: number = props.defaultNum) => {
  blogShowList.value = Array(defaultNum).fill({
    classify: '',
    title: '',
    description: '',
    id: '',
    image: '',
    createTime: '2018-08-23',
    hit: 200,
    comment: 200,
    classifyId: 1
  })
  // 共用组件，每次数据变化产生过渡效果
  refresh.value = true
  setTimeout(() => {
    refresh.value = false
  }, 800)
}
// 初始化
initBlogList()
// 暴露出去，外面可通过 ref 调用
defineExpose({
  initBlogList
})

if (props.blogList.length > 0) {
  const { blogList } = toRefs(props)
  blogShowList.value = blogList.value
}

const route = useRoute() // 相当于 vue2 中的 this.$route
const isHome = computed(
  () => route.name === 'home' || route.name === 'homePage'
)

watch(
  () => props.blogList,
  (newVal) => {
    blogShowList.value = newVal
  }
)

const { proxy }: any = getCurrentInstance()
const basePath = proxy.basePath

const setLink = (id: string | number, link: Object) => {
  return id ? link : ''
}

const descBottomList = shallowRef([
  {
    icon: 'icon-PC-date',
    key: 'createTime',
    width: '62px'
  },
  {
    icon: 'icon-eye-fill',
    key: 'hit',
    width: '26px'
  },
  {
    icon: 'icon-comments',
    key: 'comment',
    width: '26px'
  }
])

// 获取随机风景图
const getRandomScenery = (min = 1, max = 16) => {
  const index = Math.floor(Math.random() * (max - min + 1)) + min
  return `resource/scenery/${index}`
}
</script>

<template>
  <section :class="{ 'animation-fade-in': refresh }" class="section-article">
    <article v-for="(val, index) in blogShowList" :key="index">
      <div class="bg-container">
        <picture
          v-if="val.image || val.imageWebp"
          class="bg-container__picture"
        >
          <template v-if="animeCover">
            <!-- use if possible -->
            <source :srcset="`${basePath}/${val.image}`" type="image/avif" />
            <!-- fallback -->
            <img :src="`${basePath}/${val.imageWebp}`" :alt="val.title" />
          </template>
          <template v-else>
            <!-- use if possible -->
            <source
              :srcset="`${basePath}/${getRandomScenery()}.avif`"
              type="image/avif"
            />
            <!-- fallback -->
            <img
              :src="`${basePath}/${getRandomScenery()}.webp`"
              :alt="val.title"
            />
          </template>
        </picture>
      </div>
      <span v-if="val.isTop && isHome" class="top-icon">
        <i class="iconfont icon-Up-1" />
      </span>
      <!-- 这里使用命名路由，效果与下面一样，使用过滤器控制骨架屏的链接 -->
      <router-link
        :to="
          setLink(val.id, {
            name: 'blog',
            params: { id: val.id, title: val.title }
          })
        "
      >
        <div class="bg-cover">
          <p v-html="val.description"></p>
        </div>
      </router-link>
      <div class="other-bgcover right-bgcover"></div>
      <div class="other-bgcover"></div>
      <div class="desc">
        <!-- 骨架屏标题 -->
        <router-link v-if="val.id" :to="setLink(val.id, `/${val.id}`)">
          <p class="title" :title="val.title">{{ val.title }}</p>
        </router-link>
        <div v-else class="skeleton-title"></div>
        <div class="desc-bottom">
          <div class="d-detail">
            <template v-for="ele in descBottomList" :key="ele.key">
              <i :class="['iconfont', ele.icon]"></i>
              <span v-if="val.id">{{ val[ele.key] }}</span>
              <span
                v-else
                :style="{ width: ele.width }"
                class="d-b-skeleton"
              ></span>
            </template>
          </div>
          <router-link :to="setLink(val.id, `/category/${val.classifyId}`)">
            <el-tooltip
              :content="val.classify || 'Krryblog'"
              placement="top"
              effect="light"
              :append-to-body="false"
            >
              <div
                class="item-icon"
                :style="{ backgroundPosition: `0 ${-val.classifyId * 74.2}px` }"
              ></div>
            </el-tooltip>
          </router-link>
        </div>
      </div>
    </article>
    <div class="clear"></div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/css/common';

.animation-fade-in {
  animation: fadeIn 0.6s linear;
}

section {
  box-sizing: border-box;
  max-width: 960px;
  margin: 0 auto;

  article {
    position: relative;
    box-sizing: border-box;
    float: left;
    width: 280px;
    height: 340px;
    margin: 20px;
    overflow: hidden;
    background: rgb(255 255 255 / 50%);
    border-radius: 5px;
    box-shadow: 0 2px 9px 0 rgb(0 0 0 / 8%);

    &:hover {
      background: #fff;
      box-shadow: 1px 2px 12px 1px rgb(0 0 0 / 15%);

      .bg-container__picture {
        img {
          filter: blur(2px);
          transform: scale(1.1);
        }
      }

      .bg-cover {
        background-color: rgb(0 0 0 / 50%);
        transition: 0.5s;

        p {
          margin-top: 0;
          opacity: 1;
          transition: 0.5s;
        }
      }
    }

    .top-icon {
      position: absolute;
      top: -4px;
      left: -9px;
      width: 46px;
      height: 46px;
      line-height: 44px;
      color: #fff;
      text-align: center;
      background: url('../assets/pic/tag.png');
      background-size: cover;
      opacity: 0.86;

      i {
        font-size: 19px;
      }
    }

    .bg-container {
      height: 230px;

      &::before {
        @extend %skeleton-base;

        position: absolute;
        left: 0;
        width: 100%;
        font-size: 26px;
        line-height: 230px;
        color: #999;
        text-align: center;
        content: 'Loading...';
        border-radius: 5px 5px 0 0;
      }

      &__picture {
        position: relative;

        img {
          width: 100%;
          height: 230px;
          transition: all 0.5s ease;
          object-fit: cover;
        }
      }
    }

    .bg-cover {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 40px 28px;
      overflow: hidden;
      cursor: url(../assets/pic/cursor.cur), pointer !important;

      p {
        display: box;
        padding: 0;
        margin: 0;
        margin-top: 26px;
        overflow: hidden;
        font-size: 14px;
        line-height: 26px;
        color: #fff;
        opacity: 0;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }
    }

    .other-bgcover {
      position: absolute;
      right: 0;
      bottom: 1px;
      left: 0;
      z-index: 0;
      width: 110%;
      min-height: 100px;
      background-color: #fff;
      transform: rotate(5deg) translate(-10px, -20px);
    }

    .right-bgcover {
      background-color: rgb(0 0 0 / 50%) !important;
      opacity: 0.7;
      transform: rotate(-10deg) translate(10px, -30px);
    }

    .desc {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: 110px;
      padding: 7px 15px 10px;
      background: #fff;

      .skeleton-title {
        @extend %skeleton-base;

        width: 100%;
        height: 32px;
        margin-top: 8px;
        border-radius: 5px;
      }

      .title {
        display: inline-box;
        overflow: hidden;
        font-size: 16px;
        color: #000;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;

        &:hover {
          color: #ff8b18;
        }
      }

      .desc-bottom {
        position: absolute;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        width: 100%;
        padding: 0 15px 10px;
        text-align: right;

        .d-detail {
          position: absolute;
          bottom: 10px;
          display: flex;
          align-items: center;

          i {
            margin-right: 4px;
            font-size: 14px;

            &:not(:first-child) {
              margin-left: 12px;
            }
          }

          .d-b-skeleton {
            @extend %skeleton-base;

            height: 14px;
            border-radius: 5px;
          }
        }

        // .hidden-detail {
        //   span {
        //     visibility: hidden;
        //   }
        // }

        .item-icon {
          float: right;
          width: 37px;
          height: 37px;
          background: url(../assets/pic/bg-ico.png) no-repeat;
          background-size: cover;
          border: 1px solid #eaeaea;
          border-radius: 50%;
        }
      }
    }
  }
}

section :deep() {
  .el-popper {
    color: #666;
  }
}
</style>
