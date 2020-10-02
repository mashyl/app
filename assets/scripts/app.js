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

class ToolTip extends Component {
    constructor(closeNotifierFn, text, hostElementID) {
        super(hostElementID)
        this.closeNotifier = closeNotifierFn;
        this.text = text;
        this.createTooltipElement();
    }

    closeTooltip() {
        this.detach();
        this.closeNotifier();
    }

    createTooltipElement() {
        const tooltipelement = document.createElement('div');
        tooltipelement.classList = 'card';
        const tooltipTemplate = document.getElementById('tooltip');
        const tooltipBody = document.importNode(tooltipTemplate.content, true);
        tooltipBody.querySelector('p').textContent = `${this.text}`;
        tooltipelement.appendChild(tooltipBody);

        const hostPosLeft = this.hostElement.offsetLeft;
        const hostPosTop = this.hostElement.offsetTop;
        const hostHeight = this.hostElement.clientHeight;
        const scrollingValue = this.hostElement.parentElement.scrollTop;

        const x = hostPosLeft + 20;
        const y = hostPosTop + hostHeight - 10 - scrollingValue;

        tooltipelement.style.position = 'absolute';
        tooltipelement.style.left = x + 'px';
        tooltipelement.style.top = y + 'px';

        this.element = tooltipelement;
        tooltipelement.addEventListener('click', this.closeTooltip.bind(this));
    }
}

class ProjectItem {
    hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction, type) {
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoBtn();
        this.connectSwitchBtn(type);
        this.connectDrag();
    }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }
        const projectElement = document.getElementById(this.id);
        const tooltipText = projectElement.dataset.extraInfo;
        const tooltip = new ToolTip(() => {
            this.hasActiveTooltip = false;
        }, 
        tooltipText,
        this.id);
        tooltip.attach();
        this.hasActiveTooltip = true;
    }

    update(updateProjectListsFn, type) {
        this.updateProjectListsHandler = updateProjectListsFn;
        this.connectSwitchBtn(type);
    }

    connectDrag() {
        const item = document.getElementById(this.id);
        
        item.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', this.id);
            event.dataTransfer.effectAllowed = 'move';
        });

        // item.addEventListener('dragend', event => {
        //     if(event.dataTransfer.dropEffect !== 'move') {
        //         alert('Drop your project in either of project lists');
        //     }
        // })
    }

    connectSwitchBtn(type) {
        const projectElement = document.getElementById(this.id);
        let switchBtn = projectElement.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearElementEventListeners(switchBtn);
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id));
    }

    connectMoreInfoBtn() {
        const projectElement = document.getElementById(this.id);
        let moreInfoBtn = projectElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this));
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for(const prjItem of prjItems) {
            this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this), type));
        }
        this.connectDrop();
    }

    setSwitchHandler(switchHandlerFunction)
    {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type);
    }

    connectDrop() {
        const list = document.querySelector(`#${this.type}-projects ul`);

        list.addEventListener('dragenter', event => {
            if (event.dataTransfer.types[0] === 'text/plain') {
                list.parentElement.classList.add('droppable');
                event.preventDefault();
                console.log('dragenter fired');
            }
        });

        list.addEventListener('dragover', event => {
             if (event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
            }
        });

        list.addEventListener('dragleave', event => {
            if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
                list.parentElement.classList.remove('droppable');
            }
        });

        list.addEventListener('drop', event => {
            event.preventDefault();
            const prjID = event.dataTransfer.getData('text/plain'); // getting the id of the dropped list item

            if(this.projects.find(p => p.id === prjID)) {
                return;
            }
////
            document.getElementById(prjID).querySelector('button:last-of-type').click(); //trigger click on button to move element
            list.parentElement.classList.remove('droppable');
            // event.preventDefault(); //just in case we're dropping an image for example
            console.log('drop fired');
        })
    }

    switchProject(projectID) {
        this.switchHandler(this.projects.find(p => p.id === projectID));
        this.projects.filter(p => p.id !== projectID);
        
    }
}

class App {
    static init() {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandler(finishedProjectList.addProject.bind(finishedProjectList));
        finishedProjectList.setSwitchHandler(activeProjectList.addProject.bind(activeProjectList));
    }
}

App.init();