import "./style.scss";

const HEADER_POSITION = 450;

function useDebounce(callee, delay = 100) {
  let timerId;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      callee(...args);
      timerId = undefined;
    }, delay);
  };
}

function handlePageScroll() {
  const header = document.querySelector(".header");

  const headerStickyClass = "header_sticky";
  const headerRemovedClass = "header_removed";

  let isSticky = false;
  let isAnimationOn = false;

  if (!header) {
    return;
  }

  const currentPosition = window.scrollY;

  if (currentPosition > HEADER_POSITION) {
    header.classList.add(headerStickyClass);
    isSticky = true;
  }

  const scrollHandler = () => {
    const currentPosition = window.scrollY;

    if (currentPosition > HEADER_POSITION) {
      if (!isSticky && !isAnimationOn) {
        header.classList.add(headerStickyClass);
        isAnimationOn = true;

        header.addEventListener(
          "animationend",
          () => {
            isAnimationOn = false;
          },
          { once: true },
        );
        isSticky = true;
      }
    } else {
      if (isSticky && !isAnimationOn) {
        isSticky = false;
        header.classList.add(headerRemovedClass);
        isAnimationOn = true;

        header.addEventListener(
          "animationend",
          () => {
            header.classList.remove(headerStickyClass);
            header.classList.remove(headerRemovedClass);
            isAnimationOn = false;
          },
          { once: true },
        );
      }
    }
  };

  const debouncedScrollHandler = useDebounce(scrollHandler);

  window.addEventListener("scroll", debouncedScrollHandler);
}

function handleForm() {
  const form = document.getElementById("create-tour-form");

  function handleDateInput() {
    const inputDateFrom = document.querySelector(
      ".create-tour-form__input-date-from",
    );
    const inputDateTo = document.querySelector(
      ".create-tour-form__input-date-to",
    );

    const activeDateInputClass = "create-tour-form__input-date_has-value";

    if (inputDateFrom) {
      inputDateFrom.onchange = () => {
        if (inputDateFrom.value) {
          inputDateFrom.classList.add(activeDateInputClass);
        } else {
          inputDateFrom.classList.remove(activeDateInputClass);
        }
      };
    }

    if (inputDateTo) {
      inputDateTo.onchange = () => {
        if (inputDateTo.value) {
          inputDateTo.classList.add(activeDateInputClass);
        } else {
          inputDateTo.classList.remove(activeDateInputClass);
        }
      };
    }

    if (form) {
      form.addEventListener("reset", () => {
        inputDateFrom?.classList.remove(activeDateInputClass);
        inputDateTo?.classList.remove(activeDateInputClass);
      });
    }
  }

  function handleSelect() {
    const destinationSelect = document.querySelector(
      ".create-tour-form__select",
    );
    const activeSelectClass = "create-tour-form__select_selected";

    if (!destinationSelect) {
      return;
    }

    destinationSelect.onblur = () => {
      if (!destinationSelect.value) {
        destinationSelect.classList.remove(activeSelectClass);
      } else {
        destinationSelect.classList.add(activeSelectClass);
      }
    };

    if (form) {
      form.addEventListener("reset", () => {
        destinationSelect.classList.remove(activeSelectClass);
      });
    }
  }

  handleDateInput();
  handleSelect();
}

document.addEventListener("DOMContentLoaded", handleForm);
document.addEventListener("DOMContentLoaded", handlePageScroll);
