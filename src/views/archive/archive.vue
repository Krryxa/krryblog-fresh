<script setup lang="ts">
import { ref, Ref, watch, toRefs, nextTick, computed } from 'vue'
import { getAllBlog, getReviseList, getSummarizedData } from '@/service/api'
import { convertNum, slideToogle } from '@/util'
import { useRoute } from 'vue-router'
import sectionHeader from '@/components/section-header.vue'

interface SummarizedDataType {
  commentSum?: { value: number; unit: string }
  hitSum?: { value: number; unit: string }
}

const summarizedData: Ref<SummarizedDataType> = ref({
  commentSum: { value: 0, unit: '' },
  hitSum: { value: 0, unit: '' }
})
const dataObj: any = ref({})
const blogLen: Ref<number | string> = ref(0)
const spinShow = ref(true)
const route = useRoute()

const isRevise = computed(() => {
  return route.name === 'stars'
})
const title = computed(() => {
  return isRevise.value ? '风雨记录' : '时间归档'
})
const description = computed(() => {
  return isRevise.value ? 'Krryblog 历程' : 'Archive'
})

const containerRef: Ref<HTMLElement | null> = ref(null)
watch(route, (to, from) => {
  spinShow.value = true
  containerRef.value && (containerRef.value.style.display = 'none')
  setTimeout(() => {
    containerRef.value && (containerRef.value.style.display = 'block')
  }, 0)
  blogLen.value = '--'
  getBlogData()
  !isRevise.value && summarize()
})

const summarize = async () => {
  const { result }: any = await getSummarizedData()
  summarizedData.value = result
    ? {
        ...result.data,
        commentSum: convertNum(result.data.commentSum, 2, true),
        hitSum: convertNum(result.data.hitSum, 2, true)
      }
    : {}
}

!isRevise.value && summarize()

const getBlogData = async () => {
  dataObj.value = {}
  const { result }: any = isRevise.value
    ? await getReviseList()
    : await getAllBlog({
        type: 'NO'
      })
  spinShow.value = false
  let year = ''
  let month = ''
  let temp: any = {}
  blogLen.value = Array.isArray(result?.data) && result.data.length
  Array.isArray(result?.data) &&
    result.data.forEach((ele: any) => {
      const timeList = ele.createTime.split('-')
      if (timeList[0] !== year || timeList[1] !== month) {
        month = timeList[1]
        if (timeList[0] !== year) {
          year = timeList[0]
          dataObj.value[year + ' 年'] = {}
        }
        temp = dataObj.value[year + ' 年']
        // 这里需要加个字符，不能是纯数字，否则 Object.entries 的时候会自动把 10、11 月份提前，不知道为啥
        temp[month + '月'] = []
      }
      temp[month + '月'].push({
        id: ele.id,
        title: ele.title,
        year,
        month,
        day: timeList[2],
        imgUrl: ele.image,
        isShow: false,
        remark: ele.remark || ''
      })
    })
  nextTick(() => {
    const firstDom = document.getElementsByClassName('month')[0]
    slideToogle(firstDom, 600)
  })
}

getBlogData()

const handleToogle = (e: any) => {
  const monthDom = e.currentTarget.nextElementSibling
  slideToogle(monthDom, 600)
}
const showImg = (year: string, month: string, index: number) => {
  dataObj.value[year][month][index].isShow = true
}

const getEntries = (obj: any) => Object.entries(obj) as any
</script>

<template>
  <main>
    <section-header :title="title" :description="description"></section-header>
    <article ref="containerRef" class="detail-article">
      <div v-if="!isRevise" class="summarize">
        <div class="text">
          <span>数据统计</span>
        </div>
        <ul>
          <li>
            <span class="num">{{ blogLen }}</span>
            <span>文章</span>
          </li>
          <li>
            <span class="num">4</span>
            <span>存档</span>
          </li>
          <li>
            <p class="num">
              <span>{{
                summarizedData.commentSum.value.toLocaleString()
              }}</span>
              <span class="unit">{{ summarizedData.commentSum.unit }}</span
              >+
            </p>
            <span>评论</span>
          </li>
          <li>
            <p class="num">
              <span>{{ summarizedData.hitSum.value.toLocaleString() }}</span>
              <span class="unit">{{ summarizedData.hitSum.unit }}</span
              >+
            </p>
            <span>阅读</span>
          </li>
          <div class="clear"></div>
        </ul>
      </div>
      <div v-loading="spinShow" class="spin-box">
        <div
          v-for="ele in getEntries(dataObj)"
          :key="ele[0] + 'year'"
          class="year"
        >
          <span class="year-word" @click="handleToogle($event)">{{
            ele[0]
          }}</span>
          <div class="month" style="display: none">
            <div
              v-for="jcl in getEntries(ele[1])"
              :key="ele[0] + 'year' + jcl[0]"
            >
              <span class="month-word" @click="handleToogle($event)">{{
                jcl[0]
              }}</span>
              <div class="day">
                <div v-for="(item, index) in jcl[1]" :key="item.id">
                  <span class="day-word"
                    >{{ item.day }}日{{ item.remark }}：</span
                  >
                  <el-popover
                    v-if="!isRevise"
                    trigger="hover"
                    placement="right"
                    :append-to-body="false"
                    width="196"
                    @show="showImg(ele[0], jcl[0], index)"
                  >
                    <template #reference>
                      <router-link class="link" :to="'/' + item.id">{{
                        item.title
                      }}</router-link>
                    </template>
                    <div style="height: 161px">
                      <img :src="item.isShow ? item.imgUrl : ''" width="196" />
                    </div>
                  </el-popover>
                  <span v-else class="link">{{ item.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </main>
</template>

<style lang="scss" scoped>
article {
  position: relative;
  max-width: 700px;
  padding: 0 25px 16px;
  margin: 0 auto;
  margin-top: 26px;
  font-size: 14px;
  color: #24292e;
  background-color: #fff;
  animation: fadeIn 0.6s linear;

  .spin-box {
    position: relative;
    min-height: 200px;
  }

  .summarize {
    padding: 20px 50px;
    margin: 32px 0 24px;
    border: 1px dashed #e0e0e0;
    border-radius: 6px;

    .text {
      position: absolute;
      top: -15px;
      left: 56px;
      padding: 4.5px;
      color: #fff;
      background: #fff;

      span {
        padding: 6px;
        font-size: 12px;
        font-weight: 500;
        background: #eb5055;
        border-radius: 4px;
      }
    }

    ul li {
      float: left;
      width: 25%;
      padding: 6px 0;
      font-weight: 500;
      color: #666;
      text-align: center;

      .num {
        display: inline-block;
        width: 100%;
        font-size: 32px;
        color: #adabab;

        .unit {
          font-size: 19px;
          font-weight: bolder;
          vertical-align: middle;
        }
      }
    }
  }

  .year {
    .year-word {
      display: inline-block;
      margin-bottom: 20px;
      font-size: 1.3rem;
      font-weight: 500;
      cursor: url(../../assets/pic/cursor.cur), pointer !important;
    }

    .month {
      margin-left: 24px;

      .month-word {
        display: inline-block;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 500;
        cursor: url(../../assets/pic/cursor.cur), pointer !important;
      }

      & > div:last-child {
        padding-bottom: 12px;
      }

      .day {
        margin-left: 24px;
        line-height: 30px;

        .day-word {
          font-weight: 500;
          color: #666;
        }

        & > div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &:last-child {
            margin-bottom: 12px;
          }
        }

        .link {
          color: #24292e;
        }
      }
    }
  }
}
</style>
