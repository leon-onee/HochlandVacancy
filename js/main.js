class Overlay {
  constructor() {
    this.body = document.body;
    this.overlay = document.createElement('div');
  }

  add() {
    this.body.append(this.overlay);
    setTimeout(() => {
      this.overlay.classList.add('overlay');
    }, 0);
  }
  remove() {
    this.overlay.classList.remove('overlay');
    setTimeout(() => {
      this.overlay.remove();
    }, 300);
  }
}
class Popup {
  constructor(popup, openBtn = '') {
    this.overlay = new Overlay();
    this.popup = document.querySelector(popup);
    this.openBtn = openBtn;
    this.closeBtn = '.popup__close';

    this.addCloseBtn();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('click', this.onClickOpen.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('click', this.handleModalPopup.bind(this));
  }

  open() {
    this.popup.classList.add('show');
    this.overlay.add();
  }

  close() {
    this.popup.classList.remove('show');
    this.overlay.remove();
  }

  onClickOpen(event) {
    const target = event.target;
    if (target.closest(this.openBtn)) {
      this.open();
    }
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }
  handleModalPopup(event) {
    const target = event.target;
    if (target.closest('.overlay') || target.closest('.popup__close')) {
      this.close();
    }
  }

  addCloseBtn() {
    const button = document.createElement('button');
    button.classList.add('popup__close');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '28');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', './assets/svg/sprite.svg#close');
    svg.appendChild(use);
    button.appendChild(svg);
    if (this.popup) {
      this.popup.appendChild(button);
    }
  }
}

class HeaderMenu {
  constructor() {
    this.overlay = new Overlay();
    this.noScrollBody = document.body;
    this.header = document.querySelector('.header');
    this.openBtn = document.querySelector('.header__burger');
    this.closeBtn = document.querySelector('.header__menu-close');
    this.menu = document.querySelector('.header__menu');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.openBtn.addEventListener('click', this.open.bind(this));
    this.closeBtn.addEventListener('click', this.close.bind(this));
  }

  open() {
    this.header.classList.add('header__menu--open');
    this.menu.classList.add('active');
    this.openBtn.classList.add('active');
    this.noScrollBody.classList.add('no-scroll');
    this.overlay.add();
  }

  close() {
    this.header.classList.remove('header__menu--open');
    this.menu.classList.remove('active');
    this.openBtn.classList.remove('active');
    this.noScrollBody.classList.remove('no-scroll');
    this.overlay.remove();
  }
}
class CustomSelect {
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.selectOptions = selectElement.children;
    this.init();
  }

  init() {
    this.hideOriginalSelect();
    this.createSelectWrapper();
    this.createStyledSelect();
    this.populateOptions();
    this.setupListeners();
  }

  hideOriginalSelect() {
    this.selectElement.classList.add('select-hidden');
  }

  createSelectWrapper() {
    this.selectWrapper = document.createElement('div');
    this.selectWrapper.classList.add('select');
    this.selectElement.parentNode.insertBefore(this.selectWrapper, this.selectElement);
    this.selectWrapper.appendChild(this.selectElement);
  }

  createStyledSelect() {
    this.selectStyled = document.createElement('div');
    this.selectStyled.classList.add('select-styled');
    this.selectWrapper.appendChild(this.selectStyled);

    this.selectTitle = document.createElement('span');
    this.selectTitle.classList.add('select-styled__title');
    this.selectTitle.textContent =
      this.selectElement.getAttribute('data-title') || this.selectOptions[0].textContent;
    this.selectStyled.appendChild(this.selectTitle);
  }

  populateOptions() {
    this.optionsList = document.createElement('ul');
    this.optionsList.classList.add('select-options');
    this.selectStyled.parentNode.insertBefore(this.optionsList, this.selectStyled.nextSibling);

    const options = this.selectOptions;
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const listItem = document.createElement('li');
      listItem.textContent = option.textContent;
      listItem.setAttribute('rel', option.value);
      this.optionsList.appendChild(listItem);
    }
    this.listItems = this.optionsList.children;
  }

  setupListeners() {
    this.selectStyled.addEventListener('click', (e) => this.toggleOptions(e));
    Array.from(this.listItems).forEach((item) =>
      item.addEventListener('click', (e) => this.selectOption(e)),
    );
    document.addEventListener('click', () => this.closeOptions());
  }

  toggleOptions(event) {
    event.stopPropagation();
    document.querySelectorAll('.select-styled.active').forEach((item) => {
      if (item !== this.selectStyled) {
        item.classList.remove('active');
        item.nextElementSibling.classList.remove('open');
      }
    });
    this.selectStyled.classList.toggle('active');
    this.optionsList.classList.toggle('open');
  }

  selectOption(event) {
    event.stopPropagation();
    const selectedItem = event.currentTarget;
    this.selectTitle.textContent = selectedItem.textContent;
    this.selectTitle.classList.remove('active');
    this.selectElement.value = selectedItem.getAttribute('rel');
    this.optionsList.classList.remove('open');
    this.selectStyled.classList.remove('active');
    Array.from(this.listItems).forEach((li) => li.classList.remove('active'));
    selectedItem.classList.add('active');

    if (!this.selectWrapper.classList.contains('selected')) {
      this.selectWrapper.classList.add('selected');
    }
    const invalidParent = this.selectElement.closest('.invalid');
    if (invalidParent) {
      invalidParent.classList.remove('invalid');
    }
  }

  closeOptions() {
    this.selectStyled.classList.remove('active');
    this.optionsList.classList.remove('open');
  }
}

