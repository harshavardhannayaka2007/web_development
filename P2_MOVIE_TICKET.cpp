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

    void displaySummary();

    ~Ticket();
};

Ticket :: Ticket(int no,string name, int seats){
    ticketno = no;
    moviename = name;
    totalseats = seats;
    bookedseats = 0;
}

void Ticket :: bookseats(int seatNo){
    if(bookedseats < totalseats){
        bookedseats++;
        cout<<"Single seat Ticket booked sucessfully"<<endl;
    }
    else{
        cout<<"Seats not available!"<<endl;
    }
}

void Ticket :: bookseats(int seats,int dummy){
    if(bookedseats+seats <= totalseats){
        bookedseats += seats;
        cout<<"Multiple seats booked sucessfully"<<endl;
    }
    else{
        cout<<"Seats not available"<<endl;
    }
}

void Ticket :: bookseats(string category, int seats){
    if(bookedseats+seats <= totalseats){
        bookedseats+=seats;
        cout<<seats <<category <<"seats booked sucessfully."<<endl;
    }

    else{
        cout<<"seats not available."<<endl;
    }
}

void Ticket :: displaySummary(){
    cout<<"BOOKING SUMMARY:"<<endl;
    cout<<"Ticket number: "<<ticketno<<endl;
    cout<<"Movie Name: "<<moviename<<endl;
    cout<<"Total Seats: "<<totalseats<<endl;
    cout<<"Booked seats: "<<bookedseats<<endl;
    cout<<"Available seats: "<<totalseats - bookedseats<<endl; 
}

Ticket :: ~Ticket(){
    cout<<"Ticket Object Destroyed"<<endl;
}

int main(){


    int ticketno,totalseats,seatno,seats;
    string moviename,category;

    cout<<"Enter Ticket Number: "<<endl;
    cin>>ticketno;

    cout<<"Enter movie name"<<endl;
    cin>>moviename;

    cout<<"Enter Total Seats"<<endl;
    cin>>totalseats;

    Ticket t(ticketno,moviename,totalseats);

    cout<<"Enter seat number for single booking: "<<endl;
    cin>>seatno;
    t.bookseats(seatno);

    cout<<"Enter Number of seats for multiple seat booking"<<endl;
    cin>>seats;
    t.bookseats(seats,0);

    cout<<"Enter Seat category"<<endl;
    cin>>category;

    cout<<"Enter number of seats for category booking: "<<endl;
    cin>>seats;
    t.bookseats(category,seats);

    return 0;
}