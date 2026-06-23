/**
 * Backend API audit script — probes live endpoints and prints raw responses.
 */
const BASE = 'https://file-sharing-project-opcq.onrender.com'

async function request(method, path, options = {}) {
  const url = `${BASE}${path}`
  const start = Date.now()
  console.log(`\n=== ${method} ${path} ===`)
  try {
    const res = await fetch(url, { method, ...options })
    const elapsed = Date.now() - start
    const ct = res.headers.get('content-type') ?? ''
    let bodyText
    let parsed = null

    if (ct.includes('application/json')) {
      parsed = await res.json()
      bodyText = JSON.stringify(parsed, null, 2)
    } else {
      const buf = await res.arrayBuffer()
      bodyText = buf.byteLength > 500
        ? `[binary ${buf.byteLength} bytes, content-type: ${ct}]`
        : new TextDecoder().decode(buf)
    }

    console.log(`Status: ${res.status} (${elapsed}ms)`)
    console.log(`Content-Type: ${ct}`)
    console.log('Body:', bodyText)
    return { status: res.status, parsed, bodyText, headers: res.headers }
  } catch (e) {
    console.log(`Error (${Date.now() - start}ms):`, e.message)
    return null
  }
}

async function main() {
  console.log('Waking backend...')
  await request('GET', '/preview?otp=INVALID')

  console.log('\n--- uploadText { text } ---')
  const textRes = await request('POST', '/uploadtext', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'audit test text' }),
  })

  console.log('\n--- uploadText { content } ---')
  await request('POST', '/uploadtext', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'audit test text' }),
  })

  console.log('\n--- uploadFile field: file ---')
  const fileFormBad = new FormData()
  fileFormBad.append('file', new Blob(['audit'], { type: 'text/plain' }), 'audit-test.txt')
  const fileBadRes = await request('POST', '/uploadfile', { body: fileFormBad })

  console.log('\n--- uploadFile field: uploaded_file ---')
  const fileFormGood = new FormData()
  fileFormGood.append('uploaded_file', new Blob(['audit'], { type: 'text/plain' }), 'audit-test.txt')
  const fileGoodRes = await request('POST', '/uploadfile', { body: fileFormGood })

  const textOtp = textRes?.parsed?.otp ?? null
  const fileOtp = fileGoodRes?.parsed?.otp ?? null

  if (textOtp) {
    console.log('\n--- preview text OTP ---')
    await request('GET', `/preview?otp=${encodeURIComponent(textOtp)}`)
    console.log('\n--- download text OTP ---')
    await request('GET', `/download?otp=${encodeURIComponent(textOtp)}`)
  }

  if (fileOtp) {
    console.log('\n--- preview file OTP ---')
    await request('GET', `/preview?otp=${encodeURIComponent(fileOtp)}`)
    console.log('\n--- download file OTP ---')
    await request('GET', `/download?otp=${encodeURIComponent(fileOtp)}`)
  }

  console.log('\n--- SUMMARY ---')
  console.log('uploadText { text } status:', textRes?.status)
  console.log('uploadFile file status:', fileBadRes?.status, 'body:', fileBadRes?.bodyText)
  console.log('uploadFile uploaded_file status:', fileGoodRes?.status, 'body:', fileGoodRes?.bodyText)
}

main()
