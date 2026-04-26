import { http } from '@/http/http'

/**
 * 添加客户信息请求参数
 */
export interface ICustomerAddParams {
  // 客户信息
  id?: string
  customerCode?: string
  customerName?: string
  name?: string
  sex?: number
  age?: number
  phone?: string
  idCard?: string
  idCardFrontUrl?: string
  idCardBackUrl?: string
  email?: string
  wechatOpenid?: string
  address?: string

  // 合同信息
  contractCode?: string
  contractStatus?: number
  contractAmount?: number
  contractType?: string | number
  contractName?: string
  operationFee?: number
  serviceFee?: number
  startDate?: string
  endDate?: string
  signDate?: string
  signAddr?: string
  designatedOrg?: string

  // 宣传信息
  compaignPeriod?: number
  compaignStartDate?: string
  compaignEndDate?: string
  recomAmount?: number

  // 还款信息
  period?: number
  installment?: number
  repaymentDay?: number
  repaymentDate?: string
  firstRepaymentDate?: string

  // 银行卡信息
  bankCardNo?: string
  bankName?: string
  bankCardUrl?: string
  expireDate?: string

  // 邀请信息
  inviteCode?: string
  invitePerson?: string
  inviteName?: string

  // 合同其他信息
  thirdpartyContractId?: number
  thirdpartyContractName?: string
  docIds?: string
  partBUserId?: string
  userSealId?: number
  dentalContractUrl?: string
  recomContractUrl?: string
  doctorName?: string
  doctorSign?: string

  // 扩展字段
  repaymentStatus?: number
  serviceProvider?: string
  installmentCount?: number
  perAmount?: number
  publicityMonths?: number
  recommendCount?: number
}

/**
 * 添加客户信息
 * @param data 客户信息
 */
export function addCustomer(data: ICustomerAddParams) {
  return http.post<{ customerCode?: string }>('/customer/customerInfo/add', data)
}

/**
 * 生成牙科合同
 * @param customerCode 客户编号
 */
export function generateDentalContract(customerCode: string) {
  return http.get<{ dentalContractUrl?: string }>('/contract/customerContract/generateDentalContract', { customerCode })
}

/**
 * 生成推荐合同
 * @param customerCode 客户编号
 */
export function generateRecommendContract(customerCode: string) {
  return http.get<{ recomContractUrl?: string }>('/contract/customerContract/generateRecommendContract', { customerCode })
}
