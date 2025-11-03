// app/api/bookings/route.js
export async function GET() {
  const data = {
    profile: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      joined: "January 2023",
      totalBookings: 4,
      loyaltyPoints: 2200,
    },
    history: [
      {
        id: 1,
        car: "Toyota Corolla",
        image: "/cars/toyota-corolla.jpg",
        status: "Returned",
        date: "Oct 10, 2025",
        price: "₹2,400 / day",
      },
      {
        id: 2,
        car: "Hyundai i20",
        image: "/cars/hyundai-i20.jpg",
        status: "Active",
        date: "Oct 20, 2025",
        price: "₹1,800 / day",
      },
      {
        id: 3,
        car: "BMW X5",
        image: "/cars/bmw-x5.jpg",
        status: "Upcoming",
        date: "Nov 1, 2025",
        price: "₹7,500 / day",
      },
    ],
    checkout: {
      car: "Audi Q7",
      image: "/cars/audi-q7.jpg",
      pickup: "Oct 18, 2025",
      return: "Oct 21, 2025",
      price: "₹8,200 / day",
      total: "₹24,600",
    },
  };

  return Response.json(data);
}
