import React, { useState } from 'react'
import api from '../api'
import "./UploadForm.scss"
const UploadForm = ({ onDone }) => {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [loading, setLoading] = useState(false)

  const upload = async (e) => {
    e.preventDefault()
    if (!file) return alert("파일을 선택하세요.")
    setLoading(true)
    try {

      console.log('업로드 시작', file)

      const { data: { url, key } } = await api.post('/files/presign', {
        filename: file.name,
        contentType: file.type
      })

      console.log('presign 발급 성공', { url, key })

      const putRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      })

      if (!putRes.ok) throw new Error('s3 업로드 실패')
      console.log('s3 업로드 성공 ', key)


      const metaRes = await api.post('/files', {
        key,
        originalName: file.name,
        contentType: file.type,
        size: file.size,
        title,
        description: desc
      })
      console.log('db 업로드 성공 ', metaRes.data)

      onDone?.()
      setTitle("")
      setDesc("")
      setFile(null)
      console.log('업로드 완료 ')

    } catch (error) {
      console.error("업로드 에러", error)
      alert('업로드에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='form-list' onSubmit={upload}>
      <input
        type="file"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
        accept='image/*'
        className='file-btn'
      />
      <div className="left">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder='title' />
        <input
          value={desc}
          type="text"
          onChange={(e) => setDesc(e.target.value)}
          placeholder='description' />
        <button type='submit' className='upload-btn' disabled={loading}>
          {loading ? "Uploading...." : "upload"}
        </button>
      </div>
    </form>
  )
}

export default UploadForm