import './index.css'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    apiStatus: apiStatusConst.failure,
    productItems: [],
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConst.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updateData = {
        id: data.id,
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(each => ({
          id: each.id,
          availability: each.availability,
          brand: each.brand,
          description: each.description,
          imageUrl: each.image_url,
          price: each.price,
          rating: each.rating,
          style: each.style,
          title: each.title,
          totalReviews: each.total_reviews,
        })),
      }
      this.setState({
        apiStatus: apiStatusConst.success,
        productItems: updateData,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  onIncreaseQuantity = () => {
    this.setState(prev => ({
      quantity: prev.quantity + 1,
    }))
  }

  onDecreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prev => ({
        quantity: prev.quantity - 1,
      }))
    }
  }

  navigateToProducts = () => {
    const {history} = this.props
    history.replace('/Products')
  }

  apiSuccessView = () => {
    const {productItems, quantity} = this.state
    const {
      imageUrl,
      description,
      price,
      rating,
      totalReviews,
      title,
      availability,
      brand,
      similarProducts,
    } = productItems
    console.log(imageUrl)
    return (
      <div className="bg-container">
        <div className="product-item-container">
          <img src={imageUrl} alt="product" className="main-product-image" />
          <div className="product-details-container">
            <h1 className="product-heading">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="review-container">
              <p className="rating-container">
                {rating}
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </p>
              <p>{totalReviews}Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="available">
              Available:
              <span className="available-result">{availability}</span>
            </p>
            <p className="available">
              Brand: <span className="available-result">{brand}</span>
            </p>
            <div className="quantity-container">
              <button
                type="button"
                className="icons-btn"
                onClick={this.onDecreaseQuantity}
                data-testid="minus"
              >
                <BsDashSquare className="minus-icon" />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                className="icons-btn"
                onClick={this.onIncreaseQuantity}
                data-testid="plus"
              >
                <BsPlusSquare className="plus-icon" />
              </button>
            </div>
            <button type="button" className="add-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-container">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem key={eachProduct.id} details={eachProduct} />
          ))}
        </ul>
      </div>
    )
  }

  apiFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1>Product Not Found</h1>
      <button
        type="button"
        className="btn-continue-shopping"
        onClick={this.navigateToProducts}
      >
        Continue Shopping
      </button>
    </div>
  )

  apiLoadingStatus = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={40} width={90} color="#3b82f6" />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.success:
        return this.apiSuccessView()
      case apiStatusConst.failure:
        return this.apiFailureView()
      case apiStatusConst.inProgress:
        return this.apiLoadingStatus()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderApiStatus()}
      </>
    )
  }
}

export default ProductItemDetails
