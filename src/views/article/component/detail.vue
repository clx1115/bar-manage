<template>
  <div class="detail-container">
    <el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="150px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
          <el-form-item label="文章分类" prop="categoryId">
            <el-cascader v-model="ruleForm.categoryId" :options="categoryList" collapse-tags clearable :props="{ value: 'id', label: 'name', multiple: false, emitPath: false }" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入文章标题" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
          <el-form-item label="作者">
            <el-input v-model="ruleForm.author" placeholder="选填，请输入文章作者" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
          <el-form-item label="来源">
            <el-input v-model="ruleForm.source" placeholder="选填，请输入文章来源" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="4" :md="4" :lg="4" :xl="4" class="mb20">
          <el-form-item label="状态">
            <el-switch v-model="ruleForm.status" inline-prompt :active-value="1" :inactive-value="2" active-text="启" inactive-text="禁"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="文章封面" prop="headPic">
            <upload-img v-model="ruleForm.headPic" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="文章内容" prop="content">
            <wangeditor v-model="ruleForm.content" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="loading">{{ submitTxt }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElForm } from 'element-plus'
import { validEditor } from '@/utils/toolsValidate'
import {
  getArticleDetail,
  addArticle,
  updateArticle,
} from '@/api/article/index'
import { getCategroyList } from '@/api/article/category/index'
import UploadImg from '@/components/upload/uploadImg.vue'
import wangeditor from '@/components/wangeditor/index.vue'
import mittBus from '@/utils/mitt'



const props = defineProps({
  isEidt: {
    type: Boolean,
    default: false,
  },
})

// 定义变量内容
function validateContent(rule: any, value: any, callback: any) {
  if (validEditor(value)) {
    callback(new Error('请填写文章内容'))
  } else {
    callback()
  }
}
const route = useRoute()
const router = useRouter()
const formRef = ref(ElForm)
const state = reactive({
  categoryList: [] as any,
  loading: false,
  ruleForm: {} as any,
  rules: {
    categoryId: [
      { required: true, trigger: 'blur', message: '请选择文章分类' },
    ],
    title: [{ required: true, trigger: 'blur', message: '请填写文章标题' }],
    content: [
      { required: true, trigger: 'blur', validator: validateContent },
    ],
  },
  type: '',
  submitTxt: '',
})

const { categoryList, loading, ruleForm, rules, submitTxt } = toRefs(state)

// 获取详情
const getDetailData = () => {
  if (props.isEidt) {
    state.type = 'edit'
    state.submitTxt = '修 改'
    const articleId = router.currentRoute.value.query.articleId
    getArticleDetail({
      id: articleId,
    }).then((res) => {
      state.ruleForm = {
        id: res.article.id,
        categoryId: res.article.categoryId,
        title: res.article.title,
        author: res.article.author,
        source: res.article.source,
        publishTime: res.article.publishTime * 1000,
        top: res.article.top,
        recommend: res.article.recommend,
        status: res.article.status,
        digest: res.article.digest,
        headPic: res.article.headPic,
        content: res.article.content
      }
    })
  } else {
    state.type = 'add'
    state.submitTxt = '新 增'
    state.ruleForm = {
      title: '',
      author: '',
      source: '',
      publishTime: '',
      top: 1,
      recommend: 1,
      status: 1,
      digest: '',
      headPic: '',
      content: ''
    }
  }
}

// 获取分类列表
const getCategoryListData = () => {
  getCategroyList().then((data: any) => {
    state.categoryList = data.list
  })
}


// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.publishTime = ruleForm.publishTime / 1000
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.type === 'add') {
        addArticle(ruleForm)
          .then(() => {
            state.loading = false
            router.push('/article')
            closeCurrentTagsView()
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateArticle(ruleForm)
          .then(() => {
            state.loading = false
            router.push('/article')
            closeCurrentTagsView()
          })
          .catch(() => {
            state.loading = false
          })
      }
    } else {
      return false
    }
  })
}

// 关闭当前 tagsView
const closeCurrentTagsView = () => {
  mittBus.emit(
    "onCurrentContextmenuClick",
    Object.assign({}, { contextMenuClickId: 1, ...route })
  )
}

// 页面加载时
onMounted(() => {
  getDetailData()
  getCategoryListData()
})
</script>
<style lang="scss" scoped>
.relation-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;

  .btn {
    margin-bottom: 10px;
  }
}
</style>