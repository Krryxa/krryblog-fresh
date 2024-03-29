<script setup lang="ts">
import { ref, watch, Ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/css/markdown.css'
import '@/assets/css/github.css'
import Catalog from '@/util/catalog'
import Valine from 'valine'
import { ElMessage } from 'element-plus'
import { addBlogComment, getAllBlog } from '@/service/api'
import myReward from './models/my-reward.vue'
import Cookies from 'js-cookie'
import { BlogItemType } from '@/util/const'

const props = withDefaults(
  defineProps<{
    blog: BlogItemType
    hasShowHeader: boolean
  }>(),
  {
    blog: () => ({}),
    hasShowHeader: true
  }
)

const emit = defineEmits(['clearBlog'])

let isloaded = ref(false)
let allBlogList: Ref<BlogItemType[]> = ref([])
let reFresh = ref(true)
let preIndex: Ref<string | number> = ref('')
let nextIndex: Ref<string | number> = ref('')

const blogLabel = computed(() =>
  props.blog?.label ? (props.blog['label'] as string).split(',') : []
)
const hasShowTags = computed(() => blogLabel.value.length > 0)
const isLogined = computed(() => Cookies.get('username'))

onMounted(() => {
  // 加载目录和评论插件
  if (JSON.stringify(props.blog) !== '{}' && props.blog !== null) {
    getCatalogZoomsComment()
  }
  // 这里使用深度监听 blog 对象的属性变化
  watch(() => props.blog, getCatalogZoomsComment, {
    deep: true
  })
})

const showDirectory = ref(true)
const router = useRouter()
const gotoLink = (id: number) => {
  router.push('/' + id)
  reFresh.value = false
  nextIndex.value = ''
  preIndex.value = ''
  emit('clearBlog')
  showDirectory.value = false
  nextTick(() => {
    reFresh.value = true
  })
}

// 2018-09-20 11:33:46 取年月日、取时分秒
const subTime = (time: any, index: number) =>
  time ? time.split(' ')[index] : ''

const existBlog = computed(
  () => JSON.stringify(props.blog) !== '{}' && props.blog !== null
)

const zoomImgRef: Ref<HTMLImageElement | null> = ref(null)
const getCatalogZoomsComment = () => {
  if (existBlog.value) {
    setNextPreBlog()
    // 设置文章目录
    nextTick(() => {
      Catalog({
        contentEl: 'blog',
        catalogEl: 'directory',
        selector: ['h1', 'h2', 'h3']
      })
      let wrapper = document.getElementsByClassName(
        'cl-wrapper'
      )[0] as HTMLElement
      // 没有目录，就隐藏
      if (wrapper.innerHTML === '') {
        wrapper.style.display = 'none'
      }
    })
    showDirectory.value = true
    // 设置图片点击放大
    // 事件委托，处理全部 img 标签的点击事件
    let blog = document.getElementById('blog') as HTMLElement
    let zooms = document.getElementById('zooms') as HTMLElement
    let target: HTMLImageElement | null = null
    blog.addEventListener('click', (ev) => {
      let eve = ev || window.event
      target = (eve.target || eve.srcElement) as HTMLImageElement
      if (target.nodeName.toLowerCase() === 'img') {
        zoomImgRef.value && (zoomImgRef.value.src = target.src)
        zooms.style.visibility = 'visible'
        zooms.style.opacity = '1'
      }
    })
    zooms.addEventListener('click', (ev) => {
      zooms.style.visibility = 'hidden'
      zooms.style.opacity = '0'
    })
    // 加载评论系统
    getComment()
    isloaded.value = true
  }
}

const setNextPreBlog = async () => {
  const { result }: any = await getAllBlog({
    type: 'YES'
  })
  allBlogList.value = result?.data || []
  if (result?.data) {
    const currentIndex = result.data.findIndex(
      (ele: any) => ele.id === props.blog?.id
    )
    nextIndex.value = currentIndex === 0 ? '' : currentIndex - 1
    preIndex.value =
      currentIndex === result.data.length - 1 ? '' : currentIndex + 1
  }
}

let submitBtn: HTMLElement | null = null
const commentSpanRef: Ref<HTMLSpanElement | null> = ref(null)

const getComment = () => {
  Valine({
    el: '#vcomments',
    appId: 'AXcd7u8mPqn0JWnsXku8MgdU-gzGzoHsz',
    appKey: 'xDI01iWSsPVlKzITBp5ODinq',
    path: window.location.pathname,
    avatar: 'mp',
    placeholder: '留下你的足迹... （支持 Markdown）',
    enableQQ: true
  })
  const nickInp = document.getElementsByClassName(
    'vnick vinput'
  )[0] as HTMLInputElement
  const urlInp = document.getElementsByClassName(
    'vlink vinput'
  )[0] as HTMLInputElement
  nickInp.placeholder = '昵称（或QQ号）'
  urlInp.placeholder = '网址'

  // 获取提交按钮并移除提交按钮
  submitBtn = document.getElementsByClassName('vsubmit')[0] as HTMLElement
  // 获取按钮的容器
  let buttonContainer = submitBtn.parentElement as HTMLElement
  submitBtn.style['display'] = 'none'
  // buttonContainer.removeChild(submitBtn)

  // 获取输入的昵称、邮箱、评论内容
  let nick = document.getElementsByName('nick')[0] as HTMLInputElement
  let mail = document.getElementsByName('mail')[0] as HTMLInputElement
  let textDiv = document.getElementById('veditor') as HTMLInputElement

  // 邮箱正则
  const emailReg =
    /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/

  // 创建新的按钮替换
  let btn = document.createElement('button')
  btn.className = 'new-btn'
  btn.innerText = '提交'
  buttonContainer.appendChild(btn)
  // 提交评论的事件
  btn.addEventListener('click', async (e) => {
    let nickText = nick.value
    let mailText = mail.value
    let textDesc = textDiv.value
    let isok = emailReg.test(mailText)
    if (nickText.trim() === '') {
      ElMessage.warning('先输入昵称哦~~')
    } else if (mailText.trim() && !isok) {
      ElMessage.warning('邮箱格式不正确哦~~')
    } else if (textDesc.trim() === '') {
      ElMessage.warning('先输入评论哦~~')
    } else {
      // 触发提交按钮
      // buttonContainer.appendChild(submitBtn as HTMLElement)
      submitBtn && submitBtn.click()

      const commentCount: any = await addBlogComment(props.blog?.id)
      // 需要展示头部的文章，就设置当前评论量
      if (props.hasShowHeader && commentSpanRef.value) {
        commentSpanRef.value.innerText = commentCount
      }
      // 移除评论按钮
      // buttonContainer.removeChild(submitBtn as HTMLElement)
    }
  })
}
</script>

<template>
  <article v-if="reFresh" ref="article" class="detail-article">
    <div v-if="hasShowHeader" class="art-header">
      <h1 v-if="existBlog">{{ blog.title }}</h1>
      <div v-else class="skeleton-title"></div>
      <div class="header-info">
        <i class="iconfont icon-tags-fill"></i>
        <router-link v-if="existBlog" :to="`/category/${blog.classifyId}`">{{
          blog.classify
        }}</router-link>
        <span v-else class="d-b-skeleton"></span>
        <i class="iconfont icon-PC-date"></i>
        <span v-if="existBlog">{{ subTime(blog.createTime, 0) }}</span>
        <span v-else class="d-b-skeleton"></span>
        <i class="iconfont icon-eye-fill"></i>
        <span v-if="existBlog">{{ blog.hit }}</span>
        <span v-else class="d-b-skeleton tiny"></span>
        <i class="iconfont icon-comments"></i>
        <span v-if="existBlog" ref="commentSpanRef">{{ blog.comment }}</span>
        <span v-else class="d-b-skeleton tiny"></span>
      </div>
      <div v-if="hasShowTags" class="header-tag">
        <router-link
          v-for="(tags, index) in blogLabel"
          :key="index"
          :to="{ name: 'tag', params: { name: tags } }"
          >{{ tags }}</router-link
        >
      </div>
      <div class="tag-time">
        <i class="iconfont icon-time"></i>
        {{ subTime(blog.createTime, 1) }}
      </div>
    </div>
    <div v-if="isLogined" class="modify-container">
      <router-link
        :to="{
          name: 'edit',
          query: {
            id: blog.id
          }
        }"
        >修改</router-link
      >
    </div>
    <div id="blog" class="content markdown-body" v-html="blog.content_hm"></div>
    <div v-if="!existBlog" class="skeleton-content">
      <ul>
        <li
          v-for="(ele, index) in Array(5)"
          :key="index"
          :style="{ width: (1 - (index / 10) * 2) * 100 + '%' }"
        ></li>
      </ul>
    </div>
    <div class="content-footer">
      <div class="footer-left">
        <p>
          本文由
          <router-link to="/">{{ blog.userName }}</router-link
          >&nbsp;创作，转载请注明来源
        </p>
        <p>最后编辑时间：{{ blog.updateTime }}</p>
      </div>
      <div v-if="hasShowHeader" class="footer-right">
        <el-tooltip
          v-if="preIndex !== ''"
          :content="
            (allBlogList[+preIndex] && allBlogList[+preIndex].title) ||
            'Krryblog'
          "
          effect="light"
          placement="bottom"
        >
          <span @click="gotoLink(+allBlogList[+preIndex].id)">上一篇</span>
        </el-tooltip>
        <span v-if="preIndex !== '' && nextIndex !== ''" class="split">|</span>
        <el-tooltip
          v-if="nextIndex !== ''"
          :content="
            (allBlogList[+nextIndex] && allBlogList[+nextIndex].title) ||
            'Krryblog'
          "
          effect="light"
          placement="bottom"
        >
          <span @click="gotoLink(+allBlogList[+nextIndex].id)">下一篇</span>
        </el-tooltip>
      </div>
      <div class="clear"></div>
    </div>
    <my-reward></my-reward>
    <aside v-if="showDirectory" id="directory"></aside>
    <div id="zooms" class="zoom-shadow">
      <img ref="zoomImgRef" class="zoom-big-img" />
    </div>
    <p v-if="isloaded" class="comments-desc">
      <span>发表评论</span>
      <!-- <span class="other-tips">由于站点升级，暂时下线评论功能</span> -->
    </p>
    <div id="vcomments" ref="vcomments"></div>
  </article>
