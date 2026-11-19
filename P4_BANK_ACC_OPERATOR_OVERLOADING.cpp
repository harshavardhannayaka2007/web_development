#include<iostream>
using namespace std;

class BankAccount{

    double balance;

    public:
        BankAccount(double b);
        void display();

        BankAccount operator+(const BankAccount& account);
        bool operator==(const BankAccount& account);
};

BankAccount :: BankAccount(double b){
    balance = b;
}

void BankAccount :: display(){
    cout<<"Balance: "<<balance<<endl;

}

BankAccount BankAccount :: operator+(const BankAccount& account){
    return BankAccount(balance + account.balance);
}

bool BankAccount :: operator==(const BankAccount& account){
    return balance == account.balance;
} 

int main(){

    double balance1,balance2;
    cout<<"ENter the balance for account 1:"<<endl;
    cin>>balance1;
    cout<<"ENter the balance for account 2:"<<endl;
    cin>>balance2;

    BankAccount account1(balance1);
    BankAccount account2(balance2);

    BankAccount account3 = account1 + account2;
    account3.display();

    if(account1 == account2){
        cout<<"Accounts have same balances"<<endl;
    }
    else{
        cout<<"Accounts have different balances"<<endl;
    }

    return 0;
}
