/**
* ================================================
*   此处写一些校验规则
× ================================================
*/

// 判断用户账号格式
export function validateAccount (str) {
  const reg = /^[a-zA-Z][a-zA-Z0-9_]{1,}$/ // 字母开头，允许5-16字节，允许字母数字下划线
  return reg.test(str)
}
// 判断英文格式
export function validateEnglish (str) {
  const reg = /^[a-zA-Z]{1,}$/ // 字母开头，允许0-16字节，允许字母数字下划线
  return reg.test(str)
}
// 判断大写字母格式
export function validateUpperEnglish (str) {
  const reg = /^[A-Z]{1,}$/ // 字母开头，允许5-16字节，允许字母数字下划线
  return reg.test(str)
}
// 判断密码格式
export function validatePassword (str) {
  const reg = /^[a-zA-Z0-9_-]{4,}$/ // 密码至少4位,由大小写字母和数字,-,_组成
  return reg.test(str)
}
// 判断邮箱格式
export function validateName (str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  return reg.test(str)
}

// 判断手机号码格式
export function validateMobiePhone (str) {
  const reg = /^(\+86|0086)?\s*(13|15|18)[0-9](\d{4})(\d{4})$/
  return reg.test(str)
}

// 判断邮箱格式
export function validateEmail (str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  return reg.test(str)
}

// 判断国内号码格式
export function validateTel (str) {
  const reg = /^(\+86|0086)?\s*(13|15|18)[0-9](\d{4})(\d{4})$/ // 匹配形式如 0511-4405222 或 021-87888822
  return reg.test(str)
}

// 匹配腾讯QQ号
export function validateQQ (str) {
  const reg = /[1-9][0-9]{4,}/ // 腾讯QQ号从10000开始
  return reg.test(str)
}

// 匹配中国邮政编码
export function validatePostCode (str) {
  const reg = /[1-9]d{5}(?!d)/ // 中国邮政编码为6位数字
  return reg.test(str)
}

// 匹配身份证
export function validatePersonCard (str) {
  const reg = /d{15}|d{18}/ // 中国的身份证为15位或18位
  return reg.test(str)
}

// 匹配ip地址
export function validateIP (str) {
  const reg = /d+.d+.d+.d+/
  return reg.test(str)
}

// 匹配中文
export function validateChinese (str) {
  const reg = /^[\u4e00-\u9fa5]{2,}$/
  return reg.test(str)
}

// 匹配非法字符
export function validateNotEqual (str) {
  const reg = /[^a-zA-Z0-9\\u4e00-\u9fa5]{1,}$/
  return reg.test(str)
}
// 匹配路径
export function validatePath (str) {
  const reg = /[a-zA-Z]:(\\([0-9a-zA-Z]+))+/
  return reg.test(str)
}
// 匹配正整数
export function validateInt (str) {
  const reg = /^[1-9]{0,}/
  return reg.test(str)
}
