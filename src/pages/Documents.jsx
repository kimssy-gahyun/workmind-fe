import { useRef, useState } from 'react'
import client from '../api/client.js'
import './Documents.css'

function Documents() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const submitting = useRef(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting.current) return
    setMessage(null)

    if (!file) {
      setMessage({ type: 'error', text: '첨부파일을 선택해주세요.' })
      return
    }

    const form = event.currentTarget
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    // Temporary author ID until the backend links the authenticated member.
    formData.append('upfile', file)

    submitting.current = true
    setLoading(true)
    try {
      await client.post('/documents', formData)
      setTitle('')
      setContent('')
      setFile(null)
      form.reset()
      setMessage({ type: 'success', text: '문서가 등록되었습니다.' })
    } catch {
      setMessage({ type: 'error', text: '문서를 등록하지 못했습니다. 잠시 후 다시 시도해주세요.' })
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  return (
    <>
      <h1>Documents</h1>
      <section className="document-registration" aria-labelledby="document-registration-title">
        <h2 id="document-registration-title">문서 등록</h2>
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <fieldset disabled={loading}>
            <div className="document-field">
              <label htmlFor="document-title">문서 제목</label>
              <input id="document-title" name="title" type="text" value={title}
                onChange={(event) => setTitle(event.target.value)} required />
            </div>
            <div className="document-field">
              <label htmlFor="document-content">문서 내용</label>
              <textarea id="document-content" name="content" rows={6} value={content}
                onChange={(event) => setContent(event.target.value)} />
            </div>
            <div className="document-field">
              <label htmlFor="document-file">첨부파일 (필수)</label>
              <input id="document-file" name="upfile" type="file" required
                onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </div>
            <button className="document-submit" type="submit" disabled={loading}>
              {loading ? '등록 중…' : '문서 등록'}
            </button>
          </fieldset>
          {message && (
            <p className={`document-message ${message.type}`}
              role={message.type === 'error' ? 'alert' : 'status'}>
              {message.text}
            </p>
          )}
        </form>
      </section>
    </>
  )
}

export default Documents