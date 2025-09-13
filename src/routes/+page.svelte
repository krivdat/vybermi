<script lang="ts">
  import Wheel from '$lib/components/Wheel.svelte';
  import confetti from 'canvas-confetti';

  let options = $state([]);
  let newOption = $state('');
  let spinning = $state(false);
  let selectedOption = $state<string | null>(null);

  function addOption() {
    if (newOption.trim() !== '') {
      options.push(newOption.trim());
      newOption = '';
    }
  }

  function removeOption(index: number) {
    options.splice(index, 1);
    options = options;
  }

  function startSpin() {
    spinning = true;
    selectedOption = null;
  }

  function onSpinEnd(event: CustomEvent<{ winner: string }>) {
    spinning = false;
    selectedOption = event.detail.winner;
    console.log('Winner:', selectedOption);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  function reset() {
    selectedOption = null;
  }
</script>

<div
  class="container"
  onclick={reset}
  onkeydown={reset}
  role="button"
  tabindex="0"
>
  <h1 class="title">Decision Maker</h1>

  {#if spinning || selectedOption}
    <Wheel {options} on:spinend={onSpinEnd} />
    {#if selectedOption}
      <div class="result">
        <h2>The winner is:</h2>
        <p class="winner">{selectedOption}</p>
      </div>
    {/if}
  {:else}
    <div class="options">
      <h2>Enter your options</h2>
      <div class="input-group">
        <input
          type="text"
          bind:value={newOption}
          onkeydown={(e) => e.key === 'Enter' && addOption()}
          placeholder="Add an option"
        />
        <button onclick={addOption}>Add</button>
      </div>
      <ul>
        {#each options as option, index}
          <li>
            {option}
            <button onclick={() => removeOption(index)}>Remove</button>
          </li>
        {/each}
      </ul>
      <button
        class="spin-button"
        onclick={startSpin}
        disabled={options.length < 2}
      >
        Spin the wheel
      </button>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 10px;
    text-align: center;
  }

  .title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .options {
    margin-bottom: 2rem;
  }

  .input-group {
    display: flex;
    margin-bottom: 1rem;
  }

  .input-group input {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
  }

  .input-group button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid #ccc;
    margin-bottom: 0.5rem;
  }

  li button {
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
  }

  .spin-button {
    padding: 1rem 2rem;
    font-size: 1.25rem;
    background-color: #2196f3;
    color: white;
    border: none;
    cursor: pointer;
  }

  .result {
    margin-top: 2rem;
  }

  .winner {
    font-size: 2rem;
    font-weight: bold;
    color: #4caf50;
  }
</style>
