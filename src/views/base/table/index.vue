<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">桌位管理</div>
          <div class="page-intro__desc">统一维护门店桌位、区域、关联游戏和状态信息，支持批量清理无效桌位。</div>
        </div>
      </div>
      <el-form class="query" :inline="true" size="default">
        <el-row>
          <el-form-item>
            <el-button size="default" type="primary" @click="getListData">
              <el-icon>
                <ele-Search />
              </el-icon>
              刷新列表
            </el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增桌位
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="danger" plain :disabled="multipleSelection.length === 0" @click="onBatchDel">
              批量删除
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" plain @click="onExportQrCode">
              <el-icon>
                <ele-Download />
              </el-icon>
              导出二维码
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>

      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="tableNum" label="桌号" min-width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="区域名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="gameId" label="游戏ID" min-width="100" />
        <el-table-column prop="gameName" label="游戏名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="orderIds" label="订单ID" min-width="160" show-overflow-tooltip />
        <el-table-column prop="xPos" label="X坐标" min-width="100" />
        <el-table-column prop="yPos" label="Y坐标" min-width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 20 ? 'warning' : 'success'">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdTime) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="180">
          <template #default="{ row }">
            {{ formatTime(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenAdd('edit', row)">编辑</el-button>
            <el-button size="small" text type="primary" @click="onExportSingleQrCode(row)">导出二维码</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-bottom">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { deleteAreaTable, getAreaTableList } from '@/api/base/table/index'

const detailDialog = defineAsyncComponent(() => import('./component/detail.vue'))

const detailDialogRef = ref()
const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  multipleSelection: [] as any[],
})

const { list, loading, currentPage, pageSize, total, multipleSelection } = toRefs(state)

const QR_CARD_WIDTH = 1024
const QR_CARD_HEIGHT = 1024
const QR_SIZE = 480
const QR_Y = 260
const QR_BASE_URL = 'https://r.xcx100.info/table/index.html'

const escapeFileName = (value: string) => value.replace(/[\\/:*?"<>|]/g, '_')

const getQrCodeText = (row: any) => {
  const tableId = row?.id
  const tableNo = row?.tableNum
  return tableId ? `${QR_BASE_URL}?tableId=${tableId}&&tableNo=${tableNo ?? ''}` : ''
}

const getQrCodeTitle = (row: any) => {
  const tableNum = row?.tableNum || '-'
  return `桌号：${tableNum}`
}

const getQrCodeAreaText = (row: any) => {
  return `区域名称：${row?.name || '-'}`
}

const createQrCardDataUrl = async (row: any) => {
  const qrValue = getQrCodeText(row)
  if (!qrValue) throw new Error('二维码内容为空')

  const qrDataUrl = await QRCode.toDataURL(qrValue, {
    width: QR_SIZE,
    margin: 1,
    color: {
      dark: '#111827',
      light: '#ffffff',
    },
  })

  const qrImage = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('二维码图片加载失败'))
    image.src = qrDataUrl
  })

  const canvas = document.createElement('canvas')
  canvas.width = QR_CARD_WIDTH
  canvas.height = QR_CARD_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('画布创建失败')

  ctx.fillStyle = '#f5f7fb'
  ctx.fillRect(0, 0, QR_CARD_WIDTH, QR_CARD_HEIGHT)

  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 92, 80, 840, 860, 32)
  ctx.fill()

  ctx.fillStyle = '#111827'
  ctx.textAlign = 'center'
  ctx.font = 'bold 52px Microsoft YaHei'
  ctx.fillText('桌位二维码', QR_CARD_WIDTH / 2, 170)

  ctx.font = '36px Microsoft YaHei'
  ctx.fillStyle = '#4b5563'
  ctx.fillText(getQrCodeTitle(row), QR_CARD_WIDTH / 2, 230)

  const qrX = Math.floor((QR_CARD_WIDTH - QR_SIZE) / 2)
  ctx.drawImage(qrImage, qrX, QR_Y, QR_SIZE, QR_SIZE)

  ctx.fillStyle = '#111827'
  ctx.font = 'bold 42px Microsoft YaHei'
  ctx.fillText(getQrCodeTitle(row), QR_CARD_WIDTH / 2, 820)

  ctx.fillStyle = '#6b7280'
  ctx.font = '28px Microsoft YaHei'
  ctx.fillText(getQrCodeAreaText(row), QR_CARD_WIDTH / 2, 880)

  return canvas.toDataURL('image/png')
}

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

