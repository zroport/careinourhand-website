"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteBlogPost(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) throw new Error("Post not found")

  await prisma.blogPost.delete({ where: { id } })

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
}