</template>

<style lang="scss" scoped>
@import '@/assets/css/common';

article {
  position: relative;
  box-sizing: border-box;
  max-width: 700px;
  padding: 0 25px 16px;
  margin: 0 auto;
  background-color: #fff;
  animation: fadeIn 0.6s linear;

  .art-header {
    position: relative;
    padding-top: 100px;
    padding-bottom: 14px;
    border-bottom: 1px dashed #e0e0e0;

    h1 {
      font-size: 22px;
      font-weight: 400;
      line-height: 1.8;
      color: #222;
    }

    .skeleton-title {
      @extend %skeleton-base;

      height: 38px;
      border-radius: 5px;
    }

    .header-info {
      display: flex;
      align-items: center;
      margin: 12px 0 0;

      i {
        &:not(:first-child) {
          margin-left: 12px;
        }

        margin-right: 4px;
        font-size: 14px;
      }

      .d-b-skeleton {
        @extend %skeleton-base;

        width: 62px;
        height: 14px;
        border-radius: 5px;

        &.tiny {
          width: 26px;
        }
      }
    }

    .header-tag {
      width: 85%;

      a {
        display: inline-block;
        height: 25px;
        padding: 0 15px;
        margin-top: 14px;
        margin-right: 10px;
        line-height: 25px;
        color: #fff;
        background: #f16d71;
        border: 1px solid #f16d71;
        border-radius: 15px;
        transition: 0.2s;

        &:hover {
          color: #fff !important;
          background: #ff4046;
          border: 1px solid #ff4046;
          outline-style: none;
        }
      }
    }

    .tag-time {
      position: absolute;
      right: 0;
      bottom: 12px;
      display: flex;
      align-items: center;
      line-height: 14px;

      i {
        font-size: 14px;
      }
    }
  }

  .modify-container {
    margin-top: 4px;
    text-align: right;

    & + .content {
      margin-top: 0;
    }
  }

  .content {
    margin: 20px 0;
  }

  .skeleton-content {
    margin-top: -26px;
    margin-bottom: 26px;

    ul li {
      height: 21px;
      border-radius: 5px;

      &:not(:last-child) {
        margin-bottom: 16px;
      }

      @extend %skeleton-base;
    }
  }

  .content-footer {
    padding-top: 20px;
    font-size: 14px;
    color: #24292e;
    border-top: 1px solid #e0e0e0;

    .footer-left {
      float: left;
    }

    .footer-right {
      float: right;

      .split {
        margin: 0 8px;
      }

      span:not(.split) {
        cursor: url(../assets/pic/cursor.cur), pointer;
        transition: 0.3s;

        &:hover {
          color: #eb5055;
        }
      }
    }

    a {
      border-bottom: 1px solid #ccc;

      &:hover {
        border-bottom: 1px solid #eb5055;
      }
    }
  }
}

