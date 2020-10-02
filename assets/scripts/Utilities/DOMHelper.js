class DOMHelper {
    static clearElementEventListeners (element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static moveElement (elementID, newDestination){
        const element = document.getElementById(elementID);
        const destination = document.querySelector(newDestination);
        destination.append(element);
        element.scrollIntoView({behavior: 'smooth'});
    }
}
