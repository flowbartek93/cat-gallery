class CreateGallery {
  constructor(container) {
    this.mainContainer = container;

    this.cancelBtn = document.querySelector(".overlay-cancel");
    this.overlay = document.querySelector(".overlay");
    this.interfaceContainer = document.querySelector(".wrapper");
    this.topContainer = document.querySelector(".top-container");
    this.images = [];
    this.events();

    //thumbnails properties
    this.thumbnailsContainer = document.querySelector(".bottom-images");

    this.thumbnailPosition = 0;
    this.thumbnailsToDisplay = 10; // how many thumbnails I want to be visible;
    this.oneNotch;
    this.currentIndex = null;
    this.overflow = null;

    this.nextBtn = document.querySelector(".right-arrow");
    this.prevBtn = document.querySelector(".left-arrow");
  }

  async fetchCats() {
    const limit = 15;
    const url = `https://api.thecatapi.com/v1/images/search?limit=${limit}&mime_types=jpg`;

    const response = await fetch(url, {
      headers: {
        api_key: "c1db2d2d-f2ca-4d3b-a721-20ffcaff01b6",
      },
    });
    this.images = await response.json();

    this.displayContentFromArray(this.images);
  }

  createDOMElement(element, className) {
    const el = document.createElement(element);
    el.setAttribute("class", className);
    return el;
  }

  appendDOMElement(parent, element) {
    const child = parent.appendChild(element);
    return child;
  }

  displayContentFromArray(array) {
    array.forEach((item, index) => {
      const img = this.createDOMElement("img", `img img-${index + 1}`);
      img.src = item.url;
      img.id = index + 1;
      this.appendDOMElement(this.mainContainer, img);
    });

    this.showImage(); // Select all images // Append Listeners to all img's
  }

  showImage() {
    const allImages = document.querySelectorAll(".img"); // elements that have been already appended into its container - it has nothing to do with this.images[]

    allImages.forEach((img, index) => {
      img.addEventListener("click", () => {
        const source = img.src;
        const bigImage = this.createDOMElement("img", "big-image");
        bigImage.src = source;

        this.currentIndex = index + 1;

        this.appendDOMElement(this.topContainer, bigImage);

        this.createInterface(source); //displaying big image follows with creating entire interface with thumbnails etc.
      });
    });
  }

  displayThumbnails() {
    this.images.forEach((image, index) => {
      const thumbnail = this.createDOMElement("div", "thumbnail");
      thumbnail.style.backgroundImage = `url(${image.url})`;
      this.appendDOMElement(this.thumbnailsContainer, thumbnail);
    });
  }

  createInterface(source) {
    this.overlay.classList.add("active");
    this.interfaceContainer.classList.add("active");
    this.cancelBtn.classList.add("active");
    document.body.classList.add("active");

    this.overlay.style.backgroundImage = `url(${source})`;

    this.displayThumbnails();
    this.setThumbnailsContainerWidth(this.images.length);
    this.goToNext();
    this.goToPrev();
    this.selectThumbnail();
    this.closeInterface();
  }

  setThumbnailsContainerWidth() {
    this.oneNotch = document.querySelector(".thumbnail").getBoundingClientRect().width; // getting width of single thumbnail. Imprtant value to properly scroll
    const entireWidth = this.oneNotch * this.thumbnailsToDisplay;
    this.thumbnailsContainer.style.maxWidth = entireWidth;

    this.setThumbnailsPosition();
  }

  checkThumbnailPosition() {
    let isVisible;
    if (this.currentIndex > this.thumbnailsToDisplay) {
      isVisible = false;
    } else {
      isVisible = true;
    }
    return isVisible;
  }

  setThumbnailsPosition(change) {
    const isVisible = this.checkThumbnailPosition();
    const thumbnails = document.querySelectorAll(".thumbnail");

    let newLeftValue;

    //checking
    if (!isVisible && !change) {
      newLeftValue = -(this.currentIndex - this.thumbnailsToDisplay) * this.oneNotch;
      this.setPositionLeft(thumbnails, newLeftValue);
    }

    //Runs when prevbtn or nextbtn are fired
    if (change) {
      let styleValue = window.getComputedStyle(this.thumbnailsContainer.children[0]);
      let leftValue = parseInt(styleValue.left);
      let maxNotches = this.images.length - this.thumbnailsToDisplay;
      let maxNextValue = -(maxNotches * this.oneNotch);
      let maxPrevValue = 0;

      if (change.classList.contains("fa-angle-right")) {
        if (leftValue === maxNextValue) {
          newLeftValue = 0;
          this.setPositionLeft(thumbnails, newLeftValue);
        } else {
          newLeftValue = leftValue - this.oneNotch;
          this.setPositionLeft(thumbnails, newLeftValue);
        }
      } else if (change.classList.contains("fa-angle-left")) {
        if (leftValue === maxPrevValue) {
          console.log("1");
          newLeftValue = maxNextValue;
          this.setPositionLeft(thumbnails, newLeftValue);
        } else {
          console.log("2");
          newLeftValue = leftValue + this.oneNotch;
          this.setPositionLeft(thumbnails, newLeftValue);
        }
      }
    }
  }

  setPositionLeft(array, newValue) {
    return array.forEach((thumbnail) => {
      thumbnail.style.left = newValue;
    });
  }

  selectThumbnail() {
    const thumbnails = document.querySelectorAll(".thumbnail");
    const currentImage = document.querySelector(".big-image");
    thumbnails.forEach((thmb, index) => {
      thmb.addEventListener("click", (e) => {
        console.log(e.target);

        const url = e.target.style.backgroundImage;
        const src = url.split('"')[1];
        currentImage.src = src;

        this.currentIndex = index + 1;
        console.log(this.currentIndex);
      });
    });
  }

  goToNext() {
    this.nextBtn.addEventListener("click", (e) => {
      if (this.currentIndex > this.images.length - 1) {
        this.currentIndex = 0;
      }
      this.currentIndex++;
      this.topContainer.querySelector("img").src = `${this.images[this.currentIndex - 1].url}`;
      this.setThumbnailsPosition(e.target);
    });
  }

  goToPrev() {
    this.prevBtn.addEventListener("click", (e) => {
      this.currentIndex--;
      if (this.currentIndex < 1) {
        this.currentIndex = this.images.length;
      }
      this.topContainer.querySelector("img").src = `${this.images[this.currentIndex - 1].url}`;
      this.setThumbnailsPosition(e.target);
    });
  }

  closeInterface() {
    this.cancelBtn.addEventListener("click", () => {
      this.overlay.classList.remove("active");
      this.interfaceContainer.classList.remove("active");
      this.cancelBtn.classList.remove("active");
      document.body.classList.remove("active");
      this.overlay.removeAttribute("style");

      //remove top image

      if (this.topContainer.contains(document.querySelector(".big-image"))) {
        document.querySelector(".big-image").remove();
      }

      //remove all thumbnails
      while (this.thumbnailsContainer.hasChildNodes()) {
        this.thumbnailsContainer.removeChild(this.thumbnailsContainer.firstElementChild);
      }
    });
  }

  events() {
    this.fetchCats();
  }
}

const createGallery = new CreateGallery(document.querySelector(".gallery"));
