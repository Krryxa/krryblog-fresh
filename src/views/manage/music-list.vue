<script setup lang="ts">
import { ref, watch, Ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox, ElLoading, ElMessage } from 'element-plus'
import krryWaves from '@/components/krry-waves.vue'
import { getMusicByPage, deleteMusic } from '@/service/api'
import emitter from '@/bus'
import { getRequiredCookies } from '@/util'

const route: any = useRoute()
const router = useRouter()
const store = useStore()

interface MusicListType {
  [propName: string]: string | number
}

const musicList: Ref<MusicListType[]> = ref([])
const musicLen = ref(0)
const status = ref(200)
const pageNo = ref(+route.query.page || 1)
const pageSize = ref(10)
let flag = true

const isEmpty = computed(() => status.value === 404)

const getMusicList = async () => {
  let reqData = {
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  let res: any = await getMusicByPage(reqData)
  status.value = res.code
  // 404 的标题在 axios 拦截器已经定义
  if (status.value === 200) {
    musicList.value = res.result.data
    musicLen.value = res.result.musicLen
  }
}

getMusicList()

const addCount = () => {
  ++musicLen.value
}
const deleteTargetMusic = (id: number) => {
  musicList.value = musicList.value.filter(
    (item: MusicListType) => item.id !== id
  )
  --musicLen.value
  if (musicList.value.length === 0) {
    pageNo.value = --pageNo.value > 0 ? pageNo.value : 1
    getMusicList()
  }
}
const changePage = async (val: number) => {
  pageNo.value = val
  await getMusicList()
  flag = false
  let query = val === 1 ? {} : { page: val }
  router.push({ name: 'music', query: query })
}
const changePageSize = (val: number) => {
  pageSize.value = val
  changePage(1)
}

watch(route, (to, from) => {
  if (flag) {
    pageNo.value = +to.query.page || 1
    getMusicList()
  }
  flag = true
})

const musicId = computed(() => store.state.music.music.id)

const handleSuccess = (res: any) => {
  if (res !== null) {
    ElMessage.success('Upload successful!')
    musicList.value.pop() // 删除最后一个元素
    musicList.value.unshift({
      createTime: res.createTime,
      id: res.id,
      size: res.size,
      title: res.title
    })
    addCount()
  }
}
const beforeRemove = (id: number, title: string) => {
  console.log('删除id：' + id, title)
  ElMessageBox.confirm(
    `Do you want to delete the music “${title}” ？`,
    'notification~',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      remove(id, 'music/' + title)
    })
    .catch(() => {})
}

let loadingInstance = null
const remove = async (id: number, url: string) => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Deleting~~'
  })
  let msg: any = await deleteMusic(id, {
    filePath: url
  })
  if (msg === 'success') {
    // refresh local data
    deleteTargetMusic(id)
    ElMessage.success('Delete successful!')
  } else {
    ElMessage.error(msg || 'Error, Failure to delete...')
  }
  loadingInstance.close()
}
const operateMusic = (id: number) => {
  if (musicId.value === id) {
    // 暂停
    emitter.emit('operateMusic', '')
  } else {
    // 播放
    emitter.emit('operateMusic', id)
  }
}
const prefixMusicUrl = computed(() => (import.meta.env.PROD ? '' : '/krryblog'))
</script>

<template>
  <main v-if="!isEmpty">
    <section class="music">
      <h1>Music</h1>
      <div class="music-link">
        <el-upload
          class="music-upload"
          name="musicFile"
          :action="`${prefixMusicUrl}/krry/music`"
          :headers="getRequiredCookies()"
          :on-success="handleSuccess"
          :format="['mp3', 'mp4', 'm4a', 'acc']"
          accept="audio/*"
        >
          <el-button type="success" class="add-button">Upload</el-button>
        </el-upload>
        <router-link :to="{ name: 'list' }" class="modify-buttom"
          >Go to list</router-link
        >
      </div>
      <el-table :data="musicList" class="music-table">
        <el-table-column prop="id" label="ID" width="90"></el-table-column>
        <el-table-column width="80">
          <template #default="scope">
            <div class="music-control">
              <krry-waves
                :class="[{ playing: musicId === scope.row.id }, 'play-waves']"
              ></krry-waves>
              <i
                :class="[
                  musicId === scope.row.id ? 'icon-pause' : 'icon-play',
                  'iconfont play-btn'
                ]"
                @click="operateMusic(scope.row.id)"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Title" width="400">
        </el-table-column>
        <el-table-column prop="size" label="Size"> </el-table-column>
        <el-table-column prop="createTime" label="UploadTime">
        </el-table-column>
        <el-table-column label="Operation">
          <template #default="scope">
            <el-button
              class="a-button"
              type="text"
              @click="beforeRemove(scope.row.id, scope.row.title)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="musicLen > pageSize"
        v-model:currentPage="pageNo"
        :page-size="pageSize"
        layout="prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 50]"
        :total="musicLen"
        @current-change="changePage"
        @size-change="changePageSize"
      ></el-pagination>
    </section>
  </main>
  <not-found v-else></not-found>
</template>

<style lang="scss" scoped>
section {
  width: 1080px;
  padding: 90px 0 0;
  margin: 0 auto;
  animation: fadeIn 0.6s linear;

  h1 {
    margin-top: 20px;
    font-size: 36px;
    color: #ff5050;
    text-align: center;
    text-shadow: 1px 1px 2px #adadad;
  }

  .add-button {
    float: left;
    width: 80px;
    height: 32px;
    min-height: 30px;
    font-size: 12px;
    line-height: 0;
    background: #19be6b;
  }

  .modify-buttom {
    float: right;
    margin-left: 18px;
  }

  .music-link {
    overflow: hidden;
    line-height: 32px;

    .music-upload {
      float: left;
      height: 32px;
    }
  }

  .music-table {
    margin-top: 18px;
    font-size: 12px;

    .lable-name {
      display: inline-block;

      &:not(:last-child) {
        margin-right: 10px;
      }
    }

    .a-button {
      &:last-child {
        margin-left: 4px;
      }

      &:first-child {
        margin-right: 4px;
      }

      &:hover {
        color: #2d8cf0 !important;
      }

      font-size: 12px;
      color: #5cadff;
    }

    .el-table__row {
      .music-control {
        position: relative;
        line-height: 42px;

        .play-waves {
          margin-left: 3px;

          &.playing {
            visibility: visible;
            opacity: 1;
          }
        }

        .play-btn {
          position: absolute;
          top: -12px;
          width: 25px;
          font-size: 24px;
          text-align: center;
          cursor: url(../../assets/pic/cursor.cur), pointer !important;
          visibility: hidden;
          opacity: 0;
          transition: 0.4s;
        }
      }

      &:hover {
        .play-btn {
          visibility: visible;
          opacity: 1;
        }

        .play-waves.playing {
          visibility: hidden;
          opacity: 0;
        }
      }
    }
  }
}

.music {
  :deep(.el-table) {
    .cell {
      padding: 0 18px !important;
      overflow: unset;
    }

    .el-table__cell {
      padding: 8px 0;
    }
  }

  :deep(.music-link) {
    .music-upload {
      .el-upload-list {
        float: right;
        width: 200px;
        height: 10px;
        margin-top: 0;
        margin-left: 20px;

        .is-success,
        .el-upload-list__item-name {
          display: none;
        }
      }
    }
  }
}
</style>
