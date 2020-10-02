class Component {
    constructor(hostElementID, insertBefore = false) {
        if (hostElementID) {
            this.hostElement = document.getElementById(hostElementID);
        } else {
            this.hostElement = document.body;
        }
        this.insertBefore = insertBefore;
    }

    detach() {
        if(this.element) {
            this.element.remove();
        }
    }

    attach() {
        this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element);
    }
}
