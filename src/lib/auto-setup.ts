let isSetupComplete = false

export async function autoSetupAdmin() {
  // Prevent multiple setup attempts
  if (isSetupComplete) {
    return { success: true, message: 'Setup already completed' }
  }

  try {
    const response = await fetch('/api/auto-setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (result.success) {
      isSetupComplete = true
    }

    return result

  } catch (error) {
    return { success: false, error: 'Failed to setup admin user' }
  }
} 