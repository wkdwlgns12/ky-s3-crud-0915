import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import FileList from './components/FileList'
import UploadForm from './components/UploadForm'
function App() {


  return (
    <div className='container'>
      <UploadForm/>
      <FileList />
    </div>
  )
}

export default App
