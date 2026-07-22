document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initNavbarShadow();
    initRevealAnimations();
});

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const target = document.querySelector(link.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}

function initNavbarShadow() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("is-scrolled", window.scrollY > 10);
    });
}

function initRevealAnimations() {
    const groups = document.querySelectorAll(
        ".feature-grid, .timeline, .download-options"
    );

    const singles = document.querySelectorAll(
        ".showcase-image, .showcase-text, .download-card"
    );

    groups.forEach(group => {
        Array.from(group.children).forEach((element, index) => {
            prepareElement(element, index * 80);
        });
    });

    singles.forEach(element => prepareElement(element, 0));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const delay = entry.target.dataset.revealDelay || 0;

            setTimeout(() => {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }, delay);

            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15
    });

    [...groups, ...singles].forEach(group => {
        const targets = group.matches(".feature-grid, .timeline, .download-options")
            ? group.children
            : [group];

        Array.from(targets).forEach(element => observer.observe(element));
    });
}

function prepareElement(element, delay) {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    element.dataset.revealDelay = delay;
}