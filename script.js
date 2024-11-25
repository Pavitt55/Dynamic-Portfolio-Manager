'use strict';

const navLinks = document.querySelector('.nav__links');
const containerMovements = document.querySelector('.movements');
const navContainer = document.querySelector('.nav__items');
const header = document.querySelector('.header');
const form = document.querySelector('form');
const projectName = document.querySelector('.project-name');
const projectDescriptio = document.querySelector('.project-description');
const projectURL = document.querySelector('.project-url');
let projectNameval = '';
let projectDesVal = '';
const imageInput = document.querySelector('.project-screenshot');
const imagePreview = document.querySelector('.image-preview');
const buttonEdit = document.querySelector('.edit-btn');
const btnopenModal = document.querySelector('.btn--show-modal');
const overlaybtn = document.querySelector('.overlay');
const btncloseModal = document.querySelector('.btn--close-modal');
const modal = document.querySelector('.modal');
const buttonUpdate = document.querySelector('.update-button');
const submitButton = document.querySelector('.button-save');
let currentCard;
const editTitle = document.querySelector('.updated-project-name');
const editDescription = document.querySelector('.updated-project-description');
const editImage = document.querySelector('.updated-screenshot');
const editURL = document.querySelector('.updated-project-url');
const editPreview = document.querySelector('.image-preview-edit');
//onst downloadButton = document.querySelector('.download-btn');

const isValidURL = url => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getCardsLS = function () {
  return JSON.parse(localStorage.getItem('projects')) || [];
};

const saveCardsLS = function (cards) {
  localStorage.setItem('projects', JSON.stringify(cards));
};

document.addEventListener('DOMContentLoaded', function () {
  const savedCards = getCardsLS();
  console.log(savedCards);
  savedCards.forEach(card => {
    createProjectCard(
      card.name,
      card.description,
      card.imageURL,
      card.projectURL,
      false
    );
  });
});

const previewImage = function (e) {
  const file = e.target.files[0];
  console.log(file);

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // console.log(e.target.result);
      imagePreview.src = e.target.result;
      //  console.log(imagePreview.src);
      imagePreview.style.display = 'block'; // Show the image preview
    };
    reader.readAsDataURL(file);
  } else {
    // Reset image preview if no file is selected
    imagePreview.src = '';
    imagePreview.style.display = 'none';
  }
};

const editPreviewImage = function (e) {
  const file = e.target.files[0];
  console.log(file);

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      console.log(e);
      // console.log(e.target.result);
      editPreview.src = e.target.result;
      //  console.log(imagePreview.src);
      editPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    // Reset image preview if no file is selected
    editPreview.src = '';
    editPreview.style.display = 'none';
  }
};

imageInput.addEventListener('change', previewImage);

editImage.addEventListener('change', editPreviewImage);

navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

const handlehover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const target = e.target;

    const links = target.closest('.nav__items').querySelectorAll('.nav__link');
    const logo = target.closest('.nav__items').querySelector('.nav__logo');

    const opacity = this;
    links.forEach(function (el) {
      if (el !== target) {
        //console.log(el);
        el.style.opacity = opacity;
      }
    });
  }
};
navContainer.addEventListener('mouseover', handlehover.bind(0.2));
navContainer.addEventListener('mouseout', handlehover.bind(1));

///creation of project card
const addProject = function (e) {
  e.preventDefault();
  projectNameval = projectName.value.trim();
  projectDesVal = projectDescriptio.value.trim();
  const imageFile = imageInput.files[0];
  const projecturl = projectURL.value.trim();
  // console.log(projecturl);

  if (!isValidURL(projecturl)) {
    alert('Please enter a valid URL!');
    return;
  }

  const imageURL = imageFile ? URL.createObjectURL(imageFile) : null;
  // console.log(imageURL);
  const descriptionArray = projectDesVal.split('\n');
  const descriptionList = descriptionArray
    .map(item => `<li>${item}</li>`)
    .join('');

  if (projectNameval && descriptionArray.length && imageURL && projecturl) {
    createProjectCard(
      projectNameval,
      descriptionArray,
      imageURL,
      projecturl,
      true
    );
    alert('Project Successfully added🎉');
    document.querySelector('#portfolio').scrollIntoView({ behavior: 'smooth' });
    imagePreview.style.display = 'none';
    // imagePreview.src = '';
    form.reset();
  } else {
    console.error('All fields are required, including the image.');
  }
};

