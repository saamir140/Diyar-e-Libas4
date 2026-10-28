
document.addEventListener("DOMContentLoaded", async () => {
  const fallback = {
    name: "Kadhar",
    price: null,
    colors: [
      { id: "colour-01", name: "Colour 01", hex: "#e8dfce", image: "assets/images/colour-01.jpg" },
      { id: "colour-02", name: "Colour 02", hex: "#292929", image: "assets/images/colour-02.jpg" },
      { id: "colour-03", name: "Colour 03", hex: "#26364a", image: "assets/images/colour-03.jpg" },
      { id: "colour-04", name: "Colour 04", hex: "#777a68", image: "assets/images/colour-04.jpg" },
      { id: "colour-05", name: "Colour 05", hex: "#795d49", image: "assets/images/colour-05.jpg" },
      { id: "colour-06", name: "Colour 06", hex: "#f0eee7", image: "assets/images/colour-06.jpg" }
    ]
  };

  let product = fallback;

  try {
    const response = await fetch("content/products.json");
    if (response.ok) {
      const data = await response.json();
      if (data.colors && data.colors.length) product = data;
    }
  } catch (error) {
    console.warn("Using fallback Kadhar product data.");
  }

  const swatches = document.getElementById("swatches");
  const thumbnailList = document.getElementById("thumbnailList");
  const mainImage = document.getElementById("mainProductImage");
  const imageCounter = document.getElementById("imageCounter");
  const selectedName = document.getElementById("selectedColour");
  const selectedProduct = document.getElementById("selectedProduct");
  const colourCount = document.getElementById("colourCount");
  const productPrice = document.getElementById("productPrice");
  const orderButton = document.getElementById("orderButton");

  if (!swatches || !thumbnailList || !mainImage) {
    console.error("Kadhar gallery HTML elements are missing.");
    return;
  }

  let activeColorIndex = 0;
  let activePhotoIndex = 1;

  colourCount.textContent = `${product.colors.length} options`;

  if (product.price) {
    productPrice.textContent = product.price;
  }

  // Example: colour-01 becomes 01.
  function getColorNumber(color) {
    const match = color.id.match(/(\d+)/);
    return match ? match[1].padStart(2, "0") : "01";
  }

  // Each colour has five photos.
  function getPhotoPath(color, photoNumber) {
    const number = getColorNumber(color);
    return `assets/images/colour-${number}-${photoNumber}.jpg`;
  }

  function showPhoto(color, photoNumber, thumbnailButton) {
    activePhotoIndex = photoNumber;

    mainImage.onerror = function () {
      // If the numbered image is missing, try the old single-image file.
      if (!mainImage.dataset.fallbackTried && photoNumber === 1) {
        mainImage.dataset.fallbackTried = "true";
        mainImage.src = color.image;
        return;
      }

      mainImage.style.display = "none";

      let placeholder = document.getElementById("galleryPlaceholder");

      if (!placeholder) {
        placeholder = document.createElement("div");
        placeholder.id = "galleryPlaceholder";
        placeholder.className = "image-placeholder";

        const title = document.createElement("span");
        title.textContent = `${product.name.toUpperCase()} / ${color.name.toUpperCase()}`;

        const note = document.createElement("small");
        note.textContent = "Upload this photo to kadhar/assets/images/";

        placeholder.append(title, note);
        mainImage.parentElement.insertBefore(mainImage, placeholder);
        mainImage.parentElement.insertBefore(placeholder, mainImage);
      }

      placeholder.style.display = "flex";
    };

    mainImage.onload = function () {
      mainImage.style.display = "block";

      const placeholder = document.getElementById("galleryPlaceholder");
      if (placeholder) placeholder.style.display = "none";

      mainImage.dataset.fallbackTried = "";
    };

    mainImage.src = getPhotoPath(color, photoNumber);
    mainImage.alt = `${product.name} ${color.name} — photo ${photoNumber}`;

    imageCounter.textContent =
      `${String(photoNumber).padStart(2, "0")} / 05`;

    thumbnailList.querySelectorAll(".gallery-thumb").forEach((button) => {
      button.classList.toggle("active", button === thumbnailButton);
      button.setAttribute("aria-pressed", String(button === thumbnailButton));
    });
  }

  function selectColor(color, index) {
    activeColorIndex = index;
    activePhotoIndex = 1;

    selectedName.textContent = color.name;
    selectedProduct.textContent = `Selected option: ${color.name}`;

    swatches.querySelectorAll("button").forEach((button, buttonIndex) => {
      button.setAttribute("aria-pressed", String(buttonIndex === index));
    });

    // Rebuild the five vertical thumbnails for the selected colour.
    thumbnailList.innerHTML = "";

    for (let photoNumber = 1; photoNumber <= 5; photoNumber++) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-thumb";
      button.setAttribute("aria-label", `${color.name}, photo ${photoNumber}`);
      button.setAttribute("aria-pressed", String(photoNumber === 1));

      const image = document.createElement("img");
      image.src = getPhotoPath(color, photoNumber);
      image.alt = `${color.name}, product photo ${photoNumber}`;
      image.loading = photoNumber === 1 ? "eager" : "lazy";

      image.onerror = () => {
        button.style.display = "none";
      };

      button.appendChild(image);

      button.addEventListener("click", () => {
        showPhoto(color, photoNumber, button);
      });

      thumbnailList.appendChild(button);
    }

    const firstThumbnail = thumbnailList.querySelector(".gallery-thumb");
    showPhoto(color, 1, firstThumbnail);
  }

  // Build the colour swatches.
  swatches.innerHTML = "";

  product.colors.forEach((color, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `Select ${color.name}`);

    const circle = document.createElement("span");
    circle.className = "swatch-colour";
    circle.style.backgroundColor = color.hex;

    const label = document.createElement("span");
    label.textContent = color.name;

    button.append(circle, label);
    button.addEventListener("click", () => selectColor(color, index));

    swatches.appendChild(button);
  });

  if (product.colors.length) {
    selectColor(product.colors[0], 0);
  }

  const yearElement = document.querySelector(".year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (orderButton) {
    orderButton.addEventListener("click", () => {
      alert("Ordering will be enabled after the checkout and order process is configured.");
    });
  }
});
