<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  let { options }: { options: string[] } = $props();
  const dispatch = createEventDispatcher<{ spinend: { winner: string } }>();

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let spinAngle = $state(0);
  let spinVelocity = $state(0);
  let spinTimeout: number;

  onMount(() => {
    context = canvas.getContext('2d')!;
    drawWheel();
    spinVelocity = Math.random() * 0.4 + 0.4;
    spin();

    return () => {
      clearTimeout(spinTimeout);
    };
  });

  function drawWheel() {
    const numOptions = options.length;
    const arcSize = (2 * Math.PI) / numOptions;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#333';
    context.lineWidth = 2;

    for (let i = 0; i < numOptions; i++) {
      const angle = spinAngle + i * arcSize;
      context.fillStyle = getFillStyle(i);

      context.beginPath();
      context.arc(250, 250, 250, angle, angle + arcSize);
      context.lineTo(250, 250);
      context.fill();

      context.save();
      context.fillStyle = 'white';
      context.translate(
        250 + Math.cos(angle + arcSize / 2) * 180,
        250 + Math.sin(angle + arcSize / 2) * 180
      );
      context.rotate(angle + arcSize / 2 + Math.PI / 2);
      context.fillText(
        options[i],
        -context.measureText(options[i]).width / 2,
        0
      );
      context.restore();
    }
  }

  function getFillStyle(index: number) {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 50%, 60%)`;
  }

  function hslToHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function spin() {
    spinAngle += spinVelocity;
    spinVelocity *= 0.97; // Friction

    drawWheel();

    if (spinVelocity > 0.001) {
      spinTimeout = setTimeout(spin, 10);
    } else {
      const pointerX = 250;
      const pointerY = 20;
      const pixel = context.getImageData(pointerX, pointerY, 1, 1).data;
      const color =
        '#' +
        (
          '000000' +
          ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)
        ).slice(-6);

      let winnerIndex = -1;
      for (let i = 0; i < options.length; i++) {
        const hue = (i * 137.508) % 360;
        if (hslToHex(hue, 50, 60) === color) {
          winnerIndex = i;
          break;
        }
      }

      dispatch('spinend', { winner: options[winnerIndex] });
    }
  }
</script>

<div class="wheel-container">
  <div class="arrow"></div>
  <canvas bind:this={canvas} width="500" height="500"></canvas>
</div>

<style>
  .wheel-container {
    position: relative;
    width: 500px;
    height: 500px;
  }

  .arrow {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid #333;
  }
</style>
