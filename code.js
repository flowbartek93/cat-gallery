class CreateGallery {
  constructor(container) {
    this.mainContainer = container;

    this.cancelBtn = document.querySelector(".overlay-cancel");
    this.overlay = document.querySelector(".overlay");
    this.interfaceContainer = document.querySelector(".wrapper");
    this.topContainer = document.querySelector(".top-container");
    this.thumbnails = document.querySelector(".bottom-images");

    this.currentIndex = null;
    this.images = [];
    this.events();
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
    const allImages = document.querySelectorAll(".img");

    allImages.forEach((img, index) => {
      img.addEventListener("click", () => {
        console.log(img);
        const source = img.src;
        const bigImage = this.createDOMElement("img", "big-image");
        bigImage.src = source;

        this.currentIndex = index + 1;
        console.log(this.currentIndex);

        this.appendDOMElement(this.topContainer, bigImage);
        this.createInterface(source);
      });
    });
  }

  createInterface(source) {
    this.overlay.classList.add("active");
    this.interfaceContainer.classList.add("active");
    this.cancelBtn.classList.add("active");
    document.body.classList.add("active");

    this.overlay.style.backgroundImage = `url(${source})`;

    this.displayThumbnails();
    this.buttons();
    this.closeInterface();
  }

  closeInterface() {
    this.cancelBtn.addEventListener("click", () => {
      this.overlay.classList.remove("active");
      this.interfaceContainer.classList.remove("active");
      this.cancelBtn.classList.remove("active");
      document.body.classList.remove("active");
      this.overlay.removeAttribute("style");
      this.topContainer.lastElementChild.remove();
    });
  }

  buttons() {
    const nextBtn = document.querySelector(".right-arrow");
    const prevBtn = document.querySelector(".left-arrow");

    nextBtn.addEventListener("click", () => {
      this.goToNext();
    });
    prevBtn.addEventListener("click", () => {
      this.goToPrev();
    });
  }

  goToNext() {
    this.currentIndex++;

    this.topContainer.querySelector("img").src = `${this.images[this.currentIndex].url}`;
  }

  goToPrev() {
    this.currentIndex--;
    this.topContainer.querySelector("img").src = `${this.images[this.currentIndex].url}`;
  }

  displayThumbnails() {
    this.images.forEach((image) => {
      const thumbnail = this.createDOMElement("div", "thumbnail");
      thumbnail.style.backgroundImage = `url(${image.url})`;
      this.appendDOMElement(this.thumbnails, thumbnail);
    });
  }

  setThumbnailsContainerWidth() {}

  events() {
    this.fetchCats();
  }
}

// switchImage() {
//   const arrowBtns = document.querySelectorAll(".arrow");

//   arrowBtns.forEach((btn) => {
//     btn.addEventListener("click", (e) => {
//       let clickedElement = e.target.parentElement;

//       //W prawo
//       if (clickedElement.classList.contains("right-arrow")) {
//         if (this.currentIndex >= this.images.length - 1) {
//           this.currentIndex = 0;
//           this.topContainer.querySelector("img").src = `${this.cats[this.currentIndex].url}`;
//           this.bottomImages.children[this.currentIndex].classList.add("active");
//           this.bottomImages.children[this.images.length - 1].classList.remove("active");
//         } else {
//           this.currentIndex++;

//           this.topContainer.querySelector("img").src = `${this.cats[this.currentIndex].url}`;

//           this.bottomImages.children[this.currentIndex].classList.add("active");
//           this.bottomImages.children[this.currentIndex - 1].classList.remove("active");
//         }

//         this.moveImages();
//       }

//       //W lewoo

//       if (clickedElement.classList.contains("left-arrow")) {
//         if (this.currentIndex === 0) {
//           console.log(this.bottomImages.children);
//           this.currentIndex = this.bottomImages.children.length - 1;
//           console.log(this.currentIndex);
//           this.topContainer.querySelector("img").src = `${this.cats[this.currentIndex].url}`;

//           this.bottomImages.children[this.currentIndex].classList.add("active");
//           this.bottomImages.children[0].classList.remove("active");
//         } else {
//           this.currentIndex--;

//           this.topContainer.querySelector("img").src = `${this.cats[this.currentIndex].url}`;

//           this.bottomImages.children[this.currentIndex].classList.add("active");
//           this.bottomImages.children[this.currentIndex + 1].classList.remove("active");
//         }

//         this.moveImages();
//       }
//     });
//   });
// }

// switchByThumbnail() {
//   console.log(this.bottomImages);
//   this.bottomImages.childNodes.forEach((thmb, index) => {
//     thmb.addEventListener("click", (e) => {
//       let thumbnailUrlStyle = e.target.style.backgroundImage.split('"')[1];
//       console.log(thumbnailUrlStyle);

//       this.bottomImages.children[index].classList.add("active");
//       this.bottomImages.children[this.currentIndex].classList.remove("active");
//       this.topContainer.querySelector("img").src = thumbnailUrlStyle;

//       this.currentIndex = index;
//     });
//   });
// }

// moveImages() {
//   const oczko = 190;
//   const thumbnails = [...this.bottomImages.children];
//   if (this.currentIndex < 4) {
//     console.log("przesuwam");
//     thumbnails.forEach((thmb) => {
//       thmb.style.left = oczko * 4 + "px";
//     });
//   }
// }

// closeInterface() {
//   const closeGallery = () => {
//     this.overlay.classList.toggle("active");
//     document.body.classList.toggle("active");
//     this.cancelBtn.classList.toggle("active");
//     this.wrapper.classList.toggle("active");

//     while (this.bottomImages.hasChildNodes()) {
//       this.bottomImages.lastElementChild.remove();
//     }
//     this.topContainer.querySelector("img").remove();
//     this.cancelBtn.removeEventListener("click", closeGallery);
//   };

//   this.cancelBtn.addEventListener("click", closeGallery);
// }

const createGallery = new CreateGallery(document.querySelector(".gallery"));