.zoom-shadow {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1500;
  width: 100%;
  height: 100%;
  visibility: hidden;
  background: rgb(0 0 0 / 60%);
  opacity: 0;
  transition: 0.3s;

  .zoom-big-img {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 86%;
    max-height: 86%;
    margin: auto;
    cursor: zoom-out;
    transform: scale(1);
  }
}
</style>
<style lang="scss">
#directory {
  position: fixed;
  top: 50%;
  max-width: 400px;
  margin-left: 686px;
  transform: translateY(-50%);

  .cl-wrapper {
    max-height: 800px;
    padding: 0 6px 0 3px;
    overflow: auto;

    & > ul {
      border-left: 2px solid #ddd;

      li {
        position: relative;
        line-height: 29px;

        div:hover {
          color: #f44336 !important;
        }

        .cl-link-active {
          &::before {
            position: absolute;
            top: 10.3px;
            left: -5px;
            display: inline-block;
            width: 8px;
            height: 8px;
            content: '';
            background-color: #f44336 !important;
            border-radius: 50%;
          }
        }

        .cl-link {
          display: initial;
          overflow: hidden;
          font-size: 14px;
          color: #272727;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: url(../assets/pic/cursor.cur), pointer;
        }
      }
    }

    & > ul > li {
      position: relative;
      padding-left: 15px;

      & > ul > li {
        .cl-link-active {
          &::before {
            left: -20px;
          }
        }

        & > ul > li {
          div {
            margin-left: 20px;
            color: #8e8e8e !important;
          }
        }

        div {
          margin-left: 10px;
          color: #5f5f5f !important;
        }
      }

      .cl-link-active {
        color: #f44336 !important;
      }
    }
  }
}

