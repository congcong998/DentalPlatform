import { http } from '@/http/http'

/**
 * 创建合同请求参数
 */
export interface ICreateContractParams {
  customerCode: string
  contractName: string
}

/**
 * 创建合同响应
 */
export interface ICreateContractRes {
  certificationUrl?: string
  contractId?: string
}

/**
 * 创建合同
 * @param data 创建合同参数
 */
export function paasV2CreateContract(data: ICreateContractParams) {
  return http.post<ICreateContractRes>('/paasv2/createContract', data)
}

/**
 * 乙方签署预览
 * @param contractId 合同ID
 */
export function paasV2PartyBSign(contractId: string) {
  return http.get<string>('/paasv2/partyBSign', { contractId })
}

/**
 * 甲方签署预览
 * @param contractId 合同ID
 */
export function paasV2PartyASign(contractId: string) {
  return http.get<string>('/paasv2/partyASign', { contractId })
}

/**
 * 合同预览
 * @param contractId 合同ID
 */
export function paasV2Preview(contractId: string) {
  return http.get<string>('/paasv2/preview', { contractId })
}
