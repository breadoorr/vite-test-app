export type AccountType = 'LDAP' | 'Локальная';

export interface LabelItem {
  text: string;
}

export interface Account {
  id: string;
  labels: LabelItem[];
  type: AccountType;
  login: string;
  password: string | null;
}

export interface AccountFormErrors {
  login?: string;
  password?: string;
}