const exportRowsAsQrZip = async (rows: any[]) => {
  if (!rows.length) {
    ElMessage.warning('没有可导出的桌位数据')
    return
  }

  state.loading = true
  try {
    const zip = new JSZip()
    const folder = zip.folder('table-qrcodes')
    const summary: string[] = []

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index]
      const dataUrl = await createQrCardDataUrl(row)
      const base64 = dataUrl.split(',')[1]
      const fileName = `${escapeFileName(getQrCodeTitle(row))}.png`
      folder?.file(fileName, base64, { base64: true })
      summary.push(`${index + 1}. ${getQrCodeTitle(row)} | 链接: ${getQrCodeText(row)}`)
    }

    folder?.file(
      'README.txt',
      ['桌位二维码导出', `生成时间: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, `总数: ${rows.length}`, '', ...summary].join('\n')
    )

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    })
    saveAs(blob, `桌位二维码_${dayjs().format('YYYYMMDDHHmmss')}.zip`)
    ElMessage.success('二维码导出成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('二维码导出失败')
  } finally {
    state.loading = false
  }
}

const getListData = () => {
  state.loading = true
  getAreaTableList({
    page: state.currentPage,
    size: state.pageSize,
  })
    .then((data: any) => {
      state.list = data.list || []
      state.total = (data.pages || 0) * state.pageSize
    })
    .finally(() => {
      state.loading = false
    })
}

const onOpenAdd = (type: string, row?: any) => {
  detailDialogRef.value.openDialog(type, row)
}

const handleSizeChange = () => {
  state.currentPage = 1
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

const handleSelectionChange = (rows: any[]) => {
  state.multipleSelection = rows
}

const onExportSingleQrCode = async (row: any) => {
  await exportRowsAsQrZip([row])
}

const onExportQrCode = () => {
  ElMessageBox.confirm('确认导出当前勾选的桌位二维码吗？点击取消将导出当前列表全部数据。', '导出二维码', {
    confirmButtonText: '导出勾选数据',
    cancelButtonText: '导出全部数据',
    distinguishCancelAndClose: true,
    type: 'success',
  })
    .then(() => {
      if (!state.multipleSelection.length) {
        ElMessage.warning('请先勾选要导出的桌位')
        return
      }
      exportRowsAsQrZip(state.multipleSelection)
    })
    .catch((action) => {
      if (action === 'cancel') {
        exportRowsAsQrZip(state.list)
      }
    })
}

const getStatusText = (status: number) => {
  if (status === 20) return '有人'
  if (status === 10) return '空闲'
  return '-'
}

const formatTime = (time?: number) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
}

const doDelete = (ids: number[]) => {
  deleteAreaTable({ ids }).then(() => {
    if (state.list.length === ids.length && state.currentPage > 1) {
      state.currentPage -= 1
    }
    getListData()
    ElMessage.success('删除成功')
  })
}

const onRowDel = (row: any) => {
  ElMessageBox.confirm(`确认删除桌位「${row.tableNum}」吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      doDelete([row.id])
    })
    .catch(() => {})
}

const onBatchDel = () => {
  const ids = state.multipleSelection.map((item: any) => item.id)
  ElMessageBox.confirm(`确认删除选中的 ${ids.length} 个桌位吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      doDelete(ids)
    })
    .catch(() => {})
}

onMounted(() => {
  getListData()
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
  background: linear-gradient(135deg, #f8fbff 0%, #f4fbf5 100%);
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

.page-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
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
</style>
