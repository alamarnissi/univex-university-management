export interface ManagerType {
    email: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    institution_type: InstitutionType,
    learning_business_name: string,
    password?: string
}

export interface ManagerOAuthType {
    first_name: string,
    last_name: string,
    phone_number: string,
    institution_type: InstitutionType,
    learning_business_name: string,
}

export interface InstitutionType {
    id: number,
    name: string,
    unavailable: boolean
}