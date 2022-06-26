class Message extends HTMLElement {
	constructor() {
		super();
		this.isFirst = this.getAttribute('first');
		this.messageStatus = this.getAttribute('status');
		this.other = this.getAttribute('other');
		this.attachShadow({ mode: "open" });
	}

  getStatus() {
    if(this.other !== ''){
      return this.messageStatus
    } else return 'none'
  }

	getStyles() {
    let styles
    if (this.other === null){
        styles = `
        :host {
          z-index: 1;
          color: #fff;
          background-color: #026956;
          font-size: 1.4rem;
          max-width: 28rem;
          align-self: flex-end;
          border-radius: 0.8rem;
          position: relative;
          padding: 0.8rem !important;
          margin-top: 0.4rem !important;
        }
        
        `;
    
        if(this.isFirst === ''){
          styles += `
          :host {
            border-top-right-radius: 0;
          }
          
          :host::after {
            content: "";
            background-color: #026956;
            width: 16px;
            height: 16px;
            position: absolute;
            top: 0;
            right: -15.9px;
            border-top-right-radius: 0.4rem;
            clip-path: polygon(0% 0%, 0% 100%, 100% 16%, 100% 0%);
          }
          `
    }
    } else {
      styles = `
        :host{
          z-index: 1;
          color: #fff;
          background-color: #202c33;
          font-size: 1.4rem;
          max-width: 28rem;
          align-self: flex-start;
          border-radius: 0.8rem;
          position: relative;
          padding: 0.8rem !important;
          margin-top: 0.4rem !important;
        }
        `
        
        if(this.isFirst === ''){
          styles += `
        :host {
          border-top-left-radius: 0;
          margin-top: 1.2rem !important;
        }
        
        :host::before {
          content: "";
          background-color: #202c33;
          width: 16px;
          height: 16px;
          position: absolute;
          top: 0;
          left: -15.9px;
          border-top-left-radius: 0.4rem;
          clip-path: polygon(100% 0%, 100% 100%, 0% 16%, 0% 0%);
        }
        `
  }
    }

    styles += `.message-info {
      user-select: none;
      display: flex;
      gap: 0.4rem;
      font-size: 1.2rem;
      align-items: flex-end;
      position: absolute;
      bottom: 0.4rem;
      right: 0.8rem;
      color: #acb2b7;
    }
    
    .status-icon {
      position: relative;
      width: 1.6rem;
      height: 1.6rem;
    }
    
    .status-icon * {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 1.6rem;
    }
    
    .status-icon.none {
      width: 0;
      opacity: 0;
    }

    .delivered-icon,
    .sent-icon {
      opacity: 0;
    }
    
    .status-icon.delivered .delivered-icon,
    .status-icon.sent .sent-icon,
    .status-icon:not(.delivered):not(.seen) .sent-icon {
      opacity: 1;
    }
    
    .status-icon.seen .delivered-icon {
      opacity: 1;
      color: #58a0ff;
    }

    .message-text{
      margin: 0;
      
    }`
    return styles
	}
	getTemplate() {
		const template = document.createElement("template");
		template.innerHTML = `
    <style>${this.getStyles()}</style>
    <p class="message-text">
    <span
      ><slot></slot></span
    >
    <span class="message-space" style="opacity: 0;">aaaaaaa</span>
  </p>

  <div class="message-info">
    <div class="hour">15:56</div>
    <!-- //seen delivered -->
    <div class="status-icon ${this.getStatus()}">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        class="bi bi-check2 sent-icon"
        viewBox="0 0 16 16"
      >
        <path
          d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        class="bi bi-check2-all delivered-icon"
        viewBox="0 0 16 16"
      >
        <path
          d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"
        />
        <path
          d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z"
        />
      </svg>
    </div>
  </div>
    `;

		return template.content.cloneNode(true);
	}
	connectedCallback() {
		const template = this.getTemplate();
		this.shadowRoot.append(template);
	}
}

customElements.define("custom-message", Message);

const messageContainer = document.querySelector('.messages-container')
messageContainer.scroll(0, messageContainer.scrollHeight)

const sendButton = document.querySelector('.send-button')
const input = document.querySelector('input')

function changeIconHandler(e) {
  if( e.path[0].value.length !== 0){
    sendButton.className = 'send-button'
  } else {
    sendButton.className = 'send-button empty'
  }
}

input.addEventListener('input', changeIconHandler)
// input.addEventListener('keydown', sendMessageHandler )
sendButton.addEventListener('click', sendMessage)

function sendMessage(){
  if(input.value.length !== 0) {
    const newMessage = document.createElement('custom-message')
    newMessage.textContent = input.value
    input.value = ''
    messageContainer.children[0].append(newMessage)
    messageContainer.scroll(0, messageContainer.scrollHeight)
  }
}

function sendMessageHandler(e) {
  if(e.key === 'Enter'){
    sendMessage()
  }
}

