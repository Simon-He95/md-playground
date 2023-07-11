import { marked } from 'marked'

export function transfer(md: string) {
  try {
    const tokens = marked.lexer(md)
    const events: any = []
    const data: any = []
    let header: any = []
    tokens.forEach((token: any) => {
      if (token.type === 'table') {
        header = token.header.map((item: any) => item.text)
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
      }
    })
    const _name = header[0]
    const _description = header[1]
    const _callback = header[2]
    const _value = header[3]
    const props: any = {}
    data.forEach((item: any) => {
      const name = item[_name]
      const description = item[_description]
      if (name.startsWith('on')) {
        events.push({
          name,
          description,
          callback: item[_callback],
        })
      }
      else {
        props[name] = {
          value: '',
          description,
          default: item[_value],
          type: item[_callback],
        }
      }
    })
    return JSON.stringify({
      props,
      events,
    })
  }
  catch (error) {
    console.error(error)
  }
}
