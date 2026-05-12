export function extractKeywords(text: string) {

  const stopwords = [
    'dan',
    'di',
    'yang',
    'ke',
    'dari',
    'untuk',
    'ada',
    'dengan',
  ]

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')

  const filtered = words.filter(
    word =>
      word.length > 3 &&
      !stopwords.includes(word)
  )

  return [...new Set(filtered)].slice(0, 10)
}