import {LitElement, html} from '@polymer/lit-element';
import colors from '../styles/colors.js';

export default class BsButton extends LitElement {
	static get properties() {
		return {
			// set button state to active
			active: Boolean,
			// disable the button
			disabled: Boolean,
			// set to an url to get an anchor element with button styling
			href: String,
			// set to true to act as a toggle button
			toggle: Boolean,
			// the button type (default: button)
			type: String,
		}
	}

	constructor() {
		super();
		this.active = false;
		this.disabled = false;
		this.type = "button";
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this.hasAttribute('class')) {
			this.setAttribute('class', 'secondary');
		}
	}

	_render({active, disabled, href, toggle, type}) {
		return html`
			<style>
				:host(:not([hidden])) {
					display: inline-block;
				}
				:host > *:not([disabled]) {
					cursor: pointer;
				}
				:host > *:focus {
					outline: none;
				}
				a, button {
					box-sizing: border-box;
					display: inline-block;
					padding: .375em .75em;
					border: 1px solid transparent;
					border-top-left-radius: var(--bs-border-top-left-radius, .25em);
					border-top-right-radius: var(--bs-border-top-right-radius, .25em);
					border-bottom-left-radius: var(--bs-border-bottom-left-radius, .25em);
					border-bottom-right-radius: var(--bs-border-bottom-right-radius, .25em);

					font-size: 1rem;
					line-height: 1.5;
					text-align: center;
					user-select: none;
					vertical-align: middle;
					white-space: nowrap;
					text-decoration: none;

					background-color: transparent;
					transition:
						color .15s ease-in-out,
						background-color .15s ease-in-out,
						border-color .15s ease-in-out,
						box-shadow .15s ease-in-out,
						filter .15s ease-in-out;
				}
				/* reset firefox button focus style */
				button::-moz-focus-inner {
					border: 0;
				}
				:host > [active]:not([disabled]) {
					filter: brightness(0.85);
				}
				:host > [disabled] {
					opacity: 0.65;
				}
				:host(.small) > * {
					font-size: .875rem;
				}
				:host(.large) > * {
					font-size: 1.25rem;
				}
				*:focus:not([disabled]) {
					box-shadow: 0 0 0 .2rem var(--bs-button-focusring-color);
				}
				:host(:not(.outline)) > * {
					background-color: var(--bs-button-background-color);
					color: var(--bs-button-color);
				}
				:host(:not(.outline)) > *:hover:not([disabled]) {
					background-color: var(--bs-button-hover-background-color);
				}
				:host(.outline) > * {
					color: var(--bs-button-background-color);
					border-color: var(--bs-button-background-color);
				}
				:host(.outline) > *:hover:not([disabled]), :host(.outline) > [active] {
					background-color: var(--bs-button-background-color);
					color: var(--bs-button-color);
				}
				:host(.outline) > *:hover:not([active]) {
					filter: none;
				}
				/* color variants */
				${colors.map(({selector, color, contrast, focusring, hoverbg}) => html`
					:host(${selector}) {
						--bs-button-background-color: ${color};
						--bs-button-color: ${contrast};
						--bs-button-focusring-color: ${focusring};
						--bs-button-hover-background-color: ${hoverbg};
					}`
				)}
			</style>
			${href ? html`<a id="button" href$=${href} disabled?=${disabled} active?=${active}><slot></slot></a>`:
			  !toggle ? html`<button id="button" type$=${type} disabled?=${disabled} active?=${active}><slot></slot></button>`:
			  html`<button
				id="button"
				type="button"
				disabled?=${disabled}
				active?=${active}
				aria-pressed$=${active}
				on-click=${(event) => {
					event.preventDefault();
					this._toggle();
				}}
				on-keydown=${(event) => {
					if (event.altKey)
						return;

					switch (event.code) {
						case "Enter":
						case "Space":
							event.preventDefault();
							this._toggle();
							break;
						default:
							return;
				}}}><slot></slot></button>
			`}
		`;
	}

	/**
	 * Toggle the button state
	 */
	_toggle() {
		if (this.disabled)
			return;
		this.active = !this.active;
	}

	/**
	 * Fire change notification event
	 */
	_propertiesChanged(props, changedProps, oldProps) {
		super._propertiesChanged(props, changedProps, oldProps);

		if('active' in changedProps) {
			// dont fire on initial set
			if (oldProps['active'] !== undefined) {
				this.dispatchEvent(new CustomEvent('active-changed', {
					detail: {
						value: changedProps['active'],
					},
					bubbles: false,
					composed: true,
				}));
			}
		}
	};

	/**
	 * Pass external clicks to the internal button
	 */
	click() {
		this.$button.click();
	}

	/**
	 * Pass external focuses to the internal button
	 */
	focus() {
		this.$button.focus();
	}

	/**
	 * Expose internal button
	 */
	get $button() {
		return this.shadowRoot.querySelector('#button');
	}
}

customElements.define('bs-button', BsButton);
