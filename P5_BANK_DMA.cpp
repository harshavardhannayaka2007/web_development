#include<iostream>

using namespace std;

class BankAccount{
    double balance;
    int accno;

    public:
        void input(){
            cout<<"Enter the Account number: "<<endl;
            cin>>accno;
        }

        void deposit(){
            double amt;
            cout<<"Enter Amout to deposit: "<<endl;
            cin>>amt;
            if(amt<=0){
                cout<<"Invalid amount! Rascal! Enter a valid amount!"<<endl;
            }
            else{
                balance += amt;
            }

        }

        void display(){
            cout<<"ACCOUNT NUMBER: "<<accno<<endl;
            cout<<"CURRENT BALANCE: "<<balance<<endl;
        }
};

int main(){
    int n;
    cout<<"Enter the number of customers"<<endl;
    cin>>n;
    BankAccount *acc = new BankAccount[n];

    for(int i=0;i<n;i++){
        cout<<"Enter Details for customer "<<i+1<<endl;
        acc[i].input();
        acc[i].deposit();
    }

     cout<<"Details of customers "<<endl; 
    for(int i=0;i<n;i++){
        cout<<"CUSTOMER "<<i+1<<endl;
       acc[i].display();
        
    }

    delete[] acc; 
    cout<<"DM RELEASED"<<endl;

    return 0;
}
