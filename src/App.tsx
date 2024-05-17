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
  const handleOpenWhatsApp = async () => {
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
  const handleSend = async () => {

    setError("")

    if (numbers?.length == 0) {
      setError("please add valid contact numbers")
      return
    }
    if (message?.trim() == "") {
      setError("enter valid message")
      return
    }

    // custom wait func => promise
    function waitFor(num: number) {
      return new Promise((resolve, _) => {
        setTimeout(() => {
          resolve("resolved")
        }, num * 1000)
      })
    }


    function initiateMessages(number: number, message: string) {
      return new Promise<string>((resolve, _) => {
        const login: HTMLButtonElement = document.querySelector(".home-campaign-signup-button")!;
        login.click();
        let i = 0
        const interval = setInterval(() => {
          console.log("interval => ", i);
          if (i == 5) {
            resolve(`${message} => ${number}`)
            clearInterval(interval)
          } else {
            i++;
          }
        }, 1000)
      })
    }

    for (let i = 0; i < numbers.length; i++) {
      let random = Math.floor(Math.random() * 10);
      console.log("random => ", random)
      const wait = await waitFor(random)
      console.log(wait)
      const res = await chrome.scripting.executeScript({
        target: { tabId: isTab },
        func: initiateMessages,
        args: [numbers[i], message],
      })
      console.log(res)
    }



  }

  useEffect(() => {
    const checkTab = async () => {
      const [tab] = await chrome.tabs.query({ active: true });
      if (tab.url?.startsWith("https://web.whatsapp.com")) {
        // show form 
        if (tab?.id) {
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
