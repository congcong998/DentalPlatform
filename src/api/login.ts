import type { IAuthLoginRes, ICaptcha, ICustomerMobileLoginRes, IDoubleTokenRes, IUpdateInfo, IUpdatePassword, IUserInfoRes } from './types/login'
import { http } from '@/http/http'

/**
 * 登录表单
 */
export interface ILoginForm {
  username: string
  password: string
}

/**
 * 获取验证码
 * @returns ICaptcha 验证码
 */
export function getCode() {
  return http.get<ICaptcha>('/user/getCode')
}

/**
 * 用户登录
 * @param loginForm 登录表单
 */
export function login(loginForm: ILoginForm) {
  return http.post<IAuthLoginRes>('/auth/login', loginForm)
}

/**
 * H5 登录（口腔平台）
 * @param loginForm 登录表单
 */
export function mLogin(loginForm: ILoginForm) {
  return http.post<any>('/dental-finance/sys/mLogin', loginForm)
}

/**
 * 刷新token
 * @param refreshToken 刷新token
 */
export function refreshToken(refreshToken: string) {
  return http.post<IDoubleTokenRes>('/auth/refreshToken', { refreshToken })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.get<IUserInfoRes>('/user/info')
}

/**
 * 退出登录
 */
export function logout() {
  return http.get<void>('/auth/logout')
}

/**
 * 修改用户信息
 */
export function updateInfo(data: IUpdateInfo) {
  return http.post('/user/updateInfo', data)
}

/**
 * 修改用户密码
 */
export function updateUserPassword(data: IUpdatePassword) {
  return http.post('/user/updatePassword', data)
}

/**
 * 发送短信验证码
 * @param mobile 手机号
 */
export function sendSmsCode(mobile: string) {
  return http.post<{ success: boolean, message: string }>(`/dental-finance/customer/customerInfo/mobile/code?mobile=${mobile}`)
}

/**
 * 短信验证码登录
 * @param mobile 手机号
 * @param smsCode 验证码
 */
export function smsLogin(mobile: string, smsCode: string) {
  return http.post<ICustomerMobileLoginRes>(`/dental-finance/customer/customerInfo/mobile/login?mobile=${mobile}&smsCode=${smsCode}`)
}
