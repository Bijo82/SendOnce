const BASE = 'https://file-sharing-project-opcq.onrender.com'

async function main() {
  const form = new FormData()
  form.append('uploaded_file', new Blob([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], { type: 'image/png' }), 'test.png')
  const up = await fetch(`${BASE}/uploadfile`, { method: 'POST', body: form })
  const upJson = await up.json()
  console.log('PNG upload:', upJson)
  const otp = upJson.OTP

  const prev = await fetch(`${BASE}/preview?otp=${otp}`)
  console.log('PNG preview:', prev.status, await prev.json())

  const dl = await fetch(`${BASE}/download?otp=${otp}`)
  console.log('PNG download status:', dl.status)
  console.log('PNG download content-type:', dl.headers.get('content-type'))
  console.log('PNG download disposition:', dl.headers.get('content-disposition'))
  const buf = await dl.arrayBuffer()
  console.log('PNG download bytes:', buf.byteLength)

  const big = 'y'.repeat(100000)
  const bigUp = await fetch(`${BASE}/uploadtext`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: big }),
  })
  const bigJson = await bigUp.json()
  console.log('Large text upload:', bigJson)
  const bigOtp = bigJson.Otp

  const bigPrev = await fetch(`${BASE}/preview?otp=${bigOtp}`)
  console.log('Large preview:', bigPrev.status, await bigPrev.json())

  const bigDl = await fetch(`${BASE}/download?otp=${bigOtp}`)
  console.log('Large download status:', bigDl.status)
  console.log('Large download content-type:', bigDl.headers.get('content-type'))
  console.log('Large download disposition:', bigDl.headers.get('content-disposition'))
  const bigBuf = await bigDl.arrayBuffer()
  console.log('Large download bytes:', bigBuf.byteLength)
  const ct = bigDl.headers.get('content-type') ?? ''
  if (ct.includes('json')) {
    console.log('Large download JSON:', await JSON.parse(new TextDecoder().decode(bigBuf)))
  } else {
    console.log('Large download text start:', new TextDecoder().decode(bigBuf.slice(0, 100)))
  }
}

main()
