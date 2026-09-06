const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const siteHeader = document.getElementById("siteHeader");

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const tabs = document.querySelectorAll(".search-tab");
const purposeInput = document.getElementById("searchPurpose");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    purposeInput.value = tab.dataset.purpose;
  });
});

const toast = document.getElementById("toast");
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

document.getElementById("quickSearchForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const purpose = data.get("purpose");
  const location = data.get("location") || "your preferred location";
  showToast(`We'll help you explore ${purpose.toLowerCase()} options around ${location}.`);
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll(".listing-enquire").forEach(button => {
  button.addEventListener("click", () => {
    const message = leadForm?.querySelector('textarea[name="message"]');
    if (message) message.value = `I am interested in: ${button.dataset.property}. Please share more details.`;
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const leadForm = document.getElementById("leadForm");
const successMessage = document.getElementById("successMessage");

leadForm?.addEventListener("submit", event => {
  event.preventDefault();

  const data = new FormData(leadForm);
  const phone = String(data.get("phone") || "").replace(/\D/g, "");

  if (phone.length < 10) {
    showToast("Please enter a valid phone number.");
    return;
  }

  // Demo frontend flow:
  // Connect this submit handler to your backend, Google Sheets, n8n webhook,
  // Formspree, or another CRM endpoint when you are ready.
  successMessage.classList.add("show");
  leadForm.reset();
  showToast("Your property request has been submitted.");
});

let lastScrollY = window.scrollY;
const scrollThreshold = 8;

window.addEventListener("scroll", () => {
  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;

  // Keep navbar visible near the top
  if (currentY <= 80) {
    siteHeader?.classList.remove("header-hidden");
  }

  // Scroll down → hide navbar
  else if (
    delta > scrollThreshold &&
    !mobileMenu?.classList.contains("open")
  ) {
    siteHeader?.classList.add("header-hidden");
  }

  // Scroll up → show navbar
  else if (delta < -scrollThreshold) {
    siteHeader?.classList.remove("header-hidden");
  }

  lastScrollY = currentY;
}, { passive: true });
