#include<iostream>
#include<string>

using namespace std;

class BankAccount{
    int accno;
    string holdername;
    double balance;

public:
    BankAccount(int acc,string name,double bal){
        accno = acc;
        holdername = name;
        balance = bal;
    }

    void deposit(double amount){
        cout<<"Enter amount to deposit"<<endl;
        cin>>amount;
        if(amount<=0){
            cout<<"Enter a valid amount![0 and -ve amount not acceptable]"<<endl;
        }
        balance += amount;
        cout<<"amount depsoited sucessfully"<<endl;
    }

    void withdraw(double amount){
        cout<<"Enter amount to withdraw"<<endl;
        cin>>amount;
        if(amount<=0){
            cout<<"Enter a valid amount![0 and -ve amount not acceptable]"<<endl;
        }

        else if(amount > balance){
            cout<<"Insufficient balance!"<<endl;
        }

        else{
            balance -= amount;
            cout<<"Amount withdrawn sucessfully"<<endl;
    }
    } 

    void displaybal(){
        cout<<"ACCOUNT NUMBER : "<<accno<<endl;
        cout<<"ACCOUNT HOLDER NAME : "<<holdername<<endl;
        cout<<"ACCOUNT BALANCE : "<<balance<<endl;
    }

    ~BankAccount(){
        cout<<"Account objcet destroyed"<<endl;
    }



};

int main(){

    int accno;
    string holdername;
    double balance,amount;

    cout<<"Enter account number:"<<endl;
    cin>>accno;
    cout<<"Enter account holder name:"<<endl;
    cin>>holdername;
    cout<<"Enter account Balance"<<endl;
    cin>>balance;
    if(balance<0){
        cout<<"Account balance can not be negative"<<endl;
        return 1;
    }

    BankAccount acc1(accno,holdername,balance);

    acc1.deposit(amount);
    acc1.withdraw(amount);
    acc1.displaybal();
    
    return 0;
}