const BASE = 'https://file-sharing-project-opcq.onrender.com'

async function req(label, method, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { method, ...options })
  const ct = res.headers.get('content-type') ?? ''
  let body
  if (ct.includes('application/json')) body = await res.json()
  else {
    const buf = await res.arrayBuffer()
    body = buf.byteLength > 300 ? `[binary ${buf.byteLength}b ct=${ct}]` : new TextDecoder().decode(buf)
  }
  console.log(`\n[${label}] ${method} ${path}`)
  console.log('Status:', res.status, '| Content-Type:', ct)
  console.log('Body:', typeof body === 'object' ? JSON.stringify(body, null, 2) : body)
  return { res, body, ct }
}

async function main() {
  const textUp = await req('uploadText', 'POST', '/uploadtext', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'preview download audit' }),
  })
  const textOtp = textUp.body.Otp

  const textUp2 = await req('uploadText2', 'POST', '/uploadtext', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'reuse test' }),
  })
  const textOtp2 = textUp2.body.Otp

  const form = new FormData()
  form.append('uploaded_file', new Blob(['file audit'], { type: 'text/plain' }), 'audit.txt')
  const fileUp = await req('uploadFile', 'POST', '/uploadfile', { body: form })
  const fileOtp = fileUp.body.OTP

  await req('previewText', 'GET', `/preview?otp=${textOtp}`)
  await req('previewFile', 'GET', `/preview?otp=${fileOtp}`)

  await req('downloadText', 'GET', `/download?otp=${textOtp}`)
  await req('downloadFile', 'GET', `/download?otp=${fileOtp}`)

  await req('downloadTextAgain', 'GET', `/download?otp=${textOtp}`)
  await req('downloadText2First', 'GET', `/download?otp=${textOtp2}`)
  await req('downloadText2Again', 'GET', `/download?otp=${textOtp2}`)

  await req('preview404', 'GET', '/preview?otp=ZZZZZZ')
  await req('download404', 'GET', '/download?otp=ZZZZZZ')
}

main()
