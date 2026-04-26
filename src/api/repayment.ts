import { http } from '@/http/http'

export interface IRepaymentPlan {
  id: string
  customerCode: string
  customerName: string
  contractCode: string
  seqNo: number
  planDate: string
  planAmount: number
  /** 还款状态(0-未还款 1-已还款 2-部分还款 3-逾期) */
  repaymentStatus: '0' | '1' | '2' | '3'
  remark: string
  actualDate: string
  actualAmount: number
  sysOrgCode: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}

/**
 * 还款计划-通过id查询
 */
export function getRepaymentPlanById(id: string) {
  return http.get<IRepaymentPlan>('/repayment/repaymentPlan/queryById', { id })
}

/**
 * 还款计划-列表查询
 */
export function getRepaymentPlanList(params?: { customerCode?: string, contractCode?: string }) {
  return http.get<{ records: IRepaymentPlan[], total: number }>('/repayment/repaymentPlan/list', params)
}
