"use client";
export default function Home() {
  return (
    <div>

      <h1 className="ap-title">Welcome To Admin Dashboard</h1>

      {/* TOP SECTION */}
      <div className="ap-top-grid">

        <div className="ap-card ap-revenue">
          <p className="ap-gold">Total Revenue</p>
          <h2>Rs. 2,50,000</h2>
          <span>Is the revenue in Last month</span>

          <div className="ap-tabs">
            <span className="ap-active">Last Day</span>
            <span>Last Week</span>
            <span>Last Month</span>
          </div>
        </div>

        <div className="ap-card ap-small ap-red">
          <p className="ap-smallp">Last</p>
          <h3>-2422 RS</h3>
          <span>Was the last Refund processed.</span>
          <button>Know More</button>
        </div>

        <div className="ap-card ap-small ap-green">
          <p className="ap-smallp">in Hub</p>
          <h3>10</h3>
          <span>Cars available in our website.</span>
          <button>Know More</button>
        </div>

        <div className="ap-card ap-small ap-green">
          <p className="ap-smallp">in Use</p>
          <h3>12</h3>
          <span>Cars are currently in on road.</span>
          <button>Know More</button>
        </div>

        <div className="ap-card ap-small ap-green">
          <p className="ap-smallp">Upcoming</p>
          <h3>22</h3>
          <span>cars pre-booked in this month.</span>
          <button>Know More</button>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="ap-bottom-grid">

        {/* BOOKINGS */}
        <div className="ap-split">
          <div className="ap-split-top">TOTAL NUMBER OF BOOKINGS</div>
          <div className="ap-split-bottom">
            <h2 className="ap-green-text">102</h2>
            <p>Sales in this week</p>

            <div className="ap-tabs">
              <span className="ap-active">This Week</span>
              <span>Last Month</span>
            </div>
          </div>
        </div>

        {/* MAINTENANCE */}
        <div className="ap-split">
          <div className="ap-split-top">CARS UNDER MAINTAINACE</div>
          <div className="ap-split-bottom">
            <h2>12</h2>
            <p>Cars in Maintainance</p>
            <button>Know More</button>
          </div>
        </div>

        {/* ✅ ADD CARS (UPDATED) */}
        <div className="ap-add-card">

          <div className="ap-add-left">
            <img src="/add-car.png" className="ap-add-img" />
          </div>

          <div className="ap-add-right">
            <h3>ADD CARS</h3>
            <p>Add when you have all data about Car and Host</p>
            <button>Click to Add</button>
          </div>

        </div>

        {/* HOST REQUEST */}
        <div className="ap-host-card">
          <h3>HOST REQUEST</h3>
          <p>Know more about Host Requests</p>
          <button>Click to View</button>
        </div>

      </div>

    </div>
  )
}