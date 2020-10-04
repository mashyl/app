import {ProjectItem} from './ProjectItem.js';
import {DOMHelper} from '../Utilities/DOMHelper.js';

export class ProjectList {
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
                // console.log('dragenter fired');
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