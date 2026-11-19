#include<iostream>
#include<string>

using namespace std;

class Ticket{
    int ticketno;
    string moviename;
    int totalseats;
    int bookedseats;

public:
    Ticket(int,string,int);

    void bookseats(int);
    void bookseats(int,int);
    void bookseats(string,int);
    void display();

    ~Ticket();
};

Ticket :: Ticket(int no,string name,int seats){
    ticketno = no;
    moviename = name;
    totalseats = seats;
    bookedseats = 0;

}

void Ticket :: bookseats(int seatno){ 
    if(bookedseats < totalseats){
        bookedseats++;
        cout<<"Single Seat No "<<seatno<<"Booked sucessfully"<<endl;
    }
    else{
        cout<<"Seats not available"<<endl;
    }
}

void Ticket :: bookseats(int seats,int dummy){
    if(bookedseats + seats <= totalseats){
        bookedseats += seats;
        cout<<"Multiple Tickets Booked sucessfully"<<endl;
    }
    else{
        cout<<"Seats not available"<<endl;
    }
}

void Ticket :: bookseats(string category ,int seats){
    if(bookedseats + seats <= totalseats){
        bookedseats += seats;
        cout<<seats<< category<<" Tickets Booked sucessfully"<<endl;
    }
    else{
        cout<<"Seats not available"<<endl;
    }
}

Ticket :: ~Ticket(){
    cout<<"Ticket object destroyed"<<endl;
}

void Ticket :: display(){
 cout<<"Ticket Number : "<<ticketno<<endl;
 cout<<"Movie Name : "<<moviename<<endl;
 cout<<"Total Seats available : "<<totalseats-bookedseats<<endl;
 cout<<"Booked seats: "<<bookedseats<<endl;

}

int main(){
    int ticketno,totalseats,bookedseats;
    string moviename,category;
    int seatno,seats;

    cout<<"ENter ticket number"<<endl;
    cin>>ticketno;

    cout<<"ENter Movie name"<<endl;
    cin>>moviename;

    cout<<"ENter total seats"<<endl;
    cin>>totalseats;

    Ticket t(ticketno,moviename,totalseats);

    cout<<"Enter seat number for individual booking"<<endl;
    cin>>seatno;
    t.bookseats(seatno);

    cout<<"Enter Number of seats for multiple booking"<<endl;
    cin>>seats;


    t.bookseats(seats,0);

    cout<<"Enter number of seats for category booking"<<endl;
    cin>>seats;
    cout<<"Enter Category "<<endl;
    cin>>category;

    
    t.bookseats(category,seats);
    t.display();

    return 0;
    

}