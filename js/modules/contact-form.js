/**
 * Contact form — validation, intent chips, char count, success state.
 */

import { qs, qsa } from "../utils/dom.js";

function setFieldError(field, message) {
  const errorId = `${field.id}-error`;
  let errorEl = document.getElementById(errorId);
  const host = field.closest(".form__field") || field.parentElement;

  if (!errorEl) {
    errorEl = document.createElement("p");
    errorEl.id = errorId;
    errorEl.className = "form__error";
    host?.appendChild(errorEl);
  }

  errorEl.textContent = message;
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", errorId);
}

function clearFieldError(field) {
  const errorId = `${field.id}-error`;
  const errorEl = document.getElementById(errorId);

  if (errorEl) {
    errorEl.remove();
  }

  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
}

function initIntentChips(form) {
  const subject = qs("[data-subject]", form);
  const chips = qsa("[data-intent]");

  if (!subject || !chips.length) {
    return;
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const value = chip.getAttribute("data-intent") || "";
      subject.value = value;
      subject.dispatchEvent(new Event("input", { bubbles: true }));
      chips.forEach((item) => item.classList.toggle("is-active", item === chip));
      subject.focus();
    });
  });
}

function initCharCount(form) {
  const message = qs("[data-message]", form);
  const counter = qs("[data-char-count]", form);

  if (!message || !counter) {
    return;
  }

  const max = Number(message.getAttribute("maxlength")) || 1200;

  const update = () => {
    counter.textContent = `${message.value.length} / ${max}`;
  };

  message.addEventListener("input", update);
  update();
}

function showSuccess(form) {
  const body = qs("[data-form-body]", form);
  const success = qs("[data-form-success]", form);

  if (body) {
    body.hidden = true;
  }

  if (success) {
    success.hidden = false;
  }
}

function hideSuccess(form) {
  const body = qs("[data-form-body]", form);
  const success = qs("[data-form-success]", form);

  if (body) {
    body.hidden = false;
  }

  if (success) {
    success.hidden = true;
  }
}

export function initContactForm() {
  const form = qs("[data-contact-form]");

  if (!form) {
    return;
  }

  initIntentChips(form);
  initCharCount(form);

  const resetBtn = qs("[data-form-reset]", form);
  resetBtn?.addEventListener("click", () => {
    hideSuccess(form);
    form.reset();
    qsa("[data-intent]").forEach((chip) => chip.classList.remove("is-active"));
    qs("[data-message]", form)?.dispatchEvent(new Event("input"));
    qs("#name", form)?.focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = qsa("input, textarea", form);
    let isValid = true;
    let firstInvalid = null;

    fields.forEach((field) => {
      clearFieldError(field);

      if (field.required && !field.value.trim()) {
        setFieldError(field, "This field is required.");
        isValid = false;
        firstInvalid = firstInvalid || field;
        return;
      }

      if (field.type === "email" && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          setFieldError(field, "Enter a valid email address.");
          isValid = false;
          firstInvalid = firstInvalid || field;
        }
      }
    });

    if (!isValid) {
      firstInvalid?.focus();
      return;
    }

    form.classList.add("is-sending");
    const label = qs("[data-submit-label]", form);
    if (label) {
      label.textContent = "Sending…";
    }

    window.setTimeout(() => {
      form.classList.remove("is-sending");
      if (label) {
        label.textContent = "Send message";
      }
      form.reset();
      qsa("[data-intent]").forEach((chip) => chip.classList.remove("is-active"));
      qs("[data-message]", form)?.dispatchEvent(new Event("input"));
      showSuccess(form);
      form.dispatchEvent(new CustomEvent("contact:success", { bubbles: true }));
    }, 650);
  });
}
