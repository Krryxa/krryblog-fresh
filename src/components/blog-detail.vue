<script setup lang="ts">
import {
  ref,
  watch,
  Ref,
  PropType,
  onMounted,
  computed,
  nextTick,
  getCurrentInstance
} from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/css/markdown.css'
import '@/assets/css/github.css'
import Catalog from '@/util/catalog'
import Valine from 'valine'
import { addBlogComment, getAllBlog } from '@/service/api'
import myReward from './models/my-reward.vue'

interface BlogItemType {
  [propName: string]: string | number
}

const props = defineProps({
  blog: { type: Object as PropType<BlogItemType>, default: () => ({}) }
})

const emit = defineEmits(['clearBlog'])

let isloaded = ref(false)
let allBlogList: Ref<Array<BlogItemType>> = ref([])
let reFresh = ref(true)
let preIndex: Ref<string | number> = ref('')
let nextIndex: Ref<string | number> = ref('')

const blogLabel = computed(() =>
  props.blog?.label ? (props.blog['label'] as string).split(',') : []
)
const hasShowTags = computed(() => blogLabel.value.length > 0)
// 当标题是 关于我 或 友情链接，不显示文章头部信息
const hasShowHeader = computed(
  () => props.blog?.title !== '关于我' && props.blog?.title !== '友情链接'
)
const isLogined = computed(() => sessionStorage.getItem('username') !== null)

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

const router = useRouter()
const gotoLink = (id: number) => {
  router.push('/' + id)
  reFresh.value = false
  nextIndex.value = ''
  preIndex.value = ''
  emit('clearBlog')
  nextTick(() => {
    reFresh.value = true
  })
}

// 2018-09-20 11:33:46 取年月日、取时分秒
const subTime = (time: any, index: number) =>
  time ? time.split(' ')[index] : ''

const zoomImgRef: Ref<HTMLImageElement | null> = ref(null)
const getCatalogZoomsComment = () => {
  if (JSON.stringify(props.blog) !== '{}' && props.blog !== null) {
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
  allBlogList.value = (result && result.data) || []
  if (result && result.data) {
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
const { proxy }: any = getCurrentInstance()
const $message = proxy.$message
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
  nickInp.placeholder = '昵称（QQ号）'
  urlInp.placeholder = '网址'

  // 获取提交按钮并移除提交按钮
  submitBtn = document.getElementsByClassName('vsubmit')[0] as HTMLElement
  // 获取按钮的容器
  let buttonContainer = submitBtn.parentElement as HTMLElement
  submitBtn.style['display'] = 'none'
  buttonContainer.removeChild(submitBtn)

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
      $message.warning('先输入昵称哦~~')
    } else if (mailText.trim() && !isok) {
      $message.warning('邮箱格式不正确哦~~')
    } else if (textDesc.trim() === '') {
      $message.warning('先输入评论哦~~')
    } else {
      // 触发提交按钮
      buttonContainer.appendChild(submitBtn as HTMLElement)
      submitBtn && submitBtn.click()

      const commentCount: any = await addBlogComment(props.blog?.id)
      // 需要展示头部的文章，就设置当前评论量
      if (hasShowHeader.value && commentSpanRef.value) {
        commentSpanRef.value.innerText = commentCount
      }
      // 移除评论按钮
      buttonContainer.removeChild(submitBtn as HTMLElement)
    }
  })
}
</script>

<template>
  <article v-if="reFresh" ref="article" class="detail-article">
    <div v-if="hasShowHeader" class="art-header">
      <h1>{{ blog.title }}</h1>
      <div class="header-info">
        <i class="iconfont icon-tags-fill"></i>
        <router-link :to="`/category/${blog.classifyId}`"
          >&nbsp;{{ blog.classify }}</router-link
        >
        <i class="iconfont icon-PC-date"></i>
        {{ subTime(blog.createTime, 0) }}
        <i class="iconfont icon-eye-fill"></i>
        {{ blog.hit }}
        <i class="iconfont icon-comments"></i>
        <span ref="commentSpanRef">&nbsp;{{ blog.comment }}</span>
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
    <router-link
      v-if="isLogined"
      class="modifyBtn"
      :style="hasShowHeader || 'margin-top: -15px;'"
      :to="{
        name: 'edit',
        query: {
          id: blog.id
        }
      }"
      >修改</router-link
    >
    <div id="blog" class="content markdown-body" v-html="blog.content_hm"></div>
    <div class="content-footer">
      <div class="footer-left">
        <p>
          本文由
          <router-link to="/">{{ blog.userName }}</router-link
          >&nbsp;创作，转载请注明
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
        <span v-if="preIndex !== '' && nextIndex !== ''" style="margin: 0 8px"
          >|</span
        >
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
    <aside id="directory"></aside>
    <div id="zooms" class="zoom-shadow">
      <img ref="zoomImgRef" class="zoom-big-img" />
    </div>
    <p v-if="isloaded" class="comments-desc">
      <span>发表评论</span>
    </p>
    <div id="vcomments" ref="vcomments"></div>
  </article>
</template>

<style lang="scss" scoped>
article {
  position: relative;
  max-width: 700px;
  padding: 0 25px 16px;
  margin: 0 auto;
  background-color: #fff;
  animation: fadeIn 0.6s linear;
  box-sizing: border-box;

  .art-header {
    position: relative;
    padding-top: 100px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #e0e0e0;

    h1 {
      font-size: 22px;
      font-weight: 400;
      line-height: 1.8;
      color: #222;
    }

    .header-info {
      margin: 12px 0 0;

      i {
        &:not(:first-child) {
          margin-left: 12px;
        }

        font-size: 14px;
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
          outline-style: none;
          border: 1px solid #ff4046;
        }
      }
    }

    .tag-time {
      position: absolute;
      right: 0;
      bottom: 12px;
      line-height: 14px;

      i {
        margin-top: -2px;
        font-size: 14px;
      }
    }
  }

  .modifyBtn {
    position: absolute;
    right: 26px;
    margin-top: 4px;
  }

  .content {
    margin: 26px 0;
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

      span {
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
  background: rgba(0, 0, 0, 0.6);
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
.detail-article {
  .ivu-tooltip-inner {
    max-width: 100%;
  }
}

#directory {
  position: fixed;
  top: 50%;
  max-width: 400px;
  margin-left: 686px;
  transform: translateY(-54%);

  .cl-wrapper {
    padding: 5px 0;
    border-left: 2px solid #ddd;

    ul li {
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
  margin-top: 52px;
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
      border: 1px solid #ededed;
      padding: 0.5em 1.25em;
      outline: none;
      background: transparent;
      font-size: 0.875em;
      font-weight: 400;
      border-radius: 0.3em;
      color: #555;
      transition: 0.3s;

      &:hover {
        border: 1px solid #eb5055;
        color: #eb5055;
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
            color: #666;
            border-bottom: 1px solid #ccc;
            display: inline;
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
            color: #ff9800;
            margin-right: 6px;
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
</style>
