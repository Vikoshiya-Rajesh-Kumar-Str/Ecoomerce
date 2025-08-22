import Root from './pages/Root';

function App() {
  return (
    <>
      {/* Anchor targets for SPA navigation */}
      <a id="home" href="#home" className="sr-only">Home</a>
      <a id="favorites" href="#favorites" className="sr-only">Favorites</a>
      <a id="cart" href="#cart" className="sr-only">Cart</a>
      <a id="checkout" href="#checkout" className="sr-only">Checkout</a>
      <a id="login" href="#login" className="sr-only">Login</a>
      <a id="products" href="#products" className="sr-only">Products</a>
      <a id="categories" href="#categories" className="sr-only">Categories</a>
      <a id="about" href="#about" className="sr-only">About</a>
      <a id="contact" href="#contact" className="sr-only">Contact</a>

      <Root />
    </>
  );
}

export default App;