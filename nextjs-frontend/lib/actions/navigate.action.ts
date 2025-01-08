'use server'
 
import { redirect } from 'next/navigation'
 
export async function navigate(path: string, data?: FormData) {
  redirect(`${path}`)
}