<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

<!-- Svelte-MCP:BEGIN -->
You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:
## Available MCP Tools:
### 1. list-sections
Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.
### 2. get-documentation
Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.
### 3. svelte-autofixer
Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.
### 4. playground-link
Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
<!-- Svelte-MCP:END -->

<!-- Threlte-v8-Example:BEGIN -->
---
category: Basics
title: App Structure
order: -900
---

Threlte uses Svelte's [Context API](https://svelte.dev/tutorial/svelte/context-api) to share `renderer`, `camera`, [and others](/docs/reference/core/use-threlte#usage) to any child component.
Hooks like `useThrelte()` read from this context, so anything that needs it must be inside `<Canvas>`.

```svelte title="SomeComponent.svelte"
<script>
  import { useThrelte } from '@threlte/core'

  const { camera, renderer } = useThrelte()
</script>
```

## Recommended app structure

Wrap your 3D app in a single `<Canvas>` and give it one direct child: `Scene.svelte`.
Put all 3D content under that node to access Threlte hooks.

```svelte title="App.svelte"
<script>
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
</script>

<Canvas>
  <Scene />
</Canvas>
```

```svelte title="Scene.svelte"
<script>
  import { T, useTask } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  import Player from './Player.svelte'
  import World from './World.svelte'

  let rotation = $state(0)

  // useTask is relying on a context provided
  // by <Canvas>. Because we are definitely *inside*
  // <Canvas>, we can safely use it.
  useTask((delta) => {
    rotation += delta
  })

  // This file is also typically the place to
  // inject plugins
  interactivity()
</script>

<T.Mesh rotation.y={rotation}>
  <T.BoxGeometry />
  <T.MeshBasicMaterial color="red" />
</T.Mesh>

<Player />
<World />
```

## Context not available

<Tip type="danger">
	The following app structure is deceiving. It looks like it should work, but **it
	will not**. The problem is that the `useTask` hook is called *outside* of the
	`<Canvas>` component, so the main Threlte context is not available. Usually hooks
	relying on some context will tell you with descriptive error messages when they
	are used outside of their context.
</Tip>

```svelte title="App.svelte"
<script>
  import { Canvas, useTask, T } from '@threlte/core'

  let rotation = 0

  // This won't work, we're not inside <Canvas>
  useTask((delta) => {
    rotation += delta
  })
</script>

<Canvas>
  <T.Mesh rotation.y={rotation} />
</Canvas>
```

## Using a single `<Canvas>`

In a larger Svelte app or when using SvelteKit, prefer a single `<Canvas>` to avoid the WebGL error
“Too many active WebGL contexts. Oldest context will be lost.”
We can use [Svelte 5
Snippets](https://svelte.dev/docs/svelte/snippet) to easily _portal_ our 3D
content to a global `<Canvas>`. For that, let's first create a component that
renders portal content:

```svelte title="src/lib/components/CanvasPortalTarget.svelte"
<script
  lang="ts"
  module
>
  import type { Snippet } from 'svelte'
  import { SvelteSet } from 'svelte/reactivity'
  let snippets = new SvelteSet<Snippet>()

  export const addCanvasPortalSnippet = (snippet: Snippet) => {
    snippets.add(snippet)
  }

  export const removeCanvasPortalSnippet = (snippet: Snippet) => {
    snippets.delete(snippet)
  }
</script>

{#each snippets as snippet}
  {@render snippet()}
{/each}
```

Then implement this component in the root +layout.svelte component:

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
  import CanvasPortalTarget from '$lib/components/CanvasPortalTarget.svelte'
  import { Canvas } from '@threlte/core'
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<div>
  <Canvas>
    <CanvasPortalTarget />
  </Canvas>
</div>

{@render children()}

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
```

All we need is another component that we can utilize to easily portal 3D content
into the global canvas:

```svelte title="src/lib/components/CanvasPortal.svelte"
<script lang="ts">
  import {
    addCanvasPortalSnippet,
    removeCanvasPortalSnippet
  } from '$lib/components/CanvasPortalTarget.svelte'
  import { onDestroy, type Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()

  addCanvasPortalSnippet(children)

  onDestroy(() => {
    removeCanvasPortalSnippet(children)
  })
</script>
```

Now we can use this component to portal 3D content into the global canvas from
anywhere in our app all while using regular DOM elements alongside our 3D
content:

```svelte title="src/routes/+page.svelte"
<script lang="ts">
  import CanvasPortal from '$lib/components/CanvasPortal.svelte'
  import { T } from '@threlte/core'
</script>

<!-- Regular DOM elements for UI -->
<button>Click me</button>

<!-- 3D content -->
<CanvasPortal>
  <T.PerspectiveCamera
    position.z={10}
    makeDefault
  />

  <T.Mesh>
    <T.BoxGeometry />
    <T.MeshBasicMaterial color="red" />
  </T.Mesh>
</CanvasPortal>
```


<script>
  import { T, useTask } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  import { Spring } from 'svelte/motion'

  interactivity()

  const scale = new Spring(1)

  let rotation = $state(0)
  useTask((delta) => {
    rotation += delta
  })
</script>

<T.PerspectiveCamera
  makeDefault
  position={[10, 10, 10]}
  oncreate={(ref) => {
    ref.lookAt(0, 1, 0)
  }}
/>

<T.DirectionalLight
  position={[0, 10, 10]}
  castShadow
/>

<T.Mesh
  rotation.y={rotation}
  position.y={1}
  scale={scale.current}
  onpointerenter={() => {
    scale.target = 1.5
  }}
  onpointerleave={() => {
    scale.target = 1
  }}
  castShadow
>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh
  rotation.x={-Math.PI / 2}
  receiveShadow
>
  <T.CircleGeometry args={[4, 40]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>
<!-- Threlte-v8-Example:END -->