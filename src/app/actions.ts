"use server";

import { revalidatePath } from "next/cache";
import { STUDENT_SLUGS } from "@/lib/students";

export async function revalidatePortfolioPaths() {
  revalidatePath("/");
  for (const slug of STUDENT_SLUGS) {
    revalidatePath(`/${slug}`);
    revalidatePath(`/${slug}/report`);
  }
}
