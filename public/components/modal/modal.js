const template = document.createElement("template");
template.innerHTML = `
    <style>
        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            height: 500px;
            background: linear-gradient(90deg, #86CEFA 0%, rgba(226,237,238,1) 75%, rgba(255,255,255,1) 100%);
            box-shadow: 5px 5px 20px black;    
            z-index: 1;
            display: none;
            user-select: contain;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: rgba(0,0,0,.5);
            display: none;
            user-select: none;
        }
        
        .modal-header {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: 30px;
            margin-right: 5px;
            margin-top: 3px;
        }
        
        .modal-title {
            flex-grow: 1;
            text-align: center;
            font-size: 27px;
            font-weight: bold;
        }

        .modal-close-button {
            position: fixed;
            background: none;
            border: none;
            font-size: 27px;
            cursor: pointer;
            user-select: none;
        }
        
        .active {
            display: block;
        }
    </style>
        
    <div class="modal">
        <div class="modal-header">
            <div class="modal-title"></div>
            <button class="modal-close-button">&times;</button>
        </div>
        <slot></slot>
    </div>
    <div class="modal-overlay"></div`
        
class Modal extends HTMLElement {
            
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        shadow.append(template.content.cloneNode(true));
        this.modal = shadow.querySelector(".modal");
        this.modal_overlay = shadow.querySelector(".modal-overlay");
        this.modal_title = shadow.querySelector(".modal-title");
        this.close_button = shadow.querySelector(".modal-close-button");
        this.close_button.addEventListener("click", (e) => {
            this.removeAttribute("active");
        });
    }

    get isActivated() {
        return this.getAttribute("active") != null;
    }

    get hasHeight() {
        return this.getAttribute("height") != null;
    }

    get hasWidth() {
        return this.getAttribute("width") != null;
    }

    static get observedAttributes() {
        return ["active", "width", "height", "title"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title") this.changeTitle();
        if (name === "active") this.activateModal();
        if (name === "width" || name === "height") this.changeSize();
    }

    activateModal() {
        if (this.isActivated) {
            this.modal.classList.add("active");
            this.modal_overlay.classList.add("active");
        }
        else {
            this.modal.classList.remove("active");
            this.modal_overlay.classList.remove("active");
        }
    }

    changeSize() {
        this.modal.style.width = this.hasWidth ? this.getAttribute("width") : "500px";
        this.modal.style.height = this.hasHeight ? this.getAttribute("height") : "500px";
    }

    changeTitle() {
        this.modal_title.innerHTML = this.getAttribute("title");
    }
}

customElements.define("popup-modal", Modal);