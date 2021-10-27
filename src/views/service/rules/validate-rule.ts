export const CHECK_REPEAT_PW = function (form: any) {
  return (rule: any, value: any, callback: any) => {
    if (form['newPW'] !== value) {
      return callback(new Error('Two input password must be consistent'))
    } else {
      callback()
    }
  }
}