const createProjectCard = function (
  name,
  descriptionArray,
  imageURL,
  projectURL,
  saveToLS = true
) {
  const descriptionList = descriptionArray
    .map(item => `<li>${item}</li>`)
    .join('');
  const cardHtml = ` <div class="card">
      <h3>${name.toUpperCase()}</h3>
       <a href="${projectURL}" target = "_blank" class="project-card-url">Project URL</a>
      <img src="${imageURL}" alt="Project Image" class="project-image" />
      <ul class="description-list">
        ${descriptionList} 
      </ul>
      <div class="card-buttons">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
         <button class="download-btn">Download</button>
      </div>
    </div>`;
  containerMovements.insertAdjacentHTML('beforeend', cardHtml);

  if (saveToLS) {
    const cards = getCardsLS();
    cards.push({ name, description: descriptionArray, imageURL, projectURL });
    saveCardsLS(cards);
  }

  const newCard = containerMovements.lastElementChild;
  //console.log(newCard);
  const newdownloadButton = newCard.querySelector('.download-btn');
  newdownloadButton.addEventListener('click', function () {
    const imageUrl = newCard.querySelector('.project-image').src;
    const title = newCard.querySelector('h3').innerText;
    const description = newCard.querySelector('ul').innerText;
    const url = newCard.querySelector('.project-card-url').href;

    // const portfolioSection = document.querySelector('.portfolio');

    const textContent = `<div class="portfolio-heading"><h2>Your Portfolio</h2></div>
        <div class="movements">
          <div class="card">
            <h3 class="project-title">${title}</h3>
            <a href="${url}" target = "_blank" class="project-card-url">Project URL</a>
            <img src="${imageUrl}" alt="Project Image" class="project-image">
            <ul class="description-list">
              <li>${description}</li>
            </ul>
            <div class="card-buttons">
              <button class="edit-btn btn--show-modal">Edit</button>
              <button class="delete-btn">Delete</button>
              <button class="download-btn">Download</button>
            </div>
          </div>
        </div>
      `;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(' ', '/')}.txt`;
    link.click();
  });
};

form.addEventListener('submit', addProject);

//////////////////////////
//editing and deleting the cards

const openModal = function () {
  // e.preventDefault();
  modal.classList.remove('hidden');
  overlaybtn.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlaybtn.classList.add('hidden');
};

containerMovements.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?'
    );
    if (confirmDelete) {
      const card = e.target.closest('.card');
      const cardIndex = Array.from(containerMovements.children).indexOf(card);

      const cards = getCardsLS();
      cards.splice(cardIndex, 1);
      saveCardsLS(cards);
      card.remove();
      alert('Project Successfully deleted✅');
    }
  } else if (e.target.classList.contains('edit-btn')) {
    currentCard = e.target.closest('.card');
    const curTitle = currentCard.querySelector('h3').textContent;
    const curDescription =
      currentCard.querySelector('.description-list').innerText;
    const curImage = currentCard.querySelector('.project-image').src;
    const curURL = currentCard.querySelector('.project-card-url').href;

    editTitle.value = curTitle;
    editDescription.value = curDescription.replace(/<\/?li>/g, '');
    editURL.value = curURL;
    editImage.value = '';
    console.log(curTitle, curDescription, curImage);
    console.log(editImage, editTitle, editDescription);

    openModal();
    btncloseModal.addEventListener('click', closeModal);
    overlaybtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      //   console.log(e.key);
      if (e.key === 'Escape' && !modal.classList.contains('hidden'))
        closeModal();
    });
  }
});

const updateInfo = function (e) {
  e.preventDefault();
  if (currentCard) {
    if (!isValidURL(editURL.value)) {
      alert('Please enter a valid URL!');
      return;
    }
    currentCard.querySelector('h3').textContent = editTitle.value;
    currentCard.querySelector('.project-card-url').href = editURL.value;
    const updatedDescriptionArray = editDescription.value.split('\n');
    const updatedDescriptionHTML = updatedDescriptionArray
      .map(line => `<li>${line}</li>`)
      .join('');
    currentCard.querySelector('.description-list').innerHTML =
      updatedDescriptionHTML;
    if (editImage && editImage.files.length > 0) {
      const updatedImage = editImage.files[0];
      const updatedImageURL = URL.createObjectURL(updatedImage);
      currentCard.querySelector('.project-image').src = updatedImageURL;
    } else {
      alert('No file selected or element not found.');
    }
  }
  const cards = getCardsLS();
  cards[cardIndex] = {
    name: editTitle.value,
    description: updatedDescriptionArray,
    imageURL: currentCard.querySelector('.project-image').src,
    projectURL: editURL.value,
  };
  saveCardsLS(cards);
  alert('Updations Successful✅');
  editPreview.style.display = 'none';
  closeModal();
};

buttonUpdate.addEventListener('click', updateInfo);
