export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        cell += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (char !== '\r') {
      cell += char
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  return rows
}

export function csvRecords(text: string): Record<string, string>[] {
  const rows = parseCsv(text)
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => cell.trim().toLowerCase() === 'name'),
  )
  if (headerIndex === -1) {
    return []
  }

  const headers = rows[headerIndex].map((header) => header.trim().toLowerCase())
  const records: Record<string, string>[] = []

  for (const row of rows.slice(headerIndex + 1)) {
    if (row.every((cell) => cell.trim() === '')) {
      continue
    }
    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      if (header) {
        record[header] = (row[index] ?? '').trim()
      }
    })
    records.push(record)
  }

  return records
}
