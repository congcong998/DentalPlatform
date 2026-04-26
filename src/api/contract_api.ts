import { http } from '@/http/http'

/**
 * 合同配置列表请求参数
 */
export interface IContractConfigListParams {
  pageNo: number
  pageSize: number
}

/**
 * 合同配置项
 */
export interface IContractConfig {
  id: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  sysOrgCode: string
  configCode: string
  contractName: string
  contractAmount: number
  operationFee: number
  serviceFee: number
}

/**
 * 合同配置列表响应
 */
export interface IContractConfigListRes {
  success: boolean
  message: string
  code: number
  result: {
    current: number
    size: number
    total: number
    records: IContractConfig[]
    pages: number
  }
  timestamp: number
}

/**
 * 获取合同配置列表
 * @param params 分页参数
 */
export function getContractConfigList(params: IContractConfigListParams) {
  return http.get<IContractConfigListRes>('/contract/contractConfig/list', params)
}
