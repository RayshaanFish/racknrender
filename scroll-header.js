let lastScrollTop = 0;
let header = document.querySelector("header");
let scrollUpThreshold = 150;
let scrollUpDistance = 0;

window.addEventListener("scroll", function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Scrolling down → hide header instantly
    header.classList.remove("show");
    header.classList.add("hide");
    scrollUpDistance = 0;
  } else {
    // Scrolling up → wait until threshold reached
    scrollUpDistance += lastScrollTop - scrollTop;
    if (scrollUpDistance > scrollUpThreshold) {
      header.classList.remove("hide");
      header.classList.add("show");
    }
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
