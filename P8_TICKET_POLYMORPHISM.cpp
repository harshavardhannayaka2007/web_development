#include<iostream>
#include<string>

using namespace std;

class Ticket{
    protected:
    string moviename;
    float price;
    int noticket;

    public:
    virtual void getdetails(){
        cout<<"ENter movei name: "<<endl;
        cin>>moviename;
        cout<<"Enter ticket price"<<endl;
        cin>>price;
        cout<<"Enter number of tickets"<<endl;
        cin>>noticket;
    }

    virtual void display(){
         cout << "Movie Name: " << moviename << endl;
        cout << "Ticket Price: Rs. " << price << endl;
        cout << "Number of Tickets: " << noticket << endl;
        
    }
        
};

class regular : public Ticket{
    void getdetails(){
        Ticket::getdetails();
    }
    void display(){
        Ticket::display();
        cout<<"Total cost : "<<price*noticket<<endl;
    }
};

class premium : public Ticket{
    void getdetails(){
        Ticket::getdetails();
    }
    void display(){
        Ticket::display();
        cout<<"Total cost : "<<price*noticket<<endl;
    }
};

class three : public Ticket{
    void getdetails(){
        Ticket::getdetails();
    }
    void display(){
        Ticket::display();
        cout<<"Total cost : "<<price*noticket<<endl;
    }
};

int main(){

    Ticket *t[3];

    regular r;
    premium p;
    three td;

    t[0]=&r;
    t[1]=&p;
    t[2]=&td;

    cout<<"Enter regular show details"<<endl;
    t[0]->getdetails();

    cout<<"Enter premium show details"<<endl;
    t[1]->getdetails();

    cout<<"Enter 3d show details"<<endl;
    t[2]->getdetails();


    cout<<"SUMMARY OF BOOKING"<<endl;

    for(int i=0;i<3;i++){
        t[i]->display();
    }

    return 0;




}