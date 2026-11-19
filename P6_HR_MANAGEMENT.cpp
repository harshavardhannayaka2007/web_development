#include<iostream>
#include<string>

using namespace std;

class Employee{
    protected:
        string name;
        double salary;
    public:

    void getdet(){
        cout<<"Enter the name of the Employee"<<endl;
            cin>>name;
            cout<<"Enter the salary of the Employee"<<endl;
            cin>>salary;
        }
    
       void calculatesalary(){
            cout<<"NAME : "<<name<<endl;
            cout<<"SALARY : "<<salary<<endl;
        }
        virtual void calculateBonus(){
            cout<<"SALARY : "<<salary*0.05;
        }
};

class Manager : public Employee{
public:
    void calculateBonus() override{
        cout<<"SALARY : "<<salary*0.02<<endl;
    }
};

class Developer : public Employee{
public:
    void calculateBonus() override{
        cout<<"SALARY : "<<salary*0.01<<endl;
    }
};

int main(){
    Manager m;
    Developer d;

    cout<<"Enter Manager Details"<<endl;
    m.getdet();
    cout<<"Enter Developer Details"<<endl;
    d.getdet();

    cout<<"Manager Details"<<endl;
    m.calculatesalary();
    m.calculateBonus();

    cout<<"Developer Details"<<endl;
    d.calculatesalary();
    d.calculateBonus();

    return 0;

}

