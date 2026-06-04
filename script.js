const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const unlockRackBtn = document.getElementById("unlockRackBtn");
const rackPanel = document.getElementById("rackPanel");
const contactForm = document.getElementById("contactForm");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

unlockRackBtn.addEventListener("click", () => {
  rackPanel.classList.toggle("active");

  if (rackPanel.classList.contains("active")) {
    unlockRackBtn.textContent = "Hide The Hidden Rack";
  } else {
    unlockRackBtn.textContent = "Unlock The Hidden Rack";
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent("Rack & Render Business Enquiry");
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  );

  window.location.href = `mailto:info@racknrender.com?subject=${subject}&body=${body}`;
});
