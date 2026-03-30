if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  const textElements = document.querySelectorAll('.s1_p');
  if (textElements.length > 0) {
    const allImages = document.querySelectorAll('.s1_img');
    allImages.forEach((img) => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
    });

    const lines = document.querySelectorAll('[id^="s1_line_"]');
    lines.forEach((line) => {
      line.style.transition = 'outline-color 0.3s ease';
    });

    const bigCircle = document.querySelector('.s1_big_circle');
    const starImg = document.querySelector('#s1_star');
    if (bigCircle) bigCircle.style.transition = 'outline-color 0.3s ease';
    if (starImg) starImg.style.transition = 'opacity 0.3s ease';

    const originalStarSrc = starImg ? starImg.src : '';
    const newStarSrc = 'images/s1_star_active.png';

    let unclickedTexts = [];
    let starActivated = false;

    textElements.forEach((text, index) => {
      const textData = {
        element: text,
        timeoutId: null,
        isClicked: false
      };

      unclickedTexts.push(textData);

      text.addEventListener('click', function () {
        if (textData.isClicked) return;
        textData.isClicked = true;
        unclickedTexts = unclickedTexts.filter((item) => item !== textData);
        if (textData.timeoutId) clearTimeout(textData.timeoutId);

        const parentBlock = this.closest('.s1_img_text');
        if (parentBlock) {
          const img = parentBlock.querySelector('.s1_img');
          if (img) img.style.opacity = '1';
        }

        this.classList.add('s1_p_clicked');

        if (lines[index]) lines[index].style.outlineColor = '#FFFFED';

        if (unclickedTexts.length === 0 && !starActivated) {
          starActivated = true;
          if (bigCircle) bigCircle.style.outlineColor = '#FFFFED';
          blinkStar();
        }
      });
    });

    function blinkStar() {
      if (!starImg) return;
      let steps = 0;
      const interval = setInterval(() => {
        if (steps < 2) {
          if (
            starImg.src === originalStarSrc ||
            starImg.src.endsWith(originalStarSrc)
          ) {
            starImg.src = newStarSrc;
          } else {
            starImg.src = originalStarSrc;
          }
          steps++;
        } else {
          clearInterval(interval);
          starImg.src = newStarSrc;
        }
      }, 150);
    }

    function startBlinking() {
      if (unclickedTexts.length === 0) return;
      const randomIndex = Math.floor(Math.random() * unclickedTexts.length);
      const current = unclickedTexts[randomIndex];
      if (!current.isClicked) {
        current.element.classList.add('s1_p_blink');
        setTimeout(() => {
          if (!current.isClicked) {
            current.element.classList.remove('s1_p_blink');
          }
          setTimeout(() => startBlinking(), Math.random() * 500 + 200);
        }, 400);
      } else {
        setTimeout(() => startBlinking(), 50);
      }
    }

    startBlinking();
  }

  const bottomElement = document.querySelector('#s2_bottom');
  if (bottomElement) {
    bottomElement.style.transition = 'transform 0.2s ease';
    bottomElement.style.cursor = 'pointer';

    const photosContainer = document.querySelector('#s2_place_for_photos');
    if (photosContainer) {
      const photos = Array.from(photosContainer.querySelectorAll('img'));
      if (photos.length > 0) {
        const targets = [];
        for (let i = 1; i <= photos.length; i++) {
          const target = document.getElementById(`s2_div_p_${i}`);
          if (target) {
            targets.push(target);
            target.style.opacity = '0';
          } else {
            console.warn(`Целевой блок s2_div_p_${i} не найден`);
          }
        }
        if (targets.length === photos.length) {
          let currentIndex = 0;

          function animateButton() {
            bottomElement.style.transform = 'scale(0.9)';
            setTimeout(() => {
              bottomElement.style.transform = '';
            }, 200);
          }

          function blinkPhoto(photo, callback) {
            photo.style.transition = 'filter 0.1s ease';
            photo.style.filter = 'brightness(0)';
            setTimeout(() => {
              photo.style.filter = '';
              setTimeout(callback, 50);
            }, 150);
          }

          function moveNextPhoto() {
            if (currentIndex >= photos.length) return;

            const photo = photos[currentIndex];
            const targetBlock = targets[currentIndex];
            if (photo && targetBlock) {
              blinkPhoto(photo, () => {
                targetBlock.appendChild(photo);
                targetBlock.style.opacity = '1';
                photo.style.width = '100%';
                photo.style.height = '100%';
                photo.style.objectFit = 'cover';
                photo.style.transition = '';
                console.log(`Фотография ${currentIndex + 1} перемещена`);
              });
            }

            currentIndex++;
            if (currentIndex === photos.length) {
              bottomElement.removeEventListener('click', onClickHandler);
            }
          }

          function onClickHandler() {
            animateButton();
            setTimeout(() => {
              moveNextPhoto();
            }, 200);
          }

          bottomElement.addEventListener('click', onClickHandler);
        }
      }
    }
  }

  const groupForPhotos = document.querySelector('#group_for_photos');
  if (groupForPhotos) {
    groupForPhotos.style.cursor = 'pointer';
    groupForPhotos.addEventListener('click', () => {
      const targetBlocks = document.querySelectorAll(
        '#s2_div_p_1, #s2_div_p_2, #s2_div_p_3, #s2_div_p_4, #s2_div_p_5, #s2_div_p_6'
      );
      targetBlocks.forEach((block) => {
        block.classList.toggle('s2-div-p-moved');
      });
    });
  }

  const section3 = document.querySelector('section:nth-of-type(3)');
  if (section3 && !section3.classList.contains('marquee-initialized')) {
    const originalChildren = Array.from(section3.children);
    if (originalChildren.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'marquee-wrapper';
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'nowrap';
    wrapper.style.gap = getComputedStyle(section3).gap;
    wrapper.style.width = 'max-content';
    wrapper.style.alignItems = 'center';

    originalChildren.forEach((child) => wrapper.appendChild(child));

    const clone = wrapper.cloneNode(true);
    wrapper.appendChild(clone);

    section3.innerHTML = '';
    section3.appendChild(wrapper);

    section3.style.overflow = 'hidden';
    section3.style.whiteSpace = 'nowrap';
    section3.style.display = 'block';

    let position = 0;
    const speed = 2;
    let animationId = null;

    function animate() {
      position -= speed;
      const halfWidth = wrapper.scrollWidth / 2;
      if (Math.abs(position) >= halfWidth) {
        position = 0;
      }
      wrapper.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('beforeunload', () => {
      if (animationId) cancelAnimationFrame(animationId);
    });

    section3.classList.add('marquee-initialized');
  }

  const section4 = document.querySelector('section:nth-of-type(4)');
  if (section4) {
    const allPBlocks = section4.querySelectorAll('.s4_p');
    allPBlocks.forEach((pBlock) => {
      pBlock.style.opacity = '0';
      pBlock.style.transition = 'opacity 0.3s ease';
    });

    const h4Elements = section4.querySelectorAll('h4');
    h4Elements.forEach((h4) => {
      h4.style.cursor = 'pointer';
      h4.style.transition = 'transform 0.2s ease';

      h4.addEventListener('click', (event) => {
        h4.style.transform = 'scale(0.9)';
        setTimeout(() => {
          h4.style.transform = '';
        }, 200);

        const parentNT = h4.closest('.s4_n_t');
        if (parentNT) {
          const pBlock = parentNT.querySelector('.s4_p');
          if (pBlock) {
            const isVisible = pBlock.style.opacity === '1';
            pBlock.style.opacity = isVisible ? '0' : '1';
          }
        }
      });
    });
  }

  const section5 = document.querySelector('section:nth-of-type(5)');
  if (section5 && !section5.classList.contains('marquee5-advanced')) {
    const divs = Array.from(section5.children).filter(
      (child) => child.tagName === 'DIV'
    );
    if (divs.length === 3) {
      divs.forEach((div, idx) => {
        const originalItems = Array.from(div.querySelectorAll('p'));
        if (originalItems.length === 0) return;

        const direction = idx === 1 ? 'right' : 'left';

        div.innerHTML = '';
        div.style.overflow = 'hidden';
        div.style.whiteSpace = 'nowrap';
        div.style.display = 'flex';
        div.style.alignItems = 'center';

        const scrollContainer = document.createElement('div');
        scrollContainer.style.display = 'flex';
        scrollContainer.style.flexWrap = 'nowrap';
        scrollContainer.style.alignItems = 'center';
        scrollContainer.style.gap = getComputedStyle(div).gap || '1.34vw';
        scrollContainer.style.width = 'max-content';

        originalItems.forEach((item) => scrollContainer.appendChild(item));

        const clone1 = scrollContainer.cloneNode(true);
        const clone2 = scrollContainer.cloneNode(true);
        scrollContainer.appendChild(clone1);
        scrollContainer.appendChild(clone2);

        div.appendChild(scrollContainer);

        let position = 0;
        const speed = 0.3;
        let animationId = null;
        let lastTimestamp = 0;

        const getItemWidth = () => {
          const temp = scrollContainer.children[0];
          return temp.scrollWidth;
        };

        let itemWidth = getItemWidth();

        const resizeObserver = new ResizeObserver(() => {
          itemWidth = getItemWidth();
        });
        resizeObserver.observe(div);

        function animate(timestamp) {
          if (!lastTimestamp) lastTimestamp = timestamp;
          const delta = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
          lastTimestamp = timestamp;

          if (direction === 'left') {
            position -= speed * (delta * 60);
            if (position <= -itemWidth) {
              const firstSet = scrollContainer.children[0];
              scrollContainer.appendChild(firstSet);
              position += itemWidth;
            }
          } else {
            position += speed * (delta * 60);
            if (position >= itemWidth) {
              const lastSet =
                scrollContainer.children[scrollContainer.children.length - 1];
              scrollContainer.insertBefore(lastSet, scrollContainer.firstChild);
              position -= itemWidth;
            }
          }
          scrollContainer.style.transform = `translateX(${position}px)`;
          animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
        div.marqueeAnimationId = animationId;
        div._resizeObserver = resizeObserver;
      });

      const allP = section5.querySelectorAll('p');
      allP.forEach((p) => {
        if (!p.hasAttribute('data-blinking-initialized')) {
          p.style.color = '#977ccd';
          p.style.transition = 'color 0.2s ease';
          p.style.cursor = 'pointer';

          let isClicked = false;
          let blinkTimer = null;

          function startBlinking() {
            if (isClicked) return;
            if (blinkTimer) clearTimeout(blinkTimer);
            function blink() {
              if (!isClicked) {
                const currentColor = getComputedStyle(p).color;
                const targetColor =
                  currentColor === 'rgb(151, 124, 205)' ? '#FFFFED' : '#977ccd';
                p.style.color = targetColor;
                blinkTimer = setTimeout(blink, Math.random() * 600 + 200);
              }
            }
            blink();
          }

          function stopBlinking(finalColor) {
            if (blinkTimer) {
              clearTimeout(blinkTimer);
              blinkTimer = null;
            }
            p.style.color = finalColor;
          }

          startBlinking();

          p.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isClicked) {
              isClicked = true;
              stopBlinking('#FFFFED');
            } else {
              isClicked = false;
              p.style.color = '#977ccd';
              startBlinking();
            }
          });

          p.setAttribute('data-blinking-initialized', 'true');
        }
      });
    }
    section5.classList.add('marquee5-advanced');
  }

  const section6 = document.querySelector('section:nth-of-type(6)');
  if (section6 && !section6.classList.contains('s6-initialized')) {
    const s6Images = [];
    for (let i = 1; i <= 6; i++) {
      const img = document.getElementById(`s6_img_${i}`);
      if (img) {
        s6Images.push(img);
      }
    }

    const s6Words = [];
    for (let i = 1; i <= 6; i++) {
      const word = document.getElementById(`s6_w_${i}`);
      if (word) {
        s6Words.push(word);
      }
    }

    [...s6Images, ...s6Words].forEach((el) => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.5s ease';
    });

    const s6Bottoms = section6.querySelectorAll('.s6_bottom');
    let forwardBtn = null;
    let backBtn = null;

    s6Bottoms.forEach((btn) => {
      const text = btn.querySelector('p');
      if (text) {
        const textContent = text.textContent.trim().toLowerCase();
        if (textContent === 'вперед') {
          forwardBtn = btn;
        } else if (textContent === 'назад') {
          backBtn = btn;
        }
      }
    });

    let currentIndex = -1;
    let isAnimating = false;

    function showNext() {
      if (isAnimating) return;

      if (currentIndex < s6Images.length - 1) {
        isAnimating = true;
        currentIndex++;

        for (let i = 0; i <= currentIndex; i++) {
          if (s6Images[i]) {
            s6Images[i].style.opacity = '1';
          }
        }

        s6Words.forEach((word) => {
          word.style.opacity = '0';
        });
        if (s6Words[currentIndex]) {
          s6Words[currentIndex].style.opacity = '1';
        }

        setTimeout(() => {
          isAnimating = false;
        }, 500);
      }
    }

    function hidePrev() {
      if (isAnimating) return;

      if (currentIndex >= 0) {
        isAnimating = true;

        if (s6Images[currentIndex]) {
          s6Images[currentIndex].style.opacity = '0';
        }

        currentIndex--;

        s6Words.forEach((word) => {
          word.style.opacity = '0';
        });
        if (currentIndex >= 0 && s6Words[currentIndex]) {
          s6Words[currentIndex].style.opacity = '1';
        }

        setTimeout(() => {
          isAnimating = false;
        }, 500);
      }
    }

    if (forwardBtn) {
      forwardBtn.style.cursor = 'pointer';
      forwardBtn.addEventListener('click', () => {
        forwardBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          forwardBtn.style.transform = '';
        }, 150);

        showNext();
      });
    }

    if (backBtn) {
      backBtn.style.cursor = 'pointer';
      backBtn.addEventListener('click', () => {
        backBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          backBtn.style.transform = '';
        }, 150);

        hidePrev();
      });
    }

    section6.classList.add('s6-initialized');
  }
  const section7 = document.querySelector('section:nth-of-type(7)');
  if (section7 && !section7.classList.contains('marquee7-initialized')) {
    const originalItems = Array.from(section7.children);
    if (originalItems.length === 0) return;

    const computedStyle = getComputedStyle(section7);

    section7.innerHTML = '';
    section7.style.overflow = 'hidden';
    section7.style.whiteSpace = 'nowrap';
    section7.style.display = 'flex';
    section7.style.alignItems = 'center';

    const scrollContainer = document.createElement('div');
    scrollContainer.style.display = 'flex';
    scrollContainer.style.flexWrap = 'nowrap';
    scrollContainer.style.alignItems = 'center';
    scrollContainer.style.gap = computedStyle.gap || '2vw';
    scrollContainer.style.width = 'max-content';

    originalItems.forEach((item) => {
      item.style.flexShrink = '0';
      scrollContainer.appendChild(item);
    });

    const clone1 = scrollContainer.cloneNode(true);
    const clone2 = scrollContainer.cloneNode(true);
    scrollContainer.appendChild(clone1);
    scrollContainer.appendChild(clone2);

    section7.appendChild(scrollContainer);

    let position = 0;
    const speed = 1.5;
    let animationId = null;
    let lastTimestamp = 0;

    const getSetWidth = () => {
      let width = 0;
      const children = scrollContainer.children;
      const originalCount = originalItems.length;
      for (let i = 0; i < originalCount; i++) {
        width += children[i].offsetWidth + parseFloat(computedStyle.gap || 0);
      }
      return width;
    };

    let setWidth = getSetWidth();

    const resizeObserver = new ResizeObserver(() => {
      setWidth = getSetWidth();
    });
    resizeObserver.observe(section7);

    function animate(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      position -= speed * (delta * 60);

      if (position <= -setWidth) {
        const originalCount = originalItems.length;
        for (let i = 0; i < originalCount; i++) {
          const firstItem = scrollContainer.children[0];
          scrollContainer.appendChild(firstItem);
        }
        position += setWidth;
      }

      scrollContainer.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    section7._marqueeAnimationId = animationId;
    section7._resizeObserver = resizeObserver;

    section7.classList.add('marquee7-initialized');
  }
}
