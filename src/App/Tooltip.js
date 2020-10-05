import {Component} from './Component';

export class ToolTip extends Component {
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