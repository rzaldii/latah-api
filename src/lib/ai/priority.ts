export function calculatePriorityScore(data: any) {

  let score = 0

  const text =
    `${data.title} ${data.description}`.toLowerCase()

  // kategori bahaya tinggi
  const highRiskKeywords = [
    'banjir',
    'longsor',
    'listrik',
    'kabel',
    'jalan rusak parah',
    'kecelakaan',
  ]

  // urgency words
  const urgencyWords = [
    'parah',
    'darurat',
    'bahaya',
    'segera',
    'fatal',
  ]

  highRiskKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 25
    }
  })

  urgencyWords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 15
    }
  })

  // vote impact
  score += (data.vote_count || 0) * 2

  // random sedikit agar natural
  score += Math.floor(Math.random() * 10)

  if (score > 100) score = 100

  return score
}