import { mainValidation } from './utils'
import errors from './constants'

export function validateEmail(fields) {
  return mainValidation(fields, email)
}

export function email(value) {
  const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\u0080-\u00ff\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return (value && !emailRe.test(value)) ? errors.email : undefined
}
