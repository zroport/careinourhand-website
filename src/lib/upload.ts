export async function uploadFile(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    if (data.success) return data.url as string
    console.error("Upload failed:", data.error)
    return null
  } catch (err) {
    console.error("Upload error:", err)
    return null
  }
}
