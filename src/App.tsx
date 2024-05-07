import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [isTab, setIsTab] = useState(false);


  useEffect(() => {
    const checkTab = async () => {
      const [tab] = await chrome.tabs.query({ active: true });
      if (tab.url?.startsWith("https://web.whatsapp.com")) {
        // show form  
        setIsTab(true)
        console.log(isTab)
      } else {
        // show open whatsapp button
        setIsTab(false)
      }
    }

    checkTab()
  }, [])

  return (
    <div className='main'>
      <div className="container">
        <h3 className='container-title'>WABulk Sender</h3>

        {
        isTab ?
          <div className='upload-block'>
            <p className='upload-text'>Upload an excel file</p>
            <input type="file" className='upload-input' />
            <button className='upload-btn' type='button'>Upload</button>
          </div>
          :
          <div className='upload-block'>
            <button className='upload-btn' type='button'>Open WhatsApp</button>
          </div>
        }

      </div>
    </div>
  )
}

export default App
