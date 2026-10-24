(function () {
  const root = document.documentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    window.__auFailsafe = setTimeout(function () {
      root.classList.remove('is-entering', 'is-playing');
    }, 4500);
  } else {
    root.classList.remove('is-entering', 'is-playing');
  }

  // Custom IntersectionObserver to lazy-load .mobile-img elements when within 200px of viewport
  const mobileImages = Array.from(document.querySelectorAll('.mobile-img'));

  function hydrateLazyImage(img) {
    if (!img || img.dataset.lazyHydrated === 'true') return;
    img.dataset.lazyHydrated = 'true';

    const parent = img.parentElement;
    if (parent && parent.tagName === 'PICTURE') {
      parent.querySelectorAll('source[data-srcset]').forEach(function (source) {
        const sourceSrcset = source.getAttribute('data-srcset');
        if (sourceSrcset) {
          source.setAttribute('srcset', sourceSrcset);
          source.removeAttribute('data-srcset');
        }
      });
    }

    const dataSrcset = img.getAttribute('data-srcset');
    if (dataSrcset) {
      img.setAttribute('srcset', dataSrcset);
      img.removeAttribute('data-srcset');
    }

    const dataSrc = img.getAttribute('data-src');
    if (dataSrc) {
      img.setAttribute('src', dataSrc);
      img.removeAttribute('data-src');
    }

    function markLoaded() {
      img.classList.add('is-lazy-loaded');
    }

    if (img.complete && img.naturalWidth > 1) {
      if (img.decode) {
        img.decode().then(markLoaded).catch(markLoaded);
      } else {
        markLoaded();
      }
    } else {
      img.addEventListener('load', function () {
        if (img.decode) {
          img.decode().then(markLoaded).catch(markLoaded);
        } else {
          markLoaded();
        }
      }, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  }

  if ('IntersectionObserver' in window) {
    const mobileImgObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const targetImg = entry.target;
        observer.unobserve(targetImg);

        // If part of a multi-layer interactive viewport, hydrate all sibling .mobile-img layers together
        const mediaContainer = targetImg.closest('.project-card__media');
        if (mediaContainer) {
          mediaContainer.querySelectorAll('.mobile-img').forEach(function (layerImg) {
            observer.unobserve(layerImg);
            hydrateLazyImage(layerImg);
          });
        } else {
          hydrateLazyImage(targetImg);
        }
      });
    }, {
      root: null,
      rootMargin: '200px 0px',
      threshold: 0.01
    });

    mobileImages.forEach(function (img) {
      mobileImgObserver.observe(img);
    });
  } else {
    mobileImages.forEach(hydrateLazyImage);
  }

  // Bilingual Translation Dictionary (English & Persian RTL)
  const TRANSLATIONS = {
    en: {
      'workflow.index.col1': 'INDEX — 03 / MISSION WORKFLOW',
      'workflow.index.col2': 'PROTOCOL — AUTONOMOUS GRID',
      'workflow.index.col3': 'SEQUENCE — 05-STAGE PIPELINE',
      'workflow.index.col4': 'CONTROL — TABLET TELEMETRY',
      'workflow.title': 'Automated Mission Workflow',
      'workflow.subtitle': 'END-TO-END FIELD AUTONOMY',
      'workflow.desc': 'Five-stage closed-loop execution from boundary trace to actionable agronomy report.',
      'workflow.step1.num': 'STEP 01',
      'workflow.step1.label': 'PLAN',
      'workflow.step1.title': 'MAP',
      'workflow.step1.desc': 'Boundary traced on the tablet; grid flight planned.',
      'workflow.step2.num': 'STEP 02',
      'workflow.step2.label': 'SENSE',
      'workflow.step2.title': 'CAPTURE',
      'workflow.step2.desc': 'Multispectral, thermal, and RGB imagery.',
      'workflow.step3.num': 'STEP 03',
      'workflow.step3.label': 'COMPUTE',
      'workflow.step3.title': 'ANALYZE',
      'workflow.step3.desc': 'Processing unit scores crop health, moisture, and leak indicators.',
      'workflow.step4.num': 'STEP 04',
      'workflow.step4.label': 'INSPECT',
      'workflow.step4.title': 'VERIFY',
      'workflow.step4.desc': 'Flagged spots get a low-altitude RGB pass for pest identification.',
      'workflow.step5.num': 'STEP 05',
      'workflow.step5.label': 'DELIVER',
      'workflow.step5.title': 'REPORT',
      'workflow.step5.desc': "Field report sent to the farmer's tablet.",
      'workflow.banner.label': 'MANUAL OVERRIDE PROTOCOL',
      'workflow.banner.text': 'Note: The farmer can switch to manual piloting from the tablet instead of the automated mission.'
    },
    fa: {
      'workflow.index.col1': 'شاخص — ۰۳ / گردش کار ماموریت',
      'workflow.index.col2': 'پروتکل — شبکه خودکار',
      'workflow.index.col3': 'توالی — خط لوله ۵ مرحله‌ای',
      'workflow.index.col4': 'کنترل — تله‌متری تبلت',
      'workflow.title': 'گردش کار ماموریت خودکار',
      'workflow.subtitle': 'خودمختاری کامل میدانی از ابتدا تا انتها',
      'workflow.desc': 'اجرای حلقه بسته پنج مرحله‌ای از ترسیم مرز تا گزارش کاربردی کشاورزی.',
      'workflow.step1.num': 'مرحله ۰۱',
      'workflow.step1.label': 'برنامه‌ریزی',
      'workflow.step1.title': 'نقشه‌برداری',
      'workflow.step1.desc': 'مرز مزرعه روی تبلت ترسیم شده و پرواز شبکه‌ای برنامه‌ریزی می‌شود.',
      'workflow.step2.num': 'مرحله ۰۲',
      'workflow.step2.label': 'سنجش',
      'workflow.step2.title': 'ثبت تصویر',
      'workflow.step2.desc': 'تصویربرداری چندطیفی، حرارتی و RGB.',
      'workflow.step3.num': 'مرحله ۰۳',
      'workflow.step3.label': 'محاسبه',
      'workflow.step3.title': 'تحلیل',
      'workflow.step3.desc': 'واحد پردازش سلامت محصول، رطوبت و نشانگرهای نشت را امتیازدهی می‌کند.',
      'workflow.step4.num': 'مرحله ۰۴',
      'workflow.step4.label': 'بازرسی',
      'workflow.step4.title': 'تایید و بررسی',
      'workflow.step4.desc': 'نقاط علامت‌گذاری‌شده با پرواز کم‌ارتفاع RGB برای شناسایی آفات بررسی می‌شوند.',
      'workflow.step5.num': 'مرحله ۰۵',
      'workflow.step5.label': 'تحویل',
      'workflow.step5.title': 'گزارش‌دهی',
      'workflow.step5.desc': 'گزارش میدانی به تبلت کشاورز ارسال می‌شود.',
      'workflow.banner.label': 'پروتکل کنترل دستی',
      'workflow.banner.text': 'توجه: کشاورز می‌تواند به جای ماموریت خودکار، از طریق تبلت به هدایت دستی تغییر وضعیت دهد.'
    }
  };

  let currentLang = 'en';
  const langBtn = document.querySelector('.lang');
  const workflowSection = document.getElementById('mission-workflow');

  function applyLanguage(lang) {
    currentLang = TRANSLATIONS[lang] ? lang : 'en';
    const dict = TRANSLATIONS[currentLang];
    const isRtl = currentLang === 'fa';

    if (workflowSection) {
      workflowSection.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      workflowSection.setAttribute('lang', currentLang);
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    if (langBtn) {
      langBtn.textContent = isRtl ? 'FA' : 'EN';
      langBtn.setAttribute('aria-label', isRtl ? 'Language: Persian (Switch to English)' : 'Language: English (Switch to Persian)');
    }
  }

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLanguage(currentLang === 'en' ? 'fa' : 'en');
    });
  }

  const PART_CONFIG = {
    // Aerial Unit (Section 2)
    'battery': {
      label: 'Battery',
      kicker: '01 · BATTERY',
      briefSpec: 'Dual 22.2V Solid-State LiPo · Hot-Swap · 42 min Flight',
      defaultX: '50%',
      defaultY: '29.8%',
      hoverX: '50%',
      hoverY: '41.2%'
    },
    'propeller': {
      label: 'Propeller',
      kicker: '02 · PROPELLER',
      briefSpec: '28-inch Carbon Composite · Low-Noise Safety Tips',
      defaultX: '19.5%',
      defaultY: '16.5%',
      hoverX: '19.5%',
      hoverY: '32.8%'
    },
    'chassis': {
      label: 'Chassis — Upper Body',
      kicker: '03 · CHASSIS — UPPER BODY',
      briefSpec: 'IP67 Sealed Monocoque · 5-Band Multi-Spectral Visor',
      defaultX: '50%',
      defaultY: '24.5%',
      hoverX: '50%',
      hoverY: '64.5%'
    },
    'arms': {
      label: 'Extendable Arms',
      kicker: '04 · EXTENDABLE ARMS',
      briefSpec: '4-Axis Folding Carbon Booms · Quick-Lock Latches',
      defaultX: '31%',
      defaultY: '26.5%',
      hoverX: '31.5%',
      hoverY: '36.8%'
    },
    'landing-gear': {
      label: 'Landing Gear',
      kicker: '05 · LANDING GEAR',
      briefSpec: '7075-T6 Telescopic Alloy Struts · Auto-Dock Damping',
      defaultX: '50%',
      defaultY: '58.5%',
      hoverX: '50%',
      hoverY: '84.8%'
    },
    // Ground Station (Section 3)
    'station-transport': {
      label: 'Transport',
      kicker: '01 · TRANSPORT',
      briefSpec: 'All-Terrain Treaded Wheels · Telescopic Tow Handle',
      defaultX: '78.5%',
      defaultY: '26.0%',
      hoverX: '78.5%',
      hoverY: '44.2%'
    },
    'station-shelter': {
      label: 'Lid',
      kicker: '02 · LID',
      briefSpec: 'IP65 Motorized Clamshell Lid · Integrated Solar Panel',
      defaultX: '25.6%',
      defaultY: '10.5%',
      hoverX: '25.6%',
      hoverY: '35.8%'
    },
    'station-charging': {
      label: 'Charging',
      kicker: '03 · CHARGING',
      briefSpec: '500W Autonomous Contact Pad · Solar & Grid Umbilical',
      defaultX: '38.5%',
      defaultY: '47.8%',
      hoverX: '38.5%',
      hoverY: '68.2%'
    },
    'station-processing': {
      label: 'The AGRIPAD integration Bay',
      kicker: '04 · THE AGRIPAD INTEGRATION BAY',
      briefSpec: 'Recessed Rear Compute Dock · High-Speed Telemetry Sync',
      defaultX: '79.2%',
      defaultY: '42.0%',
      hoverX: '79.2%',
      hoverY: '68.5%'
    },
    'station-agripad': {
      label: 'AGRIPAD',
      kicker: '05 · AGRIPAD',
      briefSpec: 'Detachable Field Tablet · Crop, Pest & Moisture AI Maps',
      defaultX: '66.6%',
      defaultY: '79.8%',
      hoverX: '66.6%',
      hoverY: '96.5%'
    },
    'station-landing': {
      label: 'Launch / Landing',
      kicker: '06 · LAUNCH & LANDING',
      briefSpec: 'Upper RTK Precision Docking Pad · Automated Centering',
      defaultX: '30.5%',
      defaultY: '33.8%',
      hoverX: '30.5%',
      hoverY: '49.5%'
    },
    'station-legs': {
      label: 'Adjusting Legs (Outrigger Arms)',
      kicker: '07 · ADJUSTING LEGS (OUTRIGGER ARMS)',
      briefSpec: 'Articulated Hydraulic Outrigger Arms · Slope Auto-Leveling',
      defaultX: '18.0%',
      defaultY: '44.0%',
      hoverX: '18.0%',
      hoverY: '76.5%'
    }
  };

  // Drone View Switcher (Section 2) with on-demand back-view prefetch
  const droneMedia = document.getElementById('drone-media');
  const layerImages = document.querySelectorAll('.drone-layer-img');
  const viewBtns = document.querySelectorAll('.drone-view-btn[data-view-target]');
  const rotateBtn = document.getElementById('drone-rotate-btn');
  const viewIndicator = document.getElementById('drone-view-indicator');
  const viewControls = document.querySelector('.drone-view-controls');

  const VIEW_ASSETS = {
    front: {
      src: '/assets/aistudio/Untitled2_91082964.jpg',
      srcset: '/assets/aistudio/Untitled2_91082964.jpg 3840w',
      indicator: 'FRONT VIEW · 3840 × 2400 · 4K CGI'
    },
    back: {
      src: '/assets/aistudio/Untitled3_60edf3bc.jpg',
      srcset: '/assets/aistudio/Untitled3_60edf3bc.jpg 3840w',
      indicator: 'BACK VIEW · 3840 × 2400 · 4K CGI'
    }
  };

  let backViewPrefetched = false;
  function prefetchBackView() {
    if (backViewPrefetched) return;
    backViewPrefetched = true;
    const preloadImg = new Image();
    preloadImg.decoding = 'async';
    preloadImg.src = VIEW_ASSETS.back.src;
  }

  if (viewControls) {
    viewControls.addEventListener('mouseenter', prefetchBackView, { once: true, passive: true });
    viewControls.addEventListener('focusin', prefetchBackView, { once: true, passive: true });
    viewControls.addEventListener('touchstart', prefetchBackView, { once: true, passive: true });
  }

  if (droneMedia) {
    function setDroneView(targetView) {
      prefetchBackView();
      const currentView = droneMedia.getAttribute('data-view') || 'front';
      const nextView = targetView || (currentView === 'front' ? 'back' : 'front');
      if (nextView === currentView || !VIEW_ASSETS[nextView]) return;

      droneMedia.classList.add('is-switching-view');
      droneMedia.setAttribute('data-view', nextView);

      viewBtns.forEach(function (btn) {
        const isMatch = btn.getAttribute('data-view-target') === nextView;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      if (viewIndicator) {
        viewIndicator.textContent = VIEW_ASSETS[nextView].indicator;
      }

      setTimeout(function () {
        layerImages.forEach(function (img) {
          img.dataset.lazyHydrated = 'true';
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          img.src = VIEW_ASSETS[nextView].src;
          img.srcset = VIEW_ASSETS[nextView].srcset;
          img.classList.add('is-lazy-loaded');
        });
        requestAnimationFrame(function () {
          droneMedia.classList.remove('is-switching-view');
        });
      }, 130);
    }

    viewBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        setDroneView(btn.getAttribute('data-view-target'));
      });
    });

    if (rotateBtn) {
      rotateBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        setDroneView();
      });
    }
  }

  // Bind interactive hotspot & spec-card inspection per project card (Aerial Unit & Ground Station)
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(function (card) {
    const mediaEl = card.querySelector('.project-card__media');
    if (!mediaEl) return;

    const calloutText = mediaEl.querySelector('.part-callout__text');
    const hoverTooltip = mediaEl.querySelector('.part-hover-tooltip');
    const hoverKicker = mediaEl.querySelector('.part-hover-tooltip__kicker');
    const hoverSpec = mediaEl.querySelector('.part-hover-tooltip__spec');
    const hotspots = mediaEl.querySelectorAll('.drone-hotspot');
    const specItems = card.querySelectorAll('.spec-item[data-part]');

    function showHoverTooltip(part, customHoverX, customHoverY) {
      const cfg = PART_CONFIG[part];
      if (!cfg || !hoverTooltip || !hoverKicker || !hoverSpec) return;

      hoverKicker.textContent = cfg.kicker;
      hoverSpec.textContent = cfg.briefSpec;
      mediaEl.style.setProperty('--hover-x', customHoverX || cfg.hoverX);
      mediaEl.style.setProperty('--hover-y', customHoverY || cfg.hoverY);
      mediaEl.classList.add('is-part-hovering');
      hoverTooltip.setAttribute('aria-hidden', 'false');

      hotspots.forEach(function (btn) {
        btn.classList.toggle('is-part-hovered', btn.getAttribute('data-part') === part);
      });
    }

    function hideHoverTooltip() {
      if (!hoverTooltip) return;
      mediaEl.classList.remove('is-part-hovering');
      hoverTooltip.setAttribute('aria-hidden', 'true');
      hotspots.forEach(function (btn) {
        btn.classList.remove('is-part-hovered');
      });
    }

    function setActivePart(part, customX, customY) {
      const currentPart = mediaEl.getAttribute('data-active-part');
      if (!part || currentPart === part) {
        mediaEl.classList.remove('is-part-active');
        mediaEl.removeAttribute('data-active-part');
        hotspots.forEach(function (btn) {
          btn.setAttribute('aria-pressed', 'false');
        });
        specItems.forEach(function (item) {
          item.classList.remove('is-active');
        });
        return;
      }

      const cfg = PART_CONFIG[part];
      if (!cfg) return;

      mediaEl.classList.add('is-part-active');
      mediaEl.setAttribute('data-active-part', part);
      if (calloutText) {
        calloutText.textContent = cfg.label;
      }
      mediaEl.style.setProperty('--callout-x', customX || cfg.defaultX);
      mediaEl.style.setProperty('--callout-y', customY || cfg.defaultY);

      hotspots.forEach(function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-part') === part ? 'true' : 'false');
      });

      specItems.forEach(function (item) {
        item.classList.toggle('is-active', item.getAttribute('data-part') === part);
      });
    }

    hotspots.forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        const part = btn.getAttribute('data-part');
        const hx = btn.getAttribute('data-hover-x');
        const hy = btn.getAttribute('data-hover-y');
        showHoverTooltip(part, hx, hy);
      });

      btn.addEventListener('mouseleave', function () {
        hideHoverTooltip();
      });

      btn.addEventListener('focus', function () {
        const part = btn.getAttribute('data-part');
        const hx = btn.getAttribute('data-hover-x');
        const hy = btn.getAttribute('data-hover-y');
        showHoverTooltip(part, hx, hy);
      });

      btn.addEventListener('blur', function () {
        hideHoverTooltip();
      });

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const part = btn.getAttribute('data-part');
        const cx = btn.getAttribute('data-callout-x');
        const cy = btn.getAttribute('data-callout-y');
        setActivePart(part, cx, cy);
      });
    });

    specItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        const part = item.getAttribute('data-part');
        showHoverTooltip(part);
      });
      item.addEventListener('mouseleave', function () {
        hideHoverTooltip();
      });
      item.addEventListener('click', function () {
        const part = item.getAttribute('data-part');
        setActivePart(part);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const part = item.getAttribute('data-part');
          setActivePart(part);
        }
      });
    });

    mediaEl.addEventListener('click', function (e) {
      if (
        mediaEl.classList.contains('is-part-active') &&
        !e.target.closest('.drone-hotspot') &&
        !e.target.closest('.drone-view-controls')
      ) {
        setActivePart(null);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mediaEl.classList.contains('is-part-active')) {
        setActivePart(null);
      }
    });
  });

  // Preloader: tracks only the hero image and main font so lazy below-the-fold images are not blocked
  const preloader = document.getElementById('site-preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderPct = document.getElementById('preloader-pct');

  function cleanup() {
    root.classList.remove('is-entering', 'is-playing');
    if (window.__auFailsafe) {
      clearTimeout(window.__auFailsafe);
      window.__auFailsafe = null;
    }
  }

  let started = false;
  function startPlayback() {
    if (started) return;
    started = true;

    if (preloader) {
      preloader.classList.add('is-loaded');
    }

    if (prefersReduced || !root.classList.contains('is-entering')) {
      return;
    }

    requestAnimationFrame(function () {
      root.classList.add('is-playing');

      const animations = document.getAnimations ? document.getAnimations() : [];
      const auAnimations = animations.filter(function (anim) {
        return anim.animationName && anim.animationName.startsWith('au-');
      });

      const maxTimer = setTimeout(cleanup, 2200);

      if (auAnimations.length === 0) {
        setTimeout(cleanup, 2200);
      } else {
        Promise.all(auAnimations.map(function (a) {
          return a.finished.catch(function () {});
        })).then(function () {
          clearTimeout(maxTimer);
          cleanup();
        });
      }
    });
  }

  const heroImg = document.querySelector('.hero__photo img');
  const criticalImages = heroImg ? [heroImg] : [];
  const totalTasks = criticalImages.length + 1; // hero image + document.fonts
  let completedTasks = 0;

  function updateProgress() {
    completedTasks = Math.min(totalTasks, completedTasks + 1);
    const ratio = completedTasks / totalTasks;
    if (preloaderBar) {
      preloaderBar.style.setProperty('--load-progress', ratio.toFixed(3));
    }
    if (preloaderPct) {
      preloaderPct.textContent = Math.round(ratio * 100) + '%';
    }
  }

  const assetPromises = criticalImages.map(function (img) {
    return new Promise(function (resolve) {
      function done() {
        updateProgress();
        resolve();
      }
      if (img.complete && img.naturalWidth > 0) {
        if (img.decode) {
          img.decode().then(done).catch(done);
        } else {
          done();
        }
      } else {
        img.addEventListener('load', function () {
          if (img.decode) {
            img.decode().then(done).catch(done);
          } else {
            done();
          }
        }, { once: true });
        img.addEventListener('error', done, { once: true });
      }
    });
  });

  const fontPromise = (document.fonts && document.fonts.ready)
    ? document.fonts.ready.then(updateProgress).catch(updateProgress)
    : Promise.resolve().then(updateProgress);

  const preloadTimeout = setTimeout(startPlayback, 2500);

  Promise.all(assetPromises.concat([fontPromise])).then(function () {
    clearTimeout(preloadTimeout);
    setTimeout(startPlayback, 80);
  });
})();
