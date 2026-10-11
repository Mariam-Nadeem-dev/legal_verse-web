document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");

            const isOpen = navMenu.classList.contains("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });


        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });
        });

    }


    /* =========================================================
       NAVBAR SCROLL EFFECT
    ========================================================= */

    const navbar = document.getElementById("navbar");

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("#navMenu a").forEach(link => {

        const linkPage =
            link.getAttribute("href").split("#")[0];

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

    });


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const revealElements = document.querySelectorAll(
        ".tool-card, .case-card, .law-card, .court-card, .update-card, .timeline-item"
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );


        revealElements.forEach((element, index) => {

            element.style.opacity = "0";
            element.style.transform = "translateY(25px)";
            element.style.transition =
                `opacity 0.6s ease ${index * 0.04}s,
                 transform 0.6s ease ${index * 0.04}s`;

            revealObserver.observe(element);

        });

    }


    /* =========================================================
       CARD 3D TILT
    ========================================================= */

    const tiltCards = document.querySelectorAll(
        ".tool-card, .case-card, .law-card"
    );


    tiltCards.forEach(card => {

        card.addEventListener("mousemove", event => {

            if (window.innerWidth < 900) return;

            const rect = card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -2.5;

            const rotateY =
                ((x - centerX) / centerX) * 2.5;

            card.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;

        });


        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });


    /* =========================================================
       RIPPLE EFFECT
    ========================================================= */

    const buttons = document.querySelectorAll(
        ".btn, .nav-button"
    );


    buttons.forEach(button => {

        button.addEventListener("click", event => {

            const ripple = document.createElement("span");

            ripple.style.position = "absolute";
            ripple.style.width = "10px";
            ripple.style.height = "10px";
            ripple.style.borderRadius = "50%";
            ripple.style.background = "rgba(255,255,255,0.35)";
            ripple.style.pointerEvents = "none";
            ripple.style.transform = "scale(0)";
            ripple.style.animation = "legalRipple 0.6s ease-out";

            const rect =
                button.getBoundingClientRect();

            ripple.style.left =
                `${event.clientX - rect.left - 5}px`;

            ripple.style.top =
                `${event.clientY - rect.top - 5}px`;

            if (getComputedStyle(button).position === "static") {
                button.style.position = "relative";
            }

            button.style.overflow = "hidden";

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 650);

        });

    });


    /* =========================================================
       SMOOTH ANCHOR LINKS
    ========================================================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =========================================================
       HOME PAGE SEARCH SHORTCUT
    ========================================================= */

    const homeSearch = document.getElementById("homeSearch");

    if (homeSearch) {

        homeSearch.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                const query =
                    homeSearch.value.trim();

                if (!query) return;

                window.location.href =
                    `case-law.html?search=${encodeURIComponent(query)}`;

            }

        });

    }


    /* =========================================================
       CASE LAW FILTERING
    ========================================================= */

    const caseSearch =
        document.getElementById("caseSearch");

    const courtFilter =
        document.getElementById("courtFilter");

    const yearFilter =
        document.getElementById("yearFilter");

    const typeFilter =
        document.getElementById("typeFilter");

    const resultCount =
        document.getElementById("resultCount");


    function filterCases() {

        const search =
            caseSearch
                ? caseSearch.value.trim().toLowerCase()
                : "";

        const court =
            courtFilter
                ? courtFilter.value
                : "";

        const year =
            yearFilter
                ? yearFilter.value
                : "";

        const type =
            typeFilter
                ? typeFilter.value
                : "";


        const cases =
            document.querySelectorAll(".database-case");


        let visible = 0;


        cases.forEach(card => {

            const text =
                card.textContent.toLowerCase();

            const cardCourt =
                card.dataset.court || "";

            const cardYear =
                card.dataset.year || "";

            const cardType =
                card.dataset.type || "";


            const matchesSearch =
                !search ||
                text.includes(search);

            const matchesCourt =
                !court ||
                cardCourt === court;

            const matchesYear =
                !year ||
                cardYear === year;

            const matchesType =
                !type ||
                cardType === type;


            if (
                matchesSearch &&
                matchesCourt &&
                matchesYear &&
                matchesType
            ) {

                card.style.display = "";

                visible++;

            } else {

                card.style.display = "none";

            }

        });


        if (resultCount) {

            resultCount.textContent =
                `Showing ${visible} case law ${
                    visible === 1 ? "entry" : "entries"
                }.`;

        }

    }


    if (caseSearch) {
        caseSearch.addEventListener(
            "input",
            filterCases
        );
    }


    if (courtFilter) {
        courtFilter.addEventListener(
            "change",
            filterCases
        );
    }


    if (yearFilter) {
        yearFilter.addEventListener(
            "change",
            filterCases
        );
    }


    if (typeFilter) {
        typeFilter.addEventListener(
            "change",
            filterCases
        );
    }


    /* =========================================================
       CASE LAW URL PARAMETERS
    ========================================================= */

    const urlParams =
        new URLSearchParams(window.location.search);


    const selectedYear =
        urlParams.get("year");

    const selectedSearch =
        urlParams.get("search");


    if (selectedYear && yearFilter) {
        yearFilter.value = selectedYear;
    }


    if (selectedSearch && caseSearch) {
        caseSearch.value = selectedSearch;
    }


    if (
        selectedYear ||
        selectedSearch
    ) {
        filterCases();
    }


    /* =========================================================
       GENERAL PAGE SEARCH
    ========================================================= */

    const pageSearch =
        document.getElementById("pageSearch");


    if (pageSearch) {

        pageSearch.addEventListener("input", () => {

            const query =
                pageSearch.value.trim().toLowerCase();

            const searchableItems =
                document.querySelectorAll(
                    "[data-searchable]"
                );


            searchableItems.forEach(item => {

                const content =
                    item.textContent.toLowerCase();

                item.style.display =
                    !query || content.includes(query)
                        ? ""
                        : "none";

            });

        });

    }


    /* =========================================================
       YEAR ARCHIVE BUTTONS
    ========================================================= */

    document.querySelectorAll("[data-year-link]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const year =
                    button.dataset.yearLink;

                if (!year) return;

                window.location.href =
                    `case-law.html?year=${encodeURIComponent(year)}`;

            });

        });


    /* =========================================================
       SEARCH HINT BUTTONS
    ========================================================= */

    document.querySelectorAll("[data-search]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const value =
                    button.dataset.search;

                if (!value) return;

                if (caseSearch) {

                    caseSearch.value = value;

                    filterCases();

                    caseSearch.focus();

                } else {

                    window.location.href =
                        `case-law.html?search=${encodeURIComponent(value)}`;

                }

            });

        });


    /* =========================================================
       IMAGE FALLBACK
    ========================================================= */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.style.background =
                "linear-gradient(135deg, #052c24, #0d6b54)";

            image.style.objectFit = "cover";

            image.removeAttribute("src");

        });

    });


    /* =========================================================
       UPDATE CARDS
    ========================================================= */

    document.querySelectorAll(".update-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                card.classList.add("clicked");

            });

        });


    /* =========================================================
       BACK TO TOP
    ========================================================= */

    const backToTop =
        document.getElementById("backToTop");


    if (backToTop) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 600) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }

        });


        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =========================================================
       KEYBOARD ESCAPE
    ========================================================= */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (navMenu) {
                navMenu.classList.remove("open");
            }

            if (menuToggle) {
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.textContent = "☰";
            }

        }

    });

});


/* =========================================================
   RIPPLE ANIMATION
========================================================= */

const rippleStyle =
document.createElement("style");

rippleStyle.textContent = `
    @keyframes legalRipple {
        from {
            transform: scale(0);
            opacity: 0.8;
        }

        to {
            transform: scale(25);
            opacity: 0;
        }
    }
`;

document.head.appendChild(rippleStyle);