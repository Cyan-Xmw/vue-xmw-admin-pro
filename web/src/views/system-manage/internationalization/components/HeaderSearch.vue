<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="[16, 16]" align="middle">
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="I18nInternationalization('name')">
            <a-input :placeholder="I18nEntry(I18nInternationalization('name'))" allowClear v-model="queryForm.name" />
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="I18nInternationalization('zh-CN')">
            <a-input :placeholder="I18nEntry(I18nInternationalization('zh-CN'))" allowClear v-model="queryForm.zhCN" />
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="$t(I18nGlobal.CreatedAt)">
            <a-range-picker v-model="queryForm.createdAt" valueFormat="YYYY-MM-DD" />
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <span class="table-page-search-submitButtons">
            <a-space>
              <a-button type="primary" icon="search" @click="query" v-action:[ActionMap.search]>{{
                $t(I18nGlobal.Search)
              }}</a-button>
              <a-button icon="plus" @click="onAdd" v-action:[ActionMap.add]>{{ $t(I18nGlobal.Add) }}</a-button>
            </a-space>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { ActionMap } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nInternationalization } from '@/constant/i18n'
export default {
  name: 'HeaderSearch',
  props: ['queryForm'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nInternationalization,
      ActionMap
    }
  },
  methods: {
    query() {
      this.$emit('query')
    },
    onAdd() {
      this.$emit('onAdd')
    }
  }
}
</script>
