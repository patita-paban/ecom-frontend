import { useState } from "react";
import { FaShoppingCart, FaBolt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../../utils/truncateText";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";
import CompareButton from '../CompareButton';

const ProductCard = ({
        productId,
        productName,
        image,
        description,
        quantity,
        price,
        discount,
        specialPrice,
        about = false,
}) => {
    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const btnLoader = false;
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleProductView = (product) => {
        if (!about) {
            setSelectedViewProduct(product);
            setOpenProductViewModal(true);
        }
    };

    const addToCartHandler = (cartItems) => {
        dispatch(addToCart(cartItems, 1, toast));
    };

    // Buy Now Handler - Direct Checkout
    const handleBuyNow = async () => {
        setIsBuying(true);
        
        try {
            // Create cart item
            const cartItem = {
                image,
                productName,
                description,
                specialPrice,
                price,
                productId,
                quantity: 1,
            };

            // Add to cart first
            dispatch(addToCart(cartItem, 1, toast));

            // Small delay to ensure cart is updated
            setTimeout(() => {
                // Navigate to checkout page
                navigate('/checkout', {
                    state: {
                        buyNow: true,
                        product: {
                            productId,
                            productName,
                            image,
                            price: specialPrice || price,
                            quantity: 1
                        }
                    }
                });
                
                toast.success('Proceeding to checkout!', {
                    icon: '⚡',
                    duration: 2000
                });
            }, 500);

        } catch (error) {
            console.error('Buy now error:', error);
            toast.error('Failed to process. Please try again.');
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
            <div onClick={() => {
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,
                })
            }} 
                    className="w-full overflow-hidden aspect-3/2 relative group">
                <img 
                className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
                src={image}
                alt={productName}>
                </img>
                
                {/* Quick Buy Badge on Hover */}
                {isAvailable && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        <FaBolt size={10} />
                        Quick Buy
                    </div>
                )}
            </div>
            
            <div className="p-4">
                <h2 onClick={() => {
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,
                })
            }}
                    className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600 transition-colors">
                    {truncateText(productName, 50)}
                </h2>
                
                <div className="min-h-20 max-h-20">
                    <p className="text-gray-600 text-sm">
                        {truncateText(description, 80)}
                    </p>
                </div>

            { !about && (
                <>
                {/* Price Section */}
                <div className="flex items-center justify-between mb-3 mt-2">
                    {specialPrice ? (
                        <div className="flex flex-col">
                            <span className="text-gray-400 line-through text-sm">
                                ${Number(price).toFixed(2)}
                            </span>
                            <span className="text-xl font-bold text-slate-700">
                                ${Number(specialPrice).toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold text-slate-700">
                            ${Number(price).toFixed(2)}
                        </span>
                    )}
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {discount}% OFF
                        </span>
                    )}
                </div>

                {/* Action Buttons Section */}
                <div className="space-y-2">
                    {/* Buy Now Button - Primary CTA */}
                    <button
                        disabled={!isAvailable || isBuying}
                        onClick={handleBuyNow}
                        className={`w-full ${isAvailable 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        } py-2.5 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg`}>
                        {isBuying ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <FaBolt className="text-lg" />
                                {isAvailable ? "Buy Now" : "Out of Stock"}
                            </>
                        )}
                    </button>

                    {/* Secondary Actions Row */}
                    <div className="flex gap-2">
                        {/* Add to Cart Button */}
                        <button
                            disabled={!isAvailable || btnLoader}
                            onClick={() => addToCartHandler({
                                image,
                                productName,
                                description,
                                specialPrice,
                                price,
                                productId,
                                quantity,
                            })}
                            className={`bg-blue-500 ${isAvailable ? "opacity-100 hover:bg-blue-600" : "opacity-70"}
                                text-white py-2 px-3 rounded-lg items-center transition-colors duration-300 flex-1 flex justify-center text-sm`}>
                            <FaShoppingCart className="mr-1.5" size={14}/>
                            {isAvailable ? "Add to Cart" : "Stock Out"}
                        </button>
                        
                        
            
                    </div>
                </div>
                </>
            )}
                
            </div>
            <ProductViewModal 
                open={openProductViewModal}
                setOpen={setOpenProductViewModal}
                product={selectedViewProduct}
                isAvailable={isAvailable}
            />
        </div>
    )
}

export default ProductCard;