class StyleManager {
  constructor(initialVars = []) {
    this.initialVars = initialVars;
    this.headTag = document.getElementsByTagName('head')[0];
    this.styleTag = document.createElement('style');
    this.varMap = new Map();
    this.resizeObserver = null;
    console.log(initialVars);
    this.initialVars.forEach(([name, value, observerElem]) => {
      this.addStyleVar(name, value);
      if (observerElem) {
        this._observeResize(name, value, observerElem);
      }
    });
    this.headTag.appendChild(this.styleTag);
  }

  _renderStyleVar() {
    const entriesOfMap = Array.from(this.varMap.entries()).map((arr) => arr.join(':'));
    this.styleTag.innerHTML = `
      :root {
        ${entriesOfMap.join(';')}
      }
    `;
  }
  varMapSet(name, value) {
    if (typeof value === 'function') {
      this.varMap.set(name, value());
    } else {
      this.varMap.set(name, value);
    }
  }

  addStyleVar(name, value) {
    this.varMapSet(name, value);
    this._renderStyleVar();
  }

  updateStyleVar(name, value) {
    if (!this.varMap.has(name)) {
      return;
    }
    this.varMapSet(name, value);
    this._renderStyleVar();
  }

  _observeResize(name, value, observerElem) {
    if (!this.resizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === observerElem) {
            this.updateStyleVar(name, value);
          }
        }
      });
      this.resizeObserver = resizeObserver;
    }

    this.resizeObserver.observe(observerElem);
  }
}

function getHeaderHeight() {
  const header = document.querySelector('.header');
  return `${header.offsetHeight}px`;
}

function initInputMask() {
  try {
    new Inputmask('+7 (999) 999-99-99', {
      showMaskOnHover: false,
    }).mask('.inputmask--tel');
  } catch (error) {
    console.error(error);
  }
}
function initDateInputMask() {
  try {
    new Inputmask('99.99.9999', {
      alias: 'datetime',
      showMaskOnHover: false,
    }).mask('.inputmask--date');
  } catch (error) {
    console.error(error);
  }
}

function animateBorderShadowItems(selector) {
  const advantagesItems = document.querySelectorAll(selector);
  let index = 0;

  setInterval(() => {
    advantagesItems.forEach((item) => {
      item.classList.remove('active');
    });

    advantagesItems[index].classList.add('active');
    index = (index + 1) % advantagesItems.length;
  }, 2000);
}

function init() {
  const header = document.querySelector('.header');
  const styleManager = new StyleManager([['--header-height', getHeaderHeight, header]]);
  const headerMenu = new HeaderMenu();
  document.querySelectorAll('select').forEach((select) => new CustomSelect(select));
  initInputMask();
  initDateInputMask();
  getHeaderHeight();

  new Popup('.popup-become-team', '.popup-become-team__open');
}

document.addEventListener('DOMContentLoaded', init);
