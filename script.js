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

/* =========================================
   AI PROPERTY ASSISTANT → n8n WEBHOOK
========================================= */
const PROPERTY_CHAT_SESSION =
  localStorage.getItem("rawat_chat_session") ||
  crypto.randomUUID();

localStorage.setItem(
  "rawat_chat_session",
  PROPERTY_CHAT_SESSION
);
const PROPERTY_CHAT_WEBHOOK = "https://n8n.srv1126131.hstgr.cloud/webhook/rawat-property-search";
const propertyChatToggle = document.getElementById("propertyChatToggle");
const propertyChat = document.getElementById("propertyChat");
const propertyChatClose = document.getElementById("propertyChatClose");
const propertyChatForm = document.getElementById("propertyChatForm");
const propertyChatInput = document.getElementById("propertyChatInput");
const propertyChatSend = document.getElementById("propertyChatSend");
const propertyChatMessages = document.getElementById("propertyChatMessages");

function setPropertyChat(open) {
  if (!propertyChat || !propertyChatToggle) return;

  propertyChat.classList.toggle("open", open);
  propertyChat.setAttribute("aria-hidden", String(!open));
  propertyChatToggle.setAttribute("aria-expanded", String(open));

  if (open) {
    window.setTimeout(() => propertyChatInput?.focus(), 120);
  }
}

function addPropertyChatMessage(text, sender = "assistant") {
  if (!propertyChatMessages) return null;

  const wrapper = document.createElement("div");
  wrapper.className = `chat-message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.innerHTML = String(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

  wrapper.appendChild(bubble);
  propertyChatMessages.appendChild(wrapper);
  propertyChatMessages.scrollTop = propertyChatMessages.scrollHeight;

  return wrapper;
}

function addPropertyCards(properties) {
  if (!propertyChatMessages || !Array.isArray(properties)) return;

  properties.forEach(property => {
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message assistant property-result";

    const card = document.createElement("div");
    card.className = "property-chat-card";

    const images =
      Array.isArray(property.image_urls) && property.image_urls.length > 0
        ? property.image_urls
        : [];

    if (images.length > 0) {
  const gallery = document.createElement("div");

  gallery.className = "property-chat-gallery";

  gallery.style.display = "grid";
  gallery.style.gridTemplateColumns = "2fr 1fr";
  gallery.style.gridTemplateRows = "90px 90px";
  gallery.style.gap = "4px";
  gallery.style.width = "100%";
  gallery.style.height = "184px";
  gallery.style.overflow = "hidden";

  images.slice(0, 3).forEach((url, index) => {
    const image = document.createElement("img");

    image.src = url;

    image.alt =
      `${property.title || "Property image"} ${index + 1}`;

    image.loading = "lazy";

    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";
    image.style.display = "block";

    if (index === 0) {
      image.style.gridRow = "1 / 3";
    }

    gallery.appendChild(image);
  });

  card.appendChild(gallery);
}

    const content = document.createElement("div");
    content.className = "property-chat-card-content";

    const code = document.createElement("div");
    code.className = "property-chat-code";
    code.textContent = property.property_code || "";
    content.appendChild(code);

    const title = document.createElement("h3");
    title.textContent = property.title || "Property";
    content.appendChild(title);

    const location = document.createElement("div");
    location.className = "property-chat-location";
    location.textContent = `📍 ${property.locality || ""}, ${property.city || ""}`;
    content.appendChild(location);

    const details = document.createElement("div");
    details.className = "property-chat-details";
    details.textContent =
      `${property.bhk ?? property.bedrooms ?? "-"} BHK · ` +
      `${property.bathrooms ?? "-"} Baths · ` +
      `${property.area ?? property.area_sqft ?? "-"} sq.ft.`;
    content.appendChild(details);

    const price = document.createElement("div");
    price.className = "property-chat-price";
    price.textContent = property.price || property.price_label || "Price on request";
    content.appendChild(price);

    const status = document.createElement("div");
    status.className = "property-chat-status";
    status.textContent = property.status || "";
    content.appendChild(status);

    card.appendChild(content);
    wrapper.appendChild(card);
    propertyChatMessages.appendChild(wrapper);
  });

  propertyChatMessages.scrollTop = propertyChatMessages.scrollHeight;
}

propertyChatToggle?.addEventListener("click", () => {
  setPropertyChat(!propertyChat?.classList.contains("open"));
});

propertyChatClose?.addEventListener("click", () => {
  setPropertyChat(false);
});

propertyChatForm?.addEventListener("submit", async event => {
  event.preventDefault();

  const message = String(propertyChatInput?.value || "").trim();
  if (!message) return;

  addPropertyChatMessage(message, "user");

  propertyChatInput.value = "";
  propertyChatInput.disabled = true;
  propertyChatSend.disabled = true;

  const typingMessage = addPropertyChatMessage("Just a moment…", "typing");

  try {
    const response = await fetch(PROPERTY_CHAT_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  message,
  sessionId: PROPERTY_CHAT_SESSION
})
    });

    const responseText = await response.text();

    console.log("RAW n8n RESPONSE:", responseText);

    typingMessage?.remove();

    if (!response.ok) {
      throw new Error(`Webhook returned HTTP ${response.status}`);
    }

    let reply = "Sorry, I couldn't understand the assistant response.";
    let propertyData = null;

    if (responseText.trim()) {
      try {
        const result = JSON.parse(responseText);

        propertyData =
          result?.property?.output ||
          result?.output ||
          result?.data?.output ||
          result;

        if (typeof propertyData === "string") {
          try {
            propertyData = JSON.parse(propertyData);
          } catch {
            // Keep it as text if it is not JSON
          }
        }

        const possibleReply =
          propertyData?.reply ||
          result?.reply ||
          result?.message ||
          result?.text;

        if (possibleReply) {
          reply = String(possibleReply);
        }
      } catch {
        reply = responseText.trim();
      }
    }

    addPropertyChatMessage(reply, "assistant");

    if (
      Array.isArray(propertyData?.properties) &&
      propertyData.properties.length > 0
    ) {
      addPropertyCards(propertyData.properties);
    }
  } catch (error) {
    typingMessage?.remove();

    console.error("Rawat Properties chatbot error:", error);

    addPropertyChatMessage(
      "I couldn't connect to the property assistant right now. Please try again in a moment.",
      "assistant"
    );
  } finally {
    propertyChatInput.disabled = false;
    propertyChatSend.disabled = false;
    propertyChatInput.focus();
  }
});
