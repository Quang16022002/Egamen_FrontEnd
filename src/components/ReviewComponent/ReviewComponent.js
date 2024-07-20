import React from "react";
import "./ReviewComponent.scss"; 

const ReviewComponent = ({ reviews }) => {
  const a = reviews?.reviews || []; 

  return (
    <div className="review-container d-flex flex-column">
      {a.map((review) => (
        <div key={review._id} className="container d-flex review-item px-5">
          <div className="avatar-review">
            <img
              src={review.user.avatar || "https://default-avatar.png"} 
              alt="Avatar"
              className="avatar-img"
            />
          </div>
          <div className="user-review">
            <p className="user-name">{review.user.name}</p>
            <p className="review-date">
              {new Date(review.createdAt).toLocaleDateString()} {new Date(review.createdAt).toLocaleTimeString()}
            </p>
            <div className="star-rating">
              {Array.from({ length: review.rating }, (_, index) => (
                <i
                  key={index}
                  className="fa-solid fa-star filled"
                ></i>
              ))}
             
            </div>
            <p className="review-text">{review.content}</p>
            {review.images && review.images.length > 0 && (
              <div className="review-images">
                {review.images.map((image, index) => (
                  <img
                    style={{ width: 100, marginRight:10 }}
                    key={index}
                    src={image}
                    alt={`Review Image ${index}`}
                    className="review-image"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      
    </div>
  );
};

export default ReviewComponent;
