import { marked } from 'marked'

export function transfer(md: string) {
  try {
    const tokens = marked.lexer(md)
    const events: any = []
    const props: any = {}
    const methods: any = []
    const typeDetail: any = {}
    let name = ''
    let index = 0
    tokens.forEach((token: any) => {
      if (token.type === 'heading') {
        const { text } = token
        const match = text.match(/name:\s*([\w-]+)/)
        if (match) {
          name = match[1].replace(/-(\w)/g, (_: string, v: string) => v.toUpperCase())
          name = name[0].toUpperCase() + name.slice(1)
        }
      }
      else if (token.type === 'table') {
        index++
        const data: any = []
        const header = token.header.map((item: any) => item.text)
        const rows = token.rows
        rows.forEach((row: any) => {
          const temp: any = {}
          data.push(temp)
          row.forEach((item: any, i: any) => {
            const content = item.text
            // events
            temp[header[i]] = content
          })
        })
        const _name = header[0]
        const _description = header[1]
        const _callback = header[2]
        const _value = header[3]
        if (/键名/.test(_name)) {
          // 类型
          typeDetail[`type${index}`] = data.map((item: any) => {
            const [name, description, type] = Object.values(item)
            return {
              name,
              description,
              type: type
                ? (type as string)
                    .replace(/\s*\/\s*/g, ' | ')
                    .replace(/_/g, '')
                    .replace(/\\\\/g, '')
                : '',
            }
          })
        }
        else {
          data.forEach((item: any) => {
            const name = item[_name].replace(/`/g, '')
            const description = item[_description] ? item[_description].replaceAll('<br>', ' ') : ''
            const params = item[_callback]
              ? item[_callback]
                .replaceAll('<br>', ' ')
                .replace(/\s*\/\s*/g, ' | ')
                .replace(/_/g, '')
                .replace(/\\\\/g, '')
              : ''
            if ((name && name.startsWith('on')) || /事件名/.test(_name)) {
              events.push({
                name: /on-/.test(name) ? name.replace('on-', '') : name,
                description,
                params,
              })
            }
            else if (/方法名/.test(_name)) {
              methods.push({
                name,
                description,
                params,
              })
            }
            else {
              const type = params.replaceAll('<br>', ' ').replace(/`/g, '')
              let _default = _value
                ? item[_value]
                  .replaceAll('<br>', ' ')
                  .replace(/\s*\/\s*/g, ' | ')
                  .replace(/`/g, '')
                  .replace(/\\\\/g, '')
                : ''
              let value = ''
              if (_default.includes('|'))
                value = _default.split(' | ')
              else if (/^[\—\-\s]$/.test(_default) && type === 'boolean')
                _default = 'false'
              if (name.includes('/')) {
                name.split(' / ').forEach((name: string) => {
                  props[name] = {
                    value,
                    description,
                    default: _default,
                    type,
                  }
                })
              }
              else {
                props[name] = {
                  value,
                  description,
                  default: _default,
                  type,
                }
              }
            }
          })
        }
      }
      else if (token.type === 'list') {
        token.items.forEach((item: any) => {
          const text = item.text.replace(/\s+/g, ' ').split(' ')
          const prop = text[0]
          if (prop[0] === '@') {
            const propName = prop.slice(1)
            if (propName === 'property') {
              props[text[2]] = {
                value: '',
                description: text[3],
                default: '',
                type: text[1].slice(1, -1),
              }
            }
            else if (propName === 'event') {
              events.push({
                name: text[2],
                description: text[3],
                params: text[1].slice(1, -1),
              })
            }
          }
          else {
            name = prop
          }
        })
      }
    })

    return JSON.stringify({
      name,
      props,
      methods,
      typeDetail,
      events,
    }, null, 4)
  }
  catch (error) {
    console.error(error)
  }
}

transfer(`
/**
 * alertTips 警告提示
 * @description 警告提示，展现需要关注的信息
 * @tutorial https://uviewui.com/components/alertTips.html
 * @property {String} title 显示的标题文字
 * @property {String} description 辅助性文字，颜色比title浅一点，字号也小一点，可选
 * @property {String} type 关闭按钮(默认为叉号icon图标)
 * @property {String} icon 图标名称
 * @property {Object} icon-style 图标的样式，对象形式
 * @property {Object} title-style 标题的样式，对象形式
 * @property {Object} desc-style 描述的样式，对象形式
 * @property {String} close-able 用文字替代关闭图标，close-able为true时有效
 * @property {Boolean} show-icon 是否显示左边的辅助图标
 * @property {Boolean} show 显示或隐藏组件
 * @event {Function} click 点击组件时触发
 * @event {Function} close 点击关闭按钮时触发
 */
`)
