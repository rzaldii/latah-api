export function classifyReport(text: string) {

  const lowerText = text.toLowerCase()

  if (
    lowerText.includes('jalan') ||
    lowerText.includes('lubang') ||
    lowerText.includes('aspal')
  ) {
    return 'Jalan Rusak'
  }

  if (
    lowerText.includes('sampah') ||
    lowerText.includes('bau')
  ) {
    return 'Sampah Menumpuk'
  }

  if (
    lowerText.includes('lampu') ||
    lowerText.includes('gelap')
  ) {
    return 'Lampu Jalan Mati'
  }

  if (
    lowerText.includes('banjir') ||
    lowerText.includes('genangan')
  ) {
    return 'Banjir / Genangan'
  }

  return 'Lainnya'
}