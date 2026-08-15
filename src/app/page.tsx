import { redirect } from "next/navigation";
import { getOptionalCurrentUser } from "@/modules/auth/infrastructure/current-user";

export default async function Home() {
  const user = await getOptionalCurrentUser();
  redirect(user?.role === "ADMIN" ? "/admin" : user?.role === "ALUMNO" ? "/entrenamientos" : "/login");
}
