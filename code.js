class Gallery {
  constructor(images) {
    this.images = [...images];
    this.events();
    this.cats = [];

    this.body = document.querySelector("body");
    this.cancelBtn = document.querySelector(".overlay-cancel");
    this.overlay = document.querySelector(".overlay");
    this.wrapper = document.querySelector(".wrapper");
    this.topContainer = document.querySelector(".top-container");
    this.bottomContainer = document.querySelector(".bottom-container");
    this.bottomImages = document.querySelector(".bottom-images");

    this.currentIndex = null;
  }

  async fetchCats() {
    const url = `https://api.thecatapi.com/v1/images/search?limit=8&mime_types=jpg`;

    const response = await fetch(url, {
      headers: {
        api_key: "c1db2d2d-f2ca-4d3b-a721-20ffcaff01b6",
        limit: "10",
      },
    });
    const cats = await response.json();
    this.cats = cats;

    this.setImages();

    console.log(this.cats);
  }

  setImages() {
    let array = [...this.images];

    array.forEach((img, index) => {
      img.firstElementChild.src = `${this.cats[index].url}`;
    });
  }

  events() {
    this.fetchCats();
    this.showImage();
    this.switchImage();
  }

  showImage() {
    this.images.forEach((image, index) => {
      image.addEventListener("click", () => {
        const url = image.firstElementChild.src;
        this.currentIndex = index;
        const imgElement = document.createElement("img");
        this.topContainer.appendChild(imgElement);
        imgElement.src = url;

        this.createInterface(url);
        console.log(this.bottomImages.children);
      });
    });
  }

  switchImage() {
    const arrowBtns = document.querySelectorAll(".arrow");

    arrowBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let clickedElement = e.target.parentElement;

        //W prawo
        if (clickedElement.classList.contains("right-arrow")) {
          if (this.currentIndex >= this.images.length - 1) {
            this.currentIndex = 0;
            this.topContainer.querySelector("img").src = `${this.cats[this.currentIndex].url}`;
            this.bottomImages.children[this.currentIndex].classList.add("active");
            this.bottomImages.children[this.images.length - 1].classList.remove("active");
          } else {
            this.currentIndex++;

            this.topContainer.querySelector("img").src = `${this.cats[this.currentIndex].url}`;

            this.bottomImages.children[this.currentIndex].classList.add("active");
            this.bottomImages.children[this.currentIndex - 1].classList.remove("active");
          }
        }

        //W lewoo

        if (clickedElement.classList.contains("left-arrow")) {
          if (this.currentIndex === 0) {
            console.log(this.bottomImages.children);
            this.currentIndex = this.bottomImages.children.length - 1;
            console.log(this.currentIndex);
            this.topContainer.querySelector("img").src = `${this.cats[this.currentIndex].url}`;

            this.bottomImages.children[this.currentIndex].classList.add("active");
            this.bottomImages.children[0].classList.remove("active");
          } else {
            this.currentIndex--;

            this.topContainer.querySelector("img").src = `${this.cats[this.currentIndex].url}`;

            this.bottomImages.children[this.currentIndex].classList.add("active");
            this.bottomImages.children[this.currentIndex + 1].classList.remove("active");
          }
        }
      });
    });
  }

  switchByThumbnail() {
    console.log(this.bottomImages);
    this.bottomImages.childNodes.forEach((thmb, index) => {
      thmb.addEventListener("click", (e) => {
        let thumbnailUrlStyle = e.target.style.backgroundImage.split('"')[1];
        console.log(thumbnailUrlStyle);

        this.bottomImages.children[index].classList.add("active");
        this.bottomImages.children[this.currentIndex].classList.remove("active");
        this.topContainer.querySelector("img").src = thumbnailUrlStyle;

        this.currentIndex = index;
      });
    });
  }

  createInterface(url) {
    this.overlay.classList.toggle("active");
    document.body.classList.toggle("active");
    this.overlay.style.backgroundImage = `url(${url})`;
    this.cancelBtn.classList.toggle("active");
    this.wrapper.classList.toggle("active");

    // create thumbnails interface

    this.images.forEach((image) => {
      const divElement = document.createElement("div");
      divElement.style.backgroundImage = `url(${image.firstElementChild.src})`;
      divElement.classList.add("thumbnail");
      this.bottomImages.appendChild(divElement);
    });

    this.bottomImages.children[this.currentIndex].classList.add("active");

    this.switchByThumbnail();
    this.closeInterface();
  }

  closeInterface() {
    const closeGallery = () => {
      this.overlay.classList.toggle("active");
      document.body.classList.toggle("active");
      this.cancelBtn.classList.toggle("active");
      this.wrapper.classList.toggle("active");

      while (this.bottomImages.hasChildNodes()) {
        this.bottomImages.lastElementChild.remove();
      }
      this.topContainer.querySelector("img").remove();
      this.cancelBtn.removeEventListener("click", closeGallery);
    };

    this.cancelBtn.addEventListener("click", closeGallery);
  }
}

const run = new Gallery(document.querySelectorAll(".gallery-img"));
