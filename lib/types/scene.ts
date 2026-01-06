export interface Scene {
  scene: number
  location: string
  camera: string
  action: string
}

export interface SceneBreakdownData {
  scenes: Scene[]
}

export function parseSceneBreakdown(content: string): Scene[] {
  try {
    // Handle empty or whitespace-only content
    if (!content || content.trim() === '') {
      return []
    }

    // Try to parse as JSON
    const parsed = JSON.parse(content)

    // If it's an array, return it
    if (Array.isArray(parsed)) {
      return parsed
    }

    // If it's an object with scenes property
    if (parsed.scenes && Array.isArray(parsed.scenes)) {
      return parsed.scenes
    }

    return []
  } catch (error) {
    // Content is not valid JSON (might be old markdown format)
    // Return empty array so user can regenerate in new JSON format
    console.warn('Scene breakdown is not in JSON format, needs regeneration')
    return []
  }
}

export function formatSceneBreakdownAsJSON(scenes: Scene[]): string {
  return JSON.stringify(scenes, null, 2)
}
