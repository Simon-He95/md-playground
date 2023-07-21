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
            const name = item[_name]
            const description = item[_description] ? item[_description].replaceAll('<br>', ' ') : ''
            const params = item[_callback]
              ? item[_description]
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
            else if (/'方法名'/.test(_name)) {
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

transfer(`| 名称                           | 描述                 | 版本 |    
| ------------------------------ | ------------------------------------------------- | ---- |
| goTo(slideNumber, dontAnimate) | 切换到指定面板, dontAnimate = true 时，不使用动画 |      |
| next()                         | 切换到下一面板                                    |      |
| prev()                         | 切换到上一面板                                    |      |
`)
