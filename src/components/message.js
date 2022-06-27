export class Message extends HTMLElement {
	constructor() {
		super();
		this.getInfo()
		this.attachShadow({ mode: "open" });
	}

  static get observedAttributes() {
    return ['first', 'other', 'status'];
  }

  attributeChangedCallback(name, oldValue, newValue){
    this.getInfo()
  }

  getInfo(){
    const isFirst = this.getAttribute('first');
    const messageStatus = this.getAttribute('status');
		const other = this.getAttribute('other');

    if(isFirst !== null){
      this.isFirst = true
    } else this.isFirst = false

    // if(messageStatus !== null){
    //   this.messageStatus = true
    // } else this.messageStatus = false
    this.messageStatus = messageStatus

    if(other !== null){
      this.other = true
    } else this.other = false

    return [this.isFirst, this.other, this.messageStatus]
  }

  getStatus() {
    if(!this.other){
      return this.messageStatus
    } else return 'none'
  }

	getStyles() {
    let styles
    if (!this.other){
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
          transition: all 0.4s;
        }
        
        `;
    
        if(this.isFirst){
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
          transition: all 0.4s;
        }
        `
        
        if(this.isFirst){
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
      overflow-wrap: break-word;
    }

    .status-icon .none{
      opacity: 0;
      width: 0;
    }
    
    .options{
        position: absolute;
        top: 0.8rem;
        right: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        background-color: transparent;
        color: #acb2b7;
        border: none;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s;
        cursor: pointer;
    }

    .options:hover{
        opacity: 1;
    }
    `

    if(!this.other){
        styles += `
            .options{
                background-color:  #026956;
                box-shadow: 0 0 10px #026956, 0 0 10px #026956, 0 0 10px #026956;
            }
        `
    } else {
        styles += `
            .options{
                background-color: #202c33;
                box-shadow: 0 0 10px #202c33, 0 0 10px #202c33, 0 0 10px #202c33;
            }
        `
    }
    return styles
	}

  getDate () {
    const newDate = new Date
  
    let hour = newDate.getHours()
    let minutes = newDate.getMinutes()
    let afternoon = 'a.m.'
  
    if(hour > 12){
      hour = hour - 12
      afternoon = 'p.m.'
    } 
  
    return `${hour}:${minutes} ${afternoon}`
  }

	getTemplate() {
		const template = document.createElement("template");
		template.innerHTML = `
    <style>${this.getStyles()}</style>

    <button class="options">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
  </svg>
    </button>

    <p class="message-text">
        <span><slot></slot></span>
    </p>

  <div class="message-info">
    <div class="hour">${this.getDate()}</div>
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