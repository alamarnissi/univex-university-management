import { ManagerType, ManagerOAuthType } from "@/lib/types/manager";
import { getCookie } from "cookies-next";

export const FetchUserData = async () => {
    const token = getCookie("access_token") || "";
    
    const res = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL+"/v1/users/profile",
        {
            mode: "cors",
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            }
        }
    )
    const response = res.json();
    return response;
}

export const FetchRegisterManager = async (manager: ManagerType) => {
    let institution_type = "";
    switch (manager.institution_type.name) {
        case "Training Center":
            institution_type = "Training_center";
            break;
        case "Corporate":
            institution_type = "Corporate";
            break;
        case "Educational Institution":
            institution_type = "Educational_institution";
            break;
        case "Solo Educator":
            institution_type = "Solo_educator";
            break;
        default:
            institution_type = "";
            break;

    }
    const res = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL+"/v1/managers/create",
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8"
            },
            body: JSON.stringify({
                "email": manager.email,
                "first_name": manager.first_name,
                "last_name": manager.last_name,
                "phone_number": manager.phone_number,
                "institution_type": institution_type,
                "learning_business_name": manager.learning_business_name,
                "password": manager.password
            }),
        });

    const response = res;
    return response;
}

/**
 * LOGIN Request
 * @field workspace_subdomain: This is used to be passed in access_token in backend
 */
export const FetchLogin = async ({ workspace_subdomain, email, password }: { workspace_subdomain: string, email: string, password: string }, type: string) => {
    const url = process.env.NEXT_PUBLIC_AUTH_API_URL;

    let api = "";
    switch (type) {
        case "manager":
            api = "/v1/managers/login";
            break;
        case "instructor":
            api = "/v1/instructors/login";
            break;
        case "student":
            api = "/v1/students/login";
            break;
        default:
            break;
    }
    const full_url = url + api;

    const res = await fetch(full_url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8"
            },
            body: JSON.stringify({
                email,
                password,
                workspace_subdomain
            }),
        });
    const response = res.json();
    return response;
}

/**
 * Fetch update manager profile settings
 */
export const FetchUpdateMangerProfile = async (manager: any) => {
    const token = getCookie("access_token") || "";
    
    const url = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/managers/update-profile";
    
    const res = await fetch(url,
        {
            mode: "cors",
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                ...manager
            })
        }
    )
    const response = res.json();
    return response;
}

/**
 * Fetch refresh jwt 
 */
export const FetchRefreshJWT = async (token: any) => {
    const url = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/refresh-token";
    const res = await fetch(url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8"
            },
            body: JSON.stringify({
                token
            })
        }
    )
    const response = res.json();
    return response;
}

/**
 * Resend verification code
 */
export const FetchResendVerificationEmail = async (email: string) => {
    const url = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/managers/resend-verification-email";
    
    const res = await fetch(url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8"
            },
            body: JSON.stringify({
                email
            })
        }
    )
    const response = res.json();
    return response;
}

/**
 * Forget Password Request
 */
export const FetchForgetPassword = async ({email, subdomain}: {email: string, subdomain: string}, type: string) => {
    const url = process.env.NEXT_PUBLIC_AUTH_API_URL;
    let api = "";
    switch (type) {
        case "manager":
            api = "/v1/managers/forget-password";
            break;
        case "instructor":
            api = "/v1/instructors/forget-password";
            break;
        case "student":
            api = "/v1/students/forget-password";
            break;
        default:
            break;
    }
    const UrlWithParam = url + api;

    const res = await fetch(UrlWithParam,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8"
            },
            body: JSON.stringify({
                email,
                subdomain
            })
        }
    )
    const response = res.json();
    return response;
}

/**
 * Reset Password Request
 */
export const FetchResetPassword = async (password: string, token: string, type: string) => {
    const url = process.env.NEXT_PUBLIC_AUTH_API_URL;
    let api = "";
    switch (type) {
        case "manager":
            api = `/v1/managers/reset-password/${token}`;
            break;
        case "instructor":
            api = `/v1/instructors/reset-password/${token}`;
            break;
        case "student":
            api = `/v1/students/reset-password/${token}`;
            break;
        default:
            break;
    }
    const UrlWithParam = url + api;

    const res = await fetch(UrlWithParam,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8"
            },
            body: JSON.stringify({
                password
            })
        }
    )
    const response = res.json();
    return response;
}

export const checkEmailAfterGoogleConnect = async (email: string) => {
    const url = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/managers/logingoogle";

    const res = await fetch(url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8"
            },
            body: JSON.stringify({
                "manager_email": email
            })
        }
    )
    const response = res.json();

    return response;
}

export const submitExtraFields = async (manager: ManagerOAuthType, email: string) => {
    const res = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/managers/logingoogle/submit_additional_fields?manager_email=" + email,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8"
            },
            body: JSON.stringify({
                "first_name": manager.first_name,
                "last_name": manager.last_name,
                "phone_number": manager.phone_number,
                "institution_type": manager.institution_type.name,
                "learning_business_name": manager.learning_business_name,
            }),
        });

    const response = res;
    return response.json();
}