import {Message} from './components/message.js'
import {Information} from './components/information.js'

customElements.define("custom-message", Message);
customElements.define("info-message", Information);


const messageContainer = document.querySelector('.messages-container')
messageContainer.scroll(0, messageContainer.scrollHeight)

const sendButton = document.querySelector('.send-button')
const input = document.querySelector('.input')
const hiddenButtons = document.querySelectorAll('.hidden-button')

function changeIconHandler(e) {
  if( e.path[0].value.length !== 0){
    sendButton.className = 'send-button'
    hiddenButtons.forEach(a => {
      a.style.width = '0'
      a.style.opacity = '0'
    })
  } else {
    sendButton.className = 'send-button empty'
    hiddenButtons.forEach(a => {
      a.style.width = 'calc(6rem - 0.4rem * 2)'
      a.style.opacity = '1'
    })
  }
}

input.addEventListener('input', changeIconHandler)
input.addEventListener('keydown', sendMessageHandler )
sendButton.addEventListener('click', sendMessage)

function sendMessage(other = false){
  if(input.value.length !== 0) {
    const newMessage = document.createElement('custom-message')
    const value = input.value.split('\n')

    let count = 0
    value.forEach(v => {
      if (v.length === 0){
        v = ' '
      }
      if(count === value.length - 1){
        const span = document.createElement('span')
        span.textContent = v
        // <span class="message-space" style="opacity: 0;">aaaaaaaaaa</span>
        const space = document.createElement('span')
        space.style.opacity = 0
        space.textContent = 'aaaaaaaaaaa'
        newMessage.append(span)
        newMessage.append(space)
      } else {
        const p = document.createElement('p')
        p.textContent = v
        newMessage.append(p)
      }

      count++
    })

    if(other){
      newMessage.setAttribute('other', '')
    }

    if(!(messageContainer.children[0].lastElementChild.other === other)){
      newMessage.setAttribute('first', '')
    } 
    
    newMessage.setAttribute('status', 'seen')
    
    input.value = ''
    messageContainer.children[0].append(newMessage)
    messageContainer.scroll(0, messageContainer.scrollHeight)
  }

  sendButton.className = 'send-button empty'
  hiddenButtons.forEach(a => {
    a.style.width = 'calc(6rem - 0.4rem * 2)'
    a.style.opacity = '1'
  })
}

function sendMessageHandler(e) {
  if(e.key === 'Enter' && !e.shiftKey && !e.ctrlKey){
    e.preventDefault()
    sendMessage()
  } else if(e.key === 'Enter' && e.ctrlKey){
    e.preventDefault()
    sendMessage(true)
  }
  console.log(input.textContent)
}


const profileImg = document.querySelector('.profile-img')
const profileInput = document.querySelector('#profileInput')

profileInput.addEventListener('change', (() => {
  const file = profileInput.files[0]
  const url = URL.createObjectURL(file)
  console.log(url)
  profileImg.src = url
}))