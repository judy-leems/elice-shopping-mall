let curPos = 0;
let postion = 0;
const imageWidth = 1000;
const slideIndex = 0;

const $prevButton = document.querySelector('.prev');
const $nextButton = document.querySelector('.next');

const $slideWrapper = document.querySelector('.home-slideshow');
const $slider = document.querySelector('.slideshow');
const $slides = document.querySelectorAll('.slide');

const totalSlides = $slides.length;
const sliderWidth = $slideWrapper.clientWidth;
$slider.style.width = sliderWidth * totalSlides + 'px';

function showSlides() {
  for (let i = 0; i < $slides.length; i++) {
    // sliderWidth.style.left = -(sliderWidth * slideIndex) + 'px';

    sliderWidth.style.transform = `translateX(-${sliderWidth * slideIndex}px)`;
  }
  slideIndex++;
  if (slideIndex === totalSlides) {
    slideIndex = 0;
  }
  setTimeout(showSlides, 2000);
}

function prev() {
  if (curPos > 0) {
    $nextButton.removeAttribute('disabled');
    postion += imageWidth;
    $slider.style.transform = `translateX(${postion}px)`;
    curPos = curPos - 1;
  }
  if (curPos == 0) {
    $prevButton.setAttribute('disabled', 'true');
  }
}

function next() {
  if (curPos < 1) {
    $prevButton.removeAttribute('disabled');
    postion -= imageWidth;
    $slider.style.transform = `translateX(${postion}px)`;
    curPos = curPos + 1;
  }
  if (curPos == 1) {
    $nextButton.setAttribute('disabled', 'true');
  }
}

function buttonSlide() {
  $prevButton.setAttribute('disabled', 'true');
  $prevButton.addEventListener('click', prev);
  $nextButton.addEventListener('click', next);
}

buttonSlide();
showSlides();