/* 评论样式 */
.comments-desc {
  &::before {
    position: absolute;
    top: -8px;
    left: 0;
    font-size: 24px;
    font-weight: bold;
    color: #eb5055;
    content: '|';
  }

  position: relative;
  margin-top: 42px;
  margin-bottom: 16px;
  font-size: 1.4em;
  color: #24292e;

  span {
    margin-left: 12px;
  }
}

#vcomments {
  .txt-right {
    display: none;
  }

  .veditor {
    min-height: 6rem;
    max-height: 12rem;
  }

  .vcount {
    display: none !important;
  }

  .vrow {
    .new-btn {
      padding: 0.5em 1.25em;
      font-size: 0.875em;
      font-weight: 400;
      color: #555;
      background: transparent;
      border: 1px solid #ededed;
      border-radius: 0.3em;
      outline: none;
      transition: 0.3s;

      &:hover {
        color: #eb5055;
        border: 1px solid #eb5055;
      }
    }
  }

  .vcards {
    & > .vcard > .vh {
      border-bottom: 1px solid #eef2f7 !important;
    }

    .vcard {
      padding-top: 20px;

      .vimg {
        width: 3.25rem;
        height: 3.25rem;
        margin-top: 0.1rem;
        border: none;
      }

      .vh {
        border: none;

        &:hover {
          & .vmeta .vat {
            // nono 暂时隐藏评论
            display: block;
          }
        }

        .vhead {
          .vnick {
            font-weight: 700;
            color: #6d757a;

            &::before {
              background: #eb5055;
            }

            &:hover {
              color: #eb5055;
              cursor: url(../assets/pic/cursor.cur), pointer;
            }

            &[href="https://ainyi.com"]
            {
              color: #eb5055;
            }
          }

          .vsys {
            display: none;
          }
        }

        .vmeta .vat {
          display: none;
          color: #b3b3b3;
          cursor: url(../assets/pic/cursor.cur), pointer;

          &:hover {
            color: #eb5055;
          }
        }

        .vcontent {
          padding-top: 2px;
          margin-bottom: 0;

          a {
            display: inline;
            color: #666;
            border-bottom: 1px solid #ccc;

            &:hover {
              border-bottom: 1px solid #eb5055;
            }
          }

          p {
            display: inline;
          }
        }
      }

      .vquote {
        padding-left: 0;
        margin-top: 0;
        border: none;

        /* @昵称 的样式 */
        .vcontent {
          & > a {
            margin-right: 6px;
            color: #ff9800;
            border: none;

            &:hover {
              color: #ff9800 !important;
              border: none;
            }
          }

          & > p > a {
            color: #ff9800;
            border: none;

            &:hover {
              color: #ff9800 !important;
              border: none;
            }
          }
        }

        .vimg {
          width: 2.8rem;
          height: 2.8rem;
        }
      }
    }
  }

  .vpage {
    .vmore {
      color: #fff;
      background: #ff9800;

      &:hover {
        border: 1px solid #f60;
      }
    }
  }
}

// 暂时隐藏评论
// .vpanel {
//   display: none;
// }

.other-tips {
  font-size: 12px;
  color: #9f9f9f;
}
</style>
