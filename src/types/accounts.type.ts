export interface TotalByCurrenciesData {
    currencyId: string;
    currencySymbol: string;
    balance: string;
}

export interface ConvertedBalance {
    amount: string;
    currencyId: string;
}