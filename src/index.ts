import { marked } from 'marked'

export function transfer(md: string) {
  try {
    const tokens = marked.lexer(md)
    const events: any = []
    const props: any = {}
    let name = ''
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
        data.forEach((item: any) => {
          const name = item[_name]
          const description = item[_description]
          if ((name && name.startsWith('on')) || _name === '事件名称') {
            events.push({
              name,
              description,
              callback: item[_callback],
            })
          }
          else {
            const type = item[_callback] ? item[_callback].replace(/\s*\/\s*/g, ' | ') : ''
            let _default = _value ? item[_value].replace(/\s*\/\s*/g, ' | ') : ''
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
    })

    return JSON.stringify({
      name,
      props,
      events,
    }, null, 4)
  }
  catch (error) {
    console.error(error)
  }
}

transfer(`### Events
| Event Name | Description | Parameters |
|---------|--------|---------|
| change | 用户确认选定的值时触发 | 组件绑定值。格式与绑定值一致，可受 \`value-format\` 控制 |
| blur | 当 input 失去焦点时触发 | 组件实例 |
| focus | 当 input 获得焦点时触发 | 组件实例 |`)
