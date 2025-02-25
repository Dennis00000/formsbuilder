import { supabase } from "./supabase"

export async function uploadFormImage(file: File, userId: string) {
  try {
    // Create a unique file path
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${userId}/forms/${fileName}`

    // Upload the file
    const { data, error } = await supabase.storage.from("forms").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("forms").getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export async function deleteFormImage(path: string) {
  try {
    const { error } = await supabase.storage.from("forms").remove([path])

    if (error) throw error
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

export async function updateUserAvatar(file: File, userId: string) {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `avatar.${fileExt}`
    const filePath = `${userId}/avatar/${fileName}`

    // Upload the file
    const { data, error } = await supabase.storage.from("forms").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) throw error

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("forms").getPublicUrl(filePath)

    // Update user profile
    const { error: updateError } = await supabase.from("users").update({ avatar_url: publicUrl }).eq("id", userId)

    if (updateError) throw updateError

    return publicUrl
  } catch (error) {
    console.error("Error updating avatar:", error)
    throw error
  }
}

