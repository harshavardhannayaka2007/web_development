#include<iostream>
using namespace std;

class Ticket{
    protected:
        float basefare;
        Ticket(float fare){
            basefare = fare;
        }

        virtual void calcfare() = 0;
};

class regular : public Ticket{
    public:
    regular(float fare) : Ticket(fare){}

    void calcfare(){
    cout<<"REGULAR SHOW FARE"<<basefare;
    }
};

class premium : public Ticket{
    public:
    premium(float fare) : Ticket(fare){}

    void calcfare(){
    cout<<"PREMIUM SHOW FARE"<<basefare+100;
    }
};

class three : public Ticket{
    public:
    three(float fare) : Ticket(fare){}

    void calcfare(){
    cout<<"3D SHOW FARE"<<basefare+150;
    }
};

int main(){
    float fare;
    cout<<"Enter base fare"<<endl;
    cin>>fare;

    regular r(fare);
    premium p(fare);
    three t(fare);

    r.calcfare();
    p.calcfare();
    t.calcfare();
}
