const BASE = 'https://file-sharing-project-opcq.onrender.com'

async function req(label, method, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { method, ...options })
  const ct = res.headers.get('content-type') ?? ''
  let body
  if (ct.includes('application/json')) body = await res.json()
  else {
    const buf = await res.arrayBuffer()
    body = `[${buf.byteLength}b ct=${ct}] ${new TextDecoder().decode(buf.slice(0, 200))}`
  }
  console.log(`\n[${label}] ${method} ${path} -> ${res.status}`)
  console.log(JSON.stringify(body, null, 2))
}

async function main() {
  await req('emptyText', 'POST', '/uploadtext', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '' }),
  })

  await req('emptyTextMissing', 'POST', '/uploadtext', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  const emptyForm = new FormData()
  emptyForm.append('uploaded_file', new Blob([]), 'empty.txt')
  await req('emptyFile', 'POST', '/uploadfile', { body: emptyForm })

  await req('invalidOtpPreview', 'GET', '/preview?otp=ABC')

  // Non-txt file download shape
  const form = new FormData()
  form.append('uploaded_file', new Blob([0x89, 0x50, 0x4e, 0x47], { type: 'image/png' }), 'test.png')
  const up = await req('pngUpload', 'POST', '/uploadfile', { body: form })
  const otp = up?.OTP
  if (otp) {
    await req('pngPreview', 'GET', `/preview?otp=${otp}`)
    await req('pngDownload', 'GET', `/download?otp=${otp}`)
  }

  // Large text - check if returns as file on download
  const big = 'x'.repeat(50000)
  const bigUp = await req('largeText', 'POST', '/uploadtext', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: big }),
  })
  const bigOtp = bigUp?.Otp
  if (bigOtp) {
    await req('largePreview', 'GET', `/preview?otp=${bigOtp}`)
    const dl = await fetch(`${BASE}/download?otp=${bigOtp}`)
    console.log('\n[largeDownload]', dl.status, dl.headers.get('content-type'))
    const buf = await dl.arrayBuffer()
    console.log('bytes:', buf.byteLength, 'starts:', new TextDecoder().decode(buf.slice(0, 80)))
  }
}

main()
