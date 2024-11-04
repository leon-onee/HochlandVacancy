class FileUploader {
  constructor(fileInputSelector, fileAddedSelector) {
    this.fileInput = document.querySelector(fileInputSelector);
    this.fileAdded = document.querySelector(fileAddedSelector);
    this.files = [];

    this.init();
  }

  init() {
    this.fileInput.addEventListener('change', (e) => this.handleFileInputChange(e));
  }

  handleFileInputChange(event) {
    if (!event.target.files) {
      return;
    }
    if (this.files.length === 3) {
      return;
    }
    this.files = [...this.files, ...event.target.files];
    this.renderFileItems();
  }

  renderFileItems() {
    let htmlFileItems = '';
    this.files.forEach((file) => {
      const fileExtension = file.name.split('.').pop();
      htmlFileItems += `<div class='file__item'>
                          <div class='file__item-close'>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <use href="./assets/svg/sprite.svg#fileClose"></use>
                            </svg>
                          </div>
                          <div class='file__item-icon'>
                            <svg width="31" height="41" viewBox="0 0 31 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <use href="./assets/svg/sprite.svg#fileIcon"></use>
                            </svg>
                            <span class='file__item-badge'>${fileExtension}</span>
                          </div>
                        </div>`;
    });

    this.fileAdded.innerHTML = htmlFileItems;

    this.fileAdded.querySelectorAll('.file__item-close').forEach((btn, index) => {
      btn.addEventListener('click', () => this.removeFileItem(index));
    });
  }

  removeFileItem(index) {
    this.files.splice(index, 1);
    this.renderFileItems();
    this.updateInputFiles();
  }

  updateInputFiles() {
    const fileList = new DataTransfer();
    this.files.forEach((file) => {
      fileList.items.add(file);
    });
    this.fileInput.files = fileList.files;
  }
}

function vacancyInputNotEmpty() {
  const vacancyInputs = document.querySelectorAll('.vacancy-apply__row input');

  vacancyInputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      if (value.length !== 0) {
        input.style.borderColor = 'var(--gray-3)';
      } else {
        input.style.borderColor = '';
      }
    });
  });
}

function vacancyFormValide(popupSuccess) {
  const config = {
    errorFieldCssClass: 'invalid',
    errorLabelCssClass: 'vacancy-apply--alert',
    errorLabelStyle: {
      color: '#EC5F6C',
    },
    successFieldCssClass: 'valid',
    successFieldStyle: {
      borderColor: '#46374D',
    },
  };
  const validate = new window.JustValidate('.vacancy-apply__content', config);
  // name
  validate.addField('.vacancy-apply__input--text > input', [
    {
      rule: 'required',
      errorMessage: 'необходимо заполнить поле',
    },
    {
      rule: 'customRegexp',
      value: /^[А-яЁё\s]+$/gi,
      errorMessage: 'некорректно заполнено поле',
    },
  ]);
  validate.addField('.vacancy-apply__input--birth > input', [
    {
      rule: 'required',
      errorMessage: 'необходимо заполнить поле',
    },
    {
      rule: 'customRegexp',
      value: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/gi,
      errorMessage: 'некорректно заполнено поле',
    },
  ]);
  validate.addField('.vacancy-apply__input--city > input', [
    {
      rule: 'required',
      errorMessage: 'необходимо заполнить поле',
    },
    {
      rule: 'customRegexp',
      value: /^[А-яЁё\s.]+$/gi,
      errorMessage: 'некорректно заполнено поле',
    },
  ]);
  validate.addField('.vacancy-apply__input--tel > input', [
    {
      rule: 'required',
      errorMessage: 'необходимо заполнить поле',
    },
    {
      rule: 'customRegexp',
      value: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/gi,
      errorMessage: 'некорректно заполнено поле',
    },
  ]);
  validate.addField('.vacancy-apply__personal > input', [
    {
      rule: 'required',
      errorMessage: 'необходимо заполнить поле',
    },
  ]);
  validate.addField('.vacancy-apply__select select', [
    {
      rule: 'required',
      errorMessage: 'необходимо заполнить поле',
    },
  ]);
  validate.addField('.vacancy-apply__file-input #resume-file', [
    {
      rule: 'files',
      value: {
        files: {
          maxSize: 2 * 1024 * 1024,
        },
      },
      errorMessage: 'необходимо добавить файлы pdf или docx, не более 2 мб',
    },
    {
      rule: 'minFilesCount',
      value: 1,
      errorMessage: 'необходимо добавить файл',
    },
    {
      rule: 'maxFilesCount',
      value: 3,
      errorMessage: 'не больше 3 файлов',
    },
  ]);

  // отправка формы
  validate.onSuccess((event) => {
    // event.currentTarget.submit();
    popupSuccess.open();
  });
}

function init() {
  const uploader = new FileUploader(
    '.vacancy-apply__file-input > label input[type="file"]',
    '.vacancy-apply__file-added',
  );
  const popupFormSuccess = new Popup('.vacancy-apply__success');
  vacancyInputNotEmpty();
  vacancyFormValide(popupFormSuccess);
  animateBorderShadowItems('.vacancy-info__advantages-item');
}

document.addEventListener('DOMContentLoaded', init);
