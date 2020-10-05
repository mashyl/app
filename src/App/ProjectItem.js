import {DOMHelper} from '../Utilities/DOMHelper';
// import {ToolTip} from './Tooltip.js';

export class ProjectItem {
    // hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction, type) {
        this.id = id;
        this.hasActiveTooltip = false;
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
        import('./Tooltip').then(module => {
            const tooltip = new module.ToolTip(() => {
                this.hasActiveTooltip = false;
            }, 
            tooltipText,
            this.id);
            tooltip.attach();
            this.hasActiveTooltip = true;
        })
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