const BASE = 'https://file-sharing-project-opcq.onrender.com'

async function main() {
  const form = new FormData()
  form.append('uploaded_file', new Blob(['a'], { type: 'text/plain' }), 'a.txt')
  form.append('uploaded_file', new Blob(['b'], { type: 'text/plain' }), 'b.txt')
  const res = await fetch(`${BASE}/uploadfile`, { method: 'POST', body: form })
  console.log('Multi file status:', res.status)
  console.log(await res.json())
}

main()
