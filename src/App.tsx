import { KeyboardEvent, useEffect, useState } from 'react'
import './App.css'
import { IoMdClose } from "react-icons/io";

function App() {

  const [isTab, setIsTab] = useState<number>(0);
  const [number, setNumber] = useState<string>("");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  // handle open whatsapp
  const handleOpenWhatsApp = async() => {
    await chrome.tabs.create({
      url: "http://web.whatsapp.com"
    })
  }

  // handle numbers 
  const handleNumbers = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && number.length > 9) {
      let num = parseInt(number)
      setNumbers(prev => [...prev, num])
      setNumber("")
    }
  }

  // handle remove number from the list 
  const handleRemoveNumber = (number: number) => {
    let filtered = numbers.filter(n => n !== number)
    setNumbers(filtered)
  }

  // handle send
  const handleSend = () => {

    setError("")

    if (numbers?.length == 0){
      setError("please add valid contact numbers")
      return
    }
    if (message?.trim() == ""){
      setError("enter valid message")
      return
    }

    console.log(numbers, message)

    function initiateMessages() {
      // write logic in here
      // const body = document.querySelector("body");
      // const a = document.createElement("a");
      // let link = `https://web.whatsapp.com/send?phone=${numbers[0]}&text=${message}`
      // a.href = link
      // a.classList.add("click-me") 
      // body?.append(a)
      // let ele: HTMLAnchorElement = document.querySelector(".click-me")!;
      // ele.click()

      setTimeout(() => {
        const body = document.querySelector("body")!;
        body.style.background = "#333";
      }, 3000)
    }

    chrome.scripting.executeScript({
      target: { tabId: isTab },
      func: initiateMessages,
    }).then(() => {
      console.log("executing script")
    })

  }

  useEffect(() => {
    const checkTab = async () => {
      const [tab] = await chrome.tabs.query({ active: true });
      if (tab.url?.startsWith("https://web.whatsapp.com")) {
        // show form 
        if (tab?.id){
          setIsTab(tab?.id)
        } 
      } else {
        // show open whatsapp button
        setIsTab(0)
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
              <input type="number" className='numbers-input' placeholder='Add Numbers...' onKeyDown={handleNumbers}
                value={number} onChange={(e) => setNumber(e.target.value)} />
              <div className="number-tags">
                {numbers?.map(num => {
                  return (
                    <div className='tag' onClick={() => handleRemoveNumber(num)}>
                      <p className='tag-number'>{num}</p>
                      <p className='tag-icon'><IoMdClose /></p>
                    </div>
                  )
                })}
              </div>
              <textarea name="text" id="text" className='text-input' rows={4} placeholder='Type Message Here...'
              value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
              <p className='error'>{error}</p>
              <button className='upload-btn' type='button' onClick={handleSend}>Send</button>
            </div>
            :
            <div className='upload-block'>
              <button className='upload-btn' type='button' onClick={handleOpenWhatsApp}>Open WhatsApp</button>
            </div>
        }

      </div>
    </div>
  )
}

export default App
