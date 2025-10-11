"use client";
import Image from "next/image";
import "./ReviewSection.css";

export default function ReviewSection() {
  return (
    <div className="review-body">
        <section className="reviewWrapper">
      <div className="reviewSection">
        
        {/* First Card */}
        <div className="reviewCard">
          <div className="reviewContent">
            <Image 
              src="/people.png" 
              alt="Share Experience" 
              width={80} 
              height={80} 
              className="reviewImg"
            />
            <div className="reviewText">
              <h3>
                Kindly Drop Your Experience with us <br />
                & Save Big on Your Next Ride
              </h3>
              <button className="reviewBtn">Be one of our success story</button>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="reviewCard">
          <div className="reviewContent">
            <Image 
              src="/star.png" 
              alt="Rate Us" 
              width={80} 
              height={80} 
              className="reviewImg1"
            />
            <div className="reviewText">
              <h3>
                Give Us Your Rating with your <br />
                Experience
              </h3>
              <button className="reviewBtn">Your One Click Help Many</button>
            </div>
          </div>
        </div>

      </div>
    </section>
    </div>
  );
}
