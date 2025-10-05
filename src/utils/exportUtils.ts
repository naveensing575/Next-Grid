interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  salary: number
  joinDate: string
  status: 'active' | 'inactive'
  avatar?: string
}

// CSV Export
export const exportToCSV = (data: User[], filename: string = 'data.csv') => {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Salary', 'Join Date', 'Status']
  const csvContent = [
    headers.join(','),
    ...data.map(user => [
      user.id,
      `"${user.name}"`,
      `"${user.email}"`,
      `"${user.role}"`,
      `"${user.department}"`,
      user.salary,
      `"${new Date(user.joinDate).toLocaleDateString()}"`,
      user.status
    ].join(','))
  ].join('\n')

  downloadFile(csvContent, filename, 'text/csv')
}

// Excel Export (using HTML table format that Excel can read)
export const exportToExcel = (data: User[], filename: string = 'data.xlsx') => {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Salary', 'Join Date', 'Status']
  
  const excelContent = `
    <table>
      <thead>
        <tr>
          ${headers.map(header => `<th style="background-color: #f0f0f0; font-weight: bold; border: 1px solid #ccc; padding: 8px;">${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(user => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">${user.id}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${user.name}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${user.email}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${user.role}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${user.department}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${user.salary.toLocaleString()}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${new Date(user.joinDate).toLocaleDateString()}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${user.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  downloadFile(excelContent, filename.replace('.xlsx', '.xls'), 'application/vnd.ms-excel')
}

// PDF Export (using HTML to PDF approach)
export const exportToPDF = (data: User[]) => {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to export PDF')
    return
  }

  const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Salary', 'Join Date', 'Status']
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Data Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .print-date { color: #666; font-size: 12px; margin-bottom: 20px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Data Grid Export</h1>
        <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
        <div class="print-date">Total Records: ${data.length}</div>
        
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(user => `
              <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.department}</td>
                <td>$${user.salary.toLocaleString()}</td>
                <td>${new Date(user.joinDate).toLocaleDateString()}</td>
                <td>${user.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="no-print" style="margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print / Save as PDF
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

// Utility function to download files
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Export filtered data utility
export const exportFilteredData = (
  allData: User[], 
  selectedIds: number[], 
  format: 'csv' | 'excel' | 'pdf',
  filename?: string
) => {
  const dataToExport = selectedIds.length > 0 
    ? allData.filter(user => selectedIds.includes(user.id))
    : allData

  const timestamp = new Date().toISOString().split('T')[0]
  const defaultFilename = `data-export-${timestamp}`

  switch (format) {
    case 'csv':
      exportToCSV(dataToExport, filename || `${defaultFilename}.csv`)
      break
    case 'excel':
      exportToExcel(dataToExport, filename || `${defaultFilename}.xlsx`)
      break
    case 'pdf':
      exportToPDF(dataToExport)
      break
    default:
      console.error('Unsupported export format:', format)
  }
}
