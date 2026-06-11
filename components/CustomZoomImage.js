import React, { useRef, useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const getObjectFitMetrics = (img, container, objectFit = 'cover') => {
  if (!img || !container || !img.naturalWidth || !img.naturalHeight) {
    return null;
  }

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const naturalWidth = img.naturalWidth;
  const naturalHeight = img.naturalHeight;

  let scale;
  if (objectFit === 'contain') {
    scale = Math.min(
      containerWidth / naturalWidth,
      containerHeight / naturalHeight
    );
  } else {
    scale = Math.max(
      containerWidth / naturalWidth,
      containerHeight / naturalHeight
    );
  }

  const renderedWidth = naturalWidth * scale;
  const renderedHeight = naturalHeight * scale;
  const offsetX = (containerWidth - renderedWidth) / 2;
  const offsetY = (containerHeight - renderedHeight) / 2;

  return {
    containerWidth,
    containerHeight,
    renderedWidth,
    renderedHeight,
    offsetX,
    offsetY,
  };
};

export const SmoothZoomImageWrapper = ({
  children,
  zoomScale = 2.5,
  popupSize = 400,
  popupOffset = 12,
  hoverOnly = true,
  // Kept for backward compatibility with previous inline-zoom API
  duration: _duration,
  easing: _easing,
  enableParallax: _enableParallax,
  className,
  style,
  ...rest
}) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const childOnLoadRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [popupCoords, setPopupCoords] = useState({ left: 0, top: 0 });
  const [mounted, setMounted] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  const shouldEnableHover =
    !hoverOnly ||
    (typeof window !== 'undefined'
      ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
      : true);

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ width, height });
  }, []);

  const updatePopupPosition = useCallback(
    (cursorY) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      const showOnRight = spaceRight >= popupSize + popupOffset + 8;
      const clampedTop = Math.max(
        0,
        Math.min(cursorY - popupSize / 2, dimensions.height - popupSize)
      );

      setPopupCoords({
        left: showOnRight
          ? rect.right + popupOffset
          : rect.left - popupSize - popupOffset,
        top: rect.top + clampedTop,
      });
    },
    [dimensions.height, popupOffset, popupSize]
  );

  const handlePointerMove = useCallback(
    (event) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setCursor({ x, y });
      updatePopupPosition(y);
    },
    [updatePopupPosition]
  );

  const handlePointerEnter = useCallback(
    (event) => {
      updateDimensions();
      setIsHovering(true);
      handlePointerMove(event);
    },
    [handlePointerMove, updateDimensions]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleImageLoad = useCallback(
    (event) => {
      setImageReady(true);
      updateDimensions();
      childOnLoadRef.current?.(event);
    },
    [updateDimensions]
  );

  useEffect(() => {
    setMounted(true);
    updateDimensions();

    const container = containerRef.current;
    if (!container) return undefined;

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [updateDimensions]);

  useEffect(() => {
    if (!isHovering) return undefined;

    const handleScrollOrResize = () => {
      updateDimensions();
      updatePopupPosition(cursor.y);
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [cursor.y, isHovering, updateDimensions, updatePopupPosition]);

  const child = React.Children.only(children);
  childOnLoadRef.current = child.props.onLoad;
  const imageSrc = child.props.src;
  const objectFit = child.props.objectFit || 'cover';
  const metrics = getObjectFitMetrics(
    imgRef.current,
    containerRef.current,
    objectFit
  );

  const popupContent =
    shouldEnableHover &&
    isHovering &&
    mounted &&
    imageReady &&
    imageSrc &&
    metrics &&
    dimensions.width > 0 ? (
      <div
        role="presentation"
        className="smooth-zoom-image-popup"
        style={{
          position: 'fixed',
          left: popupCoords.left,
          top: popupCoords.top,
          width: popupSize,
          height: popupSize,
          overflow: 'hidden',
          borderRadius: 8,
          border: '2px solid #fff',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.22)',
          backgroundColor: '#ff',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <img
          src={imageSrc}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: metrics.renderedWidth * zoomScale,
            height: metrics.renderedHeight * zoomScale,
            transform: `translate(${-(
              (cursor.x - metrics.offsetX) * zoomScale -
              popupSize / 2
            )}px, ${-(
              (cursor.y - metrics.offsetY) * zoomScale -
              popupSize / 2
            )}px)`,
            maxWidth: 'none',
            objectFit: 'cover',
          }}
        />
      </div>
    ) : null;

  return (
    <>
      <div
        ref={containerRef}
        className={`smooth-zoom-image-wrapper ${className ?? ''}`}
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'manipulation',
          cursor: shouldEnableHover ? 'crosshair' : undefined,
          ...style,
        }}
        {...rest}
        onPointerMove={shouldEnableHover ? handlePointerMove : undefined}
        onPointerEnter={
          shouldEnableHover
            ? (event) => {
                handlePointerEnter(event);
                child.props.onPointerEnter?.(event);
              }
            : undefined
        }
        onPointerLeave={
          shouldEnableHover
            ? (event) => {
                handlePointerLeave();
                child.props.onPointerLeave?.(event);
              }
            : undefined
        }
      >
        {React.cloneElement(child, {
          ref: (node) => {
            imgRef.current = node;
            if (node?.complete && node.naturalWidth > 0) {
              setImageReady(true);
            }
            if (typeof child.ref === 'function') child.ref(node);
            else if (child.ref && typeof child.ref === 'object') {
              child.ref.current = node;
            }
          },
          onLoad: handleImageLoad,
          style: {
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit,
            ...child.props.style,
          },
          draggable: false,
        })}
      </div>
      {mounted && popupContent
        ? createPortal(popupContent, document.body)
        : null}
    </>
  );
};

// Example Usage:
/*
import { SmoothZoomImageWrapper } from "./CustomZoomImage";

<SmoothZoomImageWrapper
  zoomScale={2.5}
  popupSize={220}
  hoverOnly={true}
  style={{ maxWidth: 400, aspectRatio: "16/9" }}
>
  <img
    src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800"
    alt="Sample"
    loading="lazy"
    style={{ borderRadius: 16 }}
  />
</SmoothZoomImageWrapper>
*/
