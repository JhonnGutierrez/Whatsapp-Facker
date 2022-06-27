export class Information extends HTMLElement {
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
        this.security = this.getAttribute('security')
    }

    getStyles() {
        let styles = `
            :host{
                align-self: center;
                color: #aaa;
                margin-block: 0.8rem !important;
                font-size: 1.4rem;
                padding: 0.8rem 1.2rem !important;
                background-color: #1d272e;
                border-radius: 0.8rem;
                max-width: 90%;
            }

            p{
                margin: 0;
                text-align: center;
            }
        `

        if(this.security !== null){
            styles += `
                :host{
                    color: #ffd279;
                    cursor: pointer;
                }
            `
        }
        
        return styles
    }

    getTemplate() {
        const template = document.createElement('template')

        template.innerHTML = `
            <style>${this.getStyles()}</style>
            
        ` 

        if(this.security !== null){
            template.innerHTML += `
                <p><span><svg width="1em" height="1em" viewBox="0 0 10 12" class=""><path d="M5.008 1.6c1.375 0 2.501 1.074 2.586 2.427l.005.164v1.271h.158c.585 0 1.059.48 1.059 1.07v3.351c0 .59-.474 1.07-1.059 1.07h-5.5c-.582 0-1.057-.48-1.057-1.07V6.531c0-.59.474-1.069 1.058-1.069h.158V4.191c0-1.375 1.075-2.501 2.429-2.586l.163-.005Zm0 1.248c-.696 0-1.272.534-1.337 1.214l-.006.129-.002 1.271H6.35l.001-1.271c0-.653-.47-1.2-1.088-1.319l-.126-.018-.129-.006Z" fill="currentColor"></path></svg></span> Los mensajes están cifrados de extremo a extremo. Nadie fuera de este chat, ni siquiera WhatsApp, puede leerlos ni escucharlos. Haz clic para obtener más información.</p>
            `
        } else {
            template.innerHTML += `<p><slot></slot></p>`
        }

        return template.content.cloneNode(true)
    }

    connectedCallback(){
        const template = this.getTemplate()
        this.shadowRoot.append(template)
    }
}