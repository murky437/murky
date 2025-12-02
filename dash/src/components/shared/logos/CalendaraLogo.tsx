import logoStyles from './Logo.module.css';
import { type Component, onMount } from 'solid-js';
import { gsap } from 'gsap';

const CalendaraLogo: Component = () => {
  let svgRef!: SVGSVGElement;

  onMount(() => {
    const hIds = ['h1', 'h2'];
    const vIds = ['v1', 'v2', 'v3', 'v4', 'v5'];
    const e1Ids = ['e11', 'e12'];
    const e2Ids = ['e21', 'e22', 'e23'];

    const tl = gsap.timeline();

    hIds.forEach(id => {
      const el = svgRef.querySelector(`#${id}`) as SVGGraphicsElement;
      const b = el.getBBox();
      const r = svgRef.querySelector(`#r${id}`) as SVGRectElement;
      r.setAttribute('x', String(b.x));
      r.setAttribute('y', String(b.y));

      if (b.width > 0 && b.height > 0) {
        r.setAttribute('height', String(b.height));
        tl.to(r, { width: b.width, duration: 0.5 }, 0);
      } else {
        r.setAttribute('width', '100%');
        r.setAttribute('height', '100%');
      }
    });

    vIds.forEach(id => {
      const el = svgRef.querySelector(`#${id}`) as SVGGraphicsElement;
      const b = el.getBBox();
      const r = svgRef.querySelector(`#r${id}`) as SVGRectElement;
      r.setAttribute('x', String(b.x));
      r.setAttribute('y', String(b.y));

      if (b.width > 0 && b.height > 0) {
        r.setAttribute('width', String(b.width));
        tl.to(r, { height: b.height, duration: 0.5 }, 0);
      } else {
        r.setAttribute('width', '100%');
        r.setAttribute('height', '100%');
      }
    });

    e1Ids.forEach(id => {
      const el = svgRef.querySelector(`#${id}`) as SVGGraphicsElement;
      const b = el.getBBox();
      const r = svgRef.querySelector(`#r${id}`) as SVGRectElement;
      r.setAttribute('x', String(b.x));
      r.setAttribute('y', String(b.y));

      if (b.width > 0 && b.height > 0) {
        r.setAttribute('height', String(b.height));
        tl.to(r, { width: b.width, duration: 0.1 }, 0.5);
      } else {
        r.setAttribute('width', '100%');
        r.setAttribute('height', '100%');
      }
    });

    e2Ids.forEach(id => {
      const el = svgRef.querySelector(`#${id}`) as SVGGraphicsElement;
      const b = el.getBBox();
      const r = svgRef.querySelector(`#r${id}`) as SVGRectElement;
      r.setAttribute('x', String(b.x));
      r.setAttribute('y', String(b.y));

      if (b.width > 0 && b.height > 0) {
        r.setAttribute('height', String(b.height));
        tl.to(r, { width: b.width, duration: 0.1 }, 0.6);
      } else {
        r.setAttribute('width', '100%');
        r.setAttribute('height', '100%');
      }
    });
  });

  return (
    <>
      <div class={logoStyles.logo}>
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          width="127"
          height="82"
          viewBox="0 0 127 82"
        >
          <g id="text">
            <path
              class="st0"
              d="M8.64,5.68c-.27,0-.5.1-.72.3v12.39c0,.84.07,1.52.2,2.02.13.51.42,1.02.88,1.52.88.96,2.88,1.44,6.01,1.44v.87c-.13,0-1.11.27-2.95.82-1.83.55-2.95.83-3.34.83-1.33,0-2.59-.57-3.78-1.73-1.19-1.15-1.79-2.36-1.79-3.65V5.53c0-.14,1.52-.63,4.56-1.49,3.04-.85,4.78-1.27,5.23-1.27.16,0,.34.29.56.87.21.58.46,1.28.74,2.1.28.82.57,1.42.88,1.81.3.39.88.58,1.73.58v.6c-.58.2-1.57.55-2.97,1.06-1.39.51-2.14.77-2.25.77-.4,0-.9-.81-1.51-2.45-.61-1.63-1.1-2.44-1.47-2.44Z"
            />
            <path
              class="st0"
              d="M31.57,12.73v8.49c0,.74.16,1.26.48,1.54.32.29.81.5,1.47.61v.66l-4.34,1.83c-.58-.18-1.13-.47-1.63-.88-.5-.41-.76-.79-.76-1.12l-4.98,2.01c-.08-.04-.2-.09-.36-.17-.16-.07-.43-.22-.82-.45-.39-.23-.72-.47-1.02-.73-.8-.66-1.19-1.41-1.19-2.25v-4.92c0-.32.69-.73,2.07-1.23,1.38-.5,2.76-.91,4.14-1.23l2.11-.51c0-1.14-.4-1.93-1.19-2.38-.8-.45-2.33-.67-4.62-.67v-.9c4.11-1.1,6.42-1.65,6.93-1.65.88,0,1.71.43,2.51,1.29.8.86,1.19,1.75,1.19,2.67ZM23.83,22.47c.41.33.87.49,1.37.49s1.03-.15,1.59-.45v-6.78c-.66.18-1.16.33-1.49.45-.33.12-.68.31-1.06.57-.69.48-1.03,1.31-1.03,2.49v1.95c0,.52.21.95.62,1.28Z"
            />
            <path
              class="st0"
              d="M40.33,4.84v16.59c0,1.22.54,1.91,1.63,2.07v.66l-4.02,1.71c-.58-.18-1.13-.47-1.63-.88-.5-.41-.76-.8-.76-1.16V7.24c0-1.22-.54-1.91-1.63-2.07v-.66l4.02-1.71c.58.18,1.13.48,1.63.88.5.41.76.79.76,1.16Z"
            />
            <path
              class="st0"
              d="M54.06,8.77c.13,0,.46.16,1,.47.53.31,1.06.74,1.59,1.29.53.55.8,1.09.8,1.6v5.04c0,.36-.7.8-2.11,1.32-1.41.52-2.77.94-4.08,1.27s-2.02.5-2.13.5c0,1.54.89,2.49,2.67,2.85.88.16,1.92.24,3.14.24v.87c-4.35,1.1-6.67,1.65-6.97,1.65-.8,0-1.61-.42-2.43-1.27-.82-.85-1.23-1.85-1.23-2.98v-10.08c0-.14,1.51-.63,4.54-1.49,3.02-.85,4.76-1.27,5.21-1.27ZM52.15,12.12c-.35-.39-.78-.58-1.31-.58s-1.11.15-1.75.45v6.93c2.39-.5,3.58-1.58,3.58-3.24v-2.13c0-.56-.17-1.04-.52-1.42Z"
            />
            <path
              class="st0"
              d="M61.22,23.83v-10.17c0-.66-.19-1.23-.56-1.71-.37-.48-.84-.72-1.39-.72v-.66c.19-.02,1.63-.63,4.34-1.83.19.04.41.1.68.17.26.07.62.27,1.05.58s.66.69.66,1.11c.16-.06.61-.25,1.35-.57,1.96-.84,3.13-1.26,3.5-1.26.85,0,1.65.42,2.39,1.26.74.84,1.11,1.61,1.11,2.31v9.09c0,1.1.65,1.75,1.95,1.95v.66l-4.34,1.83c-.58-.18-1.13-.47-1.63-.88-.5-.41-.76-.8-.76-1.16v-8.7c0-1.12-.17-1.97-.5-2.56-.33-.59-.92-.88-1.77-.88l-1.31.18v9.57c0,1.22.54,1.91,1.63,2.07v.66l-4.02,1.71c-.58-.18-1.13-.47-1.63-.88-.5-.41-.76-.8-.76-1.16Z"
            />
            <path
              class="st0"
              d="M85.82,2.77c.72,0,1.84,1.31,3.38,3.93,1.54,2.62,2.31,4.43,2.31,5.43v9.15c0,.46.17.91.5,1.35.33.44.8.69,1.41.75v.66c-.19.02-1.63.63-4.34,1.83-.61-.2-1.16-.5-1.65-.88-.49-.39-.74-.75-.74-1.1-2.84,1.32-4.5,1.98-4.98,1.98-.19,0-.54-.15-1.05-.46s-1.04-.76-1.55-1.35c-.52-.59-.78-1.19-.78-1.81v-10.71c0-.2,2.24-.89,6.73-2.07-.96-1.58-1.73-2.69-2.31-3.33-.58-.64-1.15-.96-1.71-.96h-1.31v-.9c2.95-1,4.98-1.5,6.09-1.5ZM85.15,23.11c.5,0,1.02-.16,1.55-.48v-10.44c0-.12-.11-.38-.34-.76-.23-.39-.39-.58-.5-.58-.77,0-1.55.18-2.35.54l-.4.18v9.33c0,1.48.68,2.22,2.03,2.22Z"
            />
            <path
              class="st0"
              d="M108.59,12.73v8.49c0,.74.16,1.26.48,1.54.32.29.81.5,1.47.61v.66l-4.34,1.83c-.58-.18-1.13-.47-1.63-.88-.5-.41-.76-.79-.76-1.12l-4.98,2.01c-.08-.04-.2-.09-.36-.17-.16-.07-.43-.22-.82-.45-.39-.23-.72-.47-1.02-.73-.8-.66-1.19-1.41-1.19-2.25v-4.92c0-.32.69-.73,2.07-1.23,1.38-.5,2.76-.91,4.14-1.23l2.11-.51c0-1.14-.4-1.93-1.19-2.38-.8-.45-2.33-.67-4.62-.67v-.9c4.11-1.1,6.42-1.65,6.93-1.65.88,0,1.71.43,2.51,1.29.8.86,1.19,1.75,1.19,2.67ZM100.85,22.47c.41.33.87.49,1.37.49s1.03-.15,1.59-.45v-6.78c-.66.18-1.16.33-1.49.45-.33.12-.68.31-1.06.57-.69.48-1.03,1.31-1.03,2.49v1.95c0,.52.21.95.62,1.28Z"
            />
            <path
              class="st0"
              d="M110.62,10.57l4.38-1.8c.19.04.4.1.66.17.25.07.6.27,1.03.58.44.32.66.68.66,1.08.13-.04.76-.35,1.89-.94s1.85-.89,2.17-.89c.85,0,1.65.42,2.39,1.26.74.84,1.11,1.61,1.11,2.31v1.47l-4.1,1.74-.68-.42c0-1.68-.21-2.64-.64-2.88-.48-.26-1.19-.39-2.15-.39v9.57c0,1.22.54,1.91,1.63,2.07v.66l-4.02,1.71c-.58-.18-1.13-.47-1.63-.88-.5-.41-.76-.8-.76-1.16v-9.96c0-.88-.21-1.54-.62-1.98-.41-.44-.86-.66-1.33-.66v-.66Z"
            />
          </g>
          <clipPath id="clip-h1">
            <rect id="rh1" x="0" y="0" width="0" height="100%" />
          </clipPath>
          <path
            id="h1"
            class="st0"
            clip-path="url(#clip-h1)"
            d="M1.79,41.34h115.21s1.41,3,0,3H1.79s-1.09-3,0-3Z"
          />
          <clipPath id="clip-h2">
            <rect id="rh2" x="0" y="0" width="0" height="100%" />
          </clipPath>
          <path
            id="h2"
            class="st0"
            clip-path="url(#clip-h2)"
            d="M1.79,65.34h68.21s1.49,3,0,3H1.79s-1.09-3,0-3Z"
          />
          <clipPath id="clip-v1">
            <rect id="rv1" x="0" y="0" width="100%" height="0" />
          </clipPath>
          <path
            id="v1"
            class="st0"
            clip-path="url(#clip-v1)"
            d="M10,36.66v43.12s-3,1.53-3,0v-43.12s3-1.15,3,0Z"
          />
          <clipPath id="clip-v2">
            <rect id="rv2" x="0" y="0" width="100%" height="0" />
          </clipPath>
          <path
            id="v2"
            class="st0"
            clip-path="url(#clip-v2)"
            d="M34,36.66v43.12s-3,1.53-3,0v-43.12s3-1.35,3,0Z"
          />
          <clipPath id="clip-v3">
            <rect id="rv3" x="0" y="0" width="100%" height="0" />
          </clipPath>
          <path
            id="v3"
            class="st0"
            clip-path="url(#clip-v3)"
            d="M57.9,36.66v43.12s-3,1.53-3,0v-43.12s3-1.05,3,0Z"
          />
          <clipPath id="clip-v4">
            <rect id="rv4" x="0" y="0" width="100%" height="0" />
          </clipPath>
          <path
            id="v4"
            class="st0"
            clip-path="url(#clip-v4)"
            d="M81.8,36.66v20.34s-3,1.87-3,0v-20.34s3-1.05,3,0Z"
          />
          <clipPath id="clip-v5">
            <rect id="rv5" x="0" y="0" width="100%" height="0" />
          </clipPath>
          <path
            id="v5"
            class="st0"
            clip-path="url(#clip-v5)"
            d="M105.8,36.66v11.12s-3,1.48-3,0v-11.12s3-1.05,3,0Z"
          />
          <clipPath id="clip-e11">
            <rect id="re11" x="0" y="0" width="0" height="100%" />
          </clipPath>
          <path
            id="e11"
            class="st0"
            clip-path="url(#clip-e11)"
            d="M16.39,50.32h8.21s.45,1,0,1h-8.21s-.44-1,0-1Z"
          />
          <clipPath id="clip-e12">
            <rect id="re12" x="0" y="0" width="0" height="100%" />
          </clipPath>
          <path
            id="e12"
            class="st0"
            clip-path="url(#clip-e12)"
            d="M16.39,54.34h8.21s.45,1,0,1h-8.21s-.44-1,0-1Z"
          />
          <clipPath id="clip-e21">
            <rect id="re21" x="0" y="0" width="0" height="100%" />
          </clipPath>
          <path
            id="e21"
            class="st0"
            clip-path="url(#clip-e21)"
            d="M64.24,50.32h8.21s.45,1,0,1h-8.21s-.44-1,0-1Z"
          />
          <clipPath id="clip-e22">
            <rect id="re22" x="0" y="0" width="0" height="100%" />
          </clipPath>
          <path
            id="e22"
            class="st0"
            clip-path="url(#clip-e22)"
            d="M64.24,54.34h8.21s.45,1,0,1h-8.21s-.44-1,0-1Z"
          />
          <clipPath id="clip-e23">
            <rect id="re23" x="0" y="0" width="0" height="100%" />
          </clipPath>
          <path
            id="e23"
            class="st0"
            clip-path="url(#clip-e23)"
            d="M64.24,58.37h8.21s.45,1,0,1h-8.21s-.44-1,0-1Z"
          />
        </svg>
      </div>
    </>
  );
};

export { CalendaraLogo };
