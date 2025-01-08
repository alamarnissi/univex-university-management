import { jwtVerify, type JWTPayload } from "jose";
import { AdapterUser } from "next-auth/adapters";


export async function verify(token: string, secret: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  // run some checks on the returned payload, perhaps you expect some specific values

  // if its all good, return it, or perhaps just return a boolean
  return payload;
}

  export const decodeJWT = async (token: any) => {
    const decoded = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return decoded;
  }