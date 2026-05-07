<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">排行榜管理</div>
          <div class="page-intro__desc">集中查看用户豪气值、魅力值和游戏分排行榜，支持按数量快速刷新榜单。</div>
        </div>
      </div>

      <el-form class="query" :inline="true">
        <el-form-item label="展示数量">
          <el-input-number v-model="count" :min="1" :max="100" :precision="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="fetchRankList">
            <el-icon><ele-Refresh /></el-icon>
            刷新榜单
          </el-button>
        </el-form-item>
      </el-form>

      <el-tabs v-model="activeTab" class="rank-tabs">
        <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label" :name="tab.name">
          <el-table :data="currentList" v-loading="loading" style="width: 100%">
            <el-table-column prop="rank" label="排名" width="90" />
            <el-table-column label="头像" width="90">
              <template #default="{ row }">
                <el-avatar :size="40" :src="row.avatar">{{ getAvatarText(row.nickName) }}</el-avatar>
              </template>
            </el-table-column>
            <el-table-column prop="userId" label="用户ID" min-width="120" />
            <el-table-column prop="nickName" label="用户昵称" min-width="150" show-overflow-tooltip />
            <el-table-column prop="phoneNumber" label="手机号" min-width="140" />
            <el-table-column :label="currentScoreLabel" min-width="120">
              <template #default="{ row }">{{ row.score ?? '-' }}</template>
            </el-table-column>
          </el-table>

          <el-empty v-if="!loading && currentList.length === 0" description="暂无排行榜数据" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { getCharmRank, getGameScoreRank, getWealthRank, type ScoreRankItem } from '@/api/scoreRank'

type RankTabName = 'wealth' | 'charm' | 'game'

const state = reactive({
  activeTab: 'wealth' as RankTabName,
  count: 10,
  loading: false,
  wealthList: [] as ScoreRankItem[],
  charmList: [] as ScoreRankItem[],
  gameList: [] as ScoreRankItem[],
  tabList: [
    { name: 'wealth' as RankTabName, label: '豪气值排名', scoreLabel: '豪气值' },
    { name: 'charm' as RankTabName, label: '魅力值排名', scoreLabel: '魅力值' },
    { name: 'game' as RankTabName, label: '游戏分排名', scoreLabel: '游戏分' },
  ],
})

const { activeTab, count, loading, tabList } = toRefs(state)

const currentList = computed(() => {
  if (state.activeTab === 'wealth') return state.wealthList
  if (state.activeTab === 'charm') return state.charmList
  return state.gameList
})

const currentScoreLabel = computed(() => state.tabList.find((item) => item.name === state.activeTab)?.scoreLabel || '分值')

const getAvatarText = (nickName?: string) => (nickName ? nickName.slice(0, 1) : '?')

const fetchRankList = async () => {
  state.loading = true
  try {
    const [wealthData, charmData, gameData] = await Promise.all([
      getWealthRank({ count: state.count }),
      getCharmRank({ count: state.count }),
      getGameScoreRank({ count: state.count }),
    ])
    state.wealthList = wealthData.list || []
    state.charmList = charmData.list || []
    state.gameList = gameData.list || []
  } catch (error) {
    ElMessage.error('获取排行榜失败')
  } finally {
    state.loading = false
  }
}

onMounted(() => {
  fetchRankList()
})
</script>

<style scoped lang="scss">
.page-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  margin-bottom: 18px;
  border: 1px solid #e7eef7;
  border-radius: 16px;
  background: linear-gradient(135deg, #fff8ef 0%, #f5fbff 100%);
}

.page-intro__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.page-intro__desc {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.6;
  color: #667085;
}

.query {
  padding-top: 4px;
}

.query :deep(.el-form-item) {
  margin-right: 12px;
  margin-bottom: 12px;
}

.query :deep(.el-input-number) {
  width: 140px;
}

.rank-tabs {
  margin-top: 4px;
}

.rank-tabs :deep(.el-tabs__item) {
  min-width: 128px;
  text-align: center;
}

:deep(.el-card__body) {
  padding: 24px 24px 18px;
}

:deep(.el-table) {
  overflow: hidden;
  border: 1px solid #edf2f7;
  border-radius: 14px;
}

:deep(.el-table th.el-table__cell) {
  background: #f8fafc;
  color: #475467;
}

:deep(.el-table .el-table__cell) {
  padding: 13px 0;
}

:deep(.el-empty) {
  padding: 32px 0 12px;
}
</style>
