export const downloadBlob = (blob: Blob, fileName: string) => {
  const blobUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = blobUrl
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(blobUrl)
}
