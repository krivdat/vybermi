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
			context.fillText(options[i], -context.measureText(options[i]).width / 2, 0);
			context.restore();
		}
	}

	function getFillStyle(index: number) {
		const colors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800', '#9c27b0'];
		return colors[index % colors.length];
	}

	function spin() {
		spinAngle += spinVelocity;
		spinVelocity *= 0.97; // Friction

		drawWheel();

		if (spinVelocity > 0.001) {
			spinTimeout = setTimeout(spin, 10);
		} else {
			const winnerIndex = Math.floor(((2 * Math.PI - spinAngle) % (2 * Math.PI)) / ((2 * Math.PI) / options.length));
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
        top: 50%;
        left: -20px;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        border-right: 20px solid #333;
    }
</style>

