import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {title, imageUrl, brand, price, rating} = details
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="available">{title}</p>
      <p className="description">by {brand}</p>
      <div className="price-container">
        <p className="price">Rs {price}/-</p>
        <p className="rating-container">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-icon"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
