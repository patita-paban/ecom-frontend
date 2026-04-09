import ProductCard from "./shared/ProductCard";

const products = [
  {
    image: "https://m.media-amazon.com/images/I/61i8Vjb17SL._SL1500_.jpg",
    productName: "iPhone 13 Pro Max",
    description:
      "Experience top-tier performance with the A15 Bionic chip, ProMotion display, and an advanced triple-camera system for stunning photography.",
    specialPrice: 720,
    price: 780,
  },
  {
    image: "https://m.media-amazon.com/images/I/81kfA-GtWwL._SL1500_.jpg",
    productName: "Samsung Galaxy S21",
    description:
      "Enjoy a premium smartphone experience with a dynamic AMOLED display, powerful processor, and pro-grade camera system.",
    specialPrice: 699,
    price: 799,
  },
  {
    image: "https://m.media-amazon.com/images/I/71SGl7xwR-L._SL1500_.jpg",
    productName: "Google Pixel 6",
    description:
      "Powered by Google Tensor, the Pixel 6 delivers smart AI features, exceptional camera quality, and a smooth Android experience.",
    price: 599,
    specialPrice: 400,
  },
];

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-black text-white min-h-screen">
      
      {/* Heading */}
      <h1 className="text-green-400 text-4xl font-bold text-center mb-12">
        About Us
      </h1>

      {/* About Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8">
        
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="text-lg mb-4 text-gray-300">
            Welcome to our modern e-commerce platform, designed to provide a seamless and secure shopping experience. 
            Our application integrates advanced technologies such as JWT-based authentication, real-time cart updates, 
            and secure payment gateways to ensure reliability and performance.
          </p>

          <p className="text-lg text-gray-300">
            We focus on delivering high-quality products, user-friendly interfaces, and efficient backend systems. 
            Our goal is to bridge the gap between customers and sellers by offering a scalable, customizable, 
            and responsive platform suitable for all devices.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
            alt="E-commerce"
            className="w-full h-auto rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 border border-green-500"
          />
        </div>
      </div>

      {/* Products Section */}
      <div className="py-7 space-y-8">
        
        <h1 className="text-green-400 text-4xl font-bold text-center">
          Our Products
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-gray-900 p-4 rounded-xl shadow-lg hover:shadow-green-500/30 transition duration-300"
            >
              <ProductCard
                image={product.image}
                productName={product.productName}
                description={product.description}
                specialPrice={product.specialPrice}
                price={product.price}
                about
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;