import { cookies } from "next/headers";

export function getServerBearer() {
  const token = cookies().get(process.env.JWT_COOKIE_NAME)?.value;
  return token ? `Bearer ${token}` : "";
}

export async function serverApiGet(path, base = process.env.NEXT_PUBLIC_PRODUCT_API) {
  const bearer = getServerBearer();
  const res = await fetch(`${base}${path}`, {
    cache: "no-store",
    headers: bearer ? { Authorization: bearer } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function serverApiPost(path, body, base = process.env.NEXT_PUBLIC_ORDER_API) {
  const bearer = getServerBearer();
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(bearer ? { Authorization: bearer } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
