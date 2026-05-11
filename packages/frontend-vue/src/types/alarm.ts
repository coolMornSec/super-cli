export type AlarmScopeType = 'ALL' | 'SERVICE' | 'CHANNEL'

export type AlarmWorkbenchTab = 'config' | 'current' | 'record'

export interface AlarmScope {
  id: string
  name: string
  type: AlarmScopeType
}

export interface AlarmThresholdFormItem {
  color: string
  enabled: boolean
  key: string
  label: string
  value: number | null
}

export interface AlarmConfigSearchForm {
  [key: string]: unknown
  keyword: string
  pageNum: number
  pageSize: number
  pointId: string
  pointType: string
  scopeId: string
  scopeType: AlarmScopeType
  status: string
}

export interface CurrentAlarmSearchForm {
  [key: string]: unknown
  keyword: string
  levels: string[]
  pageNum: number
  pageSize: number
  scopeId: string
  scopeType: AlarmScopeType
}

export interface AlarmRecordSearchForm {
  [key: string]: unknown
  endTime: string
  keyword: string
  levels: string[]
  pageNum: number
  pageSize: number
  scopeId: string
  scopeType: AlarmScopeType
  startTime: string
}

export interface AlarmConfigFormModel {
  alarmLevel: string
  changeAlarmEnabled: boolean
  thresholds: AlarmThresholdFormItem[]
}

export interface AlarmConfigItem extends AlarmConfigFormModel {
  alias: string
  description: string
  eu: string
  id: string
  lastUpdateTime: string
  latestValue: number | null
  llValue: number | null
  name: string
  pointType: string
  status: string
}

export interface CurrentAlarmItem {
  alarmLevel: string
  alarmTime: string
  description: string
  id: string
  name: string
  pointId: string
}

export interface AlarmRecordItem {
  alarmLevel: string
  eventTime: string
  eventType: 'ENTER' | 'CLEAR'
  id: string
  name: string
  pointId: string
}

export interface AlarmTreeNode {
  children?: AlarmTreeNode[]
  nodeId: string
  scopeId: string
  scopeType: AlarmScopeType
  text: string
}

export interface AlarmTreeNodeResponse extends AlarmTreeNode {}

export interface AlarmPageResponse<T> {
  pageNum: number
  pageSize: number
  records: T[]
  total: number
}

export interface AlarmDataResponse<T> {
  data: T
}

export interface AlarmImportResult {
  skipped: number
  updated: number
}

export interface AlarmWorkbenchContext {
  activeTab: AlarmWorkbenchTab
  configQuery: AlarmConfigSearchForm
  currentQuery: CurrentAlarmSearchForm
  recordQuery: AlarmRecordSearchForm
  selectedScope: AlarmScope
}

export const DEFAULT_ALARM_SCOPE: AlarmScope = {
  id: 'ALL',
  name: '全部',
  type: 'ALL',
}
