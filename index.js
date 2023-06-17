const spinner = document.querySelector(".spinner");
const errMessage = document.querySelector(".err-message");
const layoutContainer = document.querySelector(".layout-container");
const loadMoreBtn = document.querySelector(".load-more-btn");
const switchModeBtn = document.querySelector(".slider");
const checkbox = document.querySelector(".switch input");
const imageLightboxContainer = document.querySelector(
  ".image-lightbox-container"
);
const imageLightbox = document.querySelector(".image-lightbox-container img");
const darkenedBackground = document.querySelector(".darkened");
const mainContainer = document.querySelector(".main");
const xMark = document.querySelector(".fa-xmark");

const socialMediaPosts = [];
let page = 1;

const isCheckedLS = localStorage.getItem('isCheckboxChecked')
const isChecked = JSON.parse(isCheckedLS)
isCheckedLS ? checkbox.checked = isChecked : false

  if (isChecked) {
    mainContainer.classList.add("dark-mode")
  } else {
    mainContainer.classList.remove("dark-mode")
  }


// Format numbers with commas
const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format date function
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const currentDate = new Date();

  const timeDiff = currentDate.getTime() - date.getTime();

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (days <= 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  if (days > 7 && weeks < 4) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  if (months <= 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  return `${years} year${years === 1 ? "" : "s"} ago`;
}

// Function for closing lightbox
const closeLightbox = (e) => {
  e.target.parentElement.style.display = "none";
};

// Function that gets the number of posts depending on the value of page
const getFeedPostsResults = function (page, array) {
  const start = (page - 1) * 4;
  const end = page * 4;

  return array.slice(start, end);
};

// Fetching the feed posts
const fetchData = async () => {
  loadMoreBtn.style.display = "none";
  spinner.style.display = "inline-block";
  try {
    const res = await fetch("./data.json");
    const data = await res.json();
    data.forEach((o) => {
      socialMediaPosts.push(o);
    });

    renderFeedPosts(getFeedPostsResults(page, socialMediaPosts));
    errMessage.style.display = "none";
    loadMoreBtn.style.display = "inline-block";
    spinner.style.display = "none";
  } catch (err) {
    loadMoreBtn.style.display = "none";
    errMessage.style.display = "block";
    spinner.style.display = "none";
    console.error("Something bad happened");
  }
};

fetchData();


// Function that renders the feed posts
const renderFeedPosts = (posts) => {
  posts.forEach((post) => {
    const { image, caption, likes, profile_image, name, date } = post;
    const card = document.createElement("div");
    const cardHeader = document.createElement("div");

    const img = document.createElement("img");
    const captionText = document.createElement("p");
    const likesText = document.createElement("p");
    const actionContainer = document.createElement("div");

    img.src = image;
    captionText.textContent = caption;
    likes.textContent = likes;
    const formattedLikes = formatNumberWithCommas(likes);
    likesText.textContent = `${formatNumberWithCommas(likes)} like${
      formattedLikes === "1" ? "" : "s"
    }`;

    img.classList.add("card-image");
    card.classList.add("post-card");
    captionText.classList.add("card-caption");

    cardHeader.classList.add("card-header");
    likesText.classList.add("card-likes");
    actionContainer.classList.add("card-actions");

    actionContainer.innerHTML = `
    <i class="fa-regular fa-heart card-action"></i>
    <i class="fa-regular fa-comment card-action"></i>
    <i class="fa-regular fa-paper-plane card-action"></i>
    `;

    cardHeader.innerHTML = `
    <img src="${profile_image}" class="profile-picture"/>
    <div>
    <p class="card-name">${name}</p>
    <p class="card-date">${formatDate(date)}</p>
    </div>
    `;

    img.addEventListener("click", () => {
      imageLightboxContainer.style.display = "flex";
      imageLightbox.src = image;
    });

    card.append(cardHeader, img, actionContainer, likesText, captionText);

    layoutContainer.appendChild(card);
  });
};

// Load more button
loadMoreBtn.addEventListener("click", (e) => {
  page++;

  if (page >= Math.ceil(socialMediaPosts.length / 4)) {
    e.target.parentElement.remove();
  }

  renderFeedPosts(getFeedPostsResults(page, socialMediaPosts));
});

// Close lightbox container
darkenedBackground.addEventListener("click", closeLightbox);
xMark.addEventListener("click", closeLightbox);

// Button for switching mode
switchModeBtn.addEventListener("click", (e) => {
  mainContainer.classList.toggle("dark-mode");
  const isChecked = checkbox.checked
  localStorage.setItem('isCheckboxChecked', JSON.stringify(!isChecked))
 
});

// Example usage